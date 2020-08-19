import request from '@/utils/request'

class Apis {
  /**
   * 用户的卡片信息
   * @param {uid:123,activity_id:2}
   */
  GET_USER_CARD (params) {
    return request({
      method: 'get',
      url: '/activity/propaganda/get-user-info',
      params
    })
  }

  FOLLOW (data) {
    return request({
      method: 'post',
      url: '/activity/propaganda/follow',
      data
    })
  }

  UNFOLLOW (data) {
    return request({
      method: 'post',
      url: '/activity/propaganda/un-follow',
      data
    })
  }
}

export default new Apis()
