import ax from 'axios'

export const axios = ax.create({
    baseURL: "http://localhost:8000/"
})

export default {
    install (Vue) {
        Vue.prototype.$axios = axios
    }
}