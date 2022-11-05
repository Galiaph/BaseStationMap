import { createStore } from 'vuex'
import axios from 'axios'
import moment from 'moment'

// cn: "Вадим Шемятин"
// expires: "2022-10-28 20:51:05+0300"
// login: "vshemyatin"
// sip: null
// token: "<L3[cN/8<T@r5Xi06VDMASl^$FD5Um!J$K2*<Nc&%7@K=9&Vb4)AP1jrZ(iQ(k7Xk6R2I\\DJ1u3Fm#LtQ`Br-dS5Y;<SO?*I]bgp#?MD%=gMYe'di"

export default createStore({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    expires: Number(localStorage.getItem('expires')) || 0,
    userName: localStorage.getItem('user_name') || '',
    login: localStorage.getItem('login') || ''
  },
  mutations: {
    auth_success (state, payload) {
      state.status = 'success'
      state.token = payload.token
      state.expires = payload.expires
      state.userName = payload.userName
      state.login = payload.login
      localStorage.setItem('token', state.token)
      localStorage.setItem('expires', state.expires)
      localStorage.getItem('user_name', state.userName)
      localStorage.setItem('login', state.login)
    },
    auth_error (state) {
      state.status = 'error'
      localStorage.removeItem('token')
      localStorage.removeItem('expires')
    },
    logout (state) {
      state.status = ''
      state.token = ''
      state.expires = 0
      state.userName = ''
      state.login = ''
      localStorage.removeItem('token')
      localStorage.removeItem('expires')
    }
  },
  actions: {
    async login ({ commit }, user) {
      const formData = new FormData()
      formData.append('login', user.username)
      formData.append('password', user.password)
      const resp = await axios.post(
        'http://151.0.10.245:5000/token',
        formData
      )
      const token = resp.data.token
      const expires = moment(resp.data.expires, 'YYYY-MM-DD HH:mm:ssZ').unix()
      const userName = resp.data.cn
      const login = resp.data.login
      axios.defaults.headers.common.Authorization = 'Darsan2 ' + token
      commit('auth_success', {
        token,
        expires,
        userName,
        login
      })
    },
    async logout ({ commit }) {
      delete axios.defaults.headers.common.Authorization
      commit('logout')
      // localStorage.removeItem('token')
    }
  },
  getters: {
    isLoggedIn: state => {
      if (state.token === '' || state.expires === 0 || (new Date().getTime() > (state.expires - 300) * 1000)) {
        return false
      }

      return true
    },
    authStatus: state => state.status,
    getToken: state => state.token,
    getLogin: state => state.login
  },
  modules: {
  }
})
