<template>
    <section>
    <v-card height="80">
        <v-footer
                absolute
                class="font-weight-medium"
                color="#2D4059"
                height="150"
        >
            <v-col
                    class="text-center"
                    cols="12"
            >
                <p>Copyright {{ new Date().getFullYear() }} - <strong>WhatsTheUV</strong> - Built from the creators of <a href="https://bouncemap.com"> Bounce </a><p/>
            </v-col>
        </v-footer>
    </v-card>
    </section>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped>
    strong {
        color: #ffa45c;
    }
    .v-application a {
        color: #ffa45c;
    }
    p{
        color: white;
        font-weight: bold;
    }
    section{
        margin-top: 120px;
    }
</style>