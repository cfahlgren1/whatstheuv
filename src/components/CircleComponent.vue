<template>
<div class="CircleComponent">
    <h1 class="is-5"><b>Max {{uv_max}}</b></h1>
      <radial-progress-bar style="margin: auto;width: 50%;"
                           :diameter="diameter"
                           :inner-stroke-color="innerStrokeColor"
                           :stroke-width="35"
                           :completed-steps="uv"
                           :startColor = "color"
                           :stopColor = "color"
                           :total-steps="uv_max">
          <h1 v-if="uv > 0" v-bind:style="{fontSize: fontSize + 'rem' }" @mouseenter="fontSize = 4" @mouseleave="fontSize = 3"><b>{{uv}}</b></h1>
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
      innerStrokeColor: '#5d5d5a',
      color: '#ffa45c',
      max_uv_time: null,
      info : null,
      uv_max: 10,
      uv: 0,
      diameter: 250,
      fontSize : 3,
    }
  },
  components: {
    RadialProgressBar
  },
  props: {
    lng: Number,
    lat: Number,

  },
  methods :
          {
            updateUV() {
              var d = new Date(Date.now());
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
            },
          },
  mounted() {
    this.updateUV()
  },
}
</script>

<style>

  .shadow-drop-2-center {
    -webkit-animation: shadow-drop-2-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: shadow-drop-2-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }
  @-webkit-keyframes shadow-drop-2-center {
    0% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
    100% {
      -webkit-transform: translateZ(50px);
      transform: translateZ(50px);
      -webkit-box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
      box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
    }
  }
  @keyframes shadow-drop-2-center {
    0% {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
      -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    }
    100% {
      -webkit-transform: translateZ(50px);
      transform: translateZ(50px);
      -webkit-box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
      box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
    }
  }

</style>
