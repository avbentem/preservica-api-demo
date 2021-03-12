/**
 * Helpers for the Preservica Content API.
 *
 * @see https://developers.preservica.com/api-reference/8-content-api
 */

import { ref } from 'vue';
import { useAuth } from '@/plugins/Auth';

/**
 * API response for a single indexed field, like:
 *
 * ```json
 * {
 *   "shortName": "xip",
 *   "uri": "http://preservica.com/XIP/v6.2",
 *   "index": "created",
 *   "shortKey": "xip.created",
 *   "displayName": "Created Date",
 *   "type": "SINGLE_VALUED_DATE",
 *   "facetable": true
 * }
 * ```
 */
export interface IndexedField {
  // Schema Short Name in a Custom Index Definition document
  shortName: string;
  uri: string;
  index: string;
  shortKey: string;
  displayName: string;
  type: string;
  facetable: boolean;
}

export interface IndexedFieldsResponse {
  success: boolean;
  version: number;
  value: IndexedField[];
}

export interface IndexedFieldsLookup {
  [shortKey: string]: IndexedField;
}

export type SearchType = 'search' | 'search-within' | 'top-level-list' | 'object-children';
export const searchTypes: { name: string; code: SearchType }[] = [
  { name: 'Top-level list', code: 'top-level-list' },
  { name: 'Search', code: 'search' },
  { name: 'Search within', code: 'search-within' },
  { name: 'Object children', code: 'object-children' },
];

// Like `sdb:IO|31246773-c041-4674-a1d4-4e202f3680a5`; it seems this is actually case-insensitive
export const cmisRegex = /^sdb:[IS]O\|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Like `31246773-c041-4674-a1d4-4e202f3680a5`; it seems this is actually case-insensitive
export const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface FieldValues {
  name: string;
  values?: string[];
}

export interface ResultMetadata {
  name: string;
  value: unknown;
}

/**
 * Partial results of a search response (being the content in its JSON's `value` attribute).
 */
export interface SearchResult {
  objectIds: string[];
  totalHits: number;
  // Documented as "a CMIS value which is always false"
  simpleChildSearch: boolean;
  metadata: ResultMetadata[][];
  highlighting: { [key: string]: string[] };
}

export interface SearchResponse {
  success: boolean;
  version: number;
  value: SearchResult;
}

export function useContentService() {
  const { fetchWithToken } = useAuth();

  // https://usergroup.preservica.com/documentation/ce/6.2.1/html/GuideToUniversalAccess.html
  // Each date interval has three parameters.
  // - The Start and End of the range are the dates which bound the range, which must be entered
  //   as `YYYY-MM-DD`. You can also use the special value `*`, which means to the end of time,
  //   i.e. a `*` at the beginning of a range means that all entries with a value in this field
  //   before the end date will be included, and a `*` in the End field means that all entries
  //   with a value after the start date will be included.
  // - The Title field specifies the text that will be shown for the interval when a user performs
  //   a search. It is also possible to define adjacent date ranges by leaving the End field
  //   blank. In this case, the interval will use the start date of the next interval as its end
  //   date (or, if you leave End blank for the last interval, it will use `*` as its End). This
  //   allows you to create and modify adjacent date ranges without having to edit the endpoints
  //   twice. If you do this, the ranges which have been set to be adjacent must be in ascending
  //   date order.
  //
  // The example image at the URL above shows a different example that seems to make more sense,
  // though "title" is still weird in the API call:
  //
  //              * - 1999-12-31 Pre 2000
  //     2000-01-01 - 2009-12-32 2000-2010
  //     2010-01-01 - *          2010 on
  //
  // Any field which is indexed as a tokenised string will be suitable for filtering, including
  // the following fields from the xip schema:
  // - Title (title).
  // - Description (description)
  const query = ref({
    q: '',
    fields: [
      // Initialize with empty string to show the input field
      { name: 'xip.title', values: [''] },
      { name: 'xip.description', values: [''] },
      { name: 'xip.document_type', values: ['IO'] },
    ] as FieldValues[],
    sort: [{ sortFields: ['xip.created'], sortOrder: 'desc' }],
    facets: ['xip.created', 'xip.format_group_r_Display'],
    'facet.xip.created.range': [
      ['*', '', 'Pre 2015'],
      ['2015-01-01', '', '2015'],
      ['2016-01-01', '', '2016'],
      ['2017-01-01', '', '2017'],
      ['2018-01-01', '', '2018'],
      ['2019-01-01', '', '2019'],
      ['2020-01-01', '', '2020'],
      ['2021-01-01', '*', '2021 and later'],
    ],
  });

  const indexedFields = ref<IndexedField[] | undefined>(undefined);
  const indexedFieldsLookup = ref<IndexedFieldsLookup | undefined>(undefined);
  const metadata = ref(query.value.fields.map((field) => field.name).join());

  const start = ref(0);
  const max = ref(10);
  const searchType = ref<SearchType>('search');
  const searchParent = ref<string | undefined>();
  const result = ref<SearchResult | undefined>(undefined);

  /**
   * Fetch the indexed fields from the Content API and populate (and return) {@link indexedFields}.
   */
  const getIndexedFields = async (): Promise<IndexedField[] | undefined> => {
    const res = await fetchWithToken('api/content/indexed-fields');
    // The second value is a property in the Preservica JSON; it does not refer to, e.g., Vue's Ref
    indexedFields.value = ((await res.json()) as IndexedFieldsResponse).value;

    indexedFieldsLookup.value = indexedFields.value.reduce((acc, field) => {
      acc[field.shortKey] = field;
      return acc;
    }, {} as IndexedFieldsLookup);

    return indexedFields.value;
  };

  /**
   * Invoke one of the Content API's search endpoints based on {@link searchType} and using the
   * current values of {@link metadata}, {@link query} and all, and populate {@link result}.
   */
  const search = async () => {
    result.value = undefined;

    const encodedParent = encodeURIComponent(searchParent.value || '');
    const paramSearchWithin =
      searchType.value === 'search-within' ? `&parenthierarchy=${encodedParent}` : '';
    const paramObjectChildren =
      searchType.value === 'object-children' ? `&id=${encodedParent}` : '';

    // TODO Given that the API wants application/x-www-form-urlencoded we should encode the JSON too,
    // but that's horrible for the curl examples and the server seems lenient?
    const body = `q=${JSON.stringify(query.value)}&start=${start.value}&max=${
      max.value
    }&metadata=${encodeURIComponent(metadata.value)}${paramSearchWithin}${paramObjectChildren}`;

    const res = await fetchWithToken(`api/content/${searchType.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    // The second value is a property in the Preservica JSON; it does not refer to, e.g., Vue's Ref
    result.value = ((await res.json()) as SearchResponse).value;
  };

  return {
    getIndexedFields,
    indexedFields,
    indexedFieldsLookup,
    searchType,
    searchParent,
    query,
    metadata,
    start,
    max,
    search,
    result,
  };
}
