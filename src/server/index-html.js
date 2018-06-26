// WARNING: See the following for security issues around embedding JSON in HTML:
// http://redux.js.org/recipes/ServerRendering.html#security-considerations
// NOTE: https://tools.ietf.org/html/rfc2606 - use reserved TLDs
export default ({
  title = 'Taskman',
  content = '',
  initialState = undefined,
  domain = 'taskman.localhost',
  port = '8080',
}) => (
`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="http://${domain}:${port}/bundle.css">
  </head>
  <body>
    <div id="root">${content}</div>
    <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}</script>
    <script type="text/javascript" charset="utf-8" src="http://${domain}:${port}/bundle.js"></script>
  </body>
</html>`
)
