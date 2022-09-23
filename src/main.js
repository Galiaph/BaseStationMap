import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import ymapPlugin from 'vue-yandex-maps'
import axios from 'axios'
import router from "./router";

const settings = {
    apiKey: '28cc09a4-4cc8-4c92-bd21-2ee1e9d192b8',
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1'
}

const errorInterceptor = async error => {
    // check if it's a server error
    if (!error.response) {
        console.error('**Network/Server error')
        console.log(error.response)
        return Promise.reject(error)
    }

    // all the other error responses
    switch (error.response.status) {
        case 400:
        console.error(error.response.status, error.message)
        break

        case 401: // authentication error, logout the user
        console.error(error.response.status, error.message)
        break

        case 403:
        console.error(error.response.status, error.message)
        break
        //
        // default:
        //   console.error(error.response.status, error.message)
    }
    return Promise.reject(error)
}

// axios.interceptors.request.use(authInterceptor)
axios.interceptors.response.use(undefined, errorInterceptor)

createApp(App).use(router).use(ymapPlugin, settings).mount('#app')
