<template>
  <div class="engine-template-wrapper">
    <div class="relative page">
      <!--页面内容区域-->
      <div
        class="quark-page-wrapper"
        :key="updateKey"
        :style="
                    getCommonStyle(
                        {
                            ...currentPage.commonStyle,
                            top: pageTop,
                            height: currentPage.commonStyle.height || pageData.height,
                            width: currentPage.commonStyle.width || pageData.width,
                            position: 'relative',
                        },
                        scalingRatio
                    )
                "
      >
        <main-page-template
          class="quark-element-wrapper"
          v-for="(item) in currentPage.elements"
          :key="item.brotherUuid"
          :element="item"
          :invisible="item.invisible"
          :style="getCommonStyle(item.commonStyle, scalingRatio)"
          @handleElementClick="handleElementClick"
        >
          <component
            :is="item.elName"
            :defaultStyle="getCommonStyle(item.commonStyle, scalingRatio)"
            class="quark-element"
            @setSharedData="setSharedData(item.uuid, $event)"
            v-bind="{
                            ...getElementProps(item.propsValue,item.bindings),
                            value: item.value,
                            uuid:item.uuid,
                            bindings:item.bindings,
                            currentPageIndex:currentPageIndex
                        }"
          />
        </main-page-template>
      </div>
    </div>
    <van-loading
      v-if="loading"
      class="loading"
    >加载中</van-loading>
  </div>
</template>

<script>
import editorProjectConfig from "@editor/pages/editor/DataModel";
import MainPageTemplate from "./main-page-template";
import $config from "@/config";
import elementEvents from "@editor/mixins/elementEvents";
import API from "@/apis/common";
import plugins from "@/plugins/index";
import globalVariable from "@/mixins/globalVariable";
import $common from "@/utils";

import { Loading, Toast } from "vant";
import { mapGetters } from "vuex";
import { getStorage } from "@/utils/storage";

// console.log('safeAreaInsets.support', safeAreaInsets.support)
// console.log('safe-area-inset-top', safeAreaInsets.top)
// console.log('safe-area-inset-left', safeAreaInsets.left)
// console.log('safe-area-inset-right', safeAreaInsets.right)
// console.log('safe-area-inset-bottom', safeAreaInsets.bottom)
const safeAreaInsetsTop = 30;
const { iphoneX } = $common.ua;

export default {
  name: "engineH5Long",
  components: {
    MainPageTemplate,
    VanLoading: Loading,
    ...plugins,
  },
  mixins: [globalVariable, elementEvents],
  computed: {
    ...mapGetters(["sharedData"]),
  },
  data() {
    return {
      getCommonStyle: editorProjectConfig.getCommonStyle,
      scalingRatio: 1,
      pageData: {
        height: "",
        width: "",
        pages: [],
      },
      pages: [],
      currentPage: {
        commonStyle: {},
      },
      currentPageIndex: 0,
      pageTop: 0,
      loading: true,
      updateKey: "none", // 更新key强制更新整个页面
    };
  },
  mounted() {
    this.scalingRatio = document.body.clientWidth / $config.canvasH5Width;

    let totalData = JSON.parse(getStorage("H5_PAGE_MAKER_DATA"));
    console.log("totalData=", totalData);

    let pageData = JSON.parse(totalData.page_data);
    console.log("pageData=", pageData);
    this.pageData = pageData;
    this.ergodicPageData(this.pageData);
    document.title = pageData.name;
    this.pages = this.pageData.pages || [];
    // 默认展示第一页
    this.setCurrentPage(this.pages[this.currentPageIndex].uuid);
    this.loading = false;

    // API.GET_ACTIVITY_DETAIL(this.globalVariable).then((res) => {
    //     this.pageData = JSON.parse(res.data.page_data)

    //     this.ergodicPageData(this.pageData)
    //     document.title = res.data.name
    //     this.pages = this.pageData.pages || []
    //     // 默认展示第一页
    //     this.setCurrentPage(this.pages[this.currentPageIndex].uuid)
    //     this.loading = false
    // }).catch((err) => {
    //     this.loading = false
    //     console.error(err)
    //     Toast('出现了错误，请稍后再试')
    //     // window.location.href = '/404.html'
    // })
  },
  methods: {
    // 遍历页面数据
    ergodicPageData(pageData) {
      if (pageData.fullScreen && pageData.fullScreen.field && iphoneX) {
        const field = this.globalVariable[pageData.fullScreen.field];
        const value = pageData.fullScreen.value;
        if (field && field === value) {
          pageData.pages.forEach((page) => {
            page.elements.forEach((ele) => {
              ele.commonStyle.top = ele.commonStyle.top + safeAreaInsetsTop;
              // ele.commonStyle.paddingTop = safeAreaInsetsTop
            });
          });
        }
      }
    },
    //  设置显示当前页面
    setCurrentPage(uuid) {
      this.currentPageIndex = this.pages.findIndex((v) => v.uuid === uuid);
      if (this.currentPageIndex > -1) {
        this.currentPage = this.pages[this.currentPageIndex];
        const commonStyle = this.currentPage.commonStyle;
        Object.keys(commonStyle).forEach((style) => {
          document.documentElement.style[style] = commonStyle[style];
        });
      } else {
        Toast("该状态不存在");
      }
    },
    /**
     * 按钮点击事件
     * @param eventsData
     */
    async handleElementClick(eventsData, element) {
      for (let i = 0, len = eventsData.length; i < len; i++) {
        if (this["_event_" + eventsData[i].type]) {
          await this["_event_" + eventsData[i].type](
            eventsData[i],
            element,
            this.pageData
          );
        }
      }
    },
    setSharedData(uuid, data) {
      // TODO 由于页面初始化的 时候  store 中的 sharedData 不存在，导致组件共享数据无法绑定，所以组件mounted的时候绑定事件重新渲染整个页面
      if (!this.sharedData[uuid]) {
        this.$nextTick(() => {
          // this.updateKey = uuid
        });
      }
      this.$store.dispatch("setSharedData", { uuid, data });
    },
    getElementProps(props, bindings) {
      let tempProps = {};
      for (const i in props) {
        // console.log(i, props[i], Object.prototype.toString.call(props[i]))
        if (bindings) {
          // console.log(bindings, i)
          const findedBinding = bindings.find(
            (item) => item.key.join(".").indexOf(i) >= 0
          );
          if (findedBinding) {
            const [uuid, key] = findedBinding.value;
            if (this.sharedData && this.sharedData[uuid]) {
              tempProps[i] = this.sharedData[uuid][key];
            }
            // console.log(tempProps[i])
            continue;
          }
        }
        if (Object.prototype.toString.call(props[i]) === "[object Object]") {
          tempProps[i] = props[i].value;
        } else {
          tempProps[i] = props[i];
        }
        tempProps[i] = this.renderString(tempProps[i], this.globalVariable);
      }
      return tempProps;
    },
  },
};
</script>

<style lang="scss" scoped>
html {
  overflow-y: overlay;
}

.engine-template-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  &::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
}

.page {
}

.quark-page-wrapper {
  overflow: visible;
  background-size: 100% auto !important;
  background-repeat: no-repeat;
}

.relative {
  position: relative;
}

.hidden {
  overflow: hidden;
}

.loading {
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
</style>
