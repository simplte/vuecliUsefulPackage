import Vue from "vue";
const componentsContext = require.context('./global', true, /\.js$/);
componentsContext.keys().forEach(component => {
    const componentConfig = componentsContext(component);
    // 兼容 import export 和 require module.export 两种规范？
    const ctrl = componentConfig.default || componentConfig;
    Vue.component(ctrl.name, ctrl);
})