<!--test.vue-->
<template>
  <div class="qk-rich-text ql-editor" v-html="richText"></div>
</template>
<script>

export default {
  name: 'QkRichText', // 这个名字很重要，它就是未来的标签名<qk-text></qk-text>
  props: {
    richText: {
      type: String,
      default: '<p>这是一段文字html</p>'
    }
  },
  data () {

    return {
      defaultStyle: {
        height: 40
      }
    }
  },
  methods: {
    onResize(e) {
      console.log('resize', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .qk-rich-text {
    white-space: pre-wrap;
    font-weight: normal;
    padding: 0;
  }
</style>
