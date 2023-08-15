const axios = require("axios");
const cheerio = require("cheerio");
const _ = require("lodash");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const Promise = require("bluebird");

const MAX_RESULTS = 20;
// const MAX_CONCURRENT = 4;
const FETCH_INTERVAL = 30 * 1000;
let fetchedResults = 0;

// 根据URL获取HTML内容
function getHTML(url) {
  return axios.get(url).then((response) => response.data);
}

// 提取HTML中的图片链接
function extractImageUrls(html) {
  const $ = cheerio.load(html);
  const urls = [];
  $("img").each(function (i, elem) {
    urls.push($(this).attr("src"));
  });
  return urls;
}

// 下载单个图片到本地
function downloadImage(url) {
  return axios({ url, responseType: "stream" }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(
            fs.createWriteStream(
              path.join(__dirname, "img", path.basename(url))
            )
          )
          .on("finish", () => resolve())
          .on("error", (e) => reject(e));
      })
  );
}

// 抓取和保存图片
async function crawlAndSaveImages(url, MAX_CONCURRENT = 1) {
  const html = await getHTML(url);
  const imageUrls = extractImageUrls(html);
  await Promise.map(
    imageUrls,
    (url) => {
      return new Promise((resolve) => {
        if (fetchedResults >= MAX_RESULTS) resolve();
        setTimeout(() => {
          downloadImage(url)
            .then(() => {
              fetchedResults++;
              resolve();
            })
            .catch((err) => console.error(err));
        }, FETCH_INTERVAL);
      });
    },
    { concurrency: MAX_CONCURRENT }
  );
}

// 入口
async function getConcurrency(url, MAX_CONCURRENT) {
  mkdirp.sync(path.join(__dirname, "img"));
  await crawlAndSaveImages(url, MAX_CONCURRENT);
  console.log("爬虫完毕");
}

exports.getConcurrency = getConcurrency;

// const url = "https://image.baidu.com/"; // 抓取的网站
// main(url);
