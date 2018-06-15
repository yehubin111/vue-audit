<!--  -->
<template>
  <div class="headradio">
      <span class="title">性质</span>
      <div class="radio">
          <input type="radio" @click="select('1')" :name="'nature' + info.id" id="n1" value="1" checked v-if="info.nature == 1">
          <input type="radio" @click="select('1')" :name="'nature' + info.id" id="n1" value="1" v-else>
          <label for="n1">利好</label>
          <input type="radio" @click="select('2')" :name="'nature' + info.id" id="n2" value="2" checked v-if="info.nature == 2">
          <input type="radio" @click="select('2')" :name="'nature' + info.id" id="n2" value="2" v-else>
          <label for="n2">利空</label>
          <input type="radio" @click="select('3')" :name="'nature' + info.id" id="n3" value="3" checked v-if="info.nature == 3">
          <input type="radio" @click="select('3')" :name="'nature' + info.id" id="n3" value="3" v-else>
          <label for="n3">中性</label>
          <input type="radio" @click="select" :name="'nature' + info.id" id="n4" value="" checked v-if="info.nature == ''">
          <input type="radio" @click="select" :name="'nature' + info.id" id="n4" value="" v-else>
          <label for="n4">无</label>
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

  //components: {},

  //computed: {},

  //mounted: {},

  methods: {
    ...mapMutations(["CHANGEDISINFO"]),
    select(k) {
      let key = "nature";
      let vl = k ? k : "";
      this.CHANGEDISINFO({ key, vl });
    }
  }
};
</script>
<style lang='less'>
</style>