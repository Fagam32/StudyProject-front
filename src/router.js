import Vue from 'vue'
import VueRouter from "vue-router"
import Home from "@/views/Home";
import Edges from "@/views/Edges";
import Trains from "@/views/Trains";

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/stations',
            component: () => import('./views/Stations')
        },
        {
            path: '/edges',
            component: Edges
        },
        {
            path: '/trains',
            component: Trains
        }
    ]
})