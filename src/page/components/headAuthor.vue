<!--  -->
<template>
  <div class="headinput"> 
      <span class="title">作者</span>
      <div class="input">
          <input type="text" :name="'author' + info.id" v-model="message" @blur="check">
      </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: ["info"],
  data() {
    return {
      // message: ''
    };
  },
  created() {},

  //components: {},

  computed: {
    message() {
      return this.info.author;
    }
  },

  //mounted: {},

  methods: {
    ...mapMutations(["SETCHECKWORD"]),
    check() {
      let key = "title";
      let vl = this.message;
      // 存储检测数据
      this.SETCHECKWORD({ key, vl });
    }
  }
};
</script>
<style lang='less'>
.headinput{
  .input{
    input{
      width: 120px;
    }
  }
}
</style>