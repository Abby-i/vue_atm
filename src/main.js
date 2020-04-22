import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './base.css'
// 打开 main.js
import Bmob from "hydrogen-js-sdk";
import store from './store/modules/store'//所有组件对象都多了一个属性：$store

// 初始化 SDK版本 2.0.0 以下保留之前的初始化方法
Bmob.initialize("01a825c210ceaf63", "123456");
// 挂载到全局使用
Vue.prototype.Bmob = Bmob
Vue.use(ElementUI);
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  store,
})
