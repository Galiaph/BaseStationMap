<template>
  <Headers :operators="operatorGroup" :baseStations="baseStationsGroup" @selected="select_oper($event)" @selected_line="selecte_line($event)" @selected_st="select_st($event)" @searchBase="search_base($event)" />
  <div id="map" class="cnt">
    <Map :baseStations="baseStationsGroup" :operators="operatorGroup" :lines="linesGroup" :coords="coord" :zooms="zoom" @add="add_line($event)" @del="del_line($event)" @save="save_line($event)" />
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
    linesGroup: [],
    compareId: [],
    appTitle: 'Base map',
    coord: [46.63, 32.62],
    zoom: 12
  }),
  methods: {
      chZoom: function (event) {
        this.zoom = event
      },
      add_line: function (event) {
        this.linesGroup.push(event)
      },
      del_line: async function (event) {
        let item = null

        if (typeof(event.markerId) == 'number')
          item = event.markerId
        else
          item = this.compareId.find(el => el.markerId == event.markerId).id

        if (item) {
          this.linesGroup = this.linesGroup.filter(el => el.markerId != event.markerId)
          const resp = await axios.post('http://151.0.10.245:5000/del', {'id': item})

          if (resp.status != 200) {
            console.log('Server not saved line')
            console.log(resp)
          }
        }
      },
      save_line: async function (event) {
        const resp = await axios.post('http://151.0.10.245:5000/add', {'line': event})

        if (resp.status != 200) {
          console.log('Server not saved line')
          console.log(resp)
        } else {
          this.compareId.push({'id': resp.data.id, 'markerId': event.markerId})

        }
      },
      search_base: function (event) {
        const val = this.baseStationsGroup.filter(item => item.bs_name == event)[0]

        if (val) {
          this.coord = [val.bs_latitude, val.bs_longitude]
          this.zoom = 17
        }
      },
      selecte_line: function (event) {
        if (event)
          this.getLines()
        else
          this.linesGroup = []
      },
      select_oper: function (event) {
        this.operatorGroup[event].change = !this.operatorGroup[event].change

        if (this.operatorGroup[event].change) {
          this.getBaseStationById(this.operatorGroup[event].id)
        } else {
          this.delBaseStationById(this.operatorGroup[event].id)
          this.operatorGroup[event].standart2G = 1
          this.operatorGroup[event].standart3G = 1
          this.operatorGroup[event].standart4G = 1
        }
      },
      select_st: async function (event) {
        switch (event.st) {
          case '2g':
            this.operatorGroup[event.id-1].standart2G = this.operatorGroup[event.id-1].standart2G ? 0 : 1
            this.baseStationsGroup.forEach(item => {
              if (item.bs_operator == this.operatorGroup[event.id-1].id) {
                if ((item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1) ||
                    (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
                    (item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1)) {
                  item.show = true
                } else
                  item.show = false
              }
            })
            break
          case '3g':
            this.operatorGroup[event.id-1].standart3G = this.operatorGroup[event.id-1].standart3G ? 0 : 1
            this.baseStationsGroup.forEach(item => {
              if (item.bs_operator == this.operatorGroup[event.id-1].id) {
                if ((item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1) ||
                    (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
                    (item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1)) {
                  item.show = true
                } else
                  item.show = false
              }
            })
            break
          case '4g':
            this.operatorGroup[event.id-1].standart4G = this.operatorGroup[event.id-1].standart4G ? 0 : 1
            this.baseStationsGroup.forEach(item => {
              if (item.bs_operator == this.operatorGroup[event.id-1].id) {
                if ((item.bs_3g === 1 && this.operatorGroup[event.id-1].standart3G === 1) ||
                    (item.bs_2g === 1 && this.operatorGroup[event.id-1].standart2G === 1) ||
                    (item.bs_4g === 1 && this.operatorGroup[event.id-1].standart4G === 1)) {
                  item.show = true
                } else
                  item.show = false
              }
            })
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
          item.show = true
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
          item.show = true
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
      getLines: async function () {
        const resp = await axios.get(`http://151.0.10.245:5000/lines`)
        this.linesGroup = resp.data.map(el => {
          let item = {
              markerId: el.id,
              coords: el.geoCoords,
              options: {
                  strokeColor: el.stroke_color,
                  strokeWidth: el.stroke_width
              },
              properties: {
                  hintContent: el.hint
              },
              edit: false,
              drawing: false
          }

          return item
        })
      },
      delBaseStationById: async function (id) {
        this.baseStationsGroup = this.baseStationsGroup.filter(item => item.bs_operator != id)
      },
    },
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