/*
Language: SPARQL
Requires: ttl.js
Author: Mark Ellis <mark.ellis@stardog.com>
Category: common
*/

module.exports = function (hljs) {
  const common = require("../common")
  const productions = common.productions

  var KEYWORDS = {
    meta: 'base|10 prefix|10 @base|10 @prefix|10',
    keyword: 'add all as|0 ask bind by|0 clear construct|10 copymove create data default define delete describe distinct drop exists filter from|0 graph|10 group having in|0 insert limit load minus named|1 not offset optional order reduced select|0 service silent to union using values where with|0',
    function: 'abs asc avg bound ceil coalesce concat containsstrbefore count dayhours desc encode_for_uri floor group_concat if|0 iri isblank isiri isliteral isnumeric isuri langdatatype langmatches lcase max md5 min|0 minutes month now rand regex replace round sameterm sample seconds separator sha1 sha256 sha384 sha512 str strafter strdt strends strlang strlen strstarts struuid substr sum then timezone tz ucase uribnode uuid year',
    built_in: 'a|0'
  };

  return {
    case_insensitive: true,
    keywords: KEYWORDS,
    aliases: ['rql'],
    contains: [
      hljs.HASH_COMMENT_MODE,
      productions.IRIREF,
      productions.prefixedName,
      common.Var,
      common.literal,
    ]
  };
}