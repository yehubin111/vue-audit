// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex'
import Icon from 'vue-svg-icon/Icon.vue';
import VueJsonp from 'vue-jsonp';
import '../static/ueditor.config.js'
import '../static/ueditor.all.min.js'
import '../static/lang/zh-cn/zh-cn.js'
import '../static/ueditor.parse.min.js'
import '../src/assets/js/ajaxfileupload.min.js'

Vue.use(VueJsonp);
Vue.component('icon', Icon);


Vue.directive('clickOutside', {
    bind(el, binding, vnode) {
        function documentHandler(e) {
            //   if (el.contains(e.target)) {
            //     // return false;
            //     this.showHideList();
            //   }else{
            //     this.hideList()
            //   }

            if (binding.expression) {
                binding.value(e);
            }
        }

        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    }
});

Vue.filter('timeFormat', (value) => {
    if (!value)
        return '';

    let newdate = new Date();
    newdate.setTime(value);
    let nyear = newdate.getFullYear();
    let ftime = 'yyyy-MM-dd HH:mm:ss';
    let dateitems = {
        'M': newdate.getMonth() + 1,
        'd': newdate.getDate(),
        'H': newdate.getHours(),
        'm': newdate.getMinutes(),
        's': newdate.getSeconds()
    };
    //替换年份
    if (/(y+)/.test(ftime)) {
        ftime = ftime.replace(RegExp.$1, nyear);
    }
    //替换月份以及其他的
    for (let i in dateitems) {
        if (new RegExp('(' + i + '+)').test(ftime)) {
            ftime = ftime.replace(RegExp.$1, RegExp.$1.length === 1 ? dateitems[i] : ('00' + dateitems[i]).substring(('' + dateitems[i]).length));
        }
    }
    return ftime;
});

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});