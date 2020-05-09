<template>
  <v-app>
    <v-content>
      <SearchComponent/>
      <h1 class="display-3 has-text-centered location-header">{{location}}</h1>
      <br>
        <h1 v-animate-css="'bounceInUp'" class="display-4 has-text-centered"><b>{{current_temp}}°F</b></h1>
        <h1 class="display-1 has-text-centered has-text-grey-light"><b>"{{forecast}}"</b></h1>
      <br>
      <v-container fluid>
        <sequential-entrance fromTop>
          <h1 class="forecast-header display-1 has-text-left">Today's Highlights</h1>
          <v-row>
            <v-col cols="60" align="center">
              <div class="ma-6">
                <CircleComponent
                :sunrise="sunrise_time"
                :sunset="sunset_time"/>
              </div>
              </v-col>
              <v-col cols="60" align="center">
              <div class="ma-6">
                <SunriseComponent
                  :sunset="sunset"
                  :sunrise="sunrise"/>
              </div>
                <div class="ma-6">
                  <WindComponent
                    :speed="wind_speed"
                    :angle="wind_angle"/>
                </div>
              </v-col>
          </v-row>
        </sequential-entrance>
      </v-container>
    </v-content>
  </v-app>
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
  import SunriseComponent from "./components/SunriseComponent";
  import WindComponent from "./components/WindComponent";
  import VAnimateCss from 'v-animate-css';

  Vue.use(VAnimateCss);
  Vue.use(Buefy)
  Vue.use(VueAxios, axios)
  Vue.use(VueGeolocation);

  export default {
    name: 'App',
    data() {
      return {
        info: null,
        wind_speed: 0,
        wind_angle: 0,
        sunset: "Loading...",
        sunrise: "Loading...",
        sunset_time: null,
        sunrise_time: null,
        key: 'a5a79095c774d838fadee0cd998ea2f7',
        forecast: "Loading...",
        current_temp: null,
        activeBtn: 1,
      }
    },
    components: {
      CircleComponent,
      SearchComponent,
      SunriseComponent,
      WindComponent,
    },
    created(){},
    mounted() {
      this.$getLocation({enableHighAccuracy: false, timeout: Infinity, maximumAge: 0}).then(coordinates => {
        this.setLng(coordinates.lng);
        this.setLat(coordinates.lat);
        this.updateUV();
      });
    },
    methods :
            {
              getLocalTime(unix_timestamp) {
                var date = new Date(unix_timestamp * 1000);
                return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
              },
              setLng(lng){
                this.$store.commit('set_lng', lng);
              },
              setLat(lat){
                this.$store.commit('set_lat', lat);
              },
              updateUV() {
                if (this.lat !== 0 && this.lng !== 0) {
                  axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + this.lat + '&lon=' + this.lng + '&exclude=hourly&appid=' + this.key + '&units=imperial', {
                    params: {},
                  }).then(response => {
                    this.info = response.data;
                    this.sunrise_time = response.data.current.sunrise;
                    this.sunrise = this.getLocalTime(this.sunrise_time);
                    this.sunset_time = response.data.current.sunset;
                    this.sunset = this.getLocalTime(this.sunset_time);
                    this.wind_speed = response.data.current.wind_speed;
                    this.wind_angle = response.data.current.wind_deg;
                    this.forecast = response.data.current.weather[0].description;
                    this.current_temp = response.data.current.temp.toFixed(0);
                  });
                }
              }
            },
    computed: {
      lng : function(){
        return this.$store.state.lng;
      },
      lat: function(){
        return this.$store.state.lat;
      },
      location: function(){
        return this.$store.state.location;
      }
    },
    watch:{
      lng(){
        this.updateUV();
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
  .location-header{
    background-color: #2D4059;
    padding: 1em;
    color: white;
  }
  .forecast-header
  {
    margin-left: 1em;
    font-weight: bold;
  }
</style>