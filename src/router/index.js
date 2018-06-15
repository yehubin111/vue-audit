import Vue from 'vue'
import Router from 'vue-router'
import page from '../page/index'
// import page2 from '../page/index2'
// import detail from '../page/detail'

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            name: 'index',
            component: page
        },
        // {
        //     path: '/list',
        //     name: 'index2',
        //     component: page2
        // },
        // {
        //     path: '/detail/:code',
        //     name: 'detail',
        //     component: detail
        // }
    ]
})