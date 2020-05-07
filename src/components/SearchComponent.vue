<template>
    <div class="search">
        <v-fab-transition>
            <v-btn
                    v-show="!hidden"
                    color="rgb(255, 164, 92)"
                    fab
                    light
                    medium
                    top
                    right
                    absolute
                    @click="overlay=!overlay"
            >
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
        </v-fab-transition>
        <v-overlay
                :absolute="false"
                :opacity="1"
                :value="overlay"
        >
            <v-btn
                    color="primary"
                    @click="overlay = false"
            >
                Hide Overlay
            </v-btn>
        </v-overlay>
    </div>
</template>

<script>
    import axios from 'axios'
    import VueAxios from 'vue-axios'
    import Vue from "vue";
    Vue.use(VueAxios, axios)

    export default {
        name: "SearchComponent",
        data(){
            return{
                overlay: false,
                key: "pk.eyJ1IjoiY2ZhaGxncmVuMSIsImEiOiJjazdiZWtqaDEwMDhyM2xvNTJoZDFxcjFqIn0.Chg6D1kZntCd3Gt3d0HxpA",
                geocodeResults : null,
                message: "",
                hidden: false,
            }
        },
        props:{
            lat : Number,
            lng : Number,
        },
        methods: {
            getGeocode(searchText){
                if (searchText.message.length >= 6) {
                    console.log(searchText.message);
                    axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchText.message + '.json?access_token=' + this.key + '&autocomplete=true&proximity=' + this.lng + '%2C' + this.lat, {}).then(response => {
                        this.geocodeResults = response.data.features
                    });
                }
            }},
        mounted() {},
    }
</script>

<style>
</style>