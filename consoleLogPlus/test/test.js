// 通过 @babel/core 的 transformSync 方法来编译代码，并引入外部定义好的插件
const { transformFileSync } = require("@babel/core");
const insertParametersPlugin = require("../plugin/consoleLogPlusPlugin");
const path = require("path");

const { code } = transformFileSync(path.join(__dirname, "../sourceCode.js"), {
  plugins: [insertParametersPlugin],
  parserOpts: {
    sourceType: "unambiguous",
    plugins: ["jsx"],
  },
});

console.log(code);
