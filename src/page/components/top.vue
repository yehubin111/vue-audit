<template>
    <div class="top">
        <div class="news-count">
            <span class="title">未审核数量：</span>
            <span class="count">权重4：{{newsCount.weight4}}</span>
            <span class="count">权重3：{{newsCount.weight3}}</span>
            <span class="count">权重2：{{newsCount.weight2}}</span>
            <span class="count">权重1：{{newsCount.weight1}}</span>
            <span class="count">权重0：{{newsCount.weight0}}</span>
            <span class="count">机器人：{{newsCount.robot}}</span>
        </div>
        <tab-button></tab-button>
        <down-select></down-select>
        <!-- <input type="button" value="重置新闻" class="cz"> -->
    </div>
</template>
<script>
import TabButton from "./tab-button";
import DownSelect from "./down-select";
import { mapGetters } from "vuex";
export default {
  components: {
    TabButton,
    DownSelect
  },
  computed: {
    ...mapGetters(["newsCount"])
  },
  mounted() {
    let self = this;
    this.$store.dispatch("getNewsCount");
    setInterval(function() {
      self.$store.dispatch("getNewsCount");
    }, 10000);
  }
};
</script>
<style lang="less" scoped>
.top {
  width: 100%;
  height: 30px;
  padding: 0 20px;
  background-color: #333;
  box-sizing: border-box;
  flex-basis: 30px;
  min-width: 1700px;
  .news-count {
    overflow: hidden;
    float: left;
    margin: 0 20px 0 0;
    span {
      color: #fff;
      line-height: 30px;
      &.title {
        color: #999;
      }
      &.count {
        margin-right: 20px;
      }
    }
  }
  .tab-button {
    float: left;
    margin: 2px 40px 0 0;
  }
  .down-select {
    float: left;
    margin: 2px 0 0 0;
  }
  // .cz{
  //   float: left;
  // }
}
</style>