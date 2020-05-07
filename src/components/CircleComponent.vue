<template>
    <div class="CircleComponent">
        <v-card
                class="mx-auto ma-12"
                max-width="350"
                raised
        >
            <v-card-title primary-title class="headline justify-left">
                UV Index
            </v-card-title>
            <div justify="center" align="center" class="text-center ma-12">
                <v-progress-circular
                        :indeterminate="indeterminate"
                        :rotate="0"
                        :size="diameter"
                        :value="((uv/uv_max)*100)"
                        :width="25"
                        :color="circle_color"
                >
                    <div v-if="!isNight()" class="display-2">{{ uv }}</div>
                    <div v-else><v-icon x-large>mdi-weather-night</v-icon></div>
                </v-progress-circular>
            </div>
            <v-chip
                    class="ma-2"
                    color="gray"
                    text-color="black"
            >
                <v-icon left>mdi-white-balance-sunny</v-icon>
                {{uv_max}}
            </v-chip>
            <v-chip
                    class="ma-2"
                    color="gray"
                    text-color="black"
            >
                <v-icon left>mdi-clock-outline</v-icon>
                {{max_uv_time}}
            </v-chip>
        </v-card>

    </div>
</template>

<script>
    import VueGeolocation from 'vue-browser-geolocation';
    import Vue from 'vue'
    import axios from 'axios'
    import VueAxios from 'vue-axios'

    Vue.use(VueAxios, axios)
    Vue.use(VueGeolocation);

    export default {
        name: 'CircleComponent',
        data() {
            return {
                circle_color: '#ffa45c',
                max_uv_time: null,
                info : null,
                uv_max: 10,
                uv: 0,
                diameter: 180,
                indeterminate: false,
            }
        },
        components: {},
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
                isNight(){
                    var d = new Date(Date.now());
                    console.log(d);
                    return false;
                },

            },
        mounted() {
            this.updateUV()
        },
    }
</script>

<style>
    .v-progress-circular__info{
        font-size: 3em;
        color: #555;
    }
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
