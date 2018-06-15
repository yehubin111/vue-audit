<!--  -->
<template>
  <div class="editModule">
    <div class="ue-box">
        <ueTags :config='config'></ueTags>
        <UE :config='config' ref='ue' :info="info"></UE>
        <ueInput></ueInput>
    </div>
    <input type="hidden" :id="picId(1)">
    <input type="hidden" :id="picId(2)">
    <input type="hidden" :id="picId(3)">
  </div>
</template>

<script>
import UE from "./ueditor_z";
import ueTags from "./ueTags_z";
import ueInput from "./ueInput_z";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info"],
  data() {
    return {
      picValue: "",
      ueId: "DataUeditor",
      config: {
        zIndex: 15,
        initialFrameWidth: null,
        initialFrameHeight: 350,
        autoHeightEnabled: false,
        enableAutoSave: false,
        initialStyle:
          ".view{height:auto}html.view{min-height:350px;}body.view{position: relative;padding-right:158px;min-height:calc(100vh - 16px);}p{font-size:14px}.rightWarm{position:absolute;right:0;width:150px;height:100%;border-left:1px solid #dddddd;padding:0 15px;box-sizing:border-box;font-size:14px;}.rightWarm p{margin:0;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;position:absolute;top:0;width:130px;color:#e93030;}.img-pWrapper img{max-width:100%}",
        toolbars: [
          [
            "fullscreen",
            "source",
            "|",
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "|",
            "forecolor",
            "backcolor",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|",
            "link",
            "unlink",
            "anchor",
            "|",
            "insertimage",
            "date",
            "time",
            "spechars",
            "|",
            "inserttable",
            "cleardoc",
            "searchreplace",
            "help"
          ]
        ],
        elementPathEnabled: false,
        wordCount: false,
        allowDivTransToP: false
      }
    };
  },
  computed: {
    // defaultMsg() {
    //   return this.info.content;
    // }
    // ...mapGetters(["newsInfo"])
  },
  mounted() {
    this.changepic(1);
    this.changepic(2);
    this.changepic(3);
  },
  methods: {
    ...mapActions(["setNewsImg"]),
    picId(id) {
      return "artpic" + this.info.id + "_" + id;
    },
    changepic(id) {
      let _this = this;
      $("#artpic" + this.info.id + "_" + id).on(
        "input propertychange",
        function() {
          let picObj = { num: id - 1, url: $(this).val() };
          _this.setNewsImg(picObj);
        }
      );
    }
  },
  // watch: {
  //   newsInfo: (val, oldval) => {
  //     if (val[0].content) {
  //       this.defaultMsg = val[0].content;
  //     }
  //   }
  // },
  components: {
    UE,
    ueTags,
    ueInput
  }
};
</script>
<style lang='less' scoped>
.editModule {
  margin: 0 0 0 20px;
  // height: 300px;
  // background-color: #eee;
  .contain {
    min-width: 1200px;
    .ue-box {
      margin: 50px 15px 0;
    }
  }
}
</style>