<template>
  <Headers :operators="operator_group" @selected="select_oper($event)" />
  <Map :baseStations="BaseStations_group" />
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
    BaseStations_group: [],
    operator_group: [],
    appTitle: 'Base map'
  }),
  methods: {
      select_oper: function (event) {
        this.operator_group[event].change = !this.operator_group[event].change

        if (this.operator_group[event].change) {
          this.getBaseStationById(event)
        } else {
          this.delBaseStationById(event)
        }
      },
      getOperators: async function () {
        const resp = await axios.get('http://192.168.0.160:5000/operators')
        this.operator_group = resp.data

        this.operator_group.forEach(item => {
           if (item.id === 1) {
            item.change = true
          } else {
            item.change = false
          }

          item.standart2G = true
          item.standart3G = true
          item.standart4G = true
        })
      },
      getBaseStationById: async function (id) {
        const resp = await axios.get(`http://192.168.0.160:5000/bs/${id}`)
        this.BaseStations_group = resp.data
      },
      getBaseStations: async function () {
        const resp = await axios.get(`http://192.168.0.160:5000/bs/1`)
        this.BaseStations_group = resp.data
      },
      delBaseStationById: function (id) {
        this.BaseStations_group.forEach(item => {
          if (item.id === id) {
            const index = this.BaseStations_group.indexOf(item)
            if (index > -1) {
              this.BaseStations_group.splice(index, 1)
            }
          }
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