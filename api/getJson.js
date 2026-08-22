var tmdbUrl = "https://api.themoviedb.org"
const http = require('http');
const axios = require('axios');
const url = require('url');
const common = require('../utility/common.js')

module.exports = async (req, res) => {
  // ★★★ 处理 CORS 预检请求（OPTIONS）★★★
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    res.end();
    return;
  }

  var { url: requestUrl} = req;
  const parsedUrl = url.parse(requestUrl);
  // 重定向的`/get`必须去除
  if (!requestUrl.startsWith("/get")) {
    return;
  }else{
    requestUrl = requestUrl.replace(/^\/get/, '');
  }
  // 如果路径以 /3 开头，去掉它（因为 /get 已映射到官方 /3/）
  if (requestUrl.startsWith('/3')) {
    requestUrl = requestUrl.slice(2);
  }
  // 如果`api_key`前面存在参数，则`api_key`前面是'&'，否则前面就是是'?'
  if(parsedUrl.query===null){
    tmdbUrl = `https://api.themoviedb.org/3${requestUrl}?api_key=${common.apiKey}`;
  }else {
    tmdbUrl = `https://api.themoviedb.org/3${requestUrl}&api_key=${common.apiKey}`;
  }

  try {
    // 发送 HTTP 请求以获取 TMDb API 的响应
    const response = await axios.get(tmdbUrl);
    // 设置 CORS 响应头（双重保险）
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // 将 TMDb API 的响应返回给调用方
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response.data));
    console.log(tmdbUrl)
  }catch (error) {
    // 处理错误情况
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${error}`);
    console.log(`${tmdbUrl}`);
  }
};
