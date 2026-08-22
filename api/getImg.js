var tmdbUrl = "https://image.tmdb.org"
const axios = require('axios');
const url = require('url');

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
  // 重定向的`/img`必须去除
  if (!requestUrl.startsWith("/img")) {
    return;
  }else{
    requestUrl = requestUrl.replace(/^\/img/, '');
  }
  // 如果路径以 /t 开头，保留（图片路径通常以 /t/p/ 开头）
  // 不需要额外处理，直接拼接
  tmdbUrl = `https://image.tmdb.org/t/p${requestUrl}`;

  try {
    const response = await axios({
      method: 'get',
      url: tmdbUrl,
      responseType: 'stream'
    });
    // 设置 CORS 响应头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // 转发图片数据
    res.statusCode = response.status;
    response.data.pipe(res);
  }catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${error}`);
  }
};
