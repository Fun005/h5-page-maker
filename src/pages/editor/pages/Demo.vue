<template>
    <div class="editor-main" id="editor-main">
        <div class="rulers">
            <div class="horizontal ruler"></div>
            <div class="vertical ruler"></div>
        </div>
        <div class="snappable moveable">
            shshahasha
        </div>

    </div>
</template>

<script>
import Moveable from 'moveable'

export default {
    name: 'app',
    components: {},
    data: () => ({
        moveable: {
            draggable: true,
            resizable: true,
            snappable: true,
            throttleResize: 0,
            origin: false,
            bounds: {
                // left: 0, // 拖动范围
                // top: 0 // 拖动范围
            },
            container: null
        }
    }),
    mounted () {
        const snappableElement = document.querySelector('.snappable')

        new Moveable(snappableElement.parentElement, {
            target: snappableElement,
            draggable: true,
            snappable: true,
            snapCenter: true,
            origin: false,
            verticalGuidelines: [0, 150, 200],
            horizontalGuidelines: [0, 150, 200]
        }).on('drag', ({ target, left, top }) => {
            target.style.left = `${left}px`
            target.style.top = `${top}px`
        })
    },
    methods: {
        /*
        * 触发 向父组件跑出 emit 事件
        * */
        emitResize (pos) {
            this.$emit('resize', pos)
        },
        handleDragStart () {
            this.$emit('handleElementClick')
        },
        handleResizeStart () {
            this.$emit('handleElementClick')
        },
        handleDrag ({ target, left, top }) {
            target.style.left = `${left}px`
            target.style.top = `${top}px`
        },
        handleResize (e) {
            const { target, width, height } = e
            target.style.width = `${width}px`
            target.style.height = `${height}px`
        },
        handleResizeEnd ({ target }) {
            this.$emit('resize', {
                ...this.defaultStyle,
                top: Number(target.style.top.replace('px', '')),
                left: Number(target.style.left.replace('px', '')),
                width: Number(target.style.width.replace('px', '')),
                height: Number(target.style.height.replace('px', ''))
            })
        },
        handleDragEnd ({ target }) {
            this.$emit('resize', {
                ...this.defaultStyle,
                top: Number(target.style.top.replace('px', '')),
                left: Number(target.style.left.replace('px', '')),
                width: Number(target.style.width.replace('px', '')),
                height: Number(target.style.height.replace('px', ''))
            })
        }
    }
}
</script>

<style lang="scss">
    .editor-main {
        position: absolute;
        width: 375px;
        height: 667px;
        top: 100px;
        left: 40%;
        border: 1px solid gray;
    }

    .rulers {
        position: absolute;
        width: 30px;
        height: 30px;
        left: -30px;
        top: -30px;
        background: #444;
        box-sizing: border-box;
    }

    .ruler {
        position: absolute;
        background: #444;
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


    .target {
        position: absolute;
        margin: 0;
        z-index: 1;
    }

    .moveable {
        position: relative;
        width: 250px;
        height: 200px;
    }

</style>
