'use strict';

module.exports = assets => {
  return `
  <!doctype html>
  <html>
    <head>
      ${assets.getStyle()}
    </head>
    <body>
      <div id="root"></div>
      ${assets.getContext()}
      ${assets.getScript()}
    </body>
  </html>
  `;
};
