<!--  -->
<template>
  <div class="sourceUrl">
    <div class="s-input">
      <div class="input">
          <input type="text" :value="url" :name="'refUrl' + info.id" readonly>
      </div>
      <span class="button" @click="openUrl">打开</span>
    </div>
    <div class="s-page" v-html="openurl" v-show="sourceshow == 1"></div>
    
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: ["info"],
  data() {
    return {
      openurl: ""
    };
  },

  //components: {},

  computed: {
    ...mapState(["sourceshow", "ifsourceurl"]),
    url() {
      return this.info.url;
    }
  },

  //mounted: {},

  methods: {
    ...mapMutations(['CHANGESTOPMEDIA']),
    openUrl() {
      if(this.ifsourceurl == 1){
        alert('非禁用源文章');
        return;
      }

      this.CHANGESTOPMEDIA();

      this.openurl = `<iframe width="100%" height="100%" src="${this.info.url}" frameborder="0"></iframe>`;
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
.sourceUrl {
  background-color: @gray-stepf6;
  height: 100%;
  display: flex;
  flex-direction: column;
  .s-input {
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-basis: 34px;
    .input {
      flex-grow: 1;
      // background-color: @gray-stepf6;
      margin-right: 0;
      input {
        // background-color: @gray-stepf6;
        width: 100%;
        box-sizing: border-box;
      }
    }
    .button {
      float: left;
      line-height: 34px;
      // padding: 0 10px;
      height: 34px;
      width: 80px;
      flex-basis: 80px;
      text-align: center;
      background-color: @theme-style;
      border-radius: 3px;
      color: @white;
      cursor: pointer;
      &:hover {
        background-color: @theme-style-hv;
      }
    }
  }
  .s-page {
    flex-grow: 1;
    padding: 0 20px 20px;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
  }
}
</style>