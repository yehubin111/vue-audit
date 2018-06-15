<template>
    <div class="contain">
            <top></top>
            <form v-if="linestatus == 0" action="" method="post" id="newsaddall" name="newsaddall" ref="form" target="_self" onsubmit="return false">
              <input type="hidden" class="input_login" name="act" value="do">
              <input type="hidden" name="handleType" value="check">
              <input type="hidden" name="delay" value="0">
              <input type="hidden" name="submitType" value="ajax">
              <div class="con" v-for="(info, index) in newsInfo" :key="index">
                  <input type="hidden" name="id[]" :value="info.id">
                  <input type="hidden" :name="'append' + info.id" :value='info.append? JSON.stringify(info.append) : null'>
                  <input type="hidden" :name="'ischeck' + info.id" :value='info.ischeck?info.ischeck:null'>
                  <input type="hidden" :name="'rtime' + info.id" :value='info.rtime?info.rtime:null'>
                  <input type="hidden" :name="'wapTitle' + info.id" :value='(info.wapTitle? info.wapTitle : "")'>
                  <input type="hidden" :name="'isComment' + info.id" :value='(info.isComment == 0? 0 : 1)'>
                  <input type="hidden" :name="'xxgnCodes' + info.id + '[]'" v-for="(l, index) in info.xxgnCodes" :key="index" :value="l">
                  <input type="hidden" name="classtagcode" :value='info.relatecode?info.relatecode:null'>
                  <input type="hidden" :name="'stocknature' + info.id" :value='info.stocknature? JSON.stringify(info.stocknature) : null'>
                  <input type="hidden" :name="'indexCodes' + info.id" :value='info.indexCodes.join("|")'>
                  <input type="hidden" :name="'indexnature' + info.id" :value='info.indexnature? JSON.stringify(info.indexnature) : null'>
                  <input type="hidden" :name="'hknature' + info.id" :value='info.hknature? JSON.stringify(info.hknature) : null'>
                  <input type="hidden" :name="'usnature' + info.id" :value='info.usnature? JSON.stringify(info.usnature) : null'>
                  <input type="hidden" :name="'money' + info.id" :value="info.money?info.money:null">
                  <input type="hidden" :name="'keyWords' + info.id" :value="info.keyword?info.keyword:null">
                  <input type="hidden" :name="'summ' + info.id" :value="info.summ?info.summ:null">
                  <input type="hidden" :name="'paidshang' + info.id" :value="info.append.paidshang == 1? 1: 0">
                  <input type="hidden" :name="'zimeitilabel' + info.id" :value="info.append.zimeitilabel?info.append.zimeitilabel:null">
                  <div class="c-left">
                      <base-info :info="info"></base-info>
                      <tab-bar :info="info"></tab-bar>
                      <cover-image :info="info"></cover-image>
                      <edit-module :info="info"></edit-module>
                      <!-- <input type="button" @click="formSubmit" ref="submit" value="next"> -->
                  </div>
                  <div class="c-right">
                      <source-url :info="info"></source-url>
                  </div>
              </div>
            </form>
            <p v-else class="downline"><span>下线，休息一下~~</span></p>
            <p class="load" v-show="loading == 1">
              <span class="icon" :class="{ on: turnrun }">
                <icon class="loading" name="loading" scale="1" style="color: #fff;"></icon>  
                </span>
              </p>
    </div>
</template>
<script>
import Top from "./components/top";
import BaseInfo from "./components/baseinfo";
import TabBar from "./components/tabBar";
import EditModule from "./components/editModule";
import CoverImage from "./components/coverImage";
import SourceUrl from "./components/sourceUrl";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  components: {
    Top,
    BaseInfo,
    TabBar,
    EditModule,
    SourceUrl,
    CoverImage
  },
  data() {
    return {
      pageheight: ""
    };
  },
  computed: {
    ...mapState(["linestatus", "loading"]),
    ...mapGetters(["newsInfo"]),
    turnrun() {
      if (this.loading == 1) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {},
  methods: {
    // nextNews() {
    //   this.$store.dispatch("setNext");
    // },
    formSubmit() {
      // let dom = this.$refs.form;
      let postdata = $("#newsaddall").serialize();
      this.$store.dispatch("newsSubmit", { postdata });
    }
  },
  mounted() {
    //   console.log(document.documentElement.clientHeight);
    this.pageheight = "height:" + document.documentElement.clientHeight + "px";

    this.$store.dispatch("getNewsInfo");
    this.$store.dispatch("delReason");
  }
};
</script> 
<style lang="less">
@keyframes turnrun {
  0% {
    transform: rotate(0deg);
    transform-origin: 50% 50%;
  }
  12.5% {
    transform: rotate(45deg);
    transform-origin: 50% 50%;
  }
  25% {
    transform: rotate(90deg);
    transform-origin: 50% 50%;
  }
  37.5% {
    transform: rotate(135deg);
    transform-origin: 50% 50%;
  }
  50% {
    transform: rotate(180deg);
    transform-origin: 50% 50%;
  }
  62.5% {
    transform: rotate(225deg);
    transform-origin: 50% 50%;
  }
  75% {
    transform: rotate(270deg);
    transform-origin: 50% 50%;
  }
  87.5% {
    transform: rotate(315deg);
    transform-origin: 50% 50%;
  }
  100% {
    transform: rotate(360deg);
    transform-origin: 50% 50%;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.contain {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  //   max-width: 1980px;
  //   min-width: 1700px;
  .con {
    flex-grow: 1;
    width: 100%;
    display: flex;
    min-width: 1700px;
    .c-left {
      float: left;
      // width: 1200px;
      flex-basis: 1200px;
      margin: 0 40px 20px 0;
      display: flex;
      flex-direction: column;
      &.low{
        margin: 0 40px 10px 0;
      }
      
    }
    .c-right {
      flex-grow: 1;
      margin: 20px 20px 20px 0;
      float: left;
      //   height: 1000px;
      &.low{
        margin: 10px 20px 10px 0;
      }
    }
  }
  .downline {
    width: 100%;
    text-align: center;
    font-size: 80px;
    color: #999;
    line-height: 500px;
  }
  .load {
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 30;
    overflow: hidden;
    text-align: center;
    .icon {
      width: 200px;
      height: 200px;
      display: inline-block;
      margin: 220px 0 0 0;
      .loading {
        display: inline-block;
        width: 200px;
        height: 200px;
      }
      &.on{
        animation: turnrun .8s infinite;
        animation-timing-function: step-start;
      }
    }
  }
}
</style>