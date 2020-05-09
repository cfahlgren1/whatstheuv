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
                <v-toolbar
                        dark
                        color="blue"
                >
            <v-autocomplete
                    v-model="select"
                    :loading="loading"
                    :items="locationResults"
                    :search-input.sync="search"
                    class="mx-8"
                    filled
                    flat
                    hide-no-data
                    hide-details
                    label="Search a location..."
                    solo-inverted
            ></v-autocomplete>
            <v-btn icon @click="overlay = false">
                <v-icon>mdi-close-thick</v-icon>
            </v-btn>
            </v-toolbar>
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
            return {
                overlay: false,
                key: "pk.eyJ1IjoiY2ZhaGxncmVuMSIsImEiOiJjazdiZWtqaDEwMDhyM2xvNTJoZDFxcjFqIn0.Chg6D1kZntCd3Gt3d0HxpA",
                locationResults: [],
                location: "",
                hidden: false,
                loading: false,
                select: null,
                search: null,
                place_name: '',
                geometry: null,
                coordinates: [],
            }
        },
        props:{
        },
        methods: {
            querySelections (searchText) {
                this.loading = true
                if (searchText.length >= 6) {
                    axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchText + '.json?access_token=' + this.key + '&autocomplete=true&proximity=' + this.lng + '%2C' + this.lat + '&country=us', {}).then(response => {
                        response.data.features.forEach(x => this.locationResults.push( {"text" : x.place_name, "value": {"lng": x.geometry.coordinates[0], "lat": x.geometry.coordinates[1], "name" : x.text}}));
                    });
                    this.loading = false;

                }
            },
            setLng(lng){
                this.$store.commit('set_lng', lng);
            },
            setLat(lat){
                this.$store.commit('set_lat', lat);
            },
            setLocation(location){
                this.$store.commit('set_location', location);
                console.log('Location changed to ' + location);
            },
        },
        watch: {
            search (val) {
                val && val !== this.select && this.querySelections(val);
            },
            select (){
                this.setLng(this.select.lng);
                this.setLat(this.select.lat);
                this.setLocation(this.select.name);
                this.overlay = !this.overlay;
            }
        },
        computed: {
            lng : function(){
                return this.$store.state.lng;
            },
            lat: function(){
                return this.$store.state.lat;
            },
        }
    }
</script>
<style>
</style>