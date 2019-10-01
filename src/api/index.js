import axios from 'axios';
import router from '../router';
const service = axios.create({
    timeout: 600000,
    baseURL: process.env.BASE_URL
})

// 请求前的拦截
service.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
})
// 请求响应前的拦截
service.interceptors.response.use(response => {
    const responseCode = response.status;
    if (responseCode == 200) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(response);
    }
}, error => {
    // 断网 或者 请求超时 状态
    if (!error.response) {
        // 请求超时状态
        if (error.message.includes('timeout')) {
            console.log('超时了')
        } else {
            // 可以展示断网组件
            console.log('断网了')
        }
        return
    }
    // 服务器返回不是 2 开头的情况，会进入这个回调
    // 可以根据后端返回的状态码进行不同的操作
    const responseCode = error.response.status;
    switch (responseCode) {
        // 401：未登录
        case 401:
            // 跳转登录页
            router.replace({
                path: '/login',
                query: {
                    redirect: router.currentRoute.fullPath
                }
            })
            break
            // 403: token过期
        case 403:
            // 弹出错误信息
            // Message({
            //     type: 'error',
            //     message: '登录信息过期，请重新登录'
            // })
            console.log('登录信息过期，请重新登录')
            // 清除token
            localStorage.removeItem('token')
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            setTimeout(() => {
                router.replace({
                    path: '/login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                })
            }, 1000)
            break
            // 404请求不存在
        case 404:
            // Message({
            //     message: '网络请求不存在',
            //     type: 'error'
            // })
            console.log('网络请求不存在')
            break
            // 其他错误，直接抛出错误提示
        default:
            // Message({
            //     message: error.response.data.message,
            //     type: 'error'
            // })
            console.log(error.response.data.message);
    }
    return Promise.reject(error)
})

// post请求的时候，我们需要加上一个请求头，所以可以在这里进行一个默认的设置
// 即设置post的请求头为application/x-www-form-urlencoded;charset=UTF-8
service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
export default service;
export const uploadFile = formData => {
    const res = service.request({
        method: 'post',
        url: '/upload',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return res
}