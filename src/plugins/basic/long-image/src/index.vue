<!--test.vue-->
<template>
    <div class="qk-long-image">
        <template v-if="longImageList.length>0">
            <img class="spilt-img" v-for="(item,index) in longImageList" :key="index" :src="item" alt="">
        </template>
        <div v-else class="no-img">请上传长图</div>
    </div>
</template>

<script>
export default {
    name: 'QkLongImage', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
    props: {
        longImageSrc: {
            type: String,
            default: ''
        }
    },
    computed: {
        longImageList () {
            return this.longImageSrc ? this.longImageSrc.split(',') : []
        }
    },
    data () {
        return {}
    },
    methods: {}
}
</script>


<style lang="scss" scoped>
    .qk-long-image {
        width: 100%;
        height: 100%;
        font-size: 0;
        .spilt-img {
            display: block;
            width: 100%;
            vertical-align:middle;
        }

        .no-img {
            font-size: 16px;
            text-align: center;
            margin-top: 50px;
            color: #25A589;
        }
    }
</style>
