# Preservica API demo

A basic (work in progress) Vue.js and PrimeVue kitchen sink, showing various usage examples for some
of [the Preservica APIs](https://developers.preservica.com/api-reference).

:warning:  This is VERY MUCH work in progress.

:warning:  This will need a CORS proxy to access the Preservica APIs from a browser. You can set it
in the configuration screen when running the demo.

See it in action on <https://avbentem.github.io/preservica-api-demo>

## Wish list

- Authorization
  - Store credentials in local storage (also to allow opening links in new tab/window)
  - ...but warn if credentials seem to have write access
  - Router: enforce authorization when applicable
- Search
  - Fetch possible facets from API
  - Fetch content when clicking result
- Embedded Swagger UI with auto-refresh access token?
- Show `curl` commands  

## Development

This project was bootstrapped with Vue CLI v4.5.9, using Vue 3 preview, TypeScript, Yarn.

<details>
<summary>Details</summary>

Initial `vue create` options:

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
rules, added `vue.config.js`, and added PrimeVue, PrimeIcons and PrimeFlex.
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

### Linting and Prettier

A pre-commit hook ensures that linting errors and formatting errors cannot be committed. Note that
the hook uses [lint-staged](https://github.com/okonet/lint-staged), which temporarily hides unstaged
changes to partially staged files. This may make your IDE show warnings about files that were
changed outside of the IDE.

Beware that Sourcetree may [silently skip](https://jira.atlassian.com/browse/SRCTREE-7184) the
pre-commit hook.
