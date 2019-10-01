import Vue from 'vue';
import Router from 'vue-router'
// import newsRouterConfig from './news';
// import productRouterConfig from './product';
Vue.use(Router);

// const routes = [...newsRouterConfig, ...productRouterConfig];
// export default new Router({
//     mode: history,
//     base: process.env.BASE_URL,
//     routes: routes
// })
// 当我们的业务越来越庞大，
// 每次新增业务模块的时候，
// 我们都要在路由下面新增一个子路由模块
// ，然后在index.js中导入,太麻烦了，优化如下
let routes = [];
const routerContext = require.context('./', true, /index\.js$/);
routerContext.keys().forEach(route => {
    if (route.startWith('./index')) {
        return
    }
    const routerModule = routerContext(route);
    routes = [...routes, ...(routerModule.default1 || routerModule)]
})
export default new Router({
    mode: history,
    base: process.env.BASE_URL,
    routes: routes
})