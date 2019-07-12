// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import commmonCss from '@/static/common.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$video = Video
Vue.prototype.qs = qs


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})