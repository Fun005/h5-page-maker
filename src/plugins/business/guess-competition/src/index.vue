<template>
    <div class="qk-guess-competition">
        <template v-if="radio_countDown===1">
            <van-count-down v-if="time>0" :style="{color:color_countDown}" :time="time" :format="COUNT_DOWN_FORMAT"/>
            <div class="count-down-end" v-if="currentQuestion.id && time===0" :style="{color:color_countDown}">已开奖</div>
        </template>

        <img class="bg-header" :src="imageSrc_bgHeader" alt="">
        <div class="bg-repeat" :style="{backgroundImage:`url(${imageSrc_bgCenter})`}">
            <div class="qa-title" :style="{color:color_title}">{{currentQuestion.question}}</div>
            <ul class="qa-list" :style="listStyle">
                <li v-for="(label,value) in allList" :key="value"
                    :style="{color:computedItemColor(value)}"
                    class="qa-item"
                    @click="handleItemClick(value,label)">
                    <img class="qa-item-bg" :src="computedItemBg(value)" alt="">
                    <p class="qa-item-text">
                        <span>{{label}}</span>
                        <span v-if="currentQuestion.status===STATUS.S2 && currentQuestion.answer===value">（获胜选项）</span>
                        <span v-if="currentQuestion.user_answer===value">（您的选项）</span>
                    </p>
                </li>
            </ul>
        </div>
        <img class="bg-footer" :src="imageSrc_bgBottom" alt="">
    </div>
</template>

<script>
import API from './apis'
import { demoList } from './mock'
import { CountDown, Dialog } from 'vant'
import dayjs from 'dayjs'

