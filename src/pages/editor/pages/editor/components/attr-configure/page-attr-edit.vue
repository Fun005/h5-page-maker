<template>
    <el-scrollbar class="components-attr-edit">
        <p class="page-title fontBold">当前页样式</p>
        <div class="attr-item-edit-wrapper">
            <p class="attr-item-title">背景颜色：</p>
            <div class="attr-item-edit-input no-top">
                <el-color-picker
                    size="mini"
                    :show-alpha="true"
                    v-model="activePage.commonStyle.backgroundColor"
                ></el-color-picker>
            </div>
        </div>
        <div class="attr-item-edit-wrapper">
            <div class="attr-item-title">
                <p>背景图片：</p>
                <div class="attr-tips">为保证展示效果，建议图片尺寸宽为750px</div>
            </div>
            <div class="attr-item-edit-input">
                <imageSelect
                    @change="handleBackgroundImageChange"
                    :url.sync="activePage.commonStyle.backgroundImage"
                />
            </div>
        </div>

        <div v-if="pageMode !== 'h5'">
            <p class="page-title fontBold">页面尺寸</p>
            <div class="attr-item-edit-wrapper">
                <p class="attr-item-title">尺寸：</p>
                <div class="col-2 attr-item-edit-input">
                    <el-input-number
                        size="mini"
                        v-model="activePage.commonStyle.width"
                        controls-position="right"
                        :min="0"
                        disabled=""
                    />
                    <div class="attr-item-edit-input-des">宽度</div>
                </div>
                <div class="col-2 attr-item-edit-input">
                    <el-input-number
                        size="mini"
                        v-model="activePage.commonStyle.height"
                        controls-position="right"
                        :min="0"
                    />
                    <div class="attr-item-edit-input-des">高度</div>
                </div>
            </div>
        </div>

        <p class="page-title fontBold">H5全屏打开条件</p>
        <div class="attr-item-edit-wrapper">
            <div class="col-2 attr-item-edit-input">
                <span class="attr-item-edit-input-des">条件字段</span>
                <el-input size="mini" v-model="projectData.fullScreen.field"/>
            </div>
            <div class="col-2 attr-item-edit-input">
                <span class="attr-item-edit-input-des">条件值</span>
                <el-input size="mini" v-model="projectData.fullScreen.value"/>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import sizeOf from '@/utils/image-size'
import { BASE_WIDTH } from '@/constant'
import imageSelect from '@editor/components/image-select'

export default {
    components: {
        imageSelect
    },
    computed: {
        ...mapState({
            projectData: (state) => state.editor.projectData,
            activePageUUID: (state) => state.editor.activePageUUID,
            activeElementUUID: (state) => state.editor.activeElementUUID
        }),
        ...mapGetters([
            'currentPageIndex',
            'activeElementIndex',
            'activeElement',
            'activePage',
            'pageMode'
        ])
    },
    methods: {
        async handleBackgroundImageChange (url) {
            try {
                const { height, width } = await sizeOf(url)
                this.projectData.height = Math.floor(height / width * BASE_WIDTH)
            } catch (error) {
                console.log('图片检测错误')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .components-attr-edit {
        height: 100%;
    }

    .components-attr-animate-edit {
        position: relative;
    }

    .attr-title {
        font-weight: bold;
    }

    .attr-item-edit-wrapper {
        padding-left: 18px;
        display: flex;
        width: 100%;
        text-align: center;
        padding-bottom: 10px;

        .attr-item-title {
            text-align: left;
            min-width: 60px;
            font-size: 12px;
        }

        .attr-item-edit-input {
            &.col-2 {
                width: 90px;
                margin-left: 10px;
            }

            &.col-1 {
                width: 250px;
            }

            &.col-3 {
                width: 60px;
                margin-left: 10px;
            }

            &.col-4 {
                width: 50px;
                margin-left: 10px;
            }

            .attr-item-edit-input-des {
                text-align: center;
                line-height: 1;
                margin-top: 2px;
                font-size: 12px;
                color: $gray;
            }
        }
    }

    .attr-tips {
        max-width: 104px;
        margin-right: 8px;
        margin-top: 20px;
        color: #25A589;
    }
</style>
