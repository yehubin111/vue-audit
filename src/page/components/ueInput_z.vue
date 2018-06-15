<template>
    <div class="input-wrapper">
        <confirm v-show="confirmShow" :reason="delReason" @sure="sure" @circle="circle"></confirm>
        <div class="l-input">
            <input type="file" @change='changeFile' ref="inputFile" :id="upfileId" :name="upfileId" class="inputFile" title="" alt="http://flashcms.10jqka.com.cn/fileupload/index/upload/?apiName=input&apiCode=0&uploadType=2&thumbCk=on">
            <div class="new-input">
                <div class="select-file">选择文件</div>
                <div class="file-name">{{fileName}}</div>
            </div>   
            <div class="submit" @click="upfile(newsId)">上传</div>
        </div>
        <div class="r-input">
            <div class="delete-wrapper">
                <div v-for="item in threeReason" :key="item" class='three-delete'>
                  <div @click="deleteBtn(item)">{{item}}</div>
                </div>
                <downSelect @delRes="delRes" ref="downSelect"></downSelect>
            </div>
            <div class="submit" @click="submit">提交</div>
        </div>
        <input type="hidden" :name="ueNewsId" id="ueContentInput">
        <input type="hidden" :name="isDelName" value="1" v-if="isDel">
        <input type="hidden" :name="deleteReasonName" :value="delReason" v-if="isDel">
    </div>
</template>

<script>
import downSelect from "./down-select_z";
import confirm from "./confirm_z";
import { append_content,getUEditor } from "@/assets/js/input-news.js";
import { mapGetters } from "vuex";
import { submit_check } from '../../assets/js/submit_check'
export default {
  data() {
    return {
      fileName: "",
      isDel: false,
      confirmShow: false,
      delReason: ""
    };
  },
  computed: {
    ...mapGetters(["newsId","deleteReason"]),
    isDelName() {
      return "isDel" + this.newsId;
    },
    deleteReasonName() {
      return "delReason" + this.newsId;
    },
    upfileId() {
      return "upfile" + this.newsId;
    },
    threeReason () {
      return this.deleteReason.slice(0,3)
    },
    ueNewsId () {
      return "content" + this.newsId;
    }
  },
  methods: {
    changeFile() {
      this.fileName = this.$refs.inputFile.files[0].name;
    },
    upfile(newsid) {
      this.uploadFile(newsid);
    },
    submit() {
      if(submit_check())
        this.formSubmit();
    },
    formSubmit() {
      // let dom = this.$refs.form;
      $('#ueContentInput').attr('value',getUEditor(this.newsid).getContent().replace(/<div class="rightWarm.+<\/div>/, ''))
      let postdata = $("#newsaddall").serialize();
      this.$store.dispatch("newsSubmit", { postdata });//
    },
    deleteBtn (msg) {
      this.confirmShow = true;
      this.delReason = msg;
      this.isDel = true;
    },
    delRes(e) {
      this.confirmShow = true;
      this.delReason = e;
      this.isDel = true;
    },
    sure() {
      // $("#newsaddall").submit();
      this.confirmShow = false;
      this.isDel = false;

      // if(submit_check())
      this.formSubmit();
    },
    circle() {
      this.confirmShow = false;
      this.$refs.downSelect.setNone();
      this.isDel = false;
    },
    uploadFile(unitId) {
      let _this = this;
      if (!unitId) {
          unitId = '';
      }
      var url = document.getElementById('upfile' + unitId).alt;
      // 始终是直接上传
      var value = 1;
      // 默认只能上传图片
      var state = 'on';
      //下面一段为上传文件非空和文件类型判断，各应用可根据自身需求来实现 var upfile = $("#upfile").attr("value");
      var upfile = $("#upfile" + unitId).val();
      if (upfile.length == 0) {
          alert('在上传之前，必须先选择本地文件！');
          return false;
      }
      var ary = upfile.split('.');
      var filetype = ary[ary.length - 1];
      filetype = filetype.toLowerCase();
      var allowType = 'jpg|jpeg|gif|png|zip|rar|doc|pdf|xls|ppt|txt|wps|et|dps|docx|xlsx|pptx';
      if (allowType.indexOf(filetype) == -1) {
          alert('上传文件的类型[' + filetype + ']非法');
          return false;
      }
      var allows = 'jpg|jpeg|gif|png';
      if (state == 'on') {
          if (allows.indexOf(filetype) == -1) {
              alert('非图片类型不能进行相关图片操作');
              return false;
          }
      }
      //文件上传插件
      $.ajaxFileUpload({
          url: url, //处理上传文件的服务端
          secureuri: false,
          fileElementId: 'upfile' + unitId,
          dataType: 'json',
          data: {
              'waterMark': value,
              'thumbCk': state,
              'fileName': 'upfile' + unitId
          },
          async: false,
          success: function(returnResult) {
              var result = returnResult.result;
              var url = result.url;
              if (url) {
                  var pic_ext = new Array('.gif', '.jpg', '.jpeg', '.png');
                  var pic_flag = 0;
                  for (var i = 0; i < pic_ext.length; i++) {
                      var ext = url.substring(url.length - pic_ext[i].length);
                      if (ext == pic_ext[i]) {
                          pic_flag = 1;
                          break;
                      }
                  }

                  var insert_val = '';
                  if (pic_flag) {
                      insert_val = '<img src="' + url + '" border="0"/><br />';
                  } else {
                      insert_val = '<a href="' + url + '" target="_blank">点击下载附件</a>';
                  }

                  append_content(insert_val, unitId);
                  $("#upfile" + unitId).val('');
                  _this.fileName = '';
                  composition();
              } else {
                  alert(result.tip);
              }
          },
          error: function(data, sataus, e) {
              alert(e);
          }
      });
    }
  },
  components: {
    downSelect,
    confirm
  }
};
</script>

<style lang="less" scoped>
@import "../../style/common";
@theme-style: @im-color;
@theme-style-hv: @im-color-hv;
@theme-style-d: @im-color-d;
@theme-style-b: @im-color-b;
.input-wrapper {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  .l-input {
    display: flex;
    position: relative;
    .inputFile {
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 0;
      height: 34px;
      width: 86px;
      cursor: pointer;
      background-color: #ddd;
    }
    .new-input {
      width: 320px;
      height: 32px;
      border: 1px solid #dddddd;
      border-radius: 2px;
      overflow: hidden;
      display: flex;
      .select-file {
        width: 86px;
        background: #eee;
        line-height: 34px;
        text-align: center;
        font-size: 14px;
        color: #333333;
        cursor: pointer;
      }
      .file-name {
        flex: 1;
        line-height: 32px;
        padding: 0 10px;
        .mul_ell(1);
      }
    }
  }
  .r-input {
    display: flex;
    .delete-wrapper {
      display: flex;
      .three-delete {
        div {
          padding: 0 15px;
          line-height: 34px;
          font-size: 14px;
          text-align: center;
          background: #eee;
          color: #333;
          border-radius: 3px;
          margin-right: 10px;
          cursor: pointer;
          &:hover{
            background: #e6e6e6;
          }
        }
      }
    }
  }
  .submit {
    // padding: 0 22px;
    width: 80px;
    line-height: 34px;
    background-color: @theme-style;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    margin-left: 8px;
    border-radius: 2px;
    cursor: pointer;
    &:hover {
      background-color: @theme-style-hv;
    }
  }
  &.low{
    margin-top: 10px;
  }
}
</style>
