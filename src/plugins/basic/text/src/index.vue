<!--test.vue-->
<template>
  <div class="qk-text" v-text="text"></div>
</template>

<script>
export default {
  name: 'QkText', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  props: {
    text: {
      type: String,
      default: '这是一段文字'
    }
  },
  watch: {
    text (val) {
      console.log('log=>', val)
    }
  },
  data () {
    return {
      defaultStyle: {
        height: 40
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .qk-text {
    white-space: pre-wrap;
  }
</style>
