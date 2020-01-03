hljs.registerLanguage("toy", function () {
  return function (hljs, options = {}) {
    const iri = { className: "iri", begin: /<[^>]*>/, endsParent: true }
    const pname = { className: "pname", begin: /[A-Za-z]*:[A-Za-z]*/, endsParent: true }
    const string = { className: "str", begin: /'[^']*'/, endsParent: true }
    const ws = { className: "ws", begin: /\s+/ }
    const error = { className: "error", begin: /./ }
    return {
      contains: [
        {
          className: "tripleConstraint",
          begin: /<|[A-Za-z]/,
          returnBegin: true,
          contains: [
            {
              className: "predicate",
              begin: /<|[A-Za-z]/,
              returnBegin: true,
              contains: [iri, pname],
              starts: {
                contains: [ws],
                starts: {
                  className: "value",
                  begin: /<|[A-Za-z]|'/,
                  contains: [iri, pname, string],
                },
              },
            } ] },
        ws,
        { className: "punct", begin: /(;|\|)/ },
      ],
    }
  }
}());
hljs.initHighlightingOnLoad();
