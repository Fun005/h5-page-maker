<template>
    <div class="qk-lucky-draw">
        <div class="draw-area">
            <img class="bg" :src="imageSrc_drawBackground" alt="">
            <div class="content">
                <img class="egg" :src="imageSrc_egg" alt="imageSrc_egg"/>
                <img class="hammer" :src="imageSrc_hammer" alt="imageSrc_hammer"/>
            </div>
        </div>
        <div class="btn-area">
            <img
                @click="handlePrize(1)"
                :src="imageSrc_leftBtn"
                alt="imageSrc_leftBtn"
                class="left-btn"
            />
            <img
                @click="handlePrize(10)"
                :src="imageSrc_rightBtn"
                alt="imageSrc_rightBtn"
                class="right-btn"
            />
        </div>
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
                    <li class="seamless-item" v-for="(item,index) in broadcastList" :key="index">{{item.title}}</li>
                </ul>
            </vue-seamless-scroll>
        </section>
        <van-popup class="receive-popup" v-model="show" :get-container="getContainer">
            <div class="pop-content">
                <img class="bg-aperture" src="//img.ikstatic.cn/MTU4OTc5NTMxNTgyNyMgNDEjcG5n.png" alt="">
                <h3 class="pop-title">恭 喜 获 得</h3>
                <template v-if="prizeList.length===1">
                    <img class="pop-img" :src="prizeList[0].thumb" alt=""/>
                    <p class="pop-text"><b>{{ prizeList[0].name }}</b> x {{prizeList[0].num}}</p>
                </template>
                <ul v-if="prizeList.length>1" class="pop-prize-list">
                    <li class="pop-prize-item" v-for="(item,index) in prizeList" :key="index">
                        <img class="pop-list-img" :src="item.thumb" alt=""/>
                        <p class="pop-prize-text">
                            <b>{{ item.name }}</b> x {{item.num}}
                        </p>
                    </li>
                </ul>

                <img class="pop-to-accept" :src="imageSrc_popupBtn" @click="handleClose">
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Popup, Toast } from 'vant'
import API from './apis'
import PluginMixins from '../../../mixins/pluginMixins'
import VueSeamlessScroll from 'vue-seamless-scroll'
// import { demoDrawPrizeList } from './mock'
import { RUN_ENV_H5 } from '@/constant/global'

export default {
    name: 'QkLuckyDraw',
    components: { VanPopup: Popup, VueSeamlessScroll },
    mixins: [PluginMixins],
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
            default: `/pages/activity/draw-config/add.html`
        },
        imageSrc_egg: {
            label: '蛋图',
            type: String,
            default: '//img.ikstatic.cn/MTU5MjU1MTA2MzUzOSMgMjMjcG5n.png'
        },
        imageSrc_hammer: {
            label: '锤子图',
            type: String,
            default: '//img.ikstatic.cn/MTU4NzUyNDEzMDg2MiM0NDAjcG5n.png'
        },
        imageSrc_drawBackground: {
            label: '抽奖背景图',
            type: String,
            default: '//img.ikstatic.cn/MTU4NzQzNzI0NTYzMCMzMjYjcG5n.png'
        },
        imageSrc_leftBtn: {
            label: '左边按钮图',
            type: String,
            default: '//img.ikstatic.cn/MTU4Nzg2NTYxMzE3NCM2MzIjcG5n.png'
        },
        imageSrc_rightBtn: {
            label: '右边按钮图',
            type: String,
            default: '//img.ikstatic.cn/MTU4Nzg2NTYyNTIzNSMgIDQjcG5n.png'
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
    data () {
        return {
            // 无缝滚动配置
            seamlessOption: {
                step: 0.5
            },
            broadcastList: [
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' },
                { 'title': '恭喜 xxx 抽中 xxxxxxxx' }
            ],
            remainedChance: 0,
            prizeList: [], // 待领取卡片列表
            currentWaitIndex: 0, // 当前待领取卡片的数组索引
            show: false
        }
    },
    computed: {},
    created () {
        this.getLuckyDraw()
    },
    mounted () {
    },
    methods: {
        getContainer () {
            // 编辑器的时候插入到编辑器面板 否则插入到 body
            return this.RUNTIME_ENV === RUN_ENV_H5
                ? document.querySelector('body')
                : document.querySelector('#editor-main')
        },
        handleClose () {
            this.show = false
        },
        getLuckyDraw () {
            this.remainedChance = 10
            this.$emit('setSharedData', { '剩余砸蛋机会': `剩余砸蛋机会: ${this.remainedChance}次` })
        },
        // 展示弹窗内容
        showPopup () {
            this.show = true
        },
        // 开始抽奖
        handlePrize (num) {
            API.POST_DRAW_PRIZE({ num }).then(res => {
                let prizeList = []
                if (res.data && res.data.prize && res.data.prize.length > 0) {
                    prizeList = res.data.prize
                }
                // 奖品列表存在， 并且奖品价值大于0才算中奖
                if (prizeList.length > 0 && prizeList[0].price > 0) {
                    this.show = true
                    this.prizeList = prizeList
                } else {
                    Toast('很遗憾，未中奖～')
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@editor/common/styles/function';
    @import "~@/style/receive-popup.scss";

    $height: 437px;
    $width: 375px;

    .qk-lucky-draw {
        position: relative;
        padding-top: 30px;
        .draw-area {
            min-height: 300px;
            position: relative;
            .bg{
                width: 100%;
            }

            .content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }

            .egg {
                display: block;
                margin: 0 auto;
                width: 34%;
                animation: overFloat 1s infinite alternate;
            }

            .hammer {
                position: absolute;
                top: 28.5px;
                right: 62px;
                width: 66.5px;
                transform: scale(1) rotatez(7deg) translate(-14px, 1px);
                /*animation: 0.1s init, 1s aa 1s, 3s ab 1.7s infinite;*/
                animation: ab 3s infinite;
            }
        }

        .btn-area {
            width: 375px;
            display: flex;

            .left-btn, .right-btn {
                width: 50%;
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

    @keyframes overFloat {
        from {
            transform: translate(0, -15px);
        }
        to {
            transform: translate(0, 5px);
        }
    }

    @keyframes aa {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1) rotatez(7deg) translate(-17px, 1px);
        }
    }

    @keyframes ab {
        0% {
            transform: rotatez(7deg) translate(17px, 0px);
        }
        50% {
            transform: rotatez(-7deg) translate(-17px, 0px);
        }
        100% {
            transform: rotatez(7deg) translate(17px, 0px);
        }
    }
</style>
