<template>
  <Headers :operators="operatorGroup" @selected="select_oper($event)" @selected_st="select_st($event)" />
  <Map :baseStations="baseStationsGroup" :operators="operatorGroup" key="index" />
</template>

<script>
import Headers from '../components/Headers.vue'
import Map from '../components/Map.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Headers,
    Map
  },
  data: () => ({
    baseStationsGroup: [],
    //baseStationsGroup2: [],
    operatorGroup: [],
    appTitle: 'Base map',
    index: 0
  }),
  methods: {
      select_oper: function (event) {
        this.operatorGroup[event].change = !this.operatorGroup[event].change

        if (this.operatorGroup[event].change) {
          this.getBaseStationById(this.operatorGroup[event].id)
        } else {
          this.delBaseStationById(this.operatorGroup[event].id)
        }
      },
      select_st: function (event) {
        switch (event.st) {
          case '2g':
            this.operatorGroup[event.id-1].standart2G = this.operatorGroup[event.id-1].standart2G ? 0 : 1

            this.baseStationsGroup = this.baseStationsGroup.filter(element => {
              if ((element.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1) ||
                  (element.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1)) {
                return true
              }

              return false
            })
            break
          case '3g':
            this.operatorGroup[event.id-1].standart3G = this.operatorGroup[event.id-1].standart3G ? 0 : 1

            this.baseStationsGroup = this.baseStationsGroup.filter(element => {
              if ((element.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1) ||
                  (element.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1)) {
                return true
              }

              return false
            })
            break
          case '4g':
            // console.log(this.operatorGroup[event.id-1])
            this.operatorGroup[event.id-1].standart4G = this.operatorGroup[event.id-1].standart4G ? 0 : 1

            this.baseStationsGroup = this.baseStationsGroup.filter(element => {
              if ((element.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1) ||
                  (element.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1)) {
                return true
              }

              return false
            })

            // console.log(this.baseStationsGroup)

            break
        }
      },
      getOperators: async function () {
        const resp = await axios.get('http://192.168.0.160:5000/operators')
        this.operatorGroup = resp.data

        this.operatorGroup.forEach(item => {
           if (item.id === 1) {
            item.change = true
          } else {
            item.change = false
          }

          item.standart2G = 1
          item.standart3G = 1
          item.standart4G = 1
        })
      },
      getBaseStationById: async function (id) {
        const resp = await axios.get(`http://192.168.0.160:5000/bs/${id}`)
        this.baseStationsGroup = this.baseStationsGroup.concat(resp.data.filter(item => this.baseStationsGroup['bs_name'] === item.bs_name ? false : true ))
      },
      getBaseStations: async function () {
        const resp = await axios.get(`http://192.168.0.160:5000/bs/1`)
        this.baseStationsGroup = resp.data
      },
      delBaseStationById: function (id) {
        this.baseStationsGroup = this.baseStationsGroup.filter(item => item.bs_operator != id)
      },
      fillBaseStation: function (id) {
        this.baseStationsGroup.forEach(element => {
          if ((element.bs_4g === 1 && this.operatorGroup[id-1].standart4G === 1) /*||
              (element.bs_3g === 1 && this.operatorGroup[id-1].standart3G === 1) ||
              (element.bs_2g === 1 && this.operatorGroup[id-1].standart2G === 1)*/) {
            element.show = true
            return
          }

          element.show = false
        })
      }
    },
    // created: {
    // },
    mounted: async function () {
      try {
        this.getOperators()
        this.getBaseStationById(1)
      } catch (err) {
        console.error('error in headers mounted')
      }
    }
}
</script>

<style>
.ymap-container {
  height: 600px;
}
</style>