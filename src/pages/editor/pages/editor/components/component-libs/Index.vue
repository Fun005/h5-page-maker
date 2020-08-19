<template>
    <div class="components-libs-wrapper scrollbar-wrapper">
        <!-- <p class="page-title text-center">组件库</p> -->
        <el-scrollbar style="height: 100%;">
            <ul class="scrollbar-wrapper">
                <li
                    v-for="(item, index) in componentsList"
                    :key="index"
                    class="clearfix paddingB30"
                >
                    <div class="components-libs-title">
                        <p>{{ item.name }}</p>
                    </div>
                    <div v-if="item.components && item.components.length">
                        <div
                            class="components-lib-item"
                            v-for="(element, i) in item.components"
                            :key="i"
                            @click="handleClick(element)"
                            @dragstart="handleDragStart($event, element)"
                            draggable="true"
                        >
                            <div class="lib-item-img">
                                <i :class="[element.icon]"></i>
                            </div>
                            <p class="lib-item-title">{{ element.title }}</p>
                        </div>
                    </div>
                    <div v-else>
                        <p class="gray text-center paddingT20">待完善...</p>
                    </div>
                </li>
            </ul>
        </el-scrollbar>
    </div>
</template>

<script>
// import {camelCase} from 'lodash'
// import eleConfig from '../../ele-config'
import { components } from '@/plugins';
// import {_qk_register_components_object} from '@/plugins/index'
// window._qk_register_components_object=_qk_register_components_object;
import { getComponentProps } from '@editor/common/js/mUtils';

export default {
    name: 'component-libs',
    data() {
        return {
            componentsList: components,
        };
    },
    methods: {
        /**
         * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
         * @param item
         */
        handleClick(item) {
            const props = getComponentProps(item.elName);
            item.defaultStyle.top = document.getElementById(
                'device-wrapper'
            ).scrollTop; // 添加到当前视口最顶部

            this.$store.dispatch('addElement', { ...item, needProps: props });
        },

        handleDragStart(e, item) {
            const props = getComponentProps(item.elName);
            e.dataTransfer.setData(
                'dragElement',
                JSON.stringify({ ...item, needProps: props })
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.components-libs-wrapper {
    user-select: none;
    height: 100%;
    // padding-top: 60px;
    position: relative;
    & ul {
        padding: 10px;
    }
}

.page-title {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
}

.components-libs-title {
    margin-bottom: 16px;
}

.components-lib-item {
    color: #424242;
    text-align: center;
    background: #f4f4f4;
    width: 80px;
    min-height: 60px;
    float: left;
    padding: 6px 0;
    margin: 5px;
    border: 1px solid #dddddd;
    font-size: 12px;
    cursor: pointer;
    transition: All 0.3s ease-in-out;
    &:hover {
        background: #fff;
        border: 1px solid $primary;
        color: $primary;
    }
    .lib-item-img {
    }
    .lib-item-title {
    }
}
</style>
