<!--  -->
<template>
  <div class="tab">
      <label-search></label-search>
      <div class="labelList">
        <div class="list" v-show="field.length > 0">
          <span class="title" @click="toClear('field')">行业<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in field" :key="index" @click="toDelete('field', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}
              <i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <input type="hidden" :name="'fieldCodes' + info.id + '[]'" :value="l.code">
            </li>
          </ul>
        </div>
        <div class="list" v-show="concept.length > 0">
          <span class="title" @click="toClear('concept')">概念<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in concept" :key="index" @click="toDelete('concept', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <input type="hidden" :name="'conceptCodes' + info.id + '[]'" :value="l.code">
            </li>
          </ul>
          
        </div>
        <div class="list" v-show="a.length > 0">
          <span class="title" @click="toClear('a')">A股<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in a" :key="index" @click="toDelete('a', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <!-- <input type="hidden" :name="'stockCodes' + info.id" :value="l.code"> -->
            </li>
          </ul>
          <input type="hidden" :name="'stockCodes' + info.id" :value="submitData('a')">
        </div>
        <div class="list" v-show="hk.length > 0">
          <span class="title" @click="toClear('hk')">港股<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in hk" :key="index" @click="toDelete('hk', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <!-- <input type="hidden" :name="'hkCodes' + info.id" :value="l.code"> -->
            </li>
          </ul>
          <input type="hidden" :name="'hkCodes' + info.id" :value="submitData('hk')">
        </div>
        <div class="list" v-show="us.length > 0">
          <span class="title" @click="toClear('us')">美股<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in us" :key="index" @click="toDelete('us', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <!-- <input type="hidden" :name="'usCodes' + info.id" :value="l.code"> -->
            </li>
          </ul>
          <input type="hidden" :name="'usCodes' + info.id" :value="submitData('us')">
        </div>
        <div class="list" v-show="xsb.length > 0">
          <span class="title" @click="toClear('xsb')">新三板<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in xsb" :key="index" @click="toDelete('xsb', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <!-- <input type="hidden" :name="'xsbCodes' + info.id" :value="l.code"> -->
            </li>
          </ul>
        </div>
        <div class="list" v-show="bond.length > 0">
          <span class="title" @click="toClear('bond')">债券<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in bond" :key="index" @click="toDelete('bond', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <!-- <input type="hidden" :name="'bondCodes' + info.id" :value="l.code"> -->
            </li>
          </ul>
          <input type="hidden" :name="'bondCodes' + info.id" :value="submitData('bond')">
        </div>
        <div class="list" v-show="fund.length > 0">
          <span class="title" @click="toClear('fund')">基金<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in fund" :key="index" @click="toDelete('fund', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <!-- <input type="hidden" :name="'fundCodes' + info.id" :value="l.code"> -->
            </li>
          </ul>
          <input type="hidden" :name="'fundCodes' + info.id" :value="submitData('fund')">
        </div>
        <div class="list" v-show="stocktags.length > 0">
          <span class="title" @click="toClear('stocktags')">选股标签<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in stocktags" :key="index" @click="toDelete('stocktags', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <!-- <input type="hidden" :name="'classTagCode' + info.id" :value="l.code"> -->
            </li>
          </ul>
          <input type="hidden" :name="'stocktags' + info.id" :value="submitData('stocktags')">
        </div>
        <div class="list" v-show="relative.length > 0">
          <span class="title" @click="toClear('relative')">关联方<b>清空</b></span>
          <ul class="tip">
            <li v-for="(l, index) in relative" :key="index" @click="toDelete('relative', l.code)" :class="{ tagred: l.red }">{{l.name?l.name:l.code}}<i class="icon"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
            <input type="hidden" :name="'relateCode' + info.id + '[]'" :value="l.code">
            <input type="hidden" :name="'relateName' + info.id + '[]'" :value="l.name">
            </li>
          </ul>
          <input type="hidden" :name="'classTagCode' + info.id" :value="info.relatecode?info.relatecode:null">
        </div>
      </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import LabelSearch from "./labelSearch";
export default {
  props: ["info"],
  data() {
    return {};
  },

  components: {
    LabelSearch
  },

  computed: {
    ...mapState([
      "field",
      "concept",
      "a",
      "hk",
      "us",
      "xsb",
      "bond",
      "fund",
      "stocktags",
      "relative"
    ])
  },

  created() {},

  methods: {
    ...mapMutations(["CLEARLABEL", "DELLABEL"]),
    toClear(key) {
      this.CLEARLABEL({ key });
    },
    toDelete(key, code) {
      this.DELLABEL({ key, code });
    },
    submitData(key) {
      let dt = "";

      if (!Array.isArray(this[key])) return;
      // 新三板与A股一起传
      let ar = this[key];
      if (key == "a") {
        ar = ar.concat(this["xsb"]);
      }

      ar.forEach((v, i) => {
        if (key == "stocktags") dt += "|" + v.name;
        else dt += "|" + v.code;
      });

      return dt.substr(1);
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/color.less";
@theme-style: @im-color;

.tab {
  margin: 0 0 20px 20px;
  padding: 20px 0 10px 20px;
  border: 1px solid @gray-stepd;
  border-left: 3px solid @theme-style;
  .labelList {
    margin: 20px 0 0 0;
    .list {
      overflow: hidden;
      margin: 0 0 10px 0;
      .title {
        float: left;
        width: 80px;
        text-align: center;
        line-height: 24px;
        border: 1px solid @theme-style;
        color: @theme-style;
        border-radius: 3px;
        margin: 0 10px 0 0;
        cursor: pointer;
        position: relative;
        b {
          display: none;
          position: absolute;
          font-weight: normal;
          width: 100%;
          line-height: 24px;
          text-align: center;
          background-color: @theme-style;
          color: @white;
          top: 0;
        }
        &:hover {
          // background-color: @theme-style;
          // color: @white;
          b {
            display: block;
          }
        }
      }
      .tip {
        float: left;
        width: 1050px;
        li {
          float: left;
          line-height: 26px;
          padding: 0 24px 0 10px;
          position: relative;
          cursor: pointer;
          .icon {
            width: 16px;
            height: 16px;
            display: block;
            position: absolute;
            right: 0;
            top: 5px;
            background-color: @theme-style;
            border-radius: 50%;
            .close {
              display: block;
              margin: 2px 0 0 2px;
              width: 12px;
              height: 12px;
              font-weight: bold;
            }
          }
          &.tagred {
            color: #f44446;
          }
        }
      }
    }
  }
  &.low{
    padding: 10px 0 0 20px;
    margin: 0 0 10px 20px;
    .labelList {
      margin: 10px 0 0 0;
    }
  }
}
</style>