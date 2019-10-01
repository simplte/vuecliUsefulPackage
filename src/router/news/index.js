export default [{
    path: '/news',
    component: () => import( /*webpackChunkName: 'news'*/ '@/view/news/index.vue')
}]