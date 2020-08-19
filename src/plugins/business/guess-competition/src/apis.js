import request from '@/utils/request'

class Apis {
  /**
   * 获取活动排行榜数据
   * @param {uid:123,activity_id:2}
   */
  GET_QUESTION_LISTS (params) {
    return request({
      method: 'get',
      url: '/activity/question/lists',
      params
    })
  }
    /**
     * 提交竞猜答案
     * @param {uid:123,activity_id:2}
     */
    POST_QUESTION_ANSWER (data) {
        return request({
            method: 'post',
            url: '/activity/question/answer',
            data
        })
    }
}

export default new Apis()
