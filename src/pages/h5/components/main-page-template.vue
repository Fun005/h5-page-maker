<template>
    <div class="quark-element-wrapper" @click="handleClick" v-show="!invisible">
        <slot/>
    </div>
</template>

<script>
import runAnimations from '@editor/common/js/runAnimations'

export default {
    name: 'components-template',
    components: {},
    props: {
        element: {
            type: Object,
            require: true
        },
        invisible: {
            type: Boolean,
            default: false
        }
    },
    mounted () {
        let cssText = this.$el.style.cssText
        let animations = this.element.animations || []
        runAnimations(this.$el, animations, false, () => {
            this.$el.style.cssText = cssText
        })
    },
    methods: {
        async handleClick () {
            this.$emit('handleElementClick', this.element.events, this.element)
        }
    }
}
</script>
