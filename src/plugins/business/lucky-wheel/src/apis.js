import request from '@/utils/request'

class Apis {
    /**
     * 获取奖品列表
     * @param {uid:123,activity_id:2}
     */
    GET_PRIZE_LIST (params) {
        return request({
            method: 'get',
            url: '/activity/activity/prize-list',
            params
        })
    }

    // 获取奖品
    POST_DRAW_PRIZE (params, data) {
        return request({
            method: 'post',
            url: '/activity/prize/draw-prize',
            params,
            data
        })
    }
}

export default new Apis()