const COUNT_DOWN_FORMAT = 'DD天HH时mm分ss秒后开奖'
const STATUS = {
    S0: '0', // 已删除
    S1: '1', // 未开奖
    S2: '2' // 已开奖
}
export default {
    name: 'QkGuessCompetition',
    components: { VanCountDown: CountDown },
    props: {
        configBtn: {
            label: '数据源配置',
            type: String,
            default: `/pages/activity/activity-question/index.html`
        },
        imageSrc_buttonBgDefault: {
            label: '选项默认背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5NDYyNzkwNTY5OSMyNDcjcG5n.png'
        },
        imageSrc_buttonBgActive: {
            label: '选项选中背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5NDYyODcwMTE2NyM3NDUjcG5n.png'
        },
        imageSrc_buttonBgUnActive: {
            label: '选项未选中背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5NDYyODcwMTA5NCM1MjIjcG5n.png'
        },
        imageSrc_bgHeader: {
            label: '背景头部',
            type: String,
            default: '//img.ikstatic.cn/MTU5NDYzNDI4Mzg2NCM4OTUjcG5n.png'
        },
        imageSrc_bgCenter: {
            label: '背景填充',
            type: String,
            default: '//img.ikstatic.cn/MTU5NDYzMjE3NDgxMSMgMTEjcG5n.png'
        },
        imageSrc_bgBottom: {
            label: '背景底部',
            type: String,
            default: '//img.ikstatic.cn/MTU5NDYzNDI5NzYxMSM1NDYjcG5n.png'
        },
        color_title: {
            label: '题目文字颜色',
            type: String,
            default: '#999999'
        },
        color_itemUnActive: {
            label: '选项文字选中颜色',
            type: String,
            default: '#555555'
        },
        radio_countDown: {
            label: '开奖倒计时',
            type: [Number, String],
            default: 1,
            options: [
                { content: '开启', value: 1 },
                { content: '关闭', value: 2 }
            ]
        },
        imageSrc_bgcountDown: {
            label: '倒计时背景图片',
            type: String,
            default: '//img.ikstatic.cn/MTU3OTE4MTYwMzIzMSMzMzcjcG5n.png'
        },
        color_countDown: {
            label: '倒计时文字颜色',
            type: String,
            default: '#FFF'
        },
        listStyle: {}
    },
    data () {
        return {
            STATUS,
            COUNT_DOWN_FORMAT,
            currentQuestion: {
                'id': '', //问题 id
                'question': '今天没有竞猜哦',  //问题
                'select_1': '',   //选项1
                'select_2': '',
                'select_3': '',
                'select_4': '',
                'select_5': '',
                'answer_type': '0',
                'answer': '',//正确答案，开奖时才会有值
                'start_date': null,
                'end_date': null,
                'status': '',  //问题状态：0已删除，1未开奖，2已开奖
                'user_answer': null //当前用户回答的问题
            },
            time: 0,
            allList: {}, // 所有排行榜的数据
            rightAnswer: null // 正确答案
        }
    },
    computed: {},
    mounted () {
        this.fetchList()
    },
    methods: {
        fetchList () {
            API.GET_QUESTION_LISTS(this.globalVariable).then((res) => {
                let list = []
                if (Array.isArray(res.data.lists) && res.data.lists.length > 0) {
                    list = res.data.lists
                } else if (this.isPreview) { // 模拟一些数据
                    list = demoList
                }
                const [currentQuestion] = list
                if (currentQuestion) {
                    this.currentQuestion = currentQuestion
                    this.allList = {}
                    Object.keys(currentQuestion).forEach(key => {
                        if (key.indexOf('select_') > -1 && currentQuestion[key]) {
                            this.allList[key] = currentQuestion[key]
                        }
                    })

                    switch (currentQuestion.status) {
                        case STATUS.S1: // 未开奖
                            this.time = dayjs(currentQuestion.end_date).diff(dayjs())
                            this.currentQuestion.user_answer = currentQuestion.user_answer
                            break
                        case STATUS.S2: // 已开奖
                            this.time = 0
                            this.rightAnswer = currentQuestion.answer
                            break

                    }
                }
            })
        },
        // 计算每一项的背景
        computedItemBg (item) {
            // 未选中 展示 默认图片
            console.log(this.currentQuestion.user_answer)
            if (!this.currentQuestion.user_answer) {
                return this.imageSrc_buttonBgDefault
            }
            if (this.currentQuestion.status === STATUS.S1) {
                return this.currentQuestion.user_answer === item ? this.imageSrc_buttonBgActive : this.imageSrc_buttonBgUnActive
            }
            if (this.currentQuestion.status === STATUS.S2) {
                return this.currentQuestion.answer === item ? this.imageSrc_buttonBgActive : this.imageSrc_buttonBgUnActive
            }
        },
        computedItemColor (item) {
            if (this.currentQuestion.status === STATUS.S1) {
                return this.currentQuestion.user_answer === item ? this.color_itemUnActive : 'inherit'
            }
            if (this.currentQuestion.status === STATUS.S2) {
                return this.currentQuestion.answer === item ? this.color_itemUnActive : 'inherit'
            }
        },
        // 选中按钮
        handleItemClick (value, label) {
            if (this.currentQuestion.user_answer) return
            Dialog.confirm({
                title: '您的选择为',
                message: label,
                confirmButtonText: '就是它了',
                cancelButtonText: '我再想想'
            }).then(() => {
                const formData = {
                    answer: value,
                    question_id: this.currentQuestion.id
                }
                // return
                API.POST_QUESTION_ANSWER(formData).then(res => {
                    if (res) {
                        this.currentQuestion.user_answer = value
                    }
                })
            }).catch(() => {
                // on cancel
            })
        },
        // 自定义刷新组件的方法
        refresh () {
            this.fetchList()
        }
    }
}
</script>

<style lang="scss" scoped>
    .qk-guess-competition {
        .van-count-down {
            text-align: center;
            margin-bottom: 18px;
        }

        .count-down-end {
            display: block;
            text-align: center;
        }

        .bg-repeat {
            overflow: hidden;
            background-size: 100% auto;
            background-repeat: repeat-y;
        }

        .qa-title {
            margin-top: 10px;
            padding: 0 10px;
            text-align: center;
            margin-bottom: 14px;
        }

        .qa-list {
            padding: 0 22px;
        }

        .bg-header, .bg-footer {
            width: 100%;
            display: block;
        }

        .qa-item {
            position: relative;
            margin-bottom: 14px;
            min-height: 1em;
        }

        .qa-item-bg {
            display: block;
            width: 100%;
        }

        .qa-item-text {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
        }
    }
</style>
