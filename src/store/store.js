import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        lng: 0,
        lat: 0,
    },
    getters : {
        lng: (state) => {
            return state.lng
        },
        lat: (state) => {
            return state.lat
        },
    },
    mutations: {
        set_lng : (state, newValue) => {
            state.lng = newValue
        },
        set_lat : (state, newValue) => {
            state.lat = newValue
        },
    }
})