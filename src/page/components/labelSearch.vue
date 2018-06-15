<!--  -->
<template>
  <div class="labelSearch">
      <p class="input">
        <input type="text" :value="searchmessage" ref="input" @keydown="downUp" @input="toSearch" v-clickOutside="hideList">
      </p>
      <span class="button" @click="showFieldConcept">行业/概念</span>
      <transition name="fade">
        <div class="rbox" v-show="result">
          <ul class="result" v-for="(l, index) in keyboarddata" :key="index" v-show="l.length > 0">
              <li class="key" v-show="l.length > 0"><b>“{{keyboardname[index]}}”</b> 相关</li>
              <li v-for="r in l" :key="r.name" :class="{on: keyCode == r.code && arKey == keyboardkey[index]}" @click.stop="toSelect(keyboardkey[index], r.name, r.code)"><span>{{r.code}}</span>&nbsp;&nbsp;&nbsp;&nbsp;{{r.name}}</li>
          </ul>
        </div>
      </transition>
      <transition name="fade">
        <div class="fieldConcept" v-show="fcbox">
          <!-- <div class="test" v-for="l in fielddata" :key="l.name">
                      <input type="checkbox">
                      <label>{{l.name}}</label>
                    </div> -->
          <field-concept :toHideFieldConcept="toHideFieldConcept"></field-concept>
        </div>
      </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import FieldConcept from "./labelFieldConcept";
let sh;
export default {
  data() {
    return {
      message: "",
      result: false,
      fromResult: [],
      fcbox: false,
      keyboardkey: ["field", "concept", "a", "hk", "us", "xsb", "bond", "fund"],
      keyboardname: [
        "行业",
        "概念",
        "A股",
        "港股",
        "美股",
        "新三板",
        "债券",
        "基金"
      ],
      keydownIndex: -1 // 键盘控制位置
    };
  },

  components: {
    FieldConcept
  },

  computed: {
    ...mapState(['searchmessage']),
    ...mapGetters(["keyboarddata", "fielddata", "keyboarddataarr"]),
    keyCode() {
      if (this.keydownIndex < 0 || this.keyboarddataarr.length < 0) return "";
      return this.keyboarddataarr[this.keydownIndex].code;
    },
    arKey() {
      if (this.keydownIndex < 0 || this.keyboarddataarr.length < 0) return "";
      return this.keyboarddataarr[this.keydownIndex].key;
    }
  },

  //mounted: {},

  methods: {
    ...mapMutations(["SETLABEL", 'CHANGESTATE']),
    downUp(e) {
      if (!this.result || this.keyboarddataarr.length < 0) return;

      let lth = this.keyboarddataarr.length;
      console.log(e.which);
      switch (e.which) {
        case 37: // left
          let ar2 = this.keyboarddataarr
            .slice(0, this.keydownIndex + 1)
            .reverse();
          let diskey2 = ar2[0].key;
          let diskey3 = ar2.find(v => v.key != diskey2);
          let disar2 = diskey3
            ? this.keyboarddataarr.filter(v => v.key == diskey3.key)[0]
            : "";

          if (!disar2) {
            let dkey = this.keyboarddataarr.slice(0).reverse()[0].key;
            let dar = this.keyboarddataarr
              .slice(0)
              .reverse()
              .filter(v => v.key == dkey);
            let dobj = dar.reverse()[0];

            this.keydownIndex = this.keyboarddataarr.indexOf(dobj);
          } else {
            this.keydownIndex = this.keyboarddataarr.indexOf(disar2);
          }
          break;
        case 39: // right
          let ar = this.keyboarddataarr.slice(this.keydownIndex);
          let diskey = ar[0].key;
          let disar = ar.find(v => v.key != diskey);

          if (!disar) {
            this.keydownIndex = 0;
          } else {
            this.keydownIndex = this.keyboarddataarr.indexOf(disar);
          }
          break;
        case 40: //down
          this.keydownIndex++;
          if (this.keydownIndex > lth - 1) {
            this.keydownIndex = 0;
          }
          break;
        case 38: //up
          this.keydownIndex--;
          if (this.keydownIndex < -1) {
            this.keydownIndex = lth - 1;
          }

          if (this.keydownIndex === -1) {
            this.keydownIndex = lth - 1;
          }
          break;
        case 13: //enter
          let key = this.keyboarddataarr[this.keydownIndex].key;
          let name = this.keyboarddataarr[this.keydownIndex].name;
          let code = this.keyboarddataarr[this.keydownIndex].code;
          this.toSelect(key, name, code);
          break;
      }
    },
    toSearch() {
      let kwd = this.$refs.input.value;
      let self = this;
      let key = 'searchmessage';

      let vl = kwd
      this.CHANGESTATE({key, vl});
      if (!kwd) {
        this.result = false;
        this.keydownIndex = -1;
        return;
      }
      this.result = true;

      clearTimeout(sh);
      sh = setTimeout(() => {
        self.$store.dispatch("getKeyboardData", { kwd, self });
      }, 300);
    },
    hideList() {
      this.result = false;
      this.keydownIndex = -1;
    },
    toSelect(key, name, code) {
      // this.message = '';
      if (key == "field" || key == "concept") {
        this.SETLABEL({ key, name, code });
        return;
      }

      this.$store.dispatch("getKeyboardName", { key, code });
      // this.SETLABEL({ key, name, code });
    },
    showFieldConcept() {
      this.fcbox = !this.fcbox;

      this.$store.dispatch("getFieldConcept");
    },
    toHideFieldConcept() {
      this.fcbox = false;
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
.labelSearch {
  height: 34px;
  position: relative;
  .input {
    border-radius: 3px;
    height: 30px;
    padding: 1px 0;
    border: 1px solid @gray-stepd;
    float: left;
    input {
      line-height: 30px;
      height: 30px;
      border: none;
      padding: 0 10px;
      outline: none;
      width: 240px;
    }
  }
  .button {
    float: left;
    line-height: 34px;
    padding: 0 10px;
    background-color: @theme-style;
    border-radius: 3px;
    color: @white;
    cursor: pointer;
    &:hover {
      background-color: @theme-style-hv;
    }
  }
  .rbox {
    border-radius: 3px;
    box-shadow: 0 1px 10px -2px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: absolute;
    top: 44px;
    left: 0px;
    z-index: 16;
    height: 410px;
    writing-mode: vertical-lr;
    padding: 10px;
    background-color: @white;
    .result {
      // border: 1px solid #eee;
      // width: 242px;
      // flex-basis: 242px;
      // flex-grow: 0;
      writing-mode: horizontal-tb;
      margin: 0 0 10px 0;
      display: inline-block;
      li {
        color: @gray-step3;
        padding: 0 10px;
        cursor: pointer;
        width: 202px;
        padding: 0 10px 0 30px;
        line-height: 34px;
        height: 34px;
        white-space: nowrap;
        overflow: hidden;
        // text-align: justify;
        text-overflow: ellipsis;
        background-color: @white;
        span {
          width: 50px;
          display: inline-block;
        }
        &:hover {
          background-color: @theme-style-d;
          color: @theme-style;
        }
        &.on {
          background-color: @theme-style-d;
          color: @theme-style;
        }
        &.key {
          width: 222px;
          padding: 0 10px;
          background-color: @white;
          color: @gray-step3;
          line-height: 24px;
          height: 24px;
          cursor: text;
        }
      }
    }
  }
  .fieldConcept {
    position: absolute;
    top: 44px;
    left: 272px;
    z-index: 16;
  }
}
</style>