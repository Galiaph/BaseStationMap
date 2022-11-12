<template>
  <Headers :operators="operatorGroup" @selected="select_oper($event)" @selected_st="select_st($event)" @searchBase="search_base($event)" />
  <div class="cnt">
    <Map :baseStations="baseStationsGroup" :operators="operatorGroup" :coords="coord" :zooms="zoom" />
  </div>
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
    operatorGroup: [],
    appTitle: 'Base map',
    coord: [46.63, 32.62],
    zoom: 12
  }),
  methods: {
      chZoom: function (event) {
        this.zoom = event
      },
      search_base: function (event) {
        const val = this.baseStationsGroup.filter(item => item.bs_name == event)[0]

        if (val) {
          this.coord = [val.bs_latitude, val.bs_longitude]
          this.zoom = 17
        }
      },
      select_oper: function (event) {
        this.operatorGroup[event].change = !this.operatorGroup[event].change

        if (this.operatorGroup[event].change) {
          this.getBaseStationById(this.operatorGroup[event].id)
        } else {
          this.delBaseStationById(this.operatorGroup[event].id)
        }
      },
      select_st: async function (event) {
        // const resp = await axios.get(`http://151.0.10.245:5000/bs/${this.operatorGroup[event.id-1].id}`)
        switch (event.st) {
          case '2g':
            this.operatorGroup[event.id-1].standart2G = this.operatorGroup[event.id-1].standart2G ? 0 : 1
            this.baseStationsGroup.forEach(item => {
              if ((item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1) ||
                  (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
                  (item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1)) {
                item.show = true
              } else
                item.show = false
            })
            // this.delBaseStationById(this.operatorGroup[event.id-1].id)
            // this.baseStationsGroup = this.baseStationsGroup.concat(resp.data.filter(item => {
            //   if ((item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1) ||
            //       (item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1) ||
            //       (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1)) {
            //     return true
            //   }

            //   return false
            // }))
            break
          case '3g':
            this.operatorGroup[event.id-1].standart3G = this.operatorGroup[event.id-1].standart3G ? 0 : 1
            this.baseStationsGroup.forEach(item => {
              if ((item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1) ||
                  (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
                  (item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1)) {
                item.show = true
              } else
                item.show = false
            })
            // this.delBaseStationById(this.operatorGroup[event.id-1].id)
            // this.baseStationsGroup = this.baseStationsGroup.concat(resp.data.filter(item => {
            //   if ((item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1) ||
            //       (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
            //       (item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1)) {
            //     return true
            //   }

            //   return false
            // }))
            break
          case '4g':
            this.operatorGroup[event.id-1].standart4G = this.operatorGroup[event.id-1].standart4G ? 0 : 1
            this.baseStationsGroup.forEach(item => {
              if ((item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1) ||
                  (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
                  (item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1)) {
                item.show = true
              } else
                item.show = false
            })
            // this.delBaseStationById(this.operatorGroup[event.id-1].id)
            // this.baseStationsGroup = this.baseStationsGroup.concat(resp.data.filter(item => {
            //   if ((item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1) ||
            //       (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
            //       (item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1)) {
            //     return true
            //   }

            //   return false
            // }))
            break
        }
      },
      getOperators: async function () {
        const resp = await axios.get('http://151.0.10.245:5000/operators')
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
          item.show = true
        })
      },
      getBaseStationById: async function (id) {
        const resp = await axios.get(`http://151.0.10.245:5000/bs/${id}`)
        this.baseStationsGroup = this.baseStationsGroup.concat(resp.data.filter(item => {
          if (item.bs_status) {
            item.bs_comment += '\nstandart: '
            if (item.bs_2g)
              item.bs_comment += '2G '
            if (item.bs_3g)
              item.bs_comment += '3G '
            if (item.bs_4g)
              item.bs_comment += '4G '
          }
          return this.baseStationsGroup['bs_name'] === item.bs_name ? false : true
        }))
      },
      getBaseStations: async function () {
        const resp = await axios.get(`http://151.0.10.245:5000/bs/1`)
        this.baseStationsGroup = resp.data

        this.baseStationsGroup.forEach(item => {
          if (item.bs_status) {
            item.bs_comment += '\nstandart: '
            if (item.bs_2g)
              item.bs_comment += '2G '
            if (item.bs_3g)
              item.bs_comment += '3G '
            if (item.bs_4g)
              item.bs_comment += '4G '
          }
        })
      },
      delBaseStationById: async function (id) {
        this.baseStationsGroup = this.baseStationsGroup.filter(item => item.bs_operator != id)
      },
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
#app {
  width: 100%;
}

.cnt {
  width: 100%;
  height: 93%;
  position: absolute;
}

.ymap-container {
  height: 100%;
}
</style>