<template>
    <v-app>
        <v-content>
            <SearchComponent/>
            <h1 class="display-3 has-text-centered location-header">{{location}}</h1>
            <br>
                <WeatherAnimation
                        v-animate-css="'bounceInDown'"
                        v-if="forecast !== 'Waiting...'"
                        :weather="forecast"
                        :night="isNight"/>
                <h1 v-animate-css="'bounceInDown'" id="currentTemp" v-on:click="toggle_units" class="display-3 has-text-centered">
                    <b>{{current_temp}}</b></h1>
            <v-container fluid>
                <sequential-entrance fromTop>
                    <h1 class="forecast-header display-1 has-text-left">Today's Highlights</h1>
                    <v-row>
                        <v-col cols="60" align="center">
                            <div class="ma-6">
                                <CircleComponent
                                        :sunrise="sunrise_time"
                                        :sunset="sunset_time"
                                        :cloud_percent="cloud_percent"/>
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
        <Footer/>
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
    import WeatherAnimation from "./components/WeatherAnimation";
    import Footer from "./components/Footer";
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
                title: 'Current UV Index Forecast and Weather Info | WhatsTheUV',
                description: 'Find the local UV Index forecast and other important weather information at WhatsTheUV!',
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
                locationiq_key: '83fb9d3ee4efa1',
                address: '',
                city: '',
                village: '',
                country_code: '',
                location_permission: false,
                clouds: 0,
                cloud_percent: 0,
            }
        },
        components: {
            WeatherAnimation,
            CircleComponent,
            SearchComponent,
            SunriseComponent,
            WindComponent,
            Footer,
        },
        mounted() {
            if ('geolocation' in navigator) {
                // if user hasn't searched anywhere, get their location and update location store
                this.$getLocation({enableHighAccuracy: false, timeout: Infinity, maximumAge: 0}).then(coordinates => {
                    this.setLng(coordinates.lng);
                    this.setLat(coordinates.lat);
                    axios.get('https://us1.locationiq.com/v1/reverse.php?key=' + this.locationiq_key + '&lat=' + this.lat + '&lon=' + this.lng + '&format=json', {}).then(response => {
                        if (typeof response.data.address.city !== 'undefined') { // if city value is available set location to city
                            this.setLocation(response.data.address.city);
                        } else if (typeof response.data.address.village !== 'undefined') { // if village value is available set location to village
                            this.setLocation(response.data.address.village);
                        } else {  // if state value is available set location to state
                            this.setLocation(response.data.address.state);
                        }
                        if (response.data.address.country_code !== "us" && this.metric === false) { // if user is located outside of the us, toggle units to metric
                            this.toggle_units();
                        }
                    });
                });
            }
            this.updateUV();
        },
        methods:
            {
                getLocalTime(unix_timestamp) {
                    var date = new Date(unix_timestamp * 1000);
                    return date.toLocaleTimeString().replace(/(.*)\D\d+/, '$1');
                },
                //set longitude in vuex
                setLng(lng) {
                    this.$store.commit('set_lng', lng);
                },
                //set latitude in vuex
                setLat(lat) {
                    this.$store.commit('set_lat', lat);
                },
                setLocation(location) {
                    this.$store.commit('set_location', location);
                },
                toggle_units() {
                    this.$store.commit('toggle_units'); // toggle units boolean
                    if (this.current_temp.endsWith('°F') && this.metric === true) { //check if temp is farenheit and metric is celsius
                        this.current_temp = ((parseInt(this.current_temp.substring(0, this.current_temp.length - 2)) - 32) * (5 / 9)).toFixed(0) + '°C';
                        this.wind_speed = parseFloat((this.wind_speed / 2.237).toFixed(2));
                    } else { // metric is true
                        this.current_temp = ((parseInt(this.current_temp.substring(0, this.current_temp.length - 2)) * (9 / 5)) + 32).toFixed(0) + '°F';
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
                        this.forecast = response.data.current.weather[0].main;
                        this.cloud_percent = response.data.daily[0].clouds * 0.01
                        if (this.metric) { // check if units are imperial or metric
                            this.current_temp = ((response.data.current.temp - 32) * (5 / 9)).toFixed(0) + '°C'; // convert farenheit to celsius
                            this.wind_speed = parseFloat((response.data.current.wind_speed / 2.237).toFixed(2));
                        } else {
                            this.current_temp = response.data.current.temp.toFixed(0) + '°F';
                            this.wind_speed = parseFloat(response.data.current.wind_speed.toFixed(2));
                        }
                    });
                },
            },
        computed: {
            lng: function () {
                return this.$store.state.lng;
            },
            lat: function () {
                return this.$store.state.lat;
            },
            location: function () {
                return this.$store.state.location;
            },
            metric: function () {
                return this.$store.state.metric;
            },
            isNight(){
                const d = new Date(Date.now());
                const sunset_time = new Date(this.sunset_time);
                const sunrise_time = new Date(this.sunrise_time); // Convert from UNIX UTC Time to Date Object
                if (d >=  sunset_time || d <= sunrise_time){
                    return true;
                }
                return false;
            },
        },
        watch: {
            lng() {
                this.updateUV();
            },
        },
        metaInfo() { //meta info for SEO
            return {
                title: this.title,
                meta: [
                    {vmid: 'description', name: 'description', content: this.description}
                ]
            }
        },
        created() {
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
        color: #2D4059;
        margin-top: 60px;
    }

    .location-header {
        background-color: #2D4059;
        padding: 1em;
        color: white;
    }

    .forecast-header {
        margin-left: 1em;
        font-weight: bold;
    }

    #currentTemp {
        margin-bottom: 30px;
    }

    #currentTemp:hover {
        cursor: pointer;
    }
</style>