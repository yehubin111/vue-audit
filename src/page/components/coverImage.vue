<!--  -->
<template>
  <div class="coverImage">
      <span class="title">图片</span>
      <div class="list">
              <div class="picshow" v-for="(f, index) in newsimages" :key="index" v-if="f.img != ''">
                  <img :src="f.img" alt="" width="170">
                  <p class="button">
                      <span class="change" @click="toChange(index)">更换</span>
                      <span class="select" @click="toSelect(index)">选择</span>
                  </p>
                  <i class="icon" @click="toDelete(index)"> 
                        <icon class="close" name="closebond" scale="0.1" style="color: #fff;"></icon>
                    </i>
                    <input type="hidden" :name="'artpic' + info.id + '_' + (index + 1)" :value="f.img">
              </div>
              <div class="picupload" v-else>
                <div class="bline">
                    <div class="logo">
                        <span class="icon"> 
                            <icon class="photo" name="photo" scale="4" style="color: #ddd;"></icon>
                        </span>
                        <span class="font">上传图片<br>170*130</span>
                    </div>
                    <p><span class="change" @click="toChange(index)">更换</span></p>
                    <p><span class="select" @click="toSelect(index)">选择</span></p>
                </div>
              </div>
      </div>
  </div> 
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["info"],
  data() {
    return {};
  },
  created() {},

  //components: {},

  computed: {
    ...mapState(["newsimages"])
  },

  mounted() {
    window.selectImg = this.selectImg;
  },

  methods: {
    ...mapMutations(["CHANGEIMAGE"]),
    toChange(idx) {
      layer.open({
        type: 2,
        title: "更换封面图片",
        shadeClose: true,
        shade: 0.8,
        maxmin: false,
        area: ["600px", "50%"],
        content:
          "/entry/distriaudit/changecoverpic/?newsid=" +
          this.info.id +
          "_" +
          (parseInt(idx) + 1)
      });
    },
    toSelect(idx) {
      layer.open({
        type: 2,
        title: "从图库选择",
        shadeClose: true,
        shade: 0.8,
        maxmin: false,
        area: ["960px", "90%"],
        content:
          "/recommend/gallery/index/?picselectcallback=selectImg&spp=" +
          this.info.id +
          "_" +
          (parseInt(idx) + 1)
      });
    },
    selectImg(imgInfo, newsid) {
      let self = this;
      console.log(imgInfo, newsid);

      try {
        if (imgInfo.width && imgInfo.width > 200) {
          layer.msg("图片宽度超过200", { icon: 5, time: 2000 });
          return false;
        }
        let idx = newsid.split('_')[1] - 1;
        let img = imgInfo.link;

        self.CHANGEIMAGE({ idx, img });
        layer.closeAll("iframe");
      } catch (e) {}
    },
    toDelete(idx) {
      console.log(idx);
      this.CHANGEIMAGE({ idx });
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
.coverImage {
  //   overflow: hidden;
  height: 130px;
  margin: 0 0 30px 20px;
  .title {
    float: left;
    width: 50px;
    margin: 0 10px 0 0;
    line-height: 130px;
  }
  .list {
    float: left;
    .picupload {
      //   cursor: pointer;
      float: left;
      width: 168px;
      height: 128px;
      margin: 0 20px 0 0;
      //   text-align: center;
      border: 2px dashed @gray-stepd;
      //   border-radius: 3px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .bline {
        .logo {
          overflow: hidden;
          margin-bottom: 10px;
          span.icon {
            margin: 0 6px 0 0;
            float: left;
            .photo {
              float: left;
              display: block;
              font-weight: bold;
            }
          }
          .font {
            float: left;
            margin-top: 4px;
            color: @gray-stepd;
            line-height: 14px;
            font-size: 12px;
          }
        }
        p {
          text-align: center;
          span {
            width: 80px;
            line-height: 24px;
            border-radius: 3px;
            font-size: 12px;
            display: inline-block;
            cursor: pointer;
            &.change {
              background-color: @theme-style;
              color: @white;
              margin: 0 0 10px 0;
              &:hover {
                background-color: @theme-style-hv;
              }
            }
            &.select {
              background-color: #eee;
            }
          }
        }
      }
    }
    .picshow {
      float: left;
      margin: 0 20px 0 0;
      border: 1px solid @gray-stepd;
      height: 130px;
      width: 170px;
      display: flex;
      align-items: center;
      // border-radius: 3px;
      overflow: hidden;
      position: relative;
      .button {
        width: 100%;
        display: flex;
        position: absolute;
        bottom: 0;
        left: 0;
        opacity: 0.3;
        transition: all 0.3s;
        span {
          display: inline-block;
          background-color: rgba(0, 0, 0, 0.5);
          text-align: center;
          line-height: 24px;
          font-size: 12px;
          color: @white;
          cursor: pointer;
          &.change {
            flex-basis: 50%;
            margin: 0 1px 0 0;
          }
          &.select {
            flex-grow: 1;
          }
        }
      }
      i.icon {
        width: 16px;
        height: 16px;
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        opacity: 0.3;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        .close {
          display: block;
          margin: 2px 0 0 2px;
          width: 12px;
          height: 12px;
          // font-weight: bold;
        }
      }
      &:hover {
        .button {
          opacity: 1;
        }
        i.icon {
          opacity: 1;
        }
      }
    }
  }
  &.low{
    margin: 0 0 10px 20px;
  }
}
</style>