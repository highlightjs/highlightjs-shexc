hljs.registerLanguage("toy", function () {
  return function (hljs, options = {}) {
    const iri = { className: "iri", begin: /<[^>]*>/, endsParent: true }
    const pname = { className: "pname", begin: /[a-z]*:[a-z]*/, endsParent: true }
    const string = { className: "str", begin: /'[^']*'/, endsParent: true }
    const space = { className: "space", begin: /\s+/ }
    const error = { className: "error", begin: /./ }
    return {
      contains: [
        {
          className: "predicate",
          begin: /<|[a-z]/,
          returnBegin: true,
          contains: [iri, pname, error],
          starts: {
            contains: [space],
            starts: {
              className: "value",
              end: /\B\b/,
              contains: [iri, pname, string, error],
            },
          },
        },
        space,
        { className: "punct", begin: /(;|\|)/ },
      ],
    }
  }
}());
hljs.initHighlightingOnLoad();