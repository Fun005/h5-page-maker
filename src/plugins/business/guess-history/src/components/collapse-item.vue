<template>
    <div class="collapse-item">
        <div class="collapse-title">
            <slot name="title"></slot>
            <div class="collapse-button" @click="handleToggle">{{visible?'收起':'展开'}}</div>
        </div>
        <transition name="van-fade">
            <div v-show="visible">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'collapse-item',
    data () {
        return {
            visible: false
        }
    },
    methods: {
        handleToggle () {
            this.visible = !this.visible
        }
    }
}
</script>

<style lang="scss" scoped>
    .collapse-title {
        position: relative;
        line-height: 1;
    }

    .collapse-button {
        position: absolute;
        right: 10px;
        bottom: 10px;
        z-index: 1;
    }
</style>
