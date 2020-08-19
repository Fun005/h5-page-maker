import request from '@/utils/request'

class Apis {
  /**
   * 获取往期回顾
   * @param {uid:123,activity_id:2}
   */
  GET_HISTORY_QUESTION_LIST (params) {
    return request({
      method: 'get',
      url: '/activity/history-question/list',
      params
    })
  }
}

export default new Apis()
