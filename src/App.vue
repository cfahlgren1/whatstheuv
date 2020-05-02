<template>
  <div id="app">
      <h1 class="title is-1 has-text-centered">UV Index</h1>
      <h1 class="title is-4 has-text-centered has-text-grey-light">Auburn, AL</h1>
    <div class="circle">
      <CircleComponent
              :lat="lat"
              :lng="lng"
              :uv_max="uv_max"
              :uv="uv"/>
      <p><b>Max UV: {{uv_max}}</b></p>
      <strong>Time: {{max_uv_time}}</strong>
    </div>

  </div>
</template>

<script>
  import VueGeolocation from 'vue-browser-geolocation';
  import Vue from 'vue'
  import axios from 'axios'
  import VueAxios from 'vue-axios'
  import Buefy from 'buefy'
  import 'buefy/dist/buefy.css'
  import CircleComponent from "./components/CircleComponent";

  Vue.use(Buefy)
  Vue.use(VueAxios, axios)
  Vue.use(VueGeolocation);
  Vue.use(Buefy)
  Vue.use(VueAxios, axios)

export default {
  name: 'App',
  data() {
    return {
      info: null,
      uv: 0,
      uv_max: 10,
      lng: -81.64,
      lat: 30.12,
      max_uv_time : null
    }
  },
  components: {
    CircleComponent,
  },
  created(){},
  mounted() {
    this.$getLocation({enableHighAccuracy: false, timeout: Infinity, maximumAge: 0}).then(coordinates => {
      this.lng = coordinates.lng;
      this.lat = coordinates.lat;
      this.updateUV();
    });
  },
  methods :
  {
      updateUV() {
        var d = new Date();
        var n = d.toISOString();
        axios.get('https://api.openuv.io/api/v1/uv?lat=' + this.lat + '&lng=' + this.lng + '&dt=' + n, {
          params: {},
          headers: {'x-access-token': '65d941e9fdd0669b2f79c535acbf933b'}
        }).then(response => {
          this.info = response.data.result;
          this.uv = parseFloat(response.data.result['uv'].toFixed(1));
          this.uv_max = parseFloat(response.data.result['uv_max'].toFixed(1));
          this.max_uv_time = new Date(response.data.result['uv_max_time']).toLocaleTimeString('en-US');
        });
      }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
