<!--  -->
<template>
  <div class="fcbox">
          <div class="fnav">
            <ul>
              <li v-if="navon == 0" class="on">行业</li>
              <li v-else @click="tabChange(0)">行业</li>
              <li v-if="navon == 1" class="on">概念</li>
              <li v-else @click="tabChange(1)">概念</li>
            </ul>
            <i class="icon" @click="hideBox"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
          </div>
          <div class="flist" v-if="navon == 0">
              <ul>
                  <li v-for="l in fielddata" :key="l.name">
                      <input type="checkbox" @click="toSelect('field', l.name, l.code)" v-if="ifCheckedField(l.code)" checked :id="codeID(l.code)">
                      <input type="checkbox" @click="toSelect('field', l.name, l.code)" v-else :id="codeID(l.code)">
                      <label :for="codeID(l.code)">{{l.name}}</label>
                    </li>
              </ul>
          </div>
          <div class="flist spe" v-else-if="navon == 1">
              <ul>
                  <li v-for="l in conceptdata" :key="l.name">
                      <input type="checkbox" @click="toSelect('concept', l.name, l.code)" v-if="ifCheckedConcept(l.code)" checked :id="codeID(l.code)">
                      <input type="checkbox" @click="toSelect('concept', l.name, l.code)" v-else :id="codeID(l.code)">
                      <label :for="codeID(l.code)">{{l.name}}</label>
                  </li>
              </ul>
          </div>
        </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  props: ["toHideFieldConcept"],
  data() {
    return {
      navon: 0
    };
  },
  computed: {
    ...mapState(["field", "concept"]),
    ...mapGetters(["fielddata", "conceptdata"])
  },
  created() {},
  //components: {},
  //mounted: {},

  methods: {
    ...mapMutations(["CHANGELABEL"]),
    hideBox() {
      this.toHideFieldConcept();
    },
    codeID(code) {
      return "checkbox" + code;
    },
    tabChange(idx) {
      this.navon = idx;
    },
    ifCheckedField(code) {
      if (this.field.filter(v => v.code == code).length > 0) {
        return true;
      }
    },
    ifCheckedConcept(code) {
      if (this.concept.filter(v => v.code == code).length > 0) {
        return true;
      }
    },
    toSelect(key, name, code) {
      this.CHANGELABEL({ key, name, code });
      //this.$store.dispatch("setKeyboardSelect", { key, name, code });
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/color";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
@theme-style-d: @im-color-d;
@theme-style-b: @im-color-b;
.fcbox {
  border-radius: 3px;
  box-shadow: 0 1px 10px -2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 10px;
  // writing-mode: vertical-lr;
  background-color: @white;
  .fnav {
    overflow: hidden;
    // writing-mode: horizontal-tb;
    ul {
      float: left;
      li {
        line-height: 24px;
        border-radius: 3px;
        float: left;
        width: 60px;
        text-align: center;
        cursor: pointer;
        margin: 0 5px 10px 0;
        background-color: @gray-stepf6;
        &.on {
          background-color: @theme-style;
          color: @white;
        }
      }
    }
    .icon {
      width: 18px;
      height: 18px;
      background-color: @theme-style;
      float: right;
      cursor: pointer;
      text-align: center;
      border-radius: 50%;
      .close {
        display: block;
        margin: 2px 0 0 2px;
        width: 14px;
        height: 14px;
        font-weight: bold;
      }
    }
  }
  .flist {
    height: 457px;
    width: 480px;
    // writing-mode: vertical-lr;
    &.spe {
      height: 553px;
      width: 1080px;
    }
    ul {
      writing-mode: vertical-lr;
      // -webkit-box-orient: vertical;
      // height: 457px;
      li {
        display: inline-block;
        // -webkit-box-flex: 1;
        width: 120px;
        line-height: 24px;
        height: 24px;
        writing-mode: horizontal-tb;
        cursor: pointer;
        input {
          float: left;
          width: 14px;
          height: 14px;
          margin: 5px 3px 0 0;
        }
        label {
          float: left;
          cursor: pointer;
        }
      }
    }
  }
}
</style>