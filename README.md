# Preservica APIs demo

A basic (work in progress) Vue.js and PrimeVue kitchen sink, showing various usage examples for some
of [the Preservica APIs](https://developers.preservica.com/api-reference).

:warning:  This is VERY MUCH work in progress.

See it in action on <https://avbentem.github.io/preservica-api-demo>

## Cross-origin requests (CORS)

The Preservica APIs are typically used from an intermediate backend server, not directly from a
browser. Preservica does not allow [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) to
support using the APIs from a browser that is showing a website hosted on a random domain. So, to
make this demo run in a standard browser on a non-Preservica domain, one of the following is needed:

- A proxy on the same domain (same protocol, host and port) as this very demo. This is supported 
  during development and with the Docker image; when using `yarn serve` or `docker run` then enter
  `/proxy/` in the CORS proxy field of the configuration screen when running this demo.

- Or, a CORS-proxy on any domain and port, which adds or relaxes CORS headers to effectively allow
  everything we need:
  
  - It gets the full API URL appended, without any additional encoding. So, the appended URL should
    be fetched without first doing any decoding.

  - It should support OPTIONS, HEAD, GET and POST. (OPTIONS may be handled by the proxy.)

  - It should either use `Access-Control-Allow-Headers: *` or include `preservica-access-token`
    when getting an OPTIONS request with `Access-Control-Request-Headers: preservica-access-token`.

  - To make this demo use the suggested (original) file name when downloading content, the proxy's
    response must include `Access-Control-Expose-Headers: Content-Disposition`.

## Viewing and downloading content

A Preservica-provided `<iframe>` is used to view documents. This works even when not being requested
through the proxy server, and uses a URL that includes a `token` URL parameter. However, if keeping
the viewer open beyond the token's lifetime, then the `<iframe>` may prompt for credentials. (A sane
browser should warn you that these credentials are not sent to this demo website, but to the
Preservica server that hosts the embedded viewer.)

The server sets the header `Access-Control-Allow-Origin: https://<tenant>.access.preservica.com`,
and as the proxy server is not used here, the demo cannot interact with the embedded content. So, it
cannot tell if loading threw any HTTP error, and when content cannot be viewed using Preservica's
viewer, this would result in an embedded Preservica error page. To avoid that, the demo first makes
a proxied HEAD request to the same URL, for which the browser thinks it's not cross-domain. Next, if
this yields a 403 Forbidden or 404 Not Found for the given object then the viewer is simply not
embedded. Alternatively we could try to proxy the `<iframe>` but that would break if the viewer
itself makes any absolute requests to other domains.

For thumbnails and to download content an HTTP header with an access token is needed, rather than a
token in the URL. This implies that in this browser-based demo the thumbnails and content are first
fully downloaded by the JavaScript code (using the configured proxy server), and only when completed
the binary content is passed to the browser, or the browser is triggered to save the content. For
large downloads, one may want a streaming solution, but in a real use case an intermediate backend
server would proxy these downloads and add the required authorisation header on the fly.

Just like for the document viewer, for downloads first a HEAD request is made to only show the
download option when we know that Preservica can deliver that.

## Development

This uses Vue 3, PrimeVue, PrimeIcons and PrimeFlex with TypeScript.

<details>
<summary>Details</summary>

This project was bootstrapped with Vue CLI v4.5.9. Initial `vue create` options:

- Please pick a preset: Manually select features
- Check the features needed for your project: Choose Vue version, Babel, TS, Router, Vuex, CSS
  Pre-processors, Linter, Unit
- Choose a version of Vue.js that you want to start the project with: 3.x (Preview)
- Use class-style component syntax? No
- Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling
  JSX)? Yes
- Use history mode for router? (Requires proper server setup for index fallback in production) Yes
- Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default):
  Sass/SCSS (with dart-sass)
- Pick a linter / formatter config: Prettier
- Pick additional lint features: Lint on save, Lint and fix on commit
- Pick a unit testing solution: Jest
- Where do you prefer placing config for Babel, ESLint, etc.? In dedicated config files
- Pick the package manager to use when installing dependencies: Yarn

Next, upgraded Prettier to fix errors in the generated code, configured `.editorconfig` and Prettier
rules, added `vue.config.js` to set the app's title, and added PrimeVue, PrimeIcons and PrimeFlex.
</details>

### Yarn

- Download project dependencies: `yarn install`

- Compile and hot-reload for development: `yarn serve`

  This runs on <http://localhost:9090> (or 9091 and up if ports are already in use) and also
  [provides a proxy](./vue.config.js) for the API, to avoid CORS limitations. To use that, enter
  `/proxy/` in the proxy field in the configuration screen when running the demo. (This does not
  work on the GitHub Pages hosted version.)

- Compile and minify for production: `yarn build`

- Lint, Prettify and fix files: `yarn lint`

  Unlike the pre-commit hook (see below), this is not limited to staged files.

### Docker

The [Dockerfile](./Dockerfile) creates a temporary (partially cached) build image, builds the
project, and creates a final image that serves the static result using Nginx. To avoid CORS issues,
this also [proxies](./docker-nginx.conf) requests for `/proxy/https://eu.preservica.com/api/a/b/c`
to `https://eu.preservica.com/api/a/b/c`. To use that, enter `/proxy/` in the proxy field in the
configuration screen when running the demo.

To build and tag:

```text
docker build -t preservica-api-demo .
```

To run on <http://localhost:9000>:

```text
docker run -it -p 9000:80 --rm preservica-api-demo
```

### Linting and Prettier

A pre-commit hook ensures that linting errors and formatting errors cannot be committed. Note that
the hook uses [lint-staged](https://github.com/okonet/lint-staged), which temporarily hides unstaged
changes to partially staged files. This may make your IDE show warnings about files that were
changed outside of the IDE.

Beware that Sourcetree may [silently skip](https://jira.atlassian.com/browse/SRCTREE-7184) the
pre-commit hook.

## Trademark

Preservica™ is a trademark of [Preservica Ltd](https://preservica.com/). The creator of this
application is not affiliated with that organisation. 
