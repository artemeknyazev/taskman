// WARNING: See the following for security issues around embedding JSON in HTML:
// http://redux.js.org/recipes/ServerRendering.html#security-considerations
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
  </head>
  <body>
    <div id="root">${content}</div>
    <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}</script>
    <script type="text/javascript" charset="utf-8" src="bundle.js"></script>
  </body>
</html>`
)