/*
Language: ShExC
Description: Shape Expressions Compact Syntax, a schema language for graphs, may be good for Trig
Author: Eric Prud'hommeaux <eric+github@w3.org>
Category: misc
*/

/**
 * highlight.js ShExC syntax highlighting definition
 *
 * @see https://github.com/ericprud/highlightjs-shexc
 *
 * @package: highlightjs-shexc
 * @author:  Eric Prud'hommeaux <eric@w3.org>
 * @since:   2019-21-12
 *
 *
 * Maintenance notes:
 *
 * This module is largely transliterated from the ShExC grammar.
 * <http://shex.io/shex-semantics/index.html#shexc> For terminals, this acts as
 * a validator. If e.g. your URL doesn't show up with syntax highlighting, it's
 * probably malformed.
 *
 * Anything with begin: iris_RE gets relevance: 0 in order not to assume
 * anything with URLs is ShExC.
 *
 * TODO, in decreasing priority:
 *   annotations <http://shex.io/shex-semantics/index.html#prod-annotation>
 *   semacts <http://shex.io/shex-semantics/index.html#prod-semanticAction>
 *   strings <http://shex.io/shex-semantics/index.html#prod-string>
 *   comments in odd places.
 *
 * Limitations: There is no way (afaik) in highlight.js to assign classes based
 * on position. As a result, a TripleConstraint with a predicate and a datatype
 * will have the same class applied to both.
 */

module.exports = function (hljs, opts = {}) {
  const common = require("../common")
  const productions = common.productions

  productions._import = { // Need a leading '_' because "import" is a js keyword.
    beginKeywords: "import",
    className: "meta",
    end: common.EndOfDocument,
    returnBegin: true,
    contains: [
      Object.assign({ endsParent: true }, productions.IRIREF),
    ]
  }

  /** shape expressions from <http://shex.io/shex-semantics/index.html#prod-shapeExpression> 
   */
  productions.shapeDefinition = {
    begin: /{/, end: /}/,
    relevance: 0
    // Add .contains (below) after constructing its contents.
  }
  const shapeExprContentModel = [
    hljs.HASH_COMMENT_MODE,
    hljs.C_BLOCK_COMMENT_MODE,

    /** <http://shex.io/shex-semantics/index.html#prod-shapeExprLabel>
     * shapeExprDecl	::=   	shapeExprLabel (shapeExpression | "EXTERNAL")
     */
    {
      className: 'title',
      begin: common.iris_RE,
      contains: [ common.PERCENT, common.UCHAR ],
      relevance: 0
    },

    /** <http://shex.io/shex-semantics/index.html#prod-shapeRef>
     * shapeRef	   ::=   	   ATPNAME_LN | ATPNAME_NS | '@' shapeExprLabel
     */
    {
      className: 'name',
      begin: '@' + common.iris_RE,
      contains: [ common.PERCENT, common.UCHAR ],
      relevance: 10
    },

    /**
     * shapeDefinition	   ::=   	(extraPropertySet | "CLOSED")* '{' tripleExpression? '}'
     *                                  annotation* semanticActions
     */
    {
      beginKeywords: 'extra closed', end: /{/,
      returnEnd: true,
      contains: [productions.IRIREF, productions.prefixedName],
      relevance: 10
    },

    /** simplified form of <http://shex.io/shex-semantics/index.html#term-REGEXP>
	<REGEXP>	   ::=   	'/' ([^/\\\n\r]
                                             | '\\' [nrt\\|.?*+(){}$-\[\]^/]
                                             | UCHAR
                                            )+ '/' [smix]*
     */
    {
      className: 'regexp',
      begin: /\/([^\\/]|\\.)*\//,
      contains: [
        hljs.REGEXP_MODE,
      ],
    },

    {
      className: 'valueSet',
      begin: '\\[',
      end: '\\]',
      contains: [common.literal, productions.IRIREF, productions.prefixedName]
    },

    productions.shapeDefinition,
  ]
  const shapeExpression_keywords = 'and or not closed abstract extends restricts iri bnode literal nonliteran'
    + ' length minlength maxlength'
    + ' mininclusive minexclusive maxinclusive maxexclusive'
  productions.shapeExpression = {
    begin: common.iris_RE,
    end: common.EndOfDocument,
    returnBegin: true,
    keywords: shapeExpression_keywords,
    contains: shapeExprContentModel,
    relevance: 0
  }

  /** shape expressions from <http://shex.io/shex-semantics/index.html#prod-unaryTripleExpr> 
   */
  const ws = { className: "ws", begin: /\s+/ }
  function eatSpace (next) {
    return {
      contains: [ws],
      starts: next
    }
  }
  const value = {
    className: "value",
    // contains: [productions.shapeDefinition, productions.IRIREF, productions.prefixedName, common.literal],
    contains: [productions.IRIREF, productions.prefixedName, common.literal].concat(shapeExprContentModel),
  }
  const predicate_value = {
    className: "predicate",
    begin: common.iris_RE,
    returnBegin: true,
    contains: [productions.IRIREF, productions.prefixedName],
    starts: eatSpace(value),
  }

  productions.tripleConstraint = {
    className: "shex_tripleConstraint",
    begin: common.iris_RE,
    end: common.EndOfDocument,
    returnBegin: true,
    endsWithParent: true,
    keywords: shapeExpression_keywords,
    contains: [predicate_value],
    relevance: 0
  }
  productions.tripleExprLabel = {
    className: 'name',
    begin: '$' + common.iris_RE,
    contains: [ common.PERCENT, common.UCHAR ],
    relevance: 10
  }
  productions.inclusion = {
    className: 'name',
    begin: '&' + common.iris_RE,
    contains: [ common.PERCENT, common.UCHAR ],
    relevance: 10
  }
  // The root language is called "shexDoc" <http://shex.io/shex-semantics/index.html#prod-shexDoc>
  productions.shexDoc = {
    aliases: ['shex'],
    aliases: ['trig'],
    case_insensitive: true,
    contains: [
      hljs.HASH_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      productions.prefix,
      productions.base,
      productions._import,
      productions.shapeExpression,
    ],
    relevance: 10
  }

  // Add last component in this cycle:
  //   shape ➜ tripleConstraint ➜ shapeExpression ➜ shape
  productions.shapeDefinition.contains = [productions.tripleExprLabel, productions.inclusion, productions.tripleConstraint]

  const startingProduction = opts.startingProduction || 'shexDoc'
  if (!(startingProduction in productions))
    throw Error(`starting production ${startingProduction} not found in ${Object.keys(productions).join(', ')}}`)
  return productions[startingProduction]
}

