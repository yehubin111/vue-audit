<template>
    <ul class="tab-button">
        <li v-for="(l, index) in tabName" :key="index" @click="tabChange(index)" :class="index == tabIndex? 'on': ''">{{l}}</li>
    </ul>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
import { destroyUE,getIframe } from "../../assets/js/input-news.js";
export default {
  data() {
    return {
      tabIndex: 0,
      tabName: ["审核", "下线"]
    };
  },
  computed: {
    ...mapGetters(["newsId"])
  },
  methods: {
    ...mapMutations(["LINESTATUS"]),
    tabChange(idx) {
      let vl;
      let self = this;
      if (idx == this.tabIndex) return;
      if (this.tabName[1] != "下线") {
        alert("这不刚上线吗！！！");
        return;
      }
      this.tabIndex = idx;

      if (idx == 1) {
        vl = 1;
        if (getIframe(this.newsId).length != 0){
          destroyUE(this.newsId);
        }
        this.$store.dispatch("toDownLine");
      } else if (idx == 0) {
        vl = 0;
        this.$store.dispatch("getNewsInfo");
        // 防恶意频繁下线 30秒cd
        let time = 29;
        self.tabName.splice(1, 1, "30s");
        let trun = setInterval(() => {
          self.tabName.splice(1, 1, time + "s");
          time--;
          if (time == 0) {
            clearInterval(trun);
            self.tabName.splice(1, 1, "下线");
          }
        }, 1000);
      }
      // 改变上线下线状态
      this.LINESTATUS({ vl });
    }
  }
};
</script>
<style scoped lang="less">
@import "../../style/color.less";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
.tab-button {
  overflow: hidden;
  border: 1px solid @theme-style;
  border-radius: 3px;
  li {
    height: 24px;
    line-height: 24px;
    float: left;
    color: @gray-step9;
    padding: 0 14px;
    cursor: pointer;
    &.on {
      background-color: @theme-style;
      color: @white;
      &:hover {
        background-color: @theme-style-hv;
      }
    }
  }
}
</style>