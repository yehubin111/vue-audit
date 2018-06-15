<template>
    <div class="ue-tag-wrapper">
        <div class="switch-visibility" @click="toggle(newsId)">{{visibility}}</div>
        <div class="auto-composition" @click="composition()">自动排版</div>
        <div class="pagination" @click="delim_page(newsId)">此处分页</div>
        <div class="find-tags" @click="tagRecognition(newsId)">识别(所有标签)</div>
    </div>
</template>

<script>
import {
  add_content,
  getUEditor,
  appendContent,
  tagTip,
  codeRecognition,
  PB2,
  getIframe,
  get_content,
  ToDBC
} from "@/assets/js/input-news.js";
import { mapGetters, mapActions } from "vuex";
const reg = /<div class="rightWarm.+<\/div>/;
export default {
  data() {
    return {
      visibility: "切换到纯文本",
      editor: null,
      rightCont: ""
    };
  },
  props: {
    config: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(["newsId", "newsInfo"])
  },
  mounted() {
    this.editor = UE.getEditor("DataUeditor", this.config);
    this.editor.ready(() => {
      this.composition('pb');
    });

    console.log("---------------------7-----------------------");
    // 定义全局方法
    window.composition = this.composition;
  },
  methods: {
    // 启用或取消纯文本粘贴模式
    toggle(newsid) {
      if ("0" == getUEditor(newsid).queryCommandState("PastePlain")) {
        this.visibility = "切换到可视";
      } else {
        this.visibility = "切换到纯文本";
      }
      getUEditor(newsid).execCommand("PastePlain");
    },
    //插入分页
    delim_page(newsid) {
      if (confirm("是否加入该页标题")) {
        var title = prompt("请输入标题：");
        if (title) {
          add_content(
            '</br><input disable="disable" readonly="readonly" style="color: gray; text-align: center; border:1px; width: 100%" value="----------分页-#' +
              title +
              '#----------"/>',
            newsid
          );
        }
      } else {
        add_content(
          '</br><input disable="disable" style="color:gray;text-align:center;border:1px;width:100%"value="----------分页-##----------"/>',
          newsid
        );
      }
      this.updateContent(get_content(newsid));
    },
    // 自动排版
    composition(type) {
      let newsid = this.newsId;
      let _this = this;
      // 自动排版前先删掉右边的提示框
      let uContent = getUEditor(newsid).getContent();
      if (reg.test(uContent)){
        var newUCont = uContent.replace(reg, "");
        getUEditor(newsid).setContent(newUCont);
      }
      PB2(newsid,type);
      // 将新闻标题中的符号全角转半角
      var title = this.newsInfo[0].title;
      if (title) {
        this.updateTitle(ToDBC(title));
      }
      // 删掉空的ul
      var ulArr = getIframe(newsid).find('ul');
      for(var j = 0;j<ulArr.length;j++){
        if (/ */.test(ulArr[j].textContent)) {
          ulArr[j].remove()
        }
      }
      // 删掉空的table
      var tableArr = getIframe(newsid).find('table');
      for(var j = 0;j<tableArr.length;j++){
        if (/ */.test(tableArr[j].textContent)) {
          tableArr[j].remove()
        }
      }
      // 违禁词接口
      $.ajax({
        url: "/entry/news/ajax/",
        type: "POST",
        data: {
          method: "forbiddenCheck",
          title: this.newsInfo[0].title,
          content: uContent
        },
        dataType: "json",
        async: false,
        success: function(data) {
          if (data.msg) {
            let wordArr = data.msg.split("|");
            wordArr.forEach(element => {
              var reg = new RegExp(element,'g');
              uContent = uContent.replace(reg,`<span style='color:#FF00FF' class='tipWord forbidden'>${element}</span>`);
            });
            getUEditor(newsid).setContent(uContent);
          }
          let imgs = getIframe(newsid).find("img");
          let imgCount = 0;
          let validImg = 0;
          if (imgs.length > 0) {
            for(let i=0;i<imgs.length;i++){
              if (imgs[i].width > 0) {
                validImg++;
              }
            }
            if (validImg > 0) {
              for(let i=0;i<imgs.length;i++){
                imgs[i].onload = function() {
                  if (imgs[i].width > 0) {
                    imgCount++;
                    if (imgCount == validImg) {
                      _this.calRightAll(newsid);
                    }
                  }
                };
                imgs[i].onerror = function() {
                  if (imgs[i].width > 0) {
                    imgCount++;
                    if (imgCount == validImg) {
                      _this.calRightAll(newsid);
                    }
                  }
                  this.parentNode.style.display='none'
                };
              }
            } else {
              _this.calRightAll(newsid);
            }
          } else {
            _this.calRightAll(newsid);
          }
        },
        error: function(e) {
          console.log(e); 
        }
      });
    },
    // 识别所有标签
    tagRecognition(newsid) {
      // 识别A股
      this.tagTip(newsid);
      // 识别港美股
      this.codeRecognition(newsid);
    },
    calRightAll (newsid) {
      setTimeout(()=>{
        this.calRight(newsid);
        add_content(`<div class='rightWarm' contenteditable='false'>${this.rightCont}</div>`,newsid);
        this.updateContent(get_content(newsid));
      },500)
    },
    // 计算右侧提示
    calRight(newsid) {
      if (getIframe(newsid)) {
        let tipWordArr = getIframe(newsid).find(".tipWord");
        this.rightCont = "";
        let oneContent = "";
        for (var i = 0; i < tipWordArr.length; i++) {
          if (i > 0) {
            if (tipWordArr[i].offsetTop == tipWordArr[i - 1].offsetTop) {
              oneContent += this.rightStr(tipWordArr[i]);
              if (i == tipWordArr.length - 1) {
                this.rightCont += this.line(tipWordArr[i].offsetTop,oneContent);
                oneContent = "";
              }
            } else {
              this.rightCont += this.line(tipWordArr[i - 1].offsetTop,oneContent);
              oneContent = "";
              oneContent += this.rightStr(tipWordArr[i]);
              if (i == tipWordArr.length - 1) {
                this.rightCont += this.line(tipWordArr[i].offsetTop,oneContent);
              }
            }
          } else if (i == 0 && tipWordArr.length !== 1) {
            oneContent += this.rightStr(tipWordArr[i]);
          } else if (tipWordArr.length == 1) {
            oneContent += this.rightStr(tipWordArr[i]);
            this.rightCont += this.line(tipWordArr[i].offsetTop,oneContent);
          }
        }
      }
    },
    line(top, content) {
      return `<p style="top:${top}px" title="${content}">${content}</p>`;
    },
    rightStr(dom) {
      if (
        dom.className.indexOf("forbidden") != -1 &&
        dom.parentElement.className.indexOf("tipWord") == -1
      ) {
        return "违禁词 ";
      } else if (
        dom.className.indexOf("forbidden") != -1 &&
        dom.parentElement.className.indexOf("tipWord") != -1
      ) {
        return "";
      } else if (
        dom.className.indexOf("refuse") != -1 &&
        dom.parentElement.className.indexOf("tipWord") == -1
      ) {
        return "复审词 ";
      } else if (
        dom.className.indexOf("refuse") != -1 &&
        dom.parentElement.className.indexOf("tipWord") != -1
      ) {
        return "";
      } else if (
        dom.className.indexOf("ad") != -1 &&
        dom.parentElement.className.indexOf("tipWord") == -1
      ) {
        return "广告词 ";
      } else if (
        dom.className.indexOf("ad") != -1 &&
        dom.parentElement.className.indexOf("tipWord") != -1
      ) {
        return "";
      } else if (
        dom.className.indexOf("info") != -1 &&
        dom.parentElement.className.indexOf("tipWord") == -1
      ) {
        return "提示词 ";
      } else if (
        dom.className.indexOf("info") != -1 &&
        dom.parentElement.className.indexOf("tipWord") != -1
      ) {
        return "";
      }
    },
    ...mapActions(["updateContent", "updateTitle", "codeRecognition", "tagTip"])
  }
};
</script>

<style lang="less" scoped>
.ue-tag-wrapper {
  font-size: 0;
  color: #333333;
  margin-bottom: 10px;
  div {
    font-size: 14px;
    padding: 0 10px;
    background: #eee;
    display: inline-block;
    line-height: 34px;
    border-radius: 2px;
    margin-right: 12px;
    border-radius: 3px;
    cursor: pointer;
    &:hover {
      background: #e6e6e6;
    }
  }
}
</style>
