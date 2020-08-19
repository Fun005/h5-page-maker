<template>
    <div class="qk-rank-list">
        <my-pull-refresh v-model="isLoading" :head-height="40" @refresh="onPullRefresh">
            <div class="podium">
                <img class="podium-bg" :src="imageSrc_podiumBg" alt=""/>
                <div class="podium-content">
                    <div class="podium-item second">
                        <div class="avatar-wrapper">
                            <img
                                class="avatar-bg"
                                :src="imageSrc_secondIcon"
                                alt=""
                            />
                            <img
                                @click="handleAvatarClick(list[1].uid)"
                                class="img"
                                :src="list[1].portrait"
                                alt=""
                            />
                        </div>
                        <div class="podium-detail">
                            <div class="podium-title ellipsis">
                                {{ list[1].nick }}
                            </div>
                            <div class="podium-num">
                                {{ text_remark
                                }}<span>{{
                                        list[1].contribution | formatNumber
                                    }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="podium-item first">
                        <div class="avatar-wrapper">
                            <img
                                class="avatar-bg"
                                :src="imageSrc_firstIcon"
                                alt=""
                            />
                            <img
                                @click="handleAvatarClick(list[0].uid)"
                                class="img"
                                :src="list[0].portrait"
                                alt=""
                            />
                        </div>
                        <div class="podium-detail">
                            <div class="podium-title ellipsis">
                                {{ list[0].nick }}
                            </div>
                            <div class="podium-num">
                                {{ text_remark
                                }}<span>{{
                                        list[0].contribution | formatNumber
                                    }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="podium-item third">
                        <div class="avatar-wrapper">
                            <img
                                class="avatar-bg"
                                :src="imageSrc_thirdIcon"
                                alt=""
                            />
                            <img
                                @click="handleAvatarClick(list[2].uid)"
                                class="img"
                                :src="list[2].portrait"
                                alt=""
                            />
                        </div>
                        <div class="podium-detail">
                            <div class="podium-title ellipsis">
                                {{ list[2].nick }}
                            </div>
                            <div class="podium-num">
                                {{ text_remark
                                }}{{ list[2].contribution | formatNumber }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul v-if="filterTop3.length>0" class="list">
                <li
                    v-for="(item, index) in filterTop3"
                    class="item"
                    :key="index"
                >
                    <div class="item-rank">{{ index + 4 }}</div>
                    <div class="item-right">
                        <div class="item-avatar">
                            <img
                                class="self"
                                @click="handleAvatarClick(item.uid)"
                                :src="item.portrait"
                                alt=""
                            />
                        </div>
                        <div class="item-content">
                            <div class="nick ellipsis">
                                <span>{{ item.nick }}</span>
                                <img
                                    v-if="item.vip_type"
                                    class="vip-type"
                                    :src="vipImgMap[item.vip_type]"
                                    alt=""
                                />
                            </div>
                            <div class="item-num">
                                <div
                                    class="item-age"
                                    :class="
                                            item.gender+'' === '1' ? 'boy' : 'girl'
                                        "
                                >
                                    {{ item.age }}
                                </div>
                                <div
                                    v-if="imageSrc_giftIcon"
                                    class="item-total"
                                >
                                    {{ text_remark
                                    }}<span>{{
                                            item.contribution ||
                                                0 | formatNumber
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="filterTop3.length === 0" class="list">
                <img class="empty-img" :src="imageSrc_emptyBg" alt="">
                <p class="empty-text">{{text_emptyText}}</p>
            </div>
            <my-rank
                v-if="radio_myRank === 1"
                ref="myRank"
                :jump-to-user-center="handleAvatarClick"
                :user-info="userInfo"
                :color-my-rank="color_myRank"
                :image-src-my-rank="imageSrc_myRank"
                :my-rank-bottom="number_myRankBottom"
                :image-src-gift-icon="imageSrc_giftIcon"
            />
        </my-pull-refresh>
    </div>
</template>

<script>
import API from './apis'
import MyRank from './components/my-rank'
import { PullRefresh } from 'vant'
import { demoList, emptyList } from './mock'
import Vue from 'vue'

const vipImgMap = {
    1: '//img.ikstatic.cn/MTU5NjE4MjkxMDUxMyMzMjEjcG5n.png',
    2: '//img.ikstatic.cn/MTU5NjE4Mjg5OTgxOSMzNjAjcG5n.png',
    3: '//img.ikstatic.cn/MTU5NjE4MjkwNTUzNCM1OTUjcG5n.png'
}

const RANK_MAP = { 0: '第一名', 1: '第二名', '-1': '未上榜' }

const MyPullRefresh = Vue.component(
    'myPullRefresh',
    Vue.extend({
        mixins: [PullRefresh],
        methods: {
            ease (distance) {
                const headHeight = +this.headHeight
                if (distance > headHeight) {
                    if (distance < headHeight * 2) {
                        distance = headHeight + (distance - headHeight) / 2
                    } else {
                        distance = headHeight * 1.5 + (distance - headHeight * 2) / 4
                    }
                }
                    distance =Math.min(40, distance)

                return Math.round(distance)
            }
        }
    })
)

// https://h5.anyueclub.com/api/activity/rank/rich/detail?&type=daily 日榜
// https://h5.anyueclub.com/api/activity/rank/rich/detail?&type=weekly_nature 周榜
// https://h5.anyueclub.com/api/activity/rank/rich/detail?&type=total 总榜

export default {
    name: 'QkRankListPodium',
    components: { MyRank, MyPullRefresh },
    props: {
        configBtn: {
            label: '数据源配置',
            type: String,
            default: `/pages/activity/rank-config/index.html`
        },
        text_api: {
            label: '接口配置',
            type: String,
            default: ''
        },
        imageSrc_podiumBg: {
            label: '奖台背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5NjA4MDI1MDkyNSMyNDIjcG5n.png'
        },
        color_title: {
            label: '标题颜色',
            type: String,
            default: '#999999'
        },
        radio_myRank: {
            label: '是否展示我的排名',
            type: [Number, String],
            default: 1,
            options: [
                { content: '开启', value: 1 },
                { content: '关闭', value: 2 }
            ]
        },
        color_myRank: {
            label: '我的排名颜色',
            type: String,
            default: '#FFF'
        },
        imageSrc_myRank: {
            label: '我的排名背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5MDEzMzA5NTg1MyM2NDQjcG5n.png'
        },
        number_myRankBottom: {
            label: '我的排名bottom值',
            type: Number,
            default: 10
        },
        imageSrc_giftIcon: {
            label: '礼物图标',
            type: String,
            default: '//img.ikstatic.cn/MTU5NTIxNTk3Nzg5NCM4MTgjcG5n.png'
        },
        imageSrc_firstIcon: {
            label: '第一名头像框',
            type: String,
            default: '//img.ikstatic.cn/MTU5NjA5NDcyMjA3NSM3MDYjcG5n.png'
        },
        imageSrc_secondIcon: {
            label: '第二名头像框',
            type: String,
            default: '//img.ikstatic.cn/MTU5NjA5NDczNjkyMyMzMDYjcG5n.png'
        },
        imageSrc_thirdIcon: {
            label: '第三名头像框',
            type: String,
            default: '//img.ikstatic.cn/MTU5NjA5NDcyMjA3NiMyMTUjcG5n.png'
        },
        text_remark: {
            label: '备注文字',
            type: String,
            default: '贡献值:'
        },
        imageSrc_emptyBg: {
            label: '省缺图',
            type: String,
            default: '//img.ikstatic.cn/MTU3OTE4MTYwMzIzMSMzMzcjcG5n.png'
        },
        text_emptyText: {
            label: '省缺文字',
            type: String,
            default: '荣耀排名，虚位以待'
        },
        currentPageIndex: {
            type: Number,
            default: 0
        }
    },
    filters: {
        formatNumber (num) {
            return num >= 10000 ? (num / 10000).toFixed(2) + '万' : num
        }
    },
    data () {
        return {
            vipImgMap,
            isLoading: false,
            RANK_MAP,
            list: emptyList,
            allUserInfo: [] // 所有自己到数据
        }
    },
    computed: {
        userInfo () {
            return (
                this.allUserInfo[this.currentPageIndex] || {
                    nick: '', //昵称
                    portrait: '', //头像
                    total: 0, //数值
                    rank: '' //排名，0为第一名，1为第二名，-1表示没上榜
                }
            )
        },
        filterTop3 () {
            return this.list.slice(3, this.list.length)
        }
    },
    mounted () {
        this.fetchList()
    },
    methods: {
        handleAvatarClick (uid) {
            if (!uid) return
            window.$bridge.bujiu.openUserProfile({ uid })
        },
        fetchList () {
            API.GET_RANK_DATA(this.globalVariable, this.text_api)
                .then(res => {
                    if (Array.isArray(res.data) && res.data.length > 0) {
                        this.list = res.data || emptyList
                        const minLength = 3
                        if (this.list.length < minLength) {
                            for (let i = 0; i <= minLength - this.list.length; i++) {
                                this.list.push(emptyList[i])
                            }
                        }
                    } else if (this.isPreview) {
                        // 模拟一些数据
                        this.list = demoList
                    }
                })
                .finally(() => {
                    this.isLoading = false
                })
        },
        onPullRefresh () {
            this.fetchList()
        }
    }
}
</script>

<style lang="scss" scoped>
    @font-face {
        font-family: DIN-Medium;
        src: url("../../../../style/fonts/DIN-Num-Medium.ttf");
    }

    .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .qk-rank-list {
        .list {
            min-height: 200px;
            position: relative;
            padding-top: 12px;
            background-color: #fff;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;

            .empty-img {
                max-width: 100px;
                display: block;
                margin: 90px auto 0;
            }

            .empty-text {
                color: #999999;
                text-align: center;
                font-size: 12px;
                margin-top: 12px;
                padding-bottom: 60px;
            }
        }

        .item {
            display: flex;
            align-items: center;
            &:last-child{
                .item-right{
                    border-bottom:none;
                }
            }

            &-rank {
                width: 48px;
                line-height: 1;
                text-align: center;
                font-family: DIN-Medium, DIN;
                font-weight: 500;
                color: rgba(51, 51, 51, 0.3);
                font-size: 20px;
            }

            &-right {
                padding: 15px 0;
                flex: 1;
                display: flex;
                align-items: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            &-avatar {
                margin-right: 16px;
                position: relative;

                .self {
                    display: block;
                    width: 55px;
                    height: 55px;
                    margin: auto;
                    border-radius: 50%;
                    overflow: hidden;
                    object-fit: cover;
                }
            }

            &-content {
                flex: 1;
                overflow: hidden;
                margin-right: 5px;

                .nick {
                    font-size: 16px;
                    color: #333333;
                    line-height: 22px;
                    display: flex;
                    align-items: center;

                    .vip-type {
                        width: 24px;
                        margin-left: 2px;
                    }
                }

                .remark {
                    font-size: 11px;
                    margin-top: 1px;
                    line-height: 14px;
                    color: #666666;
                }

                .item-num {
                    display: flex;
                    margin-top: 7px;
                }

                .item-age {
                    margin-right: 12px;
                    width: 35px;
                    height: 20px;
                    display: inline-flex;
                    align-items: center;
                    background-size: 100% 100%;
                    padding-left: 17px;
                    font-size: 11px;

                    &.boy {
                        background-image: url("//img.ikstatic.cn/MTU5NjA4OTE3NDI0OCMyMDkjcG5n.png");
                    }

                    &.girl {
                        background-image: url("//img.ikstatic.cn/MTU5NjA4OTE3NDI1NSM0NzcjcG5n.png");
                    }
                }

                .item-total {
                    background-color: #fff5e1;
                    color: #ffa600;
                    height: 20px;
                    line-height: 20px;
                    padding: 0 10px;
                    border-radius: 20px;
                    font-size: 12px;

                    span {
                        font-size: 13px;
                        font-family: DIN-Medium, DIN;
                        margin-left: 3px;
                    }
                }
            }
        }

        &-empty {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;

            .empty-img {
                width: 200px;
            }
        }

        .podium {
            position: relative;
            height: 275px;
            /*background-image: url("//img.ikstatic.cn/MTU5NjA5NzU5ODI4OSM2NjgjcG5n.png");*/
            background-size: 100% auto;
        }

        .podium-bg {
            width: 333px;
            position: absolute;
            left: 21px;
            bottom: -32px;
            display: block;
            z-index: -1;
        }

        .podium-content {
            display: flex;
            justify-content: center;
            overflow: hidden;
            color: #fff;
            text-align: center;
        }

        .podium-item {
            width: 30%;
            position: relative;

            &.first {
                margin-top: 13px;

                .avatar-wrapper {
                    width: 86px;
                    min-height: 106px;
                }

                .img {
                    left: 3.8px;
                    top: 23px;
                    width: 80px;
                    height: 80px;
                }
            }

            &.second {
                margin-top: 47px;

                .img {
                    left: 3.2px;
                    top: 27px;
                }
            }

            &.third {
                margin-top: 61px;

                .img {
                    left: 3.2px;
                    top: 23px;
                }
            }
        }

        .podium-detail {
            margin-top: 3px;
        }

        .avatar-wrapper {
            width: 76px;
            min-height: 96px;
            margin: 0 auto;
            position: relative;

            .avatar-bg {
                width: 100%;
                display: block;
            }

            .img {
                position: absolute;
                left: 2.6px;
                top: 26.8px;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                object-fit: cover;
            }
        }

        .podium-title {
            line-height: 23px;
            font-weight: 600;
        }

        .podium-num {
            line-height: 1;
            margin-top: 4px;
            opacity: 0.8;
            font-size: 14px;
            word-break: keep-all;
            white-space: nowrap;

            span {
                font-family: DIN-Medium, DIN;
                margin-left: 4px;
            }
        }
    }
</style>

<style lang="scss">
    .qk-rank-list {
        .van-loading,
        .van-pull-refresh__head,
        .van-loading__text {
            color: #fff;
        }
    }
</style>
