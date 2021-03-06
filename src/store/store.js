import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import VuexPersistence from 'vuex-persist'


export const store = new Vuex.Store({
    state: {
        lng: -118.2437,
        lat: 34.0522,
        location: '',
        metric: false,
    },
    getters : {
        lng: (state) => {
            return state.lng
        },
        lat: (state) => {
            return state.lat
        },
        location: (state) => {
            return state.location
        },
        metric: (state) => {
            return state.metric
        },
    },
    mutations: {
        set_lng : (state, newValue) => {
            state.lng = newValue
        },
        set_lat : (state, newValue) => {
            state.lat = newValue
        },
        set_location : (state, newValue) => {
            state.location = newValue
        },
        toggle_units : (state) => {
            state.metric = !state.metric
        },
    },
    plugins: [new VuexPersistence().plugin],
})