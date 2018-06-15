<!--  -->
<template>
  <div class="headinput headtitle">
      <span class="title" :class="{ on: checkagain }">标题</span>
      <div class="input">
          <input type="text" :name="'title' + info.id" @input="toChange" :value="message" @blur="check" ref="input">
          <p class="time">时间：{{info.ctime * 1000 | timeFormat}}</p>
          <input type="hidden" :name="'ctime' + info.id" :value="info.ctime">
      </div>
      <span class="count">{{count}}字</span>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  props: ["info"],
  data() {
    return {};
  },

  //components: {},
  created() {},
  computed: {
    // ...mapState({
    //   message: "ntitle"
    // }),
    checkagain() {
      if (this.info.ischeck == 2) {
        return true;
      } else {
        return false;
      }
    },
    message() {
      return this.info.title;
    },
    count() {
      return this.info.title.replace(/[\u0391-\uFFE5]/g, "aa").length / 2;
    }
  },

  methods: {
    ...mapMutations(["SETCHECKWORD", "CHANGEDISINFO"]),
    calcCount() {
      this.count = this.message.replace(/[\u0391-\uFFE5]/g, "aa").length / 2;
    },
    toChange() {
      let key = "title";
      let vl = this.$refs.input.value;
      this.CHANGEDISINFO({ key, vl });
    },
    check() {
      let key = "title";
      let vl = this.message;
      // 存储检测数据
      this.SETCHECKWORD({ key, vl });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/color.less";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
.headtitle {
  width: 650px;
  height: 58px;
  .input{
    input{
      width: 480px;
    }
  }
  .title{
    &.on{
      color: @red-stepf4;
    }
  }
}
</style>