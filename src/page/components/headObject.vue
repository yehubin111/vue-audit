<!--  -->
<template>
  <div class="headinput"> 
      <span class="title">父对象</span>
      <div class="input" @click="letfocus = true">
          <span v-for="(l, index) in result" :key="index">{{l}}
            <i class="icon" @click="removeObj(l)">
                <icon class="close" name="closenormal" scale="2" style="color: #fff;"></icon>
            </i>
            <input type="hidden" :name="'classIds' + info.id + '[]'" :value="classIds[index]" :classidname="l">
          </span>
          <input type="text" :value="objectmessage" ref="input" @blur="letfocus = false" @input="toSearch" v-clickOutside="hideList" v-focus="letfocus">
          <!-- <input type="hidden" :name="'ftClassId' + info.id" :value="classIds[0]"> -->
          <transition name="fade">
            <ul class="result" v-show="ifsearch">
                <li v-for="(r, index) in shresult" :key="index" @click="toSelect(r.name, r.classId)">{{r.name}}</li>
            </ul>
            </transition> 
      </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
export default {
  props: ["info"],
  data() {
    return {
      letfocus: false,
      keyword: "",
      ifsearch: false,
      shresult: []
    };
  },
  created() {
    this.$store.dispatch("getParentObj");
  },
  computed: {
    ...mapState(["pobjinfo", "pobjall", "objectmessage"]),
    classIds() {
      return this.info.classIds.slice(0);
    },
    objall() {
      let ar_1 = [],
        ar_0 = [];
      this.pobjall.forEach((v, i) => {
        if (v.classId.indexOf("_1") != -1) {
          ar_1.push(v);
        } else {
          ar_0.push(v);
        }
      });

      return ar_1.concat(ar_0);
    },
    result() {
      var arr = [];

      if (!Array.isArray(this.info.classIds)) return;

      this.info.classIds.forEach((v, i) => {
        arr.push(this.pobjinfo[v] ? this.pobjinfo[v] : v);
      });

      // console.log('-----------------------');
      // console.log(this.pobjinfo);
      // console.log(this.info);
      return arr;
    }
  },
  watch: {
    pobjinfo(cur, old) {
      // console.log('update');
      // console.log(cur);
      this.pobjinfo = cur;
    }
  },
  methods: {
    ...mapMutations(["SETCHECKWORD", "CHANGESTATE"]),
    removeObj(l) {
      let idx = this.result.indexOf(l);
      this.result.splice(idx, 1);
      this.classIds.splice(idx, 1);

      let key = "classIds";
      let vl = this.classIds.slice(0);
      this.SETCHECKWORD({ key, vl });
    },
    hideList() {
      this.ifsearch = false;
    },
    toSearch() {
      let kwd = this.$refs.input.value;
      let key = 'objectmessage';
      let vl = kwd
      this.CHANGESTATE({key, vl});

      if (!kwd) {
        this.ifsearch = false;
        return;
      }

      this.ifsearch = true;

      console.log(this.objall);
      // let reg = new RegExp(eval("/" + kwd + "/g"));
      this.shresult = this.objall.filter(v => {
        return v.name.indexOf(kwd) > -1;
      });
      this.shresult = this.shresult.concat(
        this.objall.filter(v => {
          return v.py.indexOf(kwd) > -1;
        })
      );
      this.shresult = this.shresult.concat(
        this.objall.filter(v => {
          return v.classId.indexOf(kwd) > -1;
        })
      );
      this.shresult = this.shresult.slice(0, 12);
    },
    toSelect(n, id) {
      this.result.push(n);
      this.classIds.push(id);
      this.ifsearch = false;
      this.keyword = "";

      let key = "classIds";
      let vl = this.classIds.slice(0);
      this.SETCHECKWORD({ key, vl });
    }
  },
  directives: {
    focus: {
      update: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
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
.headinput {
  position: relative;
  .input {
    width: 500px;
    height: auto;
    cursor: text;
    span {
      line-height: 24px;
      border-radius: 3px;
      padding: 0 5px;
      background-color: @theme-style;
      display: inline-block;
      color: @white;
      margin: 3px 0 0 5px;
      padding: 0 26px 0 5px;
      position: relative;
      .icon {
        cursor: pointer;
        display: block;
        height: 18px;
        position: absolute;
        top: 3px;
        right: 3px;
        &:hover {
          background-color: @theme-style-hv;
        }
      }
    }
    input {
      width: auto;
      padding: 0 6px;
    }
    .result {
      border-radius: 3px;
      box-shadow: 0 1px 10px -2px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      position: absolute;
      //   top: 39px;
      margin: 11px 0 0 0;
      left: 60px;
      z-index: 17;
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
  }
}
</style>