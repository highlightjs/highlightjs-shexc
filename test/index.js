var should = require('should');
var promisify = require("util").promisify;
let path = require('path');
let hljs = require("../../../src/highlight");
const fs = require("fs");
let hlShExC = require("../src/languages/shexc");
let hlTtl = require("../src/languages/ttl");
let hlSparql = require("../src/languages/sparql");
let hlLiveScript = require("../../../src/languages/livescript.js");

const readdir = promisify(fs.readdir),
      readFile = promisify(fs.readFile);

describe("ShExC default highlighter", () => {
    before(() =>
        hljs.registerLanguage("shexc", hlShExC)
    );
    for (const f of fs.readdirSync(path.join(__dirname, "markup/shexc"))
               .filter(f => !f.includes(".expect.")))
        markup("shexc", "markup/shexc", f);

    (['shexc', 'ttl', 'sparql']).forEach(lang =>
    it("should be detected correctly", async () => {
        var code = await readFile(path.join(__dirname, "detect", lang, "default.txt"), "utf-8");
        var actual = hljs.highlightAuto(code).language;
        actual.should.eql(lang);
    })
                                           );

    it("should be detected correctly", async () => {
      var code = await readFile(path.join(__dirname, "../../../test/detect/livescript/default.txt"), "utf-8");
        var actual = hljs.highlightAuto(code).language;
        actual.should.eql("livescript");
    });
});

(["shexDoc", "tripleExpression"]).forEach(sublang =>
    describe("ShExC "+sublang+" highlighter", () => {
        before(() =>
               hljs.registerLanguage(sublang.toLowerCase(), h =>
                                     hlShExC(hljs, {startingProduction: sublang}))
        );
        const dir = sublang === "shexDoc" ? "markup/shexc" : sublang + "-markup"
        for (const f of fs.readdirSync(path.join(__dirname, dir))
                   .filter(f => !f.includes(".expect.")))
            markup(sublang, dir, f);
    })
)

function markup (sublang, dir, f) {
    let expectF = f.replace(".txt", ".expect.txt");
    it("should parse test/"+dir+"/" + f + " and generate test/"+dir+"/" + expectF, async () => {
        let fn = path.join(__dirname, dir, f);
        var code = await readFile(path.join(__dirname, dir, f), "utf-8");
      var exp = await readFile(path.join(__dirname, dir, expectF), "utf-8");
        var actual = hljs.highlight(sublang, code).value;
        actual.trim().should.eql(exp.trim(), f);
    });
}

/* sticks all markup tests into a single it()
   I'm keeking this around in case we need it for automating 3rd-party tests.

    it("should generate correct markup", async () => {
        let files = await readdir(path.join(__dirname, "markup"));
        files = files.filter(f => !f.includes(".expect."));
        for (const f of files) {
            let fn = path.join(__dirname, "markup", f);
            let expectFn = fn.replace(".txt", ".expect.txt");
            var code = await readFile(fn, "utf-8");
            var exp = await readFile(expectFn, "utf-8");
            var actual = hljs.highlight("shexc", code).value;
            actual.trim().should.eql(exp.trim(), f);
        }
    });
*/
