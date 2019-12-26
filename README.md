![logo](ShEx-Logo.svg)

## Shape Expressions Compact Syntax (ShExC) language syntax highlighting plugin for [highlight.js](https://highlightjs.org/)

[Demo](https://highlightjs.github.io/highlightjs-shexc/)

ShEx is a schema language for [RDF](https://en.wikipedia.org/wiki/Resource_Description_Framework). It defines and validates the structural requires for RDF graphs.

For more about ShEx here:

* [Home Page](http://shex.io/)
* [Primer](http://shex.io/primer/)
* [Specification](http://shex.io/spec/)
* [Shape Maps](http://shex.io/shape-map/)
* [gitter](https://gitter.im/shapeExpressions/Lobby)


## Getting started

You must add the `highlight.js` file from [highlight.js](https://github.com/highlightjs/highlight.js) in your web page or node app, load up this module and apply it to `hljs`.

If you are not using a build system and just want to embed this in your webpage:

```javascript
<script type="text/javascript" src="js/highlight.pack.js"></script>
<script type="text/javascript" src="js/shexc.js"></script>
<script type="text/javascript">
    hljs.registerLanguage('shexc', window.hljsDefineShExC);
    hljs.initHighlightingOnLoad();
</script>
```

If you are using `webpack` or `rollup` or `browserify` or `node`:

```javascript
var hljs = require('highlightjs');
var hljsDefineShExC = require('highlightjs-shexc');

hljsDefineShExC(hljs);
hljs.initHighlightingOnLoad();
```

## Licence

© 2019 [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) Eric Prud'hommeaux
