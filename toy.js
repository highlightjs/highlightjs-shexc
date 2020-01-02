hljs.registerLanguage("toy", function () {
  return function (hljs, options = {}) {
    const iri = { className: "iri", begin: /<[^>]*>/, endsParent: true }
    const pname = { className: "pname", begin: /[a-z]*:[a-z]*/, endsParent: true }
    const string = { className: "str", begin: /'[^']*'/, endsParent: true }
    return {
      contains: [
        {
          className: "predicate",
          begin: /<|[a-z]/,
          returnBegin: true,
          contains: [iri, pname],
          starts: {
            className: "value",
            end: /\B\b/,
            contains: [iri, pname, string],
            // endsParent: true
          }
        },
        { className: "punct", begin: / *(;|\|) */ }
      ]
    }
  }
}());
hljs.initHighlightingOnLoad();
