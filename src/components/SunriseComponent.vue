<template>
    <v-card
            class="mx-auto"
            max-width="350"
            raised
    >
        <v-card-title primary-title class="headline justify-left">
            Sunrise & Sunset
        </v-card-title>
        <div class="text-center ma-2">
            <v-card-subtitle class="display-1">
                <v-icon x-large left :color="color">mdi-arrow-up-circle</v-icon>
                <b>{{sunrise}}</b>
            </v-card-subtitle>
            <v-card-subtitle class="display-1">
                <v-icon x-large left :color="color">mdi-arrow-down-circle</v-icon>
                <b>{{sunset}}</b>
            </v-card-subtitle>
        </div>
    </v-card>
</template>

<script>
    export default {
        name: "SunriseComponent",
        props:{
            sunrise: String,
            sunset: String,
        },
        data(){
            return{
                color : "#ffa45c",
            }
        }
    }
</script>

<style scoped>

</style>