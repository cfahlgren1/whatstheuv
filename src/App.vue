<template>
  <v-app>
    <v-content>
      <SearchComponent
        :lat="lat"
        :lng="lng"/>
      <h1 class="title is-4 has-text-centered has-text-grey-light">Auburn, AL</h1>
      <v-container fluid>
          <v-row>
            <v-col cols="60" align="center">
            <div class="ma-6">
              <CircleComponent
              :lat="lat"
              :lng="lng"/>
            </div>
            </v-col>
            <v-col cols="60" align="center">
            <div class="ma-6">
              <SunriseComponent
                :sunset="730"
                :sunrise="630"/>
            </div>
              <div class="ma-6">
                <WindComponent
                  :speed="wind_speed"
                  :angle="wind_angle"/>
              </div>
            </v-col>
          </v-row>
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

  Vue.use(Buefy)
  Vue.use(VueAxios, axios)
  Vue.use(VueGeolocation);
  export default {
    name: 'App',
    data() {
      return {
        info: null,
        lng: -81.64,
        lat: 30.12,
        wind_speed: 35.67,
        wind_angle: 52.4,
        sunset: "Loading...",
        sunrise: "Loading..."
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
        this.lng = coordinates.lng;
        this.lat = coordinates.lat;
      });
    },
    methods :
            {}
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