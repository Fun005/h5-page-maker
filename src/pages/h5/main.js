import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import globalVariable from '@/mixins/globalVariable'
import { RUN_ENV_H5 } from '@/constant/global'
import $bridge from '@/bridge'

window.$bridge = $bridge

import 'animate.css'

Vue.config.productionTip = false
Vue.mixin(globalVariable)
Vue.prototype.RUNTIME_ENV = RUN_ENV_H5 // 组件的运行环境 因为同一个组件在编辑器和H5 可能有不同的展现形式

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
