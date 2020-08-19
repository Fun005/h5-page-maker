<template>
    <el-form-item label="">
        <el-button @click="openModal" size="small">
            {{label}}
        </el-button>
        <el-dialog class="config-btn-dialog" :title="label" :visible.sync="visible" width="60%" @close="handlerClose"
                   :close-on-click-modal="false">
            <iframe :src="urlWithParam" frameborder="0" width="100%" height="600"></iframe>
        </el-dialog>
    </el-form-item>
</template>

<script>
import $utils from '@/utils'
import { E_REFRESH } from '@/constant/eventBusConstant'
import { translateNameQKToIK } from '@editor/common/js/mUtils'
import Bus from '@/utils/eventBus'
import { ORIGIN } from '@/config/apiRoots'
import { mapGetters } from 'vuex'

const reg = new RegExp('http')

export default {
    name: 'attr-qk-configBtn',
    props: {
        value: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: '数据源配置'
        },
        urlParams: {
            type: String,
            default: ''
        }
    },
    computed: {
        urlWithParam () {
            // 检验 iframe url 中 是否有 http 没有就加上 ORIGIN
            return `${reg.test(this.value) ? '' : ORIGIN}${this.value}?${$utils.getSearch()}&component_name=${translateNameQKToIK(this.activeElement.elName)}&${this.urlParams}`
        },
        ...mapGetters([
            'activeElement'
        ])
    },
    data () {
        return {
            visible: false
        }
    },
    methods: {
        openModal () {
            this.visible = true
        },
        handlerClose () {
            Bus.$emit(E_REFRESH) // 刷新组件 并且通知其他组件
        }
    }
}
</script>

<style scoped>
    .config-btn-dialog /deep/ .el-dialog__body {
        padding: 0;
    }
</style>
