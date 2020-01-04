hljs.registerLanguage("toy", function () {
  return function (hljs, options = {}) {
    const iri = { className: "iri", begin: /<[^>]*>/, endsParent: true }
    const pname = { className: "pname", begin: /[A-Za-z]*:[A-Za-z]*/, endsParent: true }
    const string = { className: "str", begin: /'[^']*'/, endsParent: true }
    const ws = { className: "ws", begin: /\s+/ }
    const error = { className: "error", begin: /./ }
    function eatSpace (next) {
      return {
        contains: [ws],
        starts: next
      }
    }
    const shapeDefinition = {}
    const value = {
      className: "value",
      contains: [shapeDefinition, iri, pname, string],
    }
    const predicate_value = {
      className: "predicate",
      begin: /<|[A-Za-z]/,
      returnBegin: true,
      contains: [iri, pname],
      starts: eatSpace(value),
    }
    const tripleConstraint = {
      className: "tripleConstraint",
      begin: /<|[A-Za-z]/,
      returnBegin: true,
      contains: [predicate_value]
    }
    Object.assign(shapeDefinition, {
      className: "shapeDefinition",
      begin: /(?:EXTRA|CLOSED)(?:\s|<|\{)|\{/, end: /\}/,
      returnBegin: true, returnEnd: true,
      // excludeBegin: true, excludeEnd: true, -- moves close curley to outside <span class="value"/>
      contains: [
        { className: "punct", begin: /\{/ },
        { className: "punct", begin: /\}/, endsParent: true },
        { className: "extra",
          begin: /EXTRA/,
          end: /(?:EXTRA|CLOSED)(?:\s|<|\{)|\{/,
          returnEnd: true,
          keywords: "EXTRA",
          // returnBegin: true,
          // contains: [
          //   {className: "keyword", begin: /EXTRA/},
          //   // iri, pname
          // ],
          start: { contains: [iri, pname] }
        },
        { className: "keyword", begin: /CLOSED/ },
        tripleConstraint,
        ws,
        { className: "punct", begin: /(;|\|)/ },
      ]
    })
    return {
      contains: [
        // either encapsulate:
        { contains: [eatSpace(shapeDefinition)] }
        // or disable endsParent:
        //   eatSpace(Object.assign({}, shapeDefinition, { endsParent: false }))
      ]
    }
  }
}());
// hljs.initHighlightingOnLoad();
window.addEventListener('load', evt => {
  const elt = document.querySelector('pre code.toy')
  hljs.highlightBlock(elt)
  document.querySelectorAll('.hljs-shapeDefinition').forEach(n => {
    const tcs = Array.from(n.childNodes).filter(c => c.classList && c.classList[0] === "hljs-tripleConstraint")
    const elt = document.createElement('span')
    elt.classList = ["info"]
    elt.innerText = "" + tcs.length
    // annotate before:
    // n.parentNode.insertBefore(elt, n);
    // or after:
    n.parentNode.insertBefore(elt, n.nextSibling);
  })
})
