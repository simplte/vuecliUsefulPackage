export default [{
    path: '/product',
    component: () => import( /*webpackChunkName: 'news'*/ '@/view/product/index.vue')
}]