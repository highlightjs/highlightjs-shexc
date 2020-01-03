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
    const o = {
      className: "value",
      begin: /./,
      contains: [iri, pname, string],
    }
    const po = {
      className: "predicate",
      begin: /<|[A-Za-z]/,
      returnBegin: true,
      contains: [iri, pname],
      starts: eatSpace(o),
    }
    const tc = {
      className: "tripleConstraint",
      begin: /<|[A-Za-z]/,
      returnBegin: true,
      contains: [po]
    }
    return {
      contains: [
        tc,
        ws,
        { className: "punct", begin: /(;|\|)/ },
      ],
    }
  }
}());
// hljs.initHighlightingOnLoad();
window.addEventListener('load', evt => {
  const elt = document.querySelector('pre code.toy')
  hljs.highlightBlock(elt)
  let count = 0
  const cz = Array.from(document.querySelector('pre code.toy').childNodes)
  for (let i = 0; i < cz.length; ++i) {
    let c = cz[i]
    if (c.classList && c.classList[0] === "hljs-tripleConstraint")
      ++count
    else if (c.childNodes.length === 1 && c.childNodes[0].nodeType === Node.TEXT_NODE)
      c.childNodes[0].textContent = c.childNodes[0].textContent.replace(/\n/g, _ => {
        const was = count
        count = 0
        c.classList = "info";
        return " -- " + was + "\n"
      })
  }
})
