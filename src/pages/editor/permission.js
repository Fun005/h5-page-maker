/**
 *  路由权限相关管理
 * */
import router from '@editor/router'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
// import * as mUtils from '@editor/common/js/mUtils'
// import store from '@editor/store'
import request from '@/utils/request'
import root from '@/config/apiRoots'

let isLogin = false

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (process && process.env.NODE_ENV === 'development') {
    next()
    return
  }
  if (!isLogin) {
    try {
      await request.get(`${root.bossapi}user/admin/login-info`)
      isLogin = true
      // console.log(res)
    } catch (error) {
      if (error.code === 401) {
        location.href = '/'
        return false
      }
      console.log('error', error)
    }
  }
  // let userData = store.state.user
  // const token = (userData && userData.token) ? userData.token : localStorage.getItem('token')
  // if (!token && !to.meta.noNeedLogin) {
  //   mUtils.Cookie.set('beforeLoginUrl', encodeURIComponent(to.fullPath), 1 / 24 / 60, window.location.host, window.location.pathname.substring(0, window.location.pathname.length - 1)) // 保存用户进入的url
  //   // 跳转到登录
  //   next({
  //     path: '/login',
  //     query: to.query
  //   })
  //   return false
  // }
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

