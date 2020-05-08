<template>
    <v-card
            class="mx-auto"
            max-width="350"
            raised
    >
        <v-card-title primary-title class="headline justify-left">
            Wind Speed
        </v-card-title>
        <br>
            <v-card-subtitle class="display-2">
                <b>{{speed}}</b>  mph
            </v-card-subtitle>
            <v-card-title class="heading ma-3" align="left">
                <v-icon x-medium left :color="color">mdi-compass</v-icon>
                {{getCardinal(angle)}}
            </v-card-title>
    </v-card>
</template>

<script>
    export default {
        name: "WindComponent",
        data() {
            return{
                color: "blue",
            }
        },
        props: {
            speed: Number,
            angle: Number,
        },
        methods:{
            getCardinal(angle) {
                /**
                 * Customize by changing the number of directions you have
                 * We have 8
                 */
                const degreePerDirection = 360 / 8;

                /**
                 * Offset the angle by half of the degrees per direction
                 * Example: in 4 direction system North (320-45) becomes (0-90)
                 */
                const offsetAngle = angle + degreePerDirection / 2;

                return (offsetAngle >= 0 * degreePerDirection && offsetAngle < 1 * degreePerDirection) ? "N"
                    : (offsetAngle >= 1 * degreePerDirection && offsetAngle < 2 * degreePerDirection) ? "NE"
                        : (offsetAngle >= 2 * degreePerDirection && offsetAngle < 3 * degreePerDirection) ? "E"
                            : (offsetAngle >= 3 * degreePerDirection && offsetAngle < 4 * degreePerDirection) ? "SE"
                                : (offsetAngle >= 4 * degreePerDirection && offsetAngle < 5 * degreePerDirection) ? "S"
                                    : (offsetAngle >= 5 * degreePerDirection && offsetAngle < 6 * degreePerDirection) ? "SW"
                                        : (offsetAngle >= 6 * degreePerDirection && offsetAngle < 7 * degreePerDirection) ? "W"
                                            : "NW";
            }
        }
    }
</script>
<style scoped>
</style>