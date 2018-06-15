<!--  -->
<template>
  <div class="down-select">
      <div class="box" @click.stop="showHideList" v-clickOutside="hideList">
        <p class="select">{{option}}</p>
        <span class="button"></span>
      </div>
      <transition name="fade">
            <ul class="list" v-show="show">
                <li v-for="(l, index) in list" :key="index" @click.stop="select(index)">{{l}}</li>
            </ul>
        </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      list: ["以最早入库的文章开始", "以最新入库的文章开始"],
      show: false,
      choice: 0
    };
  },

  //   components: {},

  computed: {
    ...mapState(["linestatus"]),
    option() {
      return this.list[this.choice];
    }
  },

  //   mounted: {},

  methods: {
    select(i) {
      this.choice = i;
      this.show = false;

      this.$store.dispatch("changeSort", i);
    },
    showHideList() {
      if (this.linestatus == 0) return;
      this.show = !this.show;
    },
    hideList() {
      this.show = false;
    }
  },
  directives: {
    // clickoutside:
  }
};
</script>
<style lang='less' scoped>
@import "../../style/color.less";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
@theme-style-d: @im-color-d;
@theme-style-b: @im-color-b;
.down-select {
  line-height: 24px;
  height: 24px;
  .box {
    overflow: hidden;
    border: 1px solid @theme-style;
    border-radius: 3px;
    background-color: @theme-style;
    cursor: pointer;
    // margin-bottom: 5px;
    .select {
      color: @white;
      float: left;
      padding: 0 10px;
    }
    .button {
      float: left;
      width: 32px;
      height: 24px;
      // margin: 4px 0 0 0;
      border-left: 1px solid @theme-style-b;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      &:after {
        content: "";
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top-color: @white;
        transform: translateY(3px);
      }
    }
    &:hover {
      background-color: @theme-style-hv;
    }
  }
  .list {
    border-radius: 3px;
    box-shadow: 0 5px 10px -2px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: relative;
    z-index: 70;
    li {
      color: @gray-step3;
      padding: 0 10px;
      cursor: pointer;
      background-color: @white;
      &:hover {
        background-color: @theme-style-d;
        color: @theme-style;
      }
    }
  }
}
</style>