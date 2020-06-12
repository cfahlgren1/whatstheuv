<template>
    <div class="WeatherAnimation">
        <lottie v-if="rendered" :options="defaultOptions" :height="150" :width="150" v-on:animCreated="handleAnimation"/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import axios from 'axios';
    import VueAxios from 'vue-axios';
    import Lottie from 'vue-lottie';
    Vue.use(VueAxios, axios)

    export default {
        name: "WeatherAnimation",
        data() {
            return {
                url: '',
                rendered: false,
                defaultOptions: {
                    animationData: {},
                },
                animationSpeed: 0.5,
            }
        },
        props: {
            weather: String,
            night: Boolean,
        },
        components: {
            'lottie': Lottie
        },
        methods: {
            handleAnimation: function (anim) {
                this.anim = anim;
                this.anim.setSpeed(this.animationSpeed);
            },
            stop: function () {
                this.anim.stop();
            },

            play: function () {
                this.anim.play();
            },

            pause: function () {
                this.anim.pause();
            },

            onSpeedChange: function () {
                this.anim.setSpeed(this.animationSpeed);
            }
        },
        created() {
            if (this.weather === 'Rain' || this.weather === 'Drizzle'){
                this.url = 'https://gist.githubusercontent.com/cfahlgren1/e0d0398d5e29a5c57de5881bf4e3bc85/raw/462c181fb765884ec5ec4e29f29899642c75337b/Rain'
            }
            else if(this.weather === 'ThunderStorm'){
                this.url = 'https://gist.githubusercontent.com/cfahlgren1/e150d79fd677ae37d46b351b4cecfa10/raw/03719e7c5fbff3af69ddedaf6b19417b49015b25/Thunderstorm.json'
            }
            else if(this.weather === 'Clear'){
                this.url = 'https://gist.githubusercontent.com/cfahlgren1/5196d66876e4f4b3ba5dbd08944f8efc/raw/944a7c67fd2ed518b4dc70d69f975cb54deb25ef/Clear'
            }
            else if(this.weather === 'Clouds'){
                this.url = 'https://gist.githubusercontent.com/cfahlgren1/d28557d53591b0e695c90fe3fc8ab5fa/raw/756b0bb7e118a68ecf4a6339592152890ce02ae2/Clouds'
            }
            else if(this.weather === 'Mist'){
                this.url = 'https://gist.githubusercontent.com/cfahlgren1/a71c4c36b5b9d65054465f182029c91e/raw/361459446fcb1367383a50057ab7781cb6f8ddf1/Mist'
            }

            if (this.night){
                this.url = 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/night-weather/night-weather.json'
            }
            axios.get(this.url).then(response => {
               this.defaultOptions.animationData = response.data;
               this.rendered = true;
           })
        },
    }
</script>

<style scoped>

</style>