<!--  -->
<template>
  <div class="headinput headfrom"> 
      <span class="title" :class="{ on: ifsourceurl != 1 }">来源</span>
      <div class="input">
          <input type="text" :name="'source' + info.id" :value="message" ref="input" @input="toSearch" @blur="check" v-clickOutside="hideList">
      </div>
      <transition name="fade">
      <ul class="result" v-show="result">
          <li v-for="(r, index) in fromResult" :key="index" @click="selectFrom(r.name)">{{r.name}}</li>
      </ul>
      </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
// import func from "./vue-temp/vue-editor-bridge";
let timerun;
export default {
  props: ["info"],
  data() {
    return {
      result: false
    };
  },
  created() {},
  methods: {
    ...mapMutations(["SETCHECKWORD", "JUDGESTOPMEDIA", "CHANGEDISINFO"]),
    checkagain() {
      if (this.ifsourceurl == 0) {
        return true;
      } else {
        return false;
      }
    },
    // ...mapActions(["getFromSearch"]),
    toSearch() {
      let kwd = this.$refs.input.value;
      let self = this;

      this.toChange(kwd);

      if (!kwd) {
        this.result = false;
        return;
      }
      clearTimeout(timerun);

      timerun = setTimeout(function() {
        // 禁用源判断
        self.JUDGESTOPMEDIA(kwd);

        self.result = true;

        // self.getFromSearch({ kwd });
        self.$store.dispatch("getFromSearch", { kwd });
      }, 300);
    },
    toChange(n) {
      let key = "source";
      let vl = n;
      this.CHANGEDISINFO({ key, vl });
    },
    selectFrom(n) {
      this.result = false;
      // this.message = n;

      this.toChange(n);

      // 禁用源判断
      this.JUDGESTOPMEDIA(n);

      this.check();
    },
    hideList() {
      this.result = false;
    },

    check() {
      let key = "source";
      let vl = this.message;
      // 存储检测数据
      this.SETCHECKWORD({ key, vl });
    }
  },

  computed: {
    ...mapGetters(["fromResult", "ifsourceurl"]),
    message() {
      return this.info.source;
    }
  }

  //mounted: {},
};
</script>
<style lang='less' scoped>
@import "../../style/color";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
@theme-style-d: @im-color-d;
@theme-style-b: @im-color-b;
.headfrom {
  position: relative;
  .input{
    input{
      width: 120px;
    }
  }
  .result {
    border-radius: 3px;
    box-shadow: 0 1px 10px -2px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: absolute;
    top: 44px;
    left: 60px;
    z-index: 18;
    // border: 1px solid #eee;
    li {
      color: @gray-step3;
      padding: 0 10px;
      cursor: pointer;
      width: 242px;
      padding: 0 10px;
      line-height: 34px;
      background-color: @white;
      &:hover {
        background-color: @theme-style-d;
        color: @theme-style;
      }
    }
  }
  .title{
    &.on{
      color: @red-stepf4;
    }
  }
}
</style>