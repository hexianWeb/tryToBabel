const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
const generate = require("@babel/generator").default;
const template = require("@babel/template").default;

const sourceCode = require("./sourceCode");
// const sourceCode = `console.log(1);`;

const ast = parser.parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"], //解析目标内容可能有 jsx
});

const targetCalleeName = ["log", "info", "error", "debug"].map(
  (item) => `console.${item}`
);

const unKnowNameFile = "未知文件名";
traverse(ast, {
  CallExpression(path, state) {
    if (path.node.isNew) {
      return;
    }
    const calleeName = generate(path.node.callee).code;
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start;

      const newNode = template.expression(
        `console.log("${
          (state && state.filename) || unKnowNameFile
        } : (${line}, ${column})")`
      )();
      newNode.isNew = true;
      if (path.findParent((path) => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]));
        path.skip();
      } else {
        path.insertBefore(newNode);
      }
    }
  },
});

const { code, map } = generate(ast);
console.log(code);
