/*
Language: Turtle
Author: Mark Ellis <mark.ellis@stardog.com>
Category: common
*/

module.exports = function (hljs) {
  const common = require("../common")
  const productions = common.productions

  var KEYWORDS = {
    literal: 'true|0 false|0',
    built_in: 'a|0'
  };

  return {
    case_insensitive: true,
    keywords: KEYWORDS,
    aliases: ['turtle'],
    contains: [
      productions.prefix,
      productions.base,
      productions.IRIREF,
      productions.prefixedName,
      common.String,
      common.NumericLiteral,
      hljs.HASH_COMMENT_MODE,
    ]
  };
}
