#!/usr/bin/env node
const run = require("./run.js");

const program = require("commander");
program.version(require("../package.json").version);
program.option("-c, --concurrency", "concurrency control", "marble");
program.parse(process.argv); // 用于解析命令行参数, 运行spider -h会给出参数提示

function main() {
  const args = [...program.args];
  console.log(args);
  if (args.length == 0) {
    console.log("请输入爬虫网址");
    return;
  } else if (args.length === 1) {
    if (isValidUrl(args[0])) {
      console.log("开始爬虫");
      run.getConcurrency(args[0]);
    } else {
      console.log("请输入正确的网址");
    }
  } else if (args.length === 2) {
    if (isValidUrl(args[1])) {
      console.log("开始爬虫");
      const MAX_CONCURRENT = args[0] <= 10 ? args[0] : 10;
      run.getConcurrency(args[1], Number(MAX_CONCURRENT));
    } else {
      console.log("请输入正确的网址");
    }
  } else {
    console.log("参数错误");
    return;
  }
}

function isValidUrl(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // 协议
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // 域名·
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // 或者 IP (v4) 地址
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // 或者带端口号
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // 附加查询字符串
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // 附加的锚点
  return !!pattern.test(str);
}

main();
