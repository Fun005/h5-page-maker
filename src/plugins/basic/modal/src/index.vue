<template>
    <div class="qk-modal">
        <van-popup v-model="show" :get-container="getContainer" style="background-color: transparent">
            <i @click="show=false" v-if="radio_closeBtn===1" class="qk-modal-close"/>
            <div class="qk-modal-content" :style="parentStyle" v-html="richText_content"></div>
        </van-popup>
    </div>
</template>

<script>
import { Popup } from 'vant'
import omit from 'lodash/omit'
import $Bus from '@/utils/eventBus'
import { RUN_ENV_EDITOR } from '@/constant/global'

export default {
    name: 'QkModal',
    components: { VanPopup: Popup },
    props: {
        uuid: {
            type: String,
            value: ''
        },
        defaultStyle: {
            type: Object,
            default: () => ({})
        },
        radio_closeBtn: {
            label: '展示关闭按钮',
            type: [Number, String],
            default: 1,
            options: [
                { content: '是', value: 1 },
                { content: '否', value: 2 }
            ]
        },
        richText_content: {
            label: '弹窗内容:',
            type: String,
            default: '<p>这里是弹窗内容</p>'
        }
    },
    data () {
        return {
            show: this.RUNTIME_ENV === RUN_ENV_EDITOR
        }
    },
    computed: {
        parentStyle () {
            // console.log(this.defaultStyle)
            return omit(this.defaultStyle, ['position', 'left', 'top'])
        }
    },
    created () {},
    mounted () {
        $Bus.$on('openModal', ({ uuid }) => {
            if (uuid === this.uuid) {
                this.show = true
            }
        })
    },
    methods: {
        // 自定义刷新组件的方法
        refresh () {
            // this.fetchList();
        },
        getContainer () {
            // 编辑器的时候插入到编辑器面板 否则插入到 body
            return this.RUNTIME_ENV === RUN_ENV_EDITOR
                ? document.querySelector('#editor-main')
                : document.querySelector('body')
        }
    }
}
</script>

<style lang="scss" scoped>
    .qk-modal {
        &-close {
            position: absolute;
            right: 10px;
            top: 10px;
            width: 25px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;

            &:after {
                content: '';
                display: block;
                width: 13px;
                height: 13px;
                background-size: 100% 100%;
                background-image: url("//img.ikstatic.cn/MTU5NjE2NzA2NzQxMiM0MTMjcG5n.png");
            }
        }
    }

</style>
<style>
    .qk-modal-content {
        overflow: auto;
    }
</style>

