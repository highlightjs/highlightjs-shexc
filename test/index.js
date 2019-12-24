var should = require('should');
var promisify = require("util").promisify;
let path = require('path');
let hljs = require("highlightjs");
const fs = require("fs");
let hljsDefineShExC = require("../src/shexc");

const readdir = promisify(fs.readdir),
      readFile = promisify(fs.readFile);

describe("ShExC Tests", () => {
    beforeEach(() => {
        hljs.registerLanguage("shexc", hljsDefineShExC)
    });
  /* sticks all markup tests into a single it()
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
    const files = fs.readdirSync(path.join(__dirname, "markup"))
        .filter(f => !f.includes(".expect."));
    for (const f of files) {
        markup(f);
    }
    it("should be detected correctly", async () => {
        var code = await readFile(path.join(__dirname, "detect", "sample.txt"), "utf-8");
        var actual = hljs.highlightAuto(code).language;
        actual.should.eql("shexc");
    });
});

function markup (f) {
    let expectF = f.replace(".txt", ".expect.txt");
    it("should parse test/markup/" + f + " and generate test/markup/" + expectF, async () => {
        let fn = path.join(__dirname, "markup", f);
        var code = await readFile(path.join(__dirname, "markup", f), "utf-8");
        var exp = await readFile(path.join(__dirname, "markup", expectF), "utf-8");
        var actual = hljs.highlight("shexc", code).value;
        actual.trim().should.eql(exp.trim(), f);
    });
}

