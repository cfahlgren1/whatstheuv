module.exports = {
    "transpileDependencies": [
        "vuetify",
        "vue-persist"
    ],
    publicPath: process.env.NODE_ENV === 'production'
        ? '/whatstheuv/'
        : '/'
}