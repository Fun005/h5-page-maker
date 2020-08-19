function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'inkejs://__bridge_loaded__' // 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

var userAgent = window.navigator.userAgent
var IsIos = /iPhone|mac|iPod|iPad/i.test(userAgent)
// var isAndroid = /android/i.test(userAgent)
function iosBridge (type, data) {
  setupWebViewJavascriptBridge(function (bridge) {
    bridge.callHandler(type, data, function () { })
  })
}

function iosRegisterApi (funcName, cb) {
  setupWebViewJavascriptBridge(function (bridge) {
    bridge.registerHandler(funcName, function (response) {
      typeof cb === 'function' && cb(response)
    })
  })
}

function SetJsBridge () {
  this.ios = {
    showToast: function (data) {
      iosBridge('jsBridge.showToast', data)
    },
    confirmDialog: function (data) {
      iosBridge('jsBridge.confirmDialog', data)
    },
    share: function (data) {
      iosBridge('jsBridge.showShare', data)
    },
    /**
     * shareNew
     * @params string
     * 'wechat' : 微信好友
     *'wxfriends' ： 朋友圈
     */
    // 下掉了 by 西纯 at 2019-05-23
    // shareNew: function (data) {
    //   iosBridge('jsBridge.shareByType', data)
    // },
    copyT: function (data) {
      iosBridge('jsBridge.pasteToboard', data)
    },
    /**
     * shareImage
     * @params object  {"base64String": "xxxx",type: ''}
     * base64String: 图片base64地址
     * type： wechat（微信好友） 、 wxfriends（朋友圈） 、qq（腾讯qq）、qqzone（qq空间）、weibo(微博)、
     */
    shareImage: function (data) {
      iosBridge('jsBridge.shareImage', data)
    },
    /**
     * shareH5
     * @params object {
        type: wechat 微信好友 / wxfriends 朋友圈
        portrait,  分享缩略图
        title,     分享标题
        content,   分享描述
        url        分享的url
      }
     */
    shareH5: function (data) {
      iosBridge('jsBridge.shareH5', data)
    },
    topicReply: function (data) {
      iosBridge('jsBridge.topicReply', data)
    },
    /**
     * 设置右上角按钮
     * @params object {
        title: xxxxxx  文案
        action: xxxx   跳哪
      }
     */
    setRightButton: function (data) {
      iosBridge('jsBridge.renderRightButton', data)
    },

    /**
     * 录制声音  开始录制
     */
    startRecord: function (data) {
      iosBridge('jsBridge.startRecord', data)
    },

    /**
     * 录制声音  结束录制
     */
    stopRecord: function (data) {
      iosBridge('jsBridge.stopRecord', data)
    },

    /**
     * 设置右上角分享按钮
     * @param
     * button_image 分享按钮图片
     * thumb_image 分享缩略图
     * title 分享标题
     * content 分享描述
     * url 分享的url
     */
    setShareButton: function (data) {
      iosBridge('jsBridge.renderShareButton', data)
    },
    // 播放领养成功后的动画jsbridge
    showCatAnim: function () {
      iosBridge('jsBridge.showCatAnim')
    },

    setRegisterApi: function (funcNmae, cb) {
      iosRegisterApi(funcNmae, cb)
    },

    openRecharge: function (data) {
      iosBridge('jsBridge.vipOpen', data)
    },
    closePage: function () {
      iosBridge('jsBridge.closePage')
    },
    // 打开金币充值
    openGoldRecharge: function (type = 0) { // 0 个人主页 1 其他 2 幸运 转盘
      window.location.href = `queen://pname=gold_coin&from=${type}`
    },

    // 跳转到个人主页
    openUserProfile: function (data) {
      if (!data.uid) {
        console.error('缺少uid');
        return
      }
      window.location.href = `queen://pname=user_page&peer_id=${data.uid}`
    },

    // ios恢复购买
    commentQuest: function () {
      iosBridge('jsBridge.commentQuest')
    },

    // ios跳转常见问题
    restorePay: function () {
      iosBridge('jsBridge.restorePay')
    },
  }

  this.and = {
    showToast: function (param) {
      window.jsBridge.showToast(param)
    },
    confirmDialog: function (param) {
      window.jsBridge.confirmDialog(param)
    },
    share: function () {
      window.jsBridge.showShare()
    },
    // shareNew: function (param) {
    //   window.jsBridge.shareByType(param);
    // },
    copyT: function () { },
    shareImage: function (data) {
      // {"base64String":"xxxx", type: '' }
      window.jsBridge.shareImage(JSON.stringify(data))
    },
    shareH5: function (data) {
      // {type, portrait, title, content, url}
      window.jsBridge.shareH5(JSON.stringify(data))
    },
    topicReply: function (data) {
      // {type, portrait, title, content, url}
      window.jsBridge.topicReply(JSON.stringify(data))
    },
    setRightButton: function (data) {
      window.jsBridge.renderRightButton(JSON.stringify(data))
    },
    startRecord: function () {
      window.jsBridge.startRecord()
    },
    stopRecord: function () {
      window.jsBridge.stopRecord()
    },
    setShareButton: function (data) {
      window.jsBridge.renderShareButton(JSON.stringify(data))
    },
    // 播放领养成功后的动画jsbridge
    showCatAnim: function () {
      window.jsBridge.showCatAnim()
    },

    setRegisterApi: function (funcNmae, cb) {
      window[funcNmae] = function (res) {
        typeof cb === 'function' && cb(res)
      }
    },
    openRecharge: function (data) {
      try {
        window.jsBridge.vipOpen(data)
      } catch (e) {
        console.log(e);
      }
    },
    showRightButton: function () {
      try {
        window.jsBridge.showRightButton()
      } catch (e) {
        console.log(e);
      }
    },
    // 关闭当前h5
    closePage: function () {
      try {
        window.jsBridge.closePage()
      } catch (e) {
        console.log(e);
      }
    },
    // 打开金币充值
    openGoldRecharge: function (type = 0) { // 0 个人主页 1 其他 2 幸运 转盘
      window.location.href = `queen://pname=gold_coin&from=${type}`
    },

    // 跳转到个人主页
    openUserProfile: function (data) {
      if (!data.uid) {
        console.error('缺少uid');
        return
      }
      window.location.href = `queen://pname=user_page&peer_id=${data.uid}`
    }
  }
  return IsIos ? this.ios : this.and
}

export default new SetJsBridge()
