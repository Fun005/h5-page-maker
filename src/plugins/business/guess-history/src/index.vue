<template>
    <div class="qk-guess-history">
        <van-checkbox
            icon-size="1.2em"
            checked-color="#07c160"
            @change="handleCheckBoxChange" class="only-show" v-model="onlyShowMy">只显示我的竞猜
        </van-checkbox>
        <collapse-item v-for="item in allList" :key="item.id">
            <template #title>
                <div class="card-panel">
                    <img class="card-panel-bg" :src="imageSrc_bgCard" alt="">
                    <div class="card-panel-content">
                        <div class="card-panel-row">
                            <h4 class="question">{{item.question}}</h4>
                            <time class="time">{{item.start_date.slice(0,10)}}</time>
                        </div>
                        <p class="result" :style="{color:color_textCard}">竞猜结果：{{item.status_text}}</p>
                    </div>
                </div>
            </template>
            <div class="question-panel" :style="{backgroundImage:`url(${imageSrc_bgDetail})`}">
                <h4 class="question-title">{{item.question}}</h4>
                <ul class="answer-list" :style="{color:color_textDetail}">
                    <li v-for="(label,value,index) in item.options" :key="value" class="answer-item">
                        <span>{{ANSWER_MAP[index]}}. {{label}}</span>
                        <span v-if="item.user_answer===value">（您的选项）</span>
                        <span v-if="item.answer===value">（正确选项）</span>
                    </li>
                </ul>
            </div>
        </collapse-item>
    </div>
</template>

<script>
import API from './apis'
import { demoList } from './mock'
import { Checkbox } from 'vant'
import CollapseItem from './components/collapse-item'

const SELF_STATUS = {
    S0: 0, // 显示全部
    S1: 1 // 只显示自己
}
const ANSWER_MAP = ['A', 'B', 'C', 'D', 'E']
export default {
    name: 'QkGuessHistory',
    components: { VanCheckbox: Checkbox, CollapseItem },
    props: {
        imageSrc_bgCard: {
            label: '卡片背景图片',
            type: String,
            default: '//img.ikstatic.cn/MTU5NTk5MDM1NDk3OSMxMjgjcG5n.png'
        },
        color_textCard: {
            label: '竞猜结果颜色',
            type: String,
            default: '#000'
        },
        imageSrc_bgDetail: {
            label: '题目详情背景',
            type: String,
            default: '//img.ikstatic.cn/MTU5NTk4OTI2Mzc1MiM0NjYjanBn.jpg'
        },
        color_textDetail: {
            label: '题目详情文字',
            type: String,
            default: '#FFF'
        }
    },
    data () {
        return {
            ANSWER_MAP,
            onlyShowMy: true,
            activeNames: ['1'],
            allList: [], // 所有排行榜到数据
            result: null
        }
    },
    computed: {},
    mounted () {
        this.fetchList()
    },
    methods: {
        fetchList () {
            const formData = {
                page: 1,
                size: 99999,
                self: this.onlyShowMy ? SELF_STATUS.S1 : SELF_STATUS.S0
            }
            API.GET_HISTORY_QUESTION_LIST(formData).then(res => {
                this.allList = []
                if (Array.isArray(res.data.list) && res.data.list.length > 0) {
                    this.allList = res.data.list || []
                } else if (this.isPreview) { // 模拟一些数据
                    this.allList = demoList
                }
                this.allList = this.allList.map(item => {
                    const newItem = {
                        ...item,
                        options: {}
                    }
                    Object.keys(item).forEach(key => {
                        if (key.indexOf('select_') > -1 && item[key]) {
                            newItem.options[key] = item[key]
                        }
                    })
                    return newItem
                })
            })
        },
        handleCheckBoxChange () {
            this.fetchList()
        }
    }
}
</script>

<style lang="scss" scoped>
    .qk-guess-history {
        overflow: hidden;

        .collapse-item {
            margin-bottom: 20px;
        }

        .card-panel {
            position: relative;
            color: inherit;
        }

        .card-panel-bg {
            width: 100%;
        }

        .card-panel-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .card-panel-content {
            position: absolute;
            padding: 4px 15px 10px 15px;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 1;
            line-height: 1.4em;

            .time {
                font-size: 12px;
                display: block;
                opacity: 0.7;
            }

            .question {
                flex: 1;
                font-weight: bold;
                margin-right: 8px;
                line-height: 20px;
                overflow: hidden;
                white-space: normal;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .result {
                position: absolute;
                left: 10px;
                bottom: 10px;
                z-index: 1;
            }
        }

        .question-panel {
            padding: 10px;
            background-size: 100% 100%;
            text-align: center;
        }

        .question-title {
            margin-bottom: 10px;
        }

        .answer-item + .answer-item {
            margin-top: 10px;
        }
    }
</style>
<style lang="scss">
    .qk-guess-history .only-show {
        margin-bottom: 15px;

        .van-checkbox__label {
            color: inherit;
        }

    }
</style>
