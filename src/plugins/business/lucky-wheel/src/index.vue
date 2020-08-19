<template>
    <div class="qk-lucky-wheel">
        <luckywheel
            ref="vueLuckywheel"
            :background="imageSrc_drawBackground"
            :prize-index="prizeIndex"
            @get-prize="getPrize"
            @game-over="gameOver"
            :key="prizesList.length"
        >
            <luckywheel-item v-for="(prize, index) in prizesList" :key="index">
                <div class="prize-name">{{ prize.name }}</div>
                <img class="prize-img" :src="prize.thumb" alt="">
            </luckywheel-item>
        </luckywheel>
        <!-- 剩余抽奖次数占位 -->
        <div v-if="radio_surplus===1" class="surplus-block"></div>
        <!-- 滚动播报 -->
        <section v-if="radio_broadcast===1" class="broadcast-wrapper"
                 :style="{ backgroundImage: `url(${imageSrc_broadcastBg})` }">
            <vue-seamless-scroll
                :data="broadcastList"
                :class-option="seamlessOption"
                :style="{height:number_broadcastHeight+'px'}"
                class="seamless-warp">
                <ul>
                    <li class="seamless-item" v-for="(item,index) in broadcastList" :key="index">
                        <span>恭喜</span>
                        <span> {{item.uid||'xxx'}} </span>
                        <span>抽中</span>
                        <span> {{item.name}} </span>
                    </li>
                </ul>
            </vue-seamless-scroll>
        </section>

        <!-- 抽奖成功弹窗 -->
        <van-popup class="receive-popup" v-model="popupShow" :get-container="getContainer">
            <div class="pop-content">
                <img class="bg-aperture" src="//img.ikstatic.cn/MTU4OTc5NTMxNTgyNyMgNDEjcG5n.png" alt="">
                <h3 class="pop-title">恭 喜 获 得</h3>
                <img class="pop-img" :src="prizeResult.thumb" alt=""/>
                <p class="pop-text"><b>{{prizeResult.name}}</b> x {{prizeResult.num}}</p>
                <img class="pop-to-accept" :src="imageSrc_popupBtn" @click="handleClose">
            </div>
        </van-popup>
    </div>
</template>

<script>
import Luckywheel from './components/Luckywheel'
import LuckywheelItem from './components/LuckywheelItem'
import { Popup, Toast } from 'vant'
import { RUN_ENV_H5 } from '@/constant/global'
import VueSeamlessScroll from 'vue-seamless-scroll'
import { maxBy } from 'lodash'
import API from './apis'
import { demoList } from './mock'

