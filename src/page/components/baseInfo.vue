<!--  -->
<template>
  <div class="baseinfo">
      <p class="dup" v-if="samenews != null"><a :href="samenews.url" target="_blank" class="d-title" :class="[samenews.isaudit == 1? 'nblue': '', samenews.isaudit == 2? 'ngray': '']">{{samenews.title}}</a><span class="d-from">{{samenews.source}}</span><span class="d-author">{{samenews.ctime}} {{samenews.username}}</span></p>
        <div class="line spe">
            <div class="title">
                <head-title :info="info"></head-title>
            </div>
            <div class="from">
                <head-from :info="info"></head-from>
            </div> 
             <div class="author">
                <head-author :info="info"></head-author>
            </div> 
        </div>
        <div class="line hauto">
            <div class="fobject">
                <head-object :info="info"></head-object>
            </div>
            <div class="nature">
                <head-nature :info="info"></head-nature>
            </div>
            <div class="nature">
                <head-import :info="info"></head-import>
            </div>
            <div class="clear"></div>
        </div>
  </div>
</template> 

<script>
import HeadTitle from "./headTitle";
import HeadFrom from "./headFrom";
import HeadAuthor from "./headAuthor";
import HeadObject from "./headObject";
import HeadNature from "./headNature";
import HeadImport from "./headImport";
import { mapState } from "vuex";
export default {
  props: ["info"],
  data() {
    return {};
  },
  components: {
    HeadTitle,
    HeadFrom,
    HeadAuthor,
    HeadObject,
    HeadNature,
    HeadImport
  },

  computed: {
    ...mapState(["samenews"])
  },
  mounted() {
    //   this.$store.dispatch('getSameNews', this.info.title, this.info.id);
  }

  //methods: {}
};
</script>
<style lang='less'>
@import "../../style/headInput";
@import "../../style/headRadio";
@import "../../style/color.less";
.baseinfo {
  padding: 10px 0 10px 20px;
  .dup {
    line-height: 28px;
    span {
      margin-right: 20px;
      color: @gray-step3;
    }
    a {
      margin-right: 20px;
      color: @gray-step3;
      &.nblue {
        color: @blue-step44;
      }
      &.ngray {
        color: @gray-stepa;
      }
    }
  }
  .line {
    display: block;
    margin: 0 0 10px 0;
    height: 34px;
    &.spe {
      margin-top: 17px;
      height: 58px;
    }
    &.hauto {
      height: auto;
    }
    & > .title,
    .from,
    .author,
    .fobject {
      float: left;
      margin: 0 10px 0 0;
    }
    .nature {
      float: left;
      margin: 0 30px 0 0;
    }
  }
  &.low{
    .line{
      margin: 0;
      &.spe{
        margin-top: 0;
      }
    }
  }
}
</style>