<template>
    <div id="app">
        <h1 class="title is-1 has-text-centered" style="margin-bottom: 0.5rem;">UV Index</h1>
        <h1 class="title is-4 has-text-centered has-text-grey-light">Auburn, AL</h1>
        <br>
        <div class="circle">
            <CircleComponent
                    :lat="lat"
                    :lng="lng"/>
        </div>
        <br>
        <table style="width:100%;">
            <td v-for="item in forecast" v-bind:key="item.sunset">
                <tr>{{getRoundedNum(item.uvi)}}</tr>
                <tr>{{getDate(item.dt)}}</tr>
            </td>
        </table>
        <br>
        <search-component
        :lat="lat"
        :lng="lng"/>
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
  import SearchComponent from "./components/SearchComponent";

  Vue.use(Buefy)
  Vue.use(VueAxios, axios)
  Vue.use(VueGeolocation);

export default {
  name: 'App',
  data() {
    return {
        uv: 0,
        uv_max: 10,
        lng: -81.64,
        lat: 30.12,
        forecast : null,
        dateTime : null,
        location: "",
    }
  },
  components: {
      CircleComponent,
      SearchComponent,
  },
  created(){
      this.getForecast();
  },
  mounted() {
    this.$getLocation({enableHighAccuracy: false, timeout: Infinity, maximumAge: 0}).then(coordinates => {
      this.lng = coordinates.lng;
      this.lat = coordinates.lat;
    });
  },
  methods :
  {
      getForecast(){
          axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + this.lat +'&lon=' + this.lng +'&exclude=hourly&appid=a5a79095c774d838fadee0cd998ea2f7', {
          }).then(response => {
              this.forecast = response.data.daily
          });
      },
      getDate(date_time){
          var d = new Date(0);
          d.setUTCSeconds(date_time);
          d = d.getDay();
          if (d == 0)
              d = "Sun"
          else if (d == 1)
              d = "Mon"
          else if (d == 2)
              d = "Tues"
          else if (d == 3)
              d = "Wed"
          else if (d == 4)
              d = "Thur"
          else if (d == 5)
              d = "Fri"
          else if (d == 6)
              d = "Sat"
          return d;
      },
      getRoundedNum(num){
          return parseFloat(num).toFixed(1);
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
