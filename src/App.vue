<template>
  <v-app>
    <v-content>
      <SearchComponent/>
      <h1 class="display-3 has-text-centered location-header">{{location}}</h1>
      <br>
      <h1 id="currentTemp" v-animate-css="'bounceInUp'" v-on:click="toggle_units" class="display-4 has-text-centered"><b>{{current_temp}}</b></h1>
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
  import Hotjar from 'vue-hotjar';
  import VueMeta from 'vue-meta'

  Vue.use(VueMeta, {
    // optional pluginOptions
    refreshOnceOnNavigation: true
  })

  Vue.use(Hotjar, {
    id: '1805114',
    isProduction: true,
    snippetVersion: 6
  })

  Vue.use(VAnimateCss);
  Vue.use(Buefy)
  Vue.use(VueAxios, axios)
  Vue.use(VueGeolocation);

  export default {
    name: 'App',
    data() {
      return {
        info: null,
        title: 'Current UV Index Forecast and Weather Data | WhatsTheUV',
        description: 'Use WhatsTheUV to find the current UV Index forecast and other important weather information!',
        wind_speed: 0,
        wind_angle: 0,
        sunset: "Waiting...",
        sunrise: "Waiting...",
        sunset_time: null,
        sunrise_time: null,
        key: 'a5a79095c774d838fadee0cd998ea2f7',
        forecast: "Waiting...",
        current_temp: null,
        activeBtn: 1,
        locationiq_key : '83fb9d3ee4efa1',
        address: '',
        city:'',
        country_code:'',
        location_permission: false,
      }
    },
    components: {
      CircleComponent,
      SearchComponent,
      SunriseComponent,
      WindComponent,
    },
    mounted() {
      if ('geolocation' in navigator) {
        // if user hasn't searched anywhere, get their location and update location store
        this.$getLocation({enableHighAccuracy: false, timeout: Infinity, maximumAge: 0}).then(coordinates => {
          this.setLng(coordinates.lng);
          this.setLat(coordinates.lat);
          axios.get('https://us1.locationiq.com/v1/reverse.php?key=' + this.locationiq_key + '&lat=' + this.lat + '&lon=' + this.lng + '&format=json', {}).then(response => {
            this.setLocation(response.data.address.city);
            if (response.data.address.country_code !== "us" && this.metric === false){
              this.toggle_units();
            }
          });
        });
      }
      // if no location, get reverse geocode location from lng and lat
      if((this.location === '' || this.location === 'undefined')) {
        axios.get('https://us1.locationiq.com/v1/reverse.php?key=' + this.locationiq_key + '&lat=' + this.lat + '&lon=' + this.lng + '&format=json', {}).then(response => {
          this.setLocation(response.data.address.city);
          if (response.data.address.country_code !== "us" && this.metric === false){
            this.toggle_units();
          }
        });
      }
      this.updateUV();
    },
    methods :
            {
              getLocalTime(unix_timestamp) {
                var date = new Date(unix_timestamp * 1000);
                return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
              },
              //set longitude in vuex
              setLng(lng){
                this.$store.commit('set_lng', lng);
              },
              //set latitude in vuex
              setLat(lat){
                this.$store.commit('set_lat', lat);
              },
              setLocation(location){
                this.$store.commit('set_location', location);
                console.log('Location changed to ' + location);
              },
              toggle_units(){
                this.$store.commit('toggle_units'); // toggle units boolean
                if (this.current_temp.endsWith('°F') && this.metric === true) { //check if temp is farenheit and metric is celsius
                  this.current_temp = ((parseInt(this.current_temp.substring(0, this.current_temp.length - 2)) - 32) * (5/9)).toFixed(0) + '°C';
                  this.wind_speed = parseFloat(this.wind_speed / 2.237).toFixed(2);
                }
                else{ // metric is true
                  this.current_temp = ((parseInt(this.current_temp.substring(0, this.current_temp.length - 2)) * (9/5)) + 32).toFixed(0) + '°F';
                  this.wind_speed = parseFloat((this.wind_speed * 2.237).toFixed(2));
                }
              },
              //update all information
              updateUV() {
                axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=' + this.lat + '&lon=' + this.lng + '&exclude=hourly&appid=' + this.key + '&units=imperial', {
                  params: {},
                }).then(response => {
                  this.info = response.data;
                  this.sunrise_time = response.data.current.sunrise;
                  this.sunrise = this.getLocalTime(this.sunrise_time);
                  this.sunset_time = response.data.current.sunset;
                  this.sunset = this.getLocalTime(this.sunset_time);
                  this.wind_angle = response.data.current.wind_deg;
                  this.forecast = response.data.current.weather[0].description;
                  if (this.metric) { // check if units are imperial or metric
                    this.current_temp = ((response.data.current.temp - 32) * (5/9)).toFixed(0) + '°C'; // convert farenheit to celsius
                    this.wind_speed = parseFloat((response.data.current.wind_speed / 2.237).toFixed(2));
                  }
                  else{
                    this.current_temp = response.data.current.temp.toFixed(0) + '°F';
                    this.wind_speed = parseFloat(response.data.current.wind_speed.toFixed(2));
                  }
                });
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
      },
      metric: function(){
        return this.$store.state.metric;
      },
    },
    watch:{
      lng(){
        this.updateUV();
      },
    },
    metaInfo () { //meta info for SEO
      return {
        title: this.title,
        meta: [
          { vmid: 'description', name: 'description', content: this.description }
        ]
      }
    },
    created(){
      document.title = this.title
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
  #currentTemp:hover {
    cursor: pointer;
  }
</style>