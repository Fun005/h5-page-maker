<template>
    <div class="editor-pane" @mousedown="handleClickCanvas">
        <div class="editor-wrapper" :style="{width: device.width + 'px',}">
            <div class="device-wrapper" id="device-wrapper"
                 @dragover="handleDragOver"
                 @drop.capture="handleDrop"
                 @dragenter="handleDragEnter"
                 :style="{width: activePage.commonStyle.width + 'px',height: activePage.commonStyle.height + 'px'}">
                <div class="editor-main" id="editor-main"
                     :style="{...getCommonStyle(activePage.commonStyle)}">
                    <!-- 刻度尺子 -->
                    <div class="rulers">
                        <div class="horizontal ruler"></div>
                        <div class="vertical ruler" :style="{height: activePage.commonStyle.height + 'px'}"></div>
                    </div>
                    <!--页面组件列表展示-->
                    <edit-shape
                        v-for="item in elements"
                        :key="item.uuid"
                        :uuid="item.uuid"
                        :resizable="item.resizable"
                        :movable="item.movable"
                        :autoSize="item.autoWidth || item.autoHeight"
                        :defaultStyle="item.commonStyle"
                        :lockRatio="item.lockRatio"
                        :invisible="item.invisible"
                        :style="{...getCommonStyle(item.commonStyle),transition:'unset'}"
                        @handleMousedown="handleMousedown"
                        @resizeEnd="handleElementResizeEnd"
                        :active="item.uuid === activeElementUUID"
                        :name="item.name"
                        :verticalGuidelines="verticalGuidelines"
                        :horizontalGuidelines="horizontalGuidelines"
                    >
                        <component
                            :is="item.elName"
                            class="element-on-edit-pane"
                            :defaultStyle="getCommonStyle(item.commonStyle)"
                            :uuid="item.uuid"
                            :bindings="item.bindings"
                            v-bind.sync="item.propsValue"
                            :ref="`component_${item.uuid}`"
                            @setSharedData="setSharedData(item.uuid, $event)"
                        />
                    </edit-shape>
                </div>
            </div>
        </div>
        <div class="page-wrapper-menu-operation menu-item-on-edit-panel" :class="{ active: activeElementUUID }">
            <el-tooltip
                v-for="(item, index) in menuOptions"
                :key="index"
                effect="dark"
                :content="item.title"
                placement="right"
                v-once>
                <div class="menu-item menu-item-on-edit-panel" @click="handleElementCommand(item.value)">
                    <i class="menu-item-on-edit-panel" :class="[item.icon]"></i>
                </div>
            </el-tooltip>
            <el-popover
                placement="right"
                width="160"
                trigger="hover"
                v-model="syncPageVisible">
                <div class="sync-title">添加/替换到其他状态</div>
                <ul class="sync-list">
                    <li class="sync-item" @click="handleSyncPage()">全部状态</li>
                    <template v-for="item in pages">
                        <li class="sync-item"
                            v-if="activePageUUID !== item.uuid"
                            @click="handleSyncPage(item.uuid)"
                            :key="item.uuid">
                            状态{{item.name}}
                        </li>
                    </template>
                </ul>
                <div slot="reference" class="menu-item menu-item-on-edit-panel">
                    <i class="menu-item-on-edit-panel iconfont iconredo1"></i>
                </div>
            </el-popover>
        </div>
    </div>
</template>

<script>
import plugins from '@/plugins/index'
import getOffset from '@/utils/getOffset'

import editShape from '@editor/components/edit-shape'
import editorProjectConfig from '@editor/pages/editor/DataModel'
import { mapGetters, mapState } from 'vuex'
import html2canvas from 'html2canvas'
import guideLineMixin from '@editor/mixins/guideLine'

import Guides from '@scena/guides'
// window._qk_register_components_object = _qk_register_components_object;
export default {
    props: {},
    components: {
        // 批量注册qk组件
        ...plugins,
        // 画板组件
        [editShape.name]: editShape
    },
    data () {
        return {
            getCommonStyle: editorProjectConfig.getCommonStyle,
            menuOptions: [
                {
                    title: '复制',
                    icon: 'iconfont iconfuzhi',
                    value: 'copy'
                },
                {
                    title: '删除',
                    icon: 'iconfont iconshanchu',
                    value: 'delete'
                },
                {
                    title: '字体放大',
                    icon: 'iconfont iconzitifangda',
                    value: 'fontA+'
                },
                {
                    title: '字体缩小',
                    icon: 'iconfont iconzitisuoxiao',
                    value: 'fontA-'
                },
                {
                    title: '字体加粗',
                    icon: 'iconfont iconzitijiacu',
                    value: 'fontB'
                },
                {
                    title: '图层上移',
                    icon: 'iconfont iconziyuan1',
                    value: 'layerUp'
                },
                {
                    title: '图层下移',
                    icon: 'iconfont iconxiayiyiceng',
                    value: 'layerDown'
                },
                {
                    title: '图层置顶',
                    icon: 'iconfont iconcontrol-top',
                    value: 'layerTop'
                },
                {
                    title: '图层置底',
                    icon: 'iconfont iconcontrol-bottom',
                    value: 'layerBottom'
                }
            ],
            device: {
                height: 667,
                width: 375
            },
            elements: [],
            resizeListeners: null,
            syncPageVisible: false,
            guidesVertical: null,
            guidesHorizonta: null,
            verticalGuidelines: [], // [0, 150, 200]
            horizontalGuidelines: [] // [0, 150, 200]
        }
    },
    mixins: [guideLineMixin],
    computed: {
        ...mapState({
            pages: (state) => state.editor.projectData.pages,
            projectData: (state) => state.editor.projectData,
            activePageUUID: (state) => state.editor.activePageUUID,
            activeElementUUID: (state) => state.editor.activeElementUUID
        }),
        ...mapGetters([
            'currentPageIndex',
            'activeElementIndex',
            'activeElement',
            'activePage',
            'sharedData'
        ])
    },
    created () {
    },
    mounted () {
        const rulersElement = document.querySelector('.rulers')
        this.horizontalRulerElement = rulersElement.querySelector('.ruler.horizontal')
        this.verticalRulerElement = rulersElement.querySelector('.ruler.vertical')

        this.guidesHorizonta = new Guides(this.horizontalRulerElement, {
            type: 'horizontal',
            setGuides: this.refreshGuidelines.bind(this),
            backgroundColor: 'transparent',
            lineColor: '#666',
            textColor: '#333'
        })
        this.guidesVertical = new Guides(this.verticalRulerElement, {
            type: 'vertical',
            setGuides: this.refreshGuidelines.bind(this),
            backgroundColor: 'transparent',
            lineColor: '#666',
            textColor: '#333'
        })
    },
    watch: {
        'activePage.elements': {
            immediate: true,
            deep: true,
            handler () {
                this.initElements()
            }
        },
        'activePage.commonStyle.height': {
            handler () {
                this.$nextTick(() => {
                    this.guidesVertical && this.guidesVertical.resize()
                })
            }
        }
    },
    methods: {
        initElements () {
            if (!this.activePage.elements) {
                this.elements = []
            }
            const val = this.activePage.elements.map((item) => {
                return {
                    ...item,
                    propsValue: {
                        ...this.getElementProps(item.propsValue, item.bindings),
                        value: item.value
                    },
                    name: plugins[item.elName]
                        ? plugins[item.elName].title
                        : ''
                }
            })
            this.elements = val
            this._updateGuideLine()
            this.refreshGuidelines()
        },
        /**
         * 元素被选中
         * @param uuid
         */
        handleMousedown (uuid) {
            if (this.activeElementUUID !== uuid) {
                this.$emit('element-click', uuid)
                this.$store.dispatch('setActiveElementUUID', uuid)
            }
        },

        /**
         * 移动改变元素大小定位
         * @param pos 当pos有值表示移动中需要实时同步样式变化，pos为undefined时则表示移动结束，记一次历史纪录
         * 鼠标移动完成时才记入历史纪录
         */
        handleElementResizeEnd (pos) {
            // 更新元素commonStyle
            const projectData = { ...this.projectData }
            projectData.pages[this.currentPageIndex].elements[this.activeElementIndex].commonStyle = { ...pos }
            this.$store.commit('setPrjectData', projectData)
            this._clearGuideLine()
            this.$store.dispatch('addHistoryCache')
        },
        handleClickCanvas (e) {
            if (e.target.classList.contains('editor-pane') || e.target.classList.contains('editor-main')) {
                this.$store.dispatch('setActiveElementUUID', null)
            }
        },
        /**
         * 对元素进行操作命令
         */
        handleElementCommand (command) {
            this.$store.dispatch('elementCommand', command)
        },
        /**
         * 提供截屏作为项目主图
         */
        screenshots () {
            const el = document.querySelector('#canvas-panel')
            html2canvas(el, {
                width: 375,
                height: 667,
                proxy: '/htmltocanvas/corsproxy' // 设置跨域接口
            }).then((canvas) => {
                let url = canvas.toDataURL('image/jpeg')
                this.$store.commit('updateCoverImage', url)
            })
        },
        getElementProps (props, bindings) {
            let tempProps = {}
            for (const i in props) {
                // console.log(i, props[i], Object.prototype.toString.call(props[i]))
                if (bindings) {
                    // console.log(bindings, i)
                    const findedBinding = bindings.find(
                        (item) => item.key.join('.').indexOf(i) >= 0
                    )
                    if (findedBinding) {
                        // console.log(findedBinding)
                        const [uuid, key] = findedBinding.value
                        if (this.sharedData && this.sharedData[uuid]) {
                            tempProps[i] = this.sharedData[uuid][key]
                        }
                        // console.log(tempProps[i])
                        continue
                    }
                }
                if (
                    Object.prototype.toString.call(props[i]) ===
                    '[object Object]'
                ) {
                    tempProps[i] = props[i].value
                } else {
                    tempProps[i] = props[i]
                }
                tempProps[i] = this.renderString(
                    tempProps[i],
                    this.globalVariable
                )
            }
            return tempProps
        },
        // 刷新辅助线
        refreshGuidelines () {
            const guidesVertical = this.guidesVertical ? this.guidesVertical.getGuides() : []
            const guidesHorizonta = this.guidesHorizonta ? this.guidesHorizonta.getGuides() : []
            // this.verticalGuidelines = [...guidesVertical]
            // this.horizontalGuidelines = [...guidesHorizonta]
            this.verticalGuidelines = [...guidesVertical, ...this.guide.line.left]
            this.horizontalGuidelines = [...guidesHorizonta, ...this.guide.line.top]
        },
        // 同步状态数据
        handleSyncPage (pageUuid) {
            this.syncPageVisible = false
            this.$store.dispatch('asyncPage', pageUuid)
        },
        setSharedData (uuid, data) {
            this.$store.dispatch('setSharedData', { uuid, data })
            this.initElements()
        },
        handleDragEnter (e) {
            e.preventDefault()
        },

        handleDragOver (e) {
            e.preventDefault()
        },
        /**
         * 处理拖动
         */
        handleDrop (e) {
            e.preventDefault()
            e.stopPropagation()
            const transferedData = e.dataTransfer.getData('dragElement')
            if (transferedData) {
                let item = JSON.parse(transferedData)
                const targetPosition = { left: e.clientX, top: e.clientY }
                const panelPosition = getOffset(e.currentTarget)
                // 这里修改一下添加到到位置 算到组件到中心
                // panelPosition是画板的位置 clientX，clientY是元素拖动到的位置
                item.defaultStyle.left =
                    targetPosition.left -
                    panelPosition.left -
                    (item.defaultStyle.width &&
                    // 这里有可能是undefined或者auto
                    typeof item.defaultStyle.width === 'number'
                        ? item.defaultStyle.width / 2
                        : 0)
                item.defaultStyle.top =
                    targetPosition.top -
                    panelPosition.top -
                    (item.defaultStyle.height &&
                    typeof item.defaultStyle.height === 'number'
                        ? item.defaultStyle.height / 2
                        : 0)
                this.$store.dispatch('addElement', item)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .editor-pane {
        height: 100%;
        width: 100%;
        border: 1px solid #f5f5f5;
        border-width: 0 1px;
        overflow-y: auto;
        background-image: linear-gradient(
                45deg,
                #f5f5f5 25%,
                transparent 0,
                transparent 75%,
                #f5f5f5 0
        ),
        linear-gradient(
                45deg,
                #f5f5f5 25%,
                transparent 0,
                transparent 75%,
                #f5f5f5 0
        );
        background-position: 0 0, 13px 13px;
        background-size: 26px 26px;
        display: flex;
        justify-content: center;
    }

    .device-wrapper {
        border-radius: 3px;
        box-shadow: 0 3px 10px #dcdcdc;
        position: relative;
        transform: scaleX(1); /* 为了让 自组件的position:fixed 失效*/
        background-color: #fff;
        transform-origin: center top;
        background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==');
    }

    .editor-main {
        height: 100%;
        background-repeat: no-repeat;
        background-size: 100% auto !important;
    }

    .rulers {
        position: absolute;
        width: 30px;
        height: 30px;
        left: -30px;
        top: -30px;
        box-sizing: border-box;
    }

    .ruler {
        position: absolute;
    }

    .ruler.horizontal {
        width: 375px;
        height: 30px;
        left: 30px;
        top: 0px;
    }

    .ruler.vertical {
        top: 30px;
        left: 0px;
        width: 30px;
        height: 667px;
    }

    .page-wrapper-mask {
        height: 100%;
        width: 100%;
        z-index: 1000;
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
        outline: rgba(236, 238, 240, 0.77) solid 10000px;
    }

    .element-on-edit-pane {
        height: 100%;
        width: 100%;
        overflow: hidden;
    }

    .editor-wrapper {
        margin: 30px auto;
    }

    .page-wrapper-menu-operation {
        position: absolute;
        right: 100px;
        top: 5%;
        width: 0;
        background: white;
        color: #333;
        text-align: center;
        z-index: 1002;
        border-radius: 4px;
        display: none;
        transition: all 0.28s;
        opacity: 0;
        transform-origin: center top;

        .menu-item {
            padding: 10px;
            cursor: pointer;

            &.i {
                font-size: 24px;
                line-height: 30px;
            }

            &:hover {
                background: rgba(37, 165, 137, 0.09);
                color: $primary;

                &.i {
                    font-weight: bold;
                    font-size: 26px;
                }
            }
        }

        &.active {
            display: block;
            width: 60px;
            opacity: 1;
        }
    }

    .sync-title {
        font-size: 12px;
        text-align: center;
        background-color: #EDF7F4;
        margin-bottom: 5px;
        line-height: 2;
    }

    .sync-item {
        cursor: pointer;
        font-size: 12px;
        line-height: 26px;
        margin-bottom: 1px;
        padding: 0 10px;

        &:hover {
            background-color: #F2F2F2;

            .status-icon {
                display: inline-block;
            }
        }

        &.active {
            background-color: #F2F2F2;
        }
    }
</style>
