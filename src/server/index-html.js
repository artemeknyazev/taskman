// WARNING: See the following for security issues around embedding JSON in HTML:
// http://redux.js.org/recipes/ServerRendering.html#security-considerations
// TODO: better js bundling; there shouldn't be styles.bundle.js
export default ({
  title = '',
  content = '',
  initialState = undefined,
}) => (
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="bundle.css">
    <link rel="stylesheet" type="text/css" href="styles.bundle.css">
  </head>
  <body>
    <div id="root">${content}</div>
    <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}</script>
    <script type="text/javascript" charset="utf-8" src="bundle.js"></script>
    <script type="text/javascript" charset="utf-8" src="styles.bundle.js"></script>
  </body>
</html>`
)