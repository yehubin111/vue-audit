<template>
    <div>
        <script :id='id' type="text/plain" :name="editorName" v-if="id"></script>
    </div>
</template>

<script>
import top from "./top";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "UE",
  data() {
    return {
      editor: null,
      id: "DataUeditor",
      editorName: ''
    };
  },
  computed: {
    ...mapGetters(["newsId", "discontent"])
    // editorName() {
    //   return "content" + this.newsId;
    // }
  },
  props: [
    // 'defaultMsg',
    'config',
    'info'
  ],
  methods: {
    ...mapMutations(["SETCONFIG"]),
  },
  mounted() {
    const _this = this;
    this.editor = UE.getEditor(this.id, this.config);
    this.editor.ready(function() {
      _this.SETCONFIG(_this.config);
      _this.editor.setContent(_this.discontent);
    });
  },
  watch: {
    discontent(vl, oldvl) {
      // this.editor = UE.getEditor(this.id);
      this.editor.setContent(vl);

      composition('pb');
    }
    // newsId(vl,oldvl) {
    //   console.log(vl);
    //   if (vl){
    //     $('#newsaddall').find('textarea').attr('name',`content${vl}`)
    //   }
    // }
  }
};
</script>

<style lang="less">
</style>


