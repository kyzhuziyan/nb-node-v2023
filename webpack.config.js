const path = require("path");
console.log(path.join(__dirname, "/bin"));
module.exports = {
  mode: "production",
  entry: "./index.js", // 入口文件
  output: {
    path: path.join(__dirname, "/bin"), // 决定出口文件在哪里
    filename: "index.js", // 设置出口文件的名字。默认情况下，它叫main.js
  },
};