export default {
    name: 'QkLuckyWheel',
    components: { Luckywheel, LuckywheelItem, VanPopup: Popup, VueSeamlessScroll },
    data () {
        return {
            // 无缝滚动配置
            seamlessOption: {
                step: 0.5
            },
            prizeIndex: 0,
            prizeResult: {}, // 抽奖结果 对象
            popupShow: false,
            prizesList: [],
            // 广播内容
            broadcastList: [],
            lock: false
        }
    },
    props: {
        configBtn_prize: {
            label: '奖品添加',
            type: String,
            default: `/pages/activity/prize/index.html`,
            urlParams: 'type=3' // 表示抽奖活动
        },
        configBtn_config: {
            label: '抽奖配置',
            type: String,
            default: `/pages/activity/draw-config/add.html`,
        },
        imageSrc_drawBackground: {
            label: '转盘背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjM3NjE0OTIwMCM4MDIjcG5n.png'
        },
        imageSrc_lotteryBtn: {
            label: '开始按钮',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjM2Mzg5MDI4NiM4ODkjcG5n.png'
        },
        imageSrc_lotteryBtnDisable: {
            label: '禁止按钮',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjM2Mzg5ODU1MyM5NTYjcG5n.png'
        },
        imageSrc_popupBtn: {
            label: '弹窗按钮',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjI5NDYyNzM2MiM2NjkjcG5n.png'
        },
        radio_broadcast: {
            label: '中奖名单播报',
            type: [Number, String],
            default: 1,
            options: [
                { content: '开启', value: 1 },
                { content: '关闭', value: 2 }
            ]
        },
        imageSrc_broadcastBg: {
            label: '播报背景图片',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjIwMjY4MDkwMCM2MjIjcG5n.png'
        },
        number_broadcastHeight: {
            label: '播报展示高度',
            type: Number,
            default: 120
        },
        radio_surplus: {
            label: '剩余抽奖机会',
            type: [Number, String],
            default: 1,
            options: [
                { content: '开启', value: 1 },
                { content: '关闭', value: 2 }
            ]
        }
    },
    created () {
        this.getLuckyDraw()
        this.fetchList()
    },
    computed: {},
    methods: {
        fetchList () {
            // 获取兑奖礼品列表
            API.GET_PRIZE_LIST(this.globalVariable).then(res => {
                let list = []
                if (res.data && res.data.lists && res.data.lists.length > 0) {
                    list = res.data.lists
                } else if (this.isPreview) {
                    list = demoList
                }
                // 把数组 根据 position 扁平
                list = list.reduce((prev, cur) => {
                    cur.position = cur.position || []
                    return [...prev, ...cur.position.map(v => ({ ...cur, giftPosition: +v }))]
                }, [])
                // 找到最大的 position 位置
                const maxPosition = maxBy(list,'giftPosition').giftPosition
                // 把数组 根据 giftPosition 放入转盘 相应的位置
                const positionList = new Array(maxPosition).fill({})
                list.forEach(item => {
                    positionList[item.giftPosition - 1] = item
                })
                this.prizesList = positionList

                this.broadcastList = list
            })
        },
        // 绑定共享数据
        getLuckyDraw () {
            this.remainedChance = 10
            this.$emit('setSharedData', { '抽奖剩余机会': `剩余抽奖机会: ${this.remainedChance}次` })
        },
        getContainer () {
            // 编辑器的时候插入到编辑器面板 否则插入到 body
            return this.RUNTIME_ENV === RUN_ENV_H5
                ? document.querySelector('body')
                : document.querySelector('#editor-main')
        },
        handleClose () {
            this.popupShow = false
        },
        getPrize () {
            if (this.lock) return
            console.log('开始抽奖')
            this.lock = true
            API.POST_DRAW_PRIZE({ num: 1 }).then(res => {
                let prizeResult = {}
                if (res.data && res.data.prize && res.data.prize.length > 0) {
                    prizeResult = res.data.prize[0]
                }
                // if (this.isPreview) {
                //     prizeResult = demoDrawPrizeList.prize[0]
                // }
                this.prizeIndex = this.prizesList.findIndex(v => v.id === prizeResult.id)
                if (!prizeResult.id || this.prizeIndex === -1) {
                    this.lock = false
                    Toast('很遗憾，未中奖～')
                    return
                }
                this.prizeResult = prizeResult
                this.$nextTick(this.$refs.vueLuckywheel.draw)
            }).catch(() => {
                this.lock = false
            })
        },
        gameOver () {
            this.lock = false
            this.popupShow = true
            this.broadcastList.push({ ...this.prizesList[this.prizeIndex], uid: this.globalVariable.uid })
        },
        // 自定义刷新组件的方法
        refresh () {
            this.fetchList()
        }
    }
}
</script>
<style lang="scss">
    @import "~@/style/receive-popup.scss";

    .qk-lucky-wheel {
        .vue-lucky-wheel-item-content {
            .prize-name {
                position: absolute;
                left: 0;
                top: 36px;
                text-align: center;
                width: 100%;
                z-index: 1;
            }

            .prize-img {
                position: absolute;
                width: 30%;
                height: auto;
                bottom: 54px;
                left: 50%;
                z-index: 1;
                transform: translateX(-50%);
                object-fit: contain;
            }
        }
    }

    .broadcast-wrapper {
        margin-top: 10px;
        padding: 50px 20px 20px 20px;
        background-size: 100% 100%;
    }

    .seamless-warp {
        height: 120px;
        overflow: hidden;
    }

    .seamless-item {
        text-align: center;
        border-bottom: 1px dotted #f0c4b3;
    }

    .surplus-block {
        height: 50px;
    }
</style>
