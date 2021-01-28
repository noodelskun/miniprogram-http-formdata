#  小程序请求封装，支持formdata，文件上传
##  用法
*目前只写了get请求和post请求方法*

```javascript
import HttpRequest from 'miniprogram-http-formdata'
let config = {
            // 除了添加了个baseUrl，其他的配置可参考小程序文档
            // baseUrl: 'xxx.com',
            timeout: 60000,
            dataType: 'json'
          }
          const http = new HttpRequest(wx, config)
          // get请求两个参数，请求地址path以及请求参数data
          http.get({
            path: '/getList',
            data: {
              a: 1
            }
          }).then(res => {}).catch(e => {})
          // post请求4个参数，请求地址path 请求常规参数data 是否开启formdata, 上传文件列表fileList
          http.post({
            path: '/upload',
            data: {
              a: 1
            },
            formdata: true, // 开启formdata,只有开启formdata后才可以上传文件，此参数默认关闭
            fileList: [{
              key: 'image', // formdata key-value形式里的key,就相当于data里的参数名
              path:'wx://tmp/yv0U7HpmY8UP9d32e8deb160012cf9a9e039b623374d.jpg' // 小程序文件本地缓存地址，网络地址需要先下载
            }]
          }).then(res => {console.log(res)}).catch(e => {})
```

