import Vue from 'vue';
import Vuex from "vuex";
import axios from 'axios';
import router from "@/router";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        message: '',
        loggedIn: false,
        token: '',
        roles: []
    },
    mutations: {
        login(state, payload) {
            state.loggedIn = true
            state.token = payload.jwtToken
            for (let i = 0; i < payload.roles.length; i++)
                state.roles.push(payload.roles[i])
            state.message = ''
        },
        logout(state) {
            state.loggedIn = false
            state.token = ''
            state.roles = []
        },
        badLogin(state) {
            state.message = "Bad credentials"
        }
    },
    actions: {
        login(context, payload) {
            axios.post("http://localhost:8000/auth/singin", {
                username: payload.username,
                password: payload.password
            }).then(response => {
                router.push({path: '/'})
                console.log(response)
                context.commit('login', response.data)
            }).catch(() => {
                context.commit('badLogin')
            })
        },
        logout(context) {
            context.commit('logout')
        }
    },
    getters: {
        token(state) {
            return "Bearer " + state.token;
        },
        logged(state) {
            return state.loggedIn
        },
        roles(state) {
            return state.roles
        },
        message(state) {
            return state.message
        }
    },
    plugins: [createPersistedState()]
})