// 请求模块
import axios from 'axios'
import store from '@/store'

const request = axios.create({
    baseURL: 'http://toutiao.itheima.net' // 基础路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
    // config是本次请求的配置对象
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    // 务必要return 否则请求没有出口
    return config
}, function (error) {
    return Promise.reject(error)
})

export default request
