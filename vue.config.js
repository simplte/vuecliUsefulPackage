const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
    chainWebpack: config => {
        // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
        config.plugin('define').tap(args => {
            args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL);
            return args;
        })
        if (process.env.NODE_ENV == 'production') {
            config.plugin('compression')
                .use(CompressionPlugin, {
                    asset: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                    cache: true
                })
                .tap(args => {})
        }
        var externals = {
            vue: 'Vue',
            axios: 'axios',
            'element-ui': 'ELEMENT',
            'vue-router': 'VueRouter',
            vuex: 'Vuex'
        }
        config.externals(externals)
        const cdn = {
            css: [
                // element-ui css
                '//unpkg.com/element-ui/lib/theme-chalk/index.css'
            ],
            js: [
                // vue
                '//cdn.staticfile.org/vue/2.5.22/vue.min.js',
                // vue-router
                '//cdn.staticfile.org/vue-router/3.0.2/vue-router.min.js',
                // vuex
                '//cdn.staticfile.org/vuex/3.1.0/vuex.min.js',
                // axios
                '//cdn.staticfile.org/axios/0.19.0-beta.1/axios.min.js',
                // element-ui js
                '//unpkg.com/element-ui/lib/index.js'
            ]
        }
        config.plugin('html')
            .tap(args => {
                args[0].cdn = cdn
                return args
            })
        // #endregion
    }
}