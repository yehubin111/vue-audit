<template>
  <div class="confirm-box">
      <div class="blackBack"></div>
      <div class="confirm">
          <div class="confirm-top">提示</div>
          <div class="confirm-content">{{content}}</div>
          <div class="confirm-reason">{{delReason}}</div>
          <div class="confirm-btn">
            <!-- <div class="circle" @click="circle">取消</div> -->
            <div class="sure" @click="sure">确定</div>
          </div>
          <i class="icon" @click="circle"> 
                <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
            </i>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "您确定要删除这篇文章吗"
    },
    reason: {
      type: String
    }
  },
  computed: {
    delReason() {
      return "删除原因：" + this.reason;
    }
  },
  methods: {
    sure() {
      this.$emit("sure");
    },
    circle() {
      this.$emit("circle");
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../style/color";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
@theme-style-d: @im-color-d;
@theme-style-b: @im-color-b;
.confirm-box {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  .blackBack {
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    height: 100%;
  }
  .confirm {
    width: 350px;
    border-radius: 3px;
    overflow: hidden;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 15px;
    .confirm-top {
      width: 100%;
      height: 34px;
      background: @theme-style;
      font-size: 14px;
      line-height: 34px;
      padding-left: 20px;
      box-sizing: border-box;
      color: white;
      display: none;
    }
    .confirm-content {
      text-align: center;
      margin: 47px 0 5px;
      font-size: 18px;
    }
    .confirm-reason {
        font-size: 14px;
      text-align: center;
    }
    .confirm-btn {
      display: flex;
      justify-content: space-between;
      padding: 45px 90px 38px;
      div {
        border-radius: 3px;
        width: 100%;
        font-size: 14px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        color: white;
        background: @theme-style;
        cursor: pointer;
        &:hover{
            background-color: @theme-style-hv;
        }
      }
    }
    .icon {
      width: 18px;
      height: 18px;
      display: block;
      position: absolute;
      right: 10px;
      top: 10px;
      background-color: @theme-style;
      border-radius: 50%;
      cursor: pointer;
      .close {
        display: block;
        margin: 2px 0 0 2px;
        width: 14px;
        height: 14px;
        font-weight: bold;
      }
    }
  }
}
</style>
