var tmdbUrl = "https://api.themoviedb.org"
const http = require('http');
const axios = require('axios');
const url = require('url');
const common = require('../utility/common.js')

module.exports = async (req, res) => {
  var { url: requestUrl} = req;
  const parsedUrl = url.parse(requestUrl);
  
  // 处理预检请求（OPTIONS）
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // 重定向的`/get`必须去除
  if (!requestUrl.startsWith("/get")) {
    return;
  } else {
    requestUrl = requestUrl.replace(/^\/get/, '');
  }
  
  // 如果路径以 /3 开头，去掉它
  if (requestUrl.startsWith('/3')) {
    requestUrl = requestUrl.slice(2);
  }
  
  // 构造 TMDB URL
  if(parsedUrl.query===null){
    tmdbUrl = `https://api.themoviedb.org/3${requestUrl}?api_key=${common.apiKey}`;
  } else {
    tmdbUrl = `https://api.themoviedb.org/3${requestUrl}&api_key=${common.apiKey}`;
  }

  try {
    const response = await axios.get(tmdbUrl);
    
    // 设置 CORS 响应头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response.data));
    console.log(tmdbUrl)
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${error}`);
    console.log(`${tmdbUrl}`);
  }
};
