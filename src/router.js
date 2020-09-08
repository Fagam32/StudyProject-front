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
        },
        {
            path: '/stations/:stationName',
            component: () => import('./views/Station')
        },
        {
            path: '/singup',
            component: () => import('./views/Singup')
        },
        {
            path: '/singin',
            component: () => import('./views/Singin')
        },
        {
            path: '/logout',
            component: () => import('./views/Logout')
        },
        {
            path: '/search',
            component: () => import('./views/Search')
        },
        {
            path: '/mytickets',
            component: () => import('./views/Tickets')
        },
        {
            path: '/settings',
            component: () => import('./views/Settings')
        },
        {
            path: '/trains/:trainName',
            component: () => import('./views/Train')
        }

    ]
})
