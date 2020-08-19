import RankList from './rank-list'
import RankListDuiYuan from './rank-list-duiyuan'
import RankListPodium from './rank-list-podium'
import MyPoints from './my-points'
import GiftArea from './gift-area'

import Follow1 from './follow_1'
import Follow2 from './follow_2'
import Follow3 from './follow_3'

import LuckyDraw from './lucky-draw'
import LuckJiugongge from './lucky-jiugongge'
import LuckyWheel from './lucky-wheel'

// 对缘 九宫格
import LuckJiugonggeDuiyuan from './lucky-jiugongge-duiyuan'
// 竞猜组件
import guessCompetition from './guess-competition'
// 竞猜历史
import guessHistory from './guess-history'


export default {
    name: '业务组件',
    componentsType: 'business',
    components: [
        RankList,
        RankListPodium,
        RankListDuiYuan,
        MyPoints,
        GiftArea,
        Follow1,
        Follow2,
        Follow3,
        LuckyDraw,
        LuckJiugongge,
        LuckyWheel,
        LuckJiugonggeDuiyuan,
        guessCompetition,
        guessHistory
    ]
}
