<!--  -->
<template>
  <div class="headradio">
      <span class="title">权重</span>
      <div class="radio">
          <input type="radio" @click="select('1')" :name="'import' + info.id" id="i1" value="1" checked v-if="info.import == 1">
          <input type="radio" @click="select('1')" :name="'import' + info.id" id="i1" value="1" v-else>
          <label for="i1">低</label>
          <input type="radio" @click="select('2')" :name="'import' + info.id" id="i2" value="2" checked v-if="info.import == 2">
          <input type="radio" @click="select('2')" :name="'import' + info.id" id="i2" value="2" v-else>
          <label for="i2">中</label>
          <input type="radio" @click="select('3')" :name="'import' + info.id" id="i3" value="3" checked v-if="info.import == 3">
          <input type="radio" @click="select('3')" :name="'import' + info.id" id="i3" value="3" v-else>
          <label for="i3">高</label>
      </div>
  </div>
</template>
 
<script>
import { mapMutations } from "vuex";
export default {
  props: ["info"],
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["CHANGEDISINFO"]),
    select(k) {
      let key = "import";
      let vl = k ? k : "0";
      this.CHANGEDISINFO({ key, vl });
    }
  }

  //components: {},

  //computed: {},

  //mounted: {},

  //methods: {}
};
</script>
<style lang='less'>
</style>