<template>
    <div class="search">
        <div class="search-icon">
            <i v-on:click="active = !active" class="fa fa-search search-btn"></i>
        </div>
        <div v-if="active" v-on:click="active = !active" class="search-overlay active">
        </div>
        <div v-if="active" class="search-popup active">
            <form class="search-form">
                <div class="form-group">
                    <input v-on:keypress="getGeocode({message})" v-model="message" id="search" type="text" class="form-control" placeholder="Search....">
                    <button class="submit-btn"><i class="fa fa-search"></i></button>
                </div>
            </form>
            <div class="autocomplete-item">
                <div v-for="item in geocodeResults" v-bind:key="item.id">
                    <a href="#" class="autocomplete-text">
                        {{ item.text }}
                    </a>
                    <br>
                </div>
            </div>
        </div>
        <h2>{{geocodeResults}}</h2>
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
                active: false,
                key: "pk.eyJ1IjoiY2ZhaGxncmVuMSIsImEiOiJjazdiZWtqaDEwMDhyM2xvNTJoZDFxcjFqIn0.Chg6D1kZntCd3Gt3d0HxpA",
                geocodeResults : null,
                message: "",
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
    @import url("https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
    body{
        margin:0;
    }
    *{
        box-sizing: border-box;
        font-family: 'Roboto', sans-serif;
    }
    .autocomplete-text{
        color: #555;
        background: white;
        cursor: pointer;
        margin-right: 2.5em;
        padding: 0.2em 8em 0.5em 8em;
        font-size: 19px;
        text-decoration: none;
        margin-bottom: 0.5em;
    }
    .autocomplete-text:hover{
        background: #ffa45c;
        color: white;
    }

    .search-icon{
        position: absolute;
        left: 90%;
        top: 5%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .search-icon .fa{
        height: 40px;
        width: 40px;
        background-color: #5d5d5a;
        color:#ffffff;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        cursor: pointer;
    }

    .search-overlay{
        position: fixed;
        left:0;
        top:0;
        right:0;
        bottom:0;
        background-color: #5d5d5a;
        opacity: 0;
        visibility: hidden;
        transition: all .3s ease-in;
        cursor:url('../assets/close.png'),auto;
    }
    .search-overlay.active {
        visibility: visible;
        opacity: 1;
        z-index: 10;
    }

    .search-popup{
        position: absolute;
        left:50%;
        top:50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 600px;
        z-index: 11;
        opacity: 0;
        visibility: hidden;
        transition: all .3s ease-in;
    }
    .search-popup.active{
        visibility: visible;
        opacity: 1;
        z-index: 11;
    }
    .search-popup .form-group{
        position: relative;
    }
    .search-popup .form-control{
        width: 100%;
        height: 60px;
        border:none;
        padding:0 100px 0 30px;
        font-size:18px;
        border-radius: 30px;
        color:#ffa45c;
        border: 4px solid;
    }
    .search-popup .submit-btn{
        background-color: #ffa45c;
        font-size:18px;
        width: 70px;
        height: 60px;
        color:#ffffff;
        border:none;
        position: absolute;
        right:0;
        top:0;
        border-radius: 0 30px 30px 0;
    }
    .search-popup .submit-btn:focus{
        outline: none;
    }
    .search-popup .form-control:focus{
        outline: none;
    }
    /*responsive*/
    @media(max-width:650px){
        .search-popup{
            width: 100%;
        }
    }
</style>