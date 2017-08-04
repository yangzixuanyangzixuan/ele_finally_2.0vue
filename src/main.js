import Vue from 'vue'
import VueResource from 'vue-resource'
import moment from 'moment'
import router from './router'
import app from './app.vue'
import './mock/mockServer'

import "./common/styuls/index.styl"


//自定义全局的过滤器（格式化日期）
Vue.filter("date",function (value) {
  //被处理的时间值 1992-02-08 09:08:08
  return moment(value).format('YYYY-MM-DD HH:mm:ss')

})

// 声明vue插件
Vue.use(VueResource)

new Vue({
  el: '#app',
  render: h => h(app),
  // 配置路由
  router
})
