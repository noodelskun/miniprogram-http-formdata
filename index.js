/*
 * @Author: rkm
 * @Date: 2021-01-27 14:51:35
 * @LastEditTime: 2021-01-28 11:43:03
 * @FilePath: \miniprogram-http-formdata\index.js
 * @LastEditors: rkm
 */
const FormData = require('./formdata')
class HttpRequest {
    constructor(miniprogram, config) {
        this.miniprogram = miniprogram
        this.interceptors = {
            handleBefore: () => { },
            handleResponse: () => { },
            handleError: () => { },
        }
        this.config = config
    }
    get({
        path,
        data
    }) {
        const that = this
        that.interceptors.handleBefore(that.config)
        return new Promise((resolve, reject) => {
            that.miniprogram.request({
                method: 'GET',
                ...that.config,
                url: (that.config.baseUrl ? that.config.baseUrl : '') + path,
                data,
                success(res) {
                    const formatRes = that.interceptors.handleResponse(res)
                    formatRes && resolve(formatRes)
                    resolve(res)
                },
                fail(res) {
                    const err = that.interceptors.handleError(res)
                    err && reject(err)
                    reject(res)
                }
            })
        })
    }
    post({
        path,
        data,
        formdata = false,
        fileList = []
    }) {
        const that = this
        that.interceptors.handleBefore(that.config)
        let _data = new FormData(that.miniprogram);
        if (formdata) {
            // 注入文件
            if (fileList.length > 0) {
                fileList.map(file => {
                    _data.appendFile(file.key, file.path)
                })
            }
            // 注入参数
            Object.keys(data).map(key => {
                _data.append(key, data[key])
            })
        }
        const _formdata = _data.getData()
        return new Promise((resolve, reject) => {
            that.miniprogram.request({
                ...that.config,
                header: {
                    ...that.config.header,
                    'content-type': _formdata.contentType
                },
                method: 'POST',
                url: (that.config.baseUrl ? that.config.baseUrl : '') + path,
                data: _formdata.buffer,
                success(res) {
                    const formatRes = that.interceptors.handleResponse(res)
                    formatRes && resolve(formatRes)
                    resolve(res)
                },
                fail(res) {
                    const err = that.interceptors.handleError(res)
                    err && reject(err)
                    reject(res)
                }
            })
        })
    }
}

export default HttpRequest