<template>
    <div class="CircleComponent">
        <v-card
                class="mx-auto ma-12"
                max-width="350"
                raised
        >
            <v-card-title primary-title class="headline justify-left">
                UV Index <v-btn class="justify-right" @click.stop="dialog=true" icon color="gray"><v-icon>mdi-information-outline</v-icon></v-btn>
            </v-card-title>
            <v-sheet
                    class="v-sheet--offset mx-auto"
                    color="white"
                    elevation="0"
                    max-width="calc(100% - 32px)"
            >
                <h1 style="margin-bottom: 1em; font-weight: bold;">Forecast</h1>
                <v-sparkline v-if="uv_max >= 11"
                        :value="data"
                        :labels="labels"
                        :gradient="['purple', 'red', 'orange', 'yellow', 'green']"
                        color="#555555"
                        line-width="7"
                        padding="16"
                        label-size="13"
                        auto-drawn
                        smooth
                />
                <v-sparkline v-else
                             :value="data"
                             :labels="labels"
                             :gradient="['red', 'orange', 'yellow', 'green']"
                             color="#555555"
                             line-width="7"
                             padding="16"
                             label-size="13"
                             auto-draw
                             smooth
                />
            </v-sheet>
            <div justify="center" align="center" class="text-center ma-12">
                <h1 style="margin-bottom: 1em; font-weight: bold;">Current</h1>
                <v-progress-circular
                        :indeterminate="indeterminate"
                        :rotate="0"
                        :size="diameter"
                        :value="((uv/uv_max)*100)"
                        :width="25"
                        :color="circle_color"
                >
                    <h1 v-if="!isNight()" class="display-2">{{ uv }}</h1>
                    <div v-else><v-icon :size="60">mdi-weather-night</v-icon></div>
                </v-progress-circular>
            </div>
            <v-chip
                    class="ma-2"
                    color="blue"
                    text-color="white"
            >
                <v-icon left>mdi-white-balance-sunny</v-icon>
                Max: {{uv_max}}
            </v-chip>
            <v-chip
                    class="ma-2"
                    color="blue"
                    text-color="white"
            >
                <v-icon left>mdi-clock-outline</v-icon>
                {{max_uv_time}}
            </v-chip>
        </v-card>
        <v-dialog
                v-model="dialog"
                max-width="450"
        >
            <v-card>
                <v-card-title class="headline">UV Index Information</v-card-title>

                <v-card-text>
                    <ul class="justify-left">
                        <li><v-icon left color="green">mdi-circle</v-icon>0-2: Low</li>
                        <li><v-icon left color="yellow">mdi-circle</v-icon>3-5: Moderate</li>
                        <li><v-icon left color="orange">mdi-circle</v-icon>6-7: High</li>
                        <li><v-icon left color="red">mdi-circle</v-icon>8-10: Very High</li>
                        <li><v-icon left color="purple">mdi-circle</v-icon>11+: Extreme</li>
                    </ul>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="blue"
                            text
                            @click="dialog = false"
                    >
                        Cool!
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import VueGeolocation from 'vue-browser-geolocation';
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import SequentialEntrance from 'vue-sequential-entrance';
    import 'vue-sequential-entrance/vue-sequential-entrance.css';

    Vue.use(SequentialEntrance);
    Vue.use(VueAxios, axios)
    Vue.use(VueGeolocation);

    export default {
        name: 'CircleComponent',
        data() {
            return {
                circle_color: '#ffa45c',
                max_uv_time: null,
                uv_time: null,
                info : null,
                uv_max: 0,
                uv: 0,
                diameter: 180,
                indeterminate: false,
                dialog: false,  // variable for modal
                data: [],   // uv data for vuetify sparkline
                labels: [], // labels for vuetify sparkline
            }
        },
        components: {},
        props: {
            sunset: Number,
            sunrise: Number,
            cloud_percent: Number,
        },
        methods :
            {
                updateUV() {

                    //Date of today for use in Get Request
                    var d = new Date(Date.now());
                    var n = d.toISOString();

                    //Get current UV Data from OpenUV
                    axios.get('https://api.openuv.io/api/v1/uv?lat=' + this.lat + '&lng=' + this.lng + '&dt=' + n, {
                        params: {},
                        headers: {'x-access-token': '65d941e9fdd0669b2f79c535acbf933b'}
                    }).then(response => {
                        this.info = response.data.result;
                        this.uv = parseFloat(response.data.result['uv'].toFixed(1));
                        this.uv_max = parseFloat(response.data.result['uv_max'].toFixed(1));
                        this.max_uv_time = new Date(response.data.result['uv_max_time']).toLocaleTimeString('en-US').replace(/(.*)\D\d+/, '$1');
                        this.setAdjustedUV() // adjust the uv according to cloud cover
                    });
                    var skip = true;
                    //Get daily UV forecast from OpenUV
                    axios.get('https://api.openuv.io/api/v1/forecast?lat=' + this.lat + '&lng=' + this.lng + '&dt=' + n, {
                        params: {},
                        headers: {'x-access-token': '65d941e9fdd0669b2f79c535acbf933b'}
                    }).then(response => {
                        this.data = [];
                        this.labels =[];
                        this.info = response.data.result;
                        console.log(this.info);
                        this.info.forEach(x => {
                            if (skip) {
                                this.data.push(parseInt(x.uv.toFixed(0)));
                                this.labels.push(new Date(x.uv_time).getHours() > 12 ? new Date(x.uv_time).getHours() - 12 + "PM" : (new Date(x.uv_time).getHours() + "AM").replace('12AM', '12PM'));
                            }
                            skip = !skip;
                        });
                    });

                },
                isNight(){
                    var d = new Date(Date.now());
                    var sunset_time = new Date(this.sunset * 1000);
                    var sunrise_time = new Date(this.sunrise * 1000); // Convert from UNIX UTC Time to Date Object
                    if (d >=  sunset_time | d <= sunrise_time){
                        this.circle_color = "#5D5D5A";
                        return true;
                    }
                    this.circle_color = '#ffa45c';
                    return false;
                },
                setAdjustedUV(){
                    if (this.cloud_percent >= 0.4 && this.cloud_percent < 0.75) {
                        this.uv_max = (this.uv_max * 0.87).toFixed(1);
                        this.uv = (this.uv * 0.87).toFixed(1);
                    }
                    else if(this.cloud_percent >= 0.75){
                        this.uv_max = (this.uv_max * 0.60).toFixed(1);
                        this.uv = (this.uv * 0.60).toFixed(1);
                    }
                }
            },
        mounted() {
            this.updateUV()
        },
        computed: {
            lng : function(){ return this.$store.state.lng},
            lat : function(){ return this.$store.state.lat},
        },
        watch: {
            lat(){
                this.updateUV();
            }
        },
    }
</script>

<style>
    ul{
        justify-items: left;
        margin-right: auto;
        text-align: left;
        font-size: 1.5em;
    }
    li{
        padding: 10px;
        font-weight: bold;
    }
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
