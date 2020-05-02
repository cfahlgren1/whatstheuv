<template>
  <div>
    <radial-progress-bar style="margin: auto;width: 50%;"
                         :diameter="250"
                         :inner-stroke-color="innerStrokeColor"
                         :stroke-width="35"
                         :completed-steps="uv"
                         :startColor = "color"
                         :stopColor = "color"
                         :total-steps="uv_max">
      <h1 class="title is-1">{{uv}}</h1>
    </radial-progress-bar>
  </div>
</template>

<script>
  import VueGeolocation from 'vue-browser-geolocation';
  import Vue from 'vue'
  import axios from 'axios'
  import VueAxios from 'vue-axios'
  import RadialProgressBar from 'vue-radial-progress'
  import Buefy from 'buefy'
  import 'buefy/dist/buefy.css'

  Vue.use(Buefy)
  Vue.use(VueAxios, axios)
  Vue.use(VueGeolocation);
  Vue.use(Buefy)
  Vue.use(VueAxios, axios)


export default {
  name: 'CircleComponent',
  data() {
    return {
      innerStrokeColor: '#278EA5',
      color: '#21E6C1',
      max_uv_time: null
    }
  },
  components: {
    RadialProgressBar
  },
  props: {
    lng: Number,
    lat: Number,
    uv_max: Number,
    uv: Number,

  },
  methods :
          {},
}
</script>

<style scoped>
</style>
