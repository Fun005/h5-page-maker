import dayjs from 'dayjs'


export const demoList = [
    {
        'id': '1', //问题 id
        'question': '你喜欢用啥手机?',  //问题
        'select_1': '苹果',   //选项1
        'select_2': '华为',
        'select_3': '小米',
        'select_4': '三星',
        'select_5': 'oppo',
        'answer_type': '0',
        'answer': '三星',//正确答案，开奖时才会有值
        'start_date': null,
        'end_date': dayjs().add(1, 'day').format('YYYY-MM-DD HH:ss:mm'),
        'create_time': null,
        'update_time': '2020-07-14 10:20:19',
        'creator': '',
        'status': '1',  //问题状态：0已删除，1未开奖，2已开奖
        'user_answer': '' //当前用户回答的问题
    }
]
export const demoUserInfo = {
    'nick': '昵称1',    //昵称
    'portrait': 'https://img.yingtaorelian.com/MTU4NDY4NDc4ODg0MCM1NjkjanBn.jpg',//头像
    'total': 1000,//数值
    'rank': 0 //排名，0为第一名，1为第二名，-1表示没上榜
}
