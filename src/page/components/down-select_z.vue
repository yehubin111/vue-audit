<!--  -->
<template>
    <div class="down-select">
        <div class="box" @click.stop="showHideList" v-clickOutside="hideList">
            <p class="select">{{option}}</p>
            <span class="button"></span>
        </div>
        <transition name="fade">
            <ul class="list" v-show="show">
                <li v-for="(l, index) in laterReason" :key="index" @click="select(index)" ref="listLi">{{l}}</li>
            </ul>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      show: false,
      choice: -1
    };
  },
  computed: {
    option() {
      if (this.choice < 0) {
        return "无";
      } else {
        return this.laterReason[this.choice];
      }
    },
    ...mapGetters(["deleteReason"]),
    laterReason () {
      return this.deleteReason.slice(3)
    }
  },
  watch: {
    laterReason: (val, oldVal)=>{
      if (val.length) {
        let maxLength = 0
        val.forEach(element => {
          if (maxLength < element.length){
            maxLength = element.length
          }
        });
        $('.ue-box .down-select .select').width(14*maxLength-25)
      }
    }
  },
  methods: {
    select(i) {
      this.choice = i;
      this.show = false;
      this.$emit("delRes", this.laterReason[this.choice]);
    },
    showHideList() {
      this.show = !this.show;
    },
    hideList() {
      this.show = false;
    },
    setNone() {
      this.choice = -1;
    }
  }
};
</script>
<style lang='less' scoped>
@import "../../style/color.less";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
@theme-style-d: @im-color-d;
@theme-style-b: @im-color-b;
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.down-select {
  line-height: 34px;
  height: 34px;
  position: relative;
  .box {
    overflow: hidden;
    // border-radius: 3px;
    background-color: @white;
    cursor: pointer;
    margin-bottom: 5px;
    .select {
      color: #999999;
      float: left;
      padding: 0 10px;
      width: 70px;
      border: 1px solid #dfdfdf;
      border-right: none;
      line-height: 32px;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    .button {
      float: left;
      width: 24px;
      height: 34px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @theme-style;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      &:after {
        content: "";
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-top-color: #fff;
        transform: translateY(3px);
      }
      &:hover {
        background-color: @theme-style-hv;
      }
    }
  }
  .list {
    border-radius: 3px;
    box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.38);
    overflow: hidden;
    position: absolute;
    bottom: 39px;
    z-index: 1000;
    li {
      color: #333;
      padding: 0 10px;
      cursor: pointer;
      background-color: @white;
      white-space: nowrap;
      &:hover {
        background-color: @theme-style-d;
        color: @theme-style;
      }
    }
  }
}
</style>