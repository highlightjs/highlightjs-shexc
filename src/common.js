/** terminals from <http://shex.io/shex-semantics/index.html#term-IRIREF>
 * <IRIREF>      ::=          "<" ([^#0000- <>\"{}|^`\\] | UCHAR)* ">"
 * <PNAME_NS>	   ::=   	PN_PREFIX? ":"
 * <PNAME_LN>	   ::=   	PNAME_NS PN_LOCAL
 * ... (see link for the rest)
 */
const HEX_RE = '[0-9a-fA-F]'
const UCHAR_RE = '\\\\(?:u' + HEX_RE + '{4}|U' + HEX_RE + '{8})'
const ECHAR_RE = '\\\\[tbnrf"\'\\\\]'
const STRING_LITERAL1 = '\'(?:[^\\u0027\\u005C\\u000A\\u000D]|' + ECHAR_RE + '|' + UCHAR_RE + ')*\''
const STRING_LITERAL2 = '\"(?:[^\\u0022\\u005C\\u000A\\u000D]|' + ECHAR_RE + '|' + UCHAR_RE + ')*\"'
const STRING_LITERAL_LONG1 = '\'\'\'(?:(?:\'|\'\')?(?:[^\'\\\\]|' + ECHAR_RE + '))*\'\'\''
const STRING_LITERAL_LONG2 = '\"\"\"(?:(?:\"|\"\")?(?:[^\"\\\\]|' + ECHAR_RE + '))*\"\"\"'
const IRIREF_RE = '<(?:[^<>"{}|^`\\\\]|' + UCHAR_RE + ')*>'
const PN_CHARS_BASE_RE = '[a-zA-Z]'
const PN_CHARS_U_RE = [PN_CHARS_BASE_RE, '_'].join('|')
const VARNAME_RE = '(?:' + PN_CHARS_U_RE + '|[0-9])(?:' + PN_CHARS_U_RE + '|[0-9]|\\u00B7|[\\u0300-\\u036F]|[\\u203F-\\u2040])*' //
const PN_CHARS_RE = [PN_CHARS_U_RE, '-', '[0-9]'].join('|')
const PN_PREFIX_RE = PN_CHARS_BASE_RE + '(?:(?:' + PN_CHARS_RE + '|\\.)*' + PN_CHARS_RE + ')?'
const PNAME_NS_RE = '(?:' + PN_PREFIX_RE + ')?:'
const PN_LOCAL_ESC_RE = '\\\\[_~.!$&\'()*+,;=/?#@%-]'
const PERCENT_RE = '%' + HEX_RE + HEX_RE
const PLX_RE = [PERCENT_RE, PN_LOCAL_ESC_RE].join('|')
const PN_LOCAL_RE = '(?:' + [PN_CHARS_U_RE, ':', '[0-9]', PLX_RE].join('|') + ')'
      + '(?:' + '(?:' + [PN_CHARS_RE, '\\.', ':', PLX_RE].join('|') + ')' + ')*'
const PNAME_LN_RE = PNAME_NS_RE + PN_LOCAL_RE
const EXPONENT_RE = '[eE][+-]?[0-9]+'
const DOUBLE_DECIMAL_INTEGER_RE = '[+-]?(?:[0-9]+\\.[0-9]*' + EXPONENT_RE + '|\\.[0-9]+' + EXPONENT_RE + '|[0-9]+' + EXPONENT_RE + '|[0-9]*\\.[0-9]+|[0-9]+)'

/** Special regexp which consumes rest of string. */
const EndOfDocument = /\B\b/

/** IRI forms from <https://shexspec.github.io/spec/#prod-iri>
 * iri	   ::=   	IRIREF | prefixedName
 * prefixedName  ::=   	PNAME_LN | PNAME_NS
 * ... (see link for the rest)
 */
const prefixedName_RE = PNAME_LN_RE + '|' + PNAME_NS_RE
const iris_RE = '(?:' + [prefixedName_RE, IRIREF_RE].join('|') + ')'
const String_RE = [STRING_LITERAL_LONG1, STRING_LITERAL_LONG2, STRING_LITERAL1, STRING_LITERAL2].join('|')
const BooleanLiteral_RE = 'true|false'
const PERCENT = { className: 'meta-keyword', begin: PERCENT_RE }
const UCHAR = { className: 'meta-keyword', begin: UCHAR_RE }
const PN_LOCAL_ESC = { className: 'meta-keyword', begin: PN_LOCAL_ESC_RE }

const IRIREF = {
  className: "literal",
  begin: /</, end: />/, // can't use begin: IRIREF_RE because of contains.
  contains: [ PERCENT, UCHAR ]
}
const prefixedName = {
  begin: prefixedName_RE,
  className: 'rdf_prefixedName',
  returnBegin: true,
  contains: [
    {
      className: "type",
      begin: PNAME_NS_RE,
    },
    {
      className: "symbol",
      begin: PN_LOCAL_RE,
      endsWithParent: true,
      contains: [PN_LOCAL_ESC], //  doesn't work
    },
  ]
}
const Var = {
  begin: '[?$]' + VARNAME_RE,
  className: 'variable',
};
const NumericLiteral = {
  begin: DOUBLE_DECIMAL_INTEGER_RE,
  className: 'number',
  relevance: 0,
}
const String = {
  begin: String_RE,
  className: 'string',
  relevance: 0
}
const BooleanLiteral = {
  begin: BooleanLiteral_RE,
  className: 'built-in',
  relevance: 0
}
const literal = {
  begin: [String_RE, DOUBLE_DECIMAL_INTEGER_RE, BooleanLiteral_RE].join('|'),
  className: 'rdf_literal',
  returnBegin: true,
  contains: [
    NumericLiteral,
    String,
    BooleanLiteral,
  ],
}
/** directives from <https://shexspec.github.io/spec/#prod-directive>
 * baseDecl      ::=          "BASE" IRIREF
 * prefixDecl    ::=          "PREFIX" PNAME_NS IRIREF
 * importDecl    ::=          "IMPORT" IRIREF
 */
const PREFIX_RE = "[Pp][Rr][Ee][Ff][Ii][Xx]"
const prefix = {
  begin: PREFIX_RE,
  className: "rdf_prefix",
  end: EndOfDocument,
  returnBegin: true,
  contains: [
    { className: 'meta', begin: PREFIX_RE },
    {
      className: "type",
      begin: PNAME_NS_RE,
    },
    Object.assign({ endsParent: true }, IRIREF),
  ]
}
const BASE_RE = "[Bb][Aa][Ss][Ee]"
const base = {
  beginKeywords: BASE_RE,
  className: "rdf_base",
  end: EndOfDocument,
  returnBegin: true,
  contains: [
    { className: 'meta', begin: BASE_RE },
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
  String,
  Var,
  NumericLiteral,
  literal,
  productions: {
    IRIREF,
    prefixedName,
    prefix,
    base
  }
}
