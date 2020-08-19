<template>
  <div class="components-libs-wrapper scrollbar-wrapper">
    <el-scrollbar style="height: 100%;">
      <ul class="scrollbar-wrapper">
        <li
          v-for="(item) in componentsListName"
          :key="item.uuid"
          class="clearfix paddingB10"
        >
          <div
            :class="[
              'components-lib-item',
              activeElementUUID === item.uuid ? 'active' : '',
            ]"
            :key="item.uuid"
            @click="handleElementClick(item.uuid)"
          >
            <div class="lib-item-img">
              <i :class="[item.icon]"></i>
            </div>
            <p class="lib-item-title">{{ item.title }}</p>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
// import eleConfig from '../ele-config';
import plugins from "@/plugins";
import { mapState, mapGetters } from "vuex";

export default {
  name: "template-libs",
  data() {
    return {};
  },

  computed: {
    ...mapState({
      projectData: (state) => state.editor.projectData,
      activePageUUID: (state) => state.editor.activePageUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID,
    }),

    ...mapGetters([
      "currentPageIndex",
      "activeElementIndex",
      "activeElement",
      "activePage",
    ]),
    componentsListName() {
      // 当前状态的组件 && 组件按照层级排序
      return this.activePage.elements
        .map((v) => {
          const findPlugins = plugins[v.elName] || {};
          return {
            ...v,
            title: findPlugins.title,
            icon: findPlugins.icon,
          };
        })
        .sort((a, b) => b.commonStyle.zIndex - a.commonStyle.zIndex);
    },
  },
  methods: {
    /**
     * 元素被点击
     * @param uuid
     */
    handleElementClick(uuid) {
      this.$store.dispatch("setActiveElementUUID", uuid);
    },
  },
};
</script>

<style lang="scss" scoped>
.components-libs-wrapper {
  height: calc(100vh - 322px);
}

.components-lib-item {
  color: #424242;
  text-align: center;
  background: #f4f4f4;
  width: 80%;
  /* float: left; */
  padding: 6px 0;
  margin: 5px auto;
  border: 1px solid #dddddd;
  font-size: 12px;
  cursor: pointer;
  transition: All 0.3s ease-in-out;

  &:hover {
    background: #fff;
    border: 1px solid $primary;
    color: $primary;
  }

  &.active {
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
