/** terminals from <http://shex.io/shex-semantics/index.html#term-IRIREF>
 * <IRIREF>      ::=          "<" ([^#0000- <>\"{}|^`\\] | UCHAR)* ">"
 * <PNAME_NS>	   ::=   	PN_PREFIX? ":"
 * <PNAME_LN>	   ::=   	PNAME_NS PN_LOCAL
 * ... (see link for the rest)
 */
const HEX_RE = '[0-9a-fA-F]'
const UCHAR_RE = '\\\\(?:u' + HEX_RE + '{4}|U' + HEX_RE + '{8})'
const IRIREF_RE = '<([^<>"{}|^`\\\\]|' + UCHAR_RE + ')*>'
const PN_CHARS_BASE_RE = '[a-zA-Z]'
const PN_CHARS_U_RE = [PN_CHARS_BASE_RE, '_'].join('|')
const PN_CHARS_RE = [PN_CHARS_U_RE, '-', '[0-9]'].join('|')
const PN_PREFIX_RE = PN_CHARS_BASE_RE + '((' + PN_CHARS_RE + '|\\.)*' + PN_CHARS_RE + ')?'
const PNAME_NS_RE = '(' + PN_PREFIX_RE + ')?:'
const PN_LOCAL_ESC_RE = '\\\\[_~.!$&\'()*+,;=/?#@%-]'
const PERCENT_RE = '%' + HEX_RE + HEX_RE
const PLX_RE = [PERCENT_RE, PN_LOCAL_ESC_RE].join('|')
const PN_LOCAL_RE = '(' + [PN_CHARS_U_RE, ':', '[0-9]', PLX_RE].join('|') + ')'
      + '(' + '(' + [PN_CHARS_RE, '\\.', ':', PLX_RE].join('|') + ')' + ')*'
const PNAME_LN_RE = PNAME_NS_RE + PN_LOCAL_RE

/** Special regexp which consumes rest of string. */
const EndOfDocument = /\B\b/

/** IRI forms from <https://shexspec.github.io/spec/#prod-iri>
 * iri	   ::=   	IRIREF | prefixedName
 * prefixedName  ::=   	PNAME_LN | PNAME_NS
 * ... (see link for the rest)
 */
const prefixedName_RE = PNAME_LN_RE + '|' + PNAME_NS_RE
const iris_RE = '(' + [prefixedName_RE, IRIREF_RE].join('|') + ')'
const PERCENT = { className: 'meta-keyword', begin: PERCENT_RE }
const UCHAR = { className: 'meta-keyword', begin: UCHAR_RE }
const PN_LOCAL_ESC = { className: 'meta-keyword', begin: PN_LOCAL_ESC_RE }

const IRIREF = {
  className: 'symbol',
  begin: /</, end: />/, // can't use begin: IRIREF_RE because of contains.
  contains: [ PERCENT, UCHAR ]
}
const prefixedName = {
  begin: prefixedName_RE,
  returnBegin: true,
  contains: [
    {
      className: "type",
      begin: PNAME_NS_RE,
    },
    {
      className: "variable",
      begin: PN_LOCAL_RE,
      endsWithParent: true,
      contains: [PN_LOCAL_ESC], //  doesn't work
    },
  ]
}
/** directives from <https://shexspec.github.io/spec/#prod-directive>
 * baseDecl      ::=          "BASE" IRIREF
 * prefixDecl    ::=          "PREFIX" PNAME_NS IRIREF
 * importDecl    ::=          "IMPORT" IRIREF
 */
const prefix = {
  beginKeywords: "prefix",
  // begin: "prefix",
  end: EndOfDocument,
  returnBegin: true,
  contains: [
    // { // not needed if using beginKeywords in parent
    //   className: "keyword",
    //   beginKeywords: 'prefix',
    // },
    {
      className: "type",
      begin: PNAME_NS_RE,
    },
    Object.assign({ endsParent: true }, IRIREF),
  ]
}
const base = {
  beginKeywords: "base",
  end: EndOfDocument,
  returnBegin: true,
  contains: [
    Object.assign({ endsParent: true }, IRIREF),
  ]
}

module.exports = {
  PERCENT,
  UCHAR,
  PNAME_NS_RE,
  PN_LOCAL_RE,
  PN_LOCAL_ESC,
  prefixedName_RE,
  EndOfDocument,
  iris_RE,
  productions: {
    IRIREF,
    prefixedName,
    prefix,
    base
  }
}
