<template>
  <Headers :operators="operatorGroup" :baseStations="baseStationsGroup" :lines="linesGroup" :providers="providers" :districts="districts" @selected="select_oper($event)" @selected_p="select_prov($event)" @selected_d="select_dist($event)" @selected_line="selecte_line($event)" @selected_st="select_st($event)" @selected_ln="select_ln($event)" @searchBase="search_base($event)" />
  <div id="map" class="cnt">
    <Map :baseStations="baseStationsGroup" :operators="operatorGroup" :lines="linesGroup2" :uplinks="uplinks" :coords="coord" :zooms="zoom" :providers="providers" :providers_geo="providers_geo" :districts_geo="districts_geo" @add="add_line($event)" @del="del_line($event)" @save="save_line($event)" @mark="add_marker($event)" @delmark="del_mark($event)" @savemark="save_mark($event)"/>
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
    linesGroup2: [],
    compareId: [],
    uplinks: [],
    districts: [],
    providers: [],
    providers_geo: [],
    districts_geo: [],
    appTitle: 'Base map',
    coord: [46.63, 32.62],
    zoom: 12
  }),
  methods: {
      chZoom: function (event) {
        this.zoom = event
      },
      add_line: function (event) {
        this.linesGroup2.push(event)
      },
      add_marker: function (event) {
        this.providers_geo.push(event)
      },
      del_line: async function (event) {
        let item = this.compareId.find(el => el.markerId == event.markerId)
        
        const resp = await axios.post('http://151.0.10.245:5000/delline', {'id': item ? item.id : event.markerId})

        if (resp.status != 200) {
          console.log('Server not saved line')
          console.log(resp)
        } else {
          if (item) {
            this.linesGroup = this.linesGroup.filter(el => el.markerId != item.id)
            this.linesGroup2 = this.linesGroup2.filter(el => el.markerId != item.id)
            this.compareId = this.compareId.filter(el => el.id != item.id)
          }

          this.linesGroup = this.linesGroup.filter(el => el.markerId != event.markerId)
          this.linesGroup2 = this.linesGroup2.filter(el => el.markerId != event.markerId)
        }
      },
      del_mark: async function (event) {
        let item = this.compareId.find(el => el.markerId == event.markerId)
        
        const resp = await axios.post('http://151.0.10.245:5000/delmark', {'id': item ? item.id : event.markerId})

        if (resp.status != 200) {
          console.log('Server not saved line')
          console.log(resp)
        } else {
          if (item) {
            this.providers_geo = this.providers_geo.filter(el => el.markerId != item.id)
            this.compareId = this.compareId.filter(el => el.id != item.id)
          }

          this.providers_geo = this.providers_geo.filter(el => el.markerId != event.markerId)
        }
      },
      save_line: async function (event) {
        let item = this.compareId.find(el => el.markerId == event.markerId)

        const resp = await axios.post('http://151.0.10.245:5000/addline', {'line': {
                        markerId: item ? item.id : event.markerId,
                        coords: event.coords,
                        options: event.options,
                        properties: event.properties
                    }})

        if (resp.status != 200) {
          console.log('Server not saved line')
          console.log(resp)
        } else {
          if (!item)
            this.compareId.push({'id': resp.data.id, 'markerId': event.markerId})
        }
      },
      save_mark: async function (event) {
        let item = this.compareId.find(el => el.markerId == event.markerId)

        const resp = await axios.post('http://151.0.10.245:5000/addmark', {'mark': {
                        markerId: item ? item.id : event.markerId,
                        coords: event.coords,
                        provider: event.provider,
                        properties: event.properties
                    }})

        if (resp.status != 200) {
          console.log('Server not saved line')
          console.log(resp)
        } else {
          if (!item)
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
        if (event) {
          this.getLines()
          this.getUplinks()
        } else {
          this.linesGroup = this.linesGroup2 = []
          this.uplinks = []
        }
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
      select_prov: function (event) {
        this.providers[event].change = !this.providers[event].change

        this.providers_geo.forEach(el => { if (el.provider == this.providers[event].id) el.show = this.providers[event].change })
      },
      select_dist: async function (id) {
        if (this.districts.find(el => el.id == id).change) {
          this.districts_geo = []
          this.districts.forEach(el => el.change = false )
          return
        }
        const resp = await axios.get(`http://151.0.10.245:5000/ds/${id}`)
        this.districts.forEach(el => { el.change = el.id == id ? true : false })
        this.districts_geo = resp.data[0].geoCoords.map((el, index) => {
          let item = {
              markerId: index,
              coords: el[0].map(x => {
                return [x[1], x[0]]
              }),
              properties: {
                  description: 'Бериславский район',
                  fill:'#ff931e',
                  fillOpacity: 0.3,
                  stroke: '#e6761b',
                  strokeWidth: 2,
                  strokeOpacity: 0.9
              }
          }

          return item
        })
      },
      select_ln: function (event) {
        if (this.linesGroup2.length == 1 && this.linesGroup2[0].markerId == event) {
          this.linesGroup.forEach(el => el.selected = false )
          this.linesGroup2 = this.linesGroup
        } else {
          this.linesGroup.forEach(el => { if (el.markerId == this.linesGroup2[0].markerId) el.selected = false })
          this.linesGroup2 = this.linesGroup.filter(el => {
            if (el.markerId == event) {
              el.selected = true
              return el
            }
          })
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
          //  if (item.id === 1) {
          //   item.change = true
          // } else {
          //   item.change = false
          // }

          item.standart2G = 1
          item.standart3G = 1
          item.standart4G = 1
          item.show = true
        })
      },
      getProviders: async function () {
        const resp = await axios.get('http://151.0.10.245:5000/providers')
        this.providers = resp.data

        this.operatorGroup.forEach(item => {
            item.change = false
        })
      },
      getDistricts: async function () {
        const resp = await axios.get('http://151.0.10.245:5000/districts')
        this.districts = resp.data

        this.districts.forEach(item => {
            item.change = false
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
      getColorMarker: function(item, status) {
        if (!status)
          return 'islands#redMedicalCircleIcon'
        switch (item) {
          case 1:
            return 'islands#violetRapidTransitCircleIcon'
          case 2:
            return 'islands#darkOrangeHydroCircleIcon'
          case 3:
            return 'islands#oliveLeisureCircleIcon'
          case 4:
            return 'islands#brownWorshipCircleIcon'
          case 5:
            return 'islands#nightZooCircleIcon'
          case 6:
            return 'islands#pinkRunCircleIcon'
          case 7:
            return 'islands#yellowCircusCircleIcon'
          case 8:
            return 'islands#redParkingCircleIcon'
          case 9:
            return 'islands#blueAttentionCircleIcon'
          case 10:
            return 'islands#yellowCircusCircleIcon'
        }

        return 'islands#grayStarCircleIcon'
      },
      getMarks: async function () {
        const resp = await axios.get(`http://151.0.10.245:5000/marks`)
        this.providers_geo = resp.data.map(el => {
          let item = {
              markerId: el.id,
              coords: [el.latitude, el.longitude],
              provider: el.provider,
              options: {
                  preset: this.getColorMarker(el.provider, el.status)
              },
              properties: {
                  hintContent: this.providers[el.provider-1].provider_name,
                  balloonContentHeader: el.balloon
              },
              show: false
          }

          return item
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
              drawing: false,
              selected: false
          }

          return item
        })

         this.linesGroup2 =  this.linesGroup
      },
      getUplinks: async function() {
        const resp = await axios.get(`http://151.0.10.245:5000/uplinks`)
        this.uplinks = resp.data.map(el => {
          let item = {
              id: el.id,
              coords: [el.bs_latitude, el.bs_longitude],
              providers: el.providers
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
        // this.getBaseStationById(1)
        await this.getProviders()
        this.getMarks()
        this.getDistricts()
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
.dropdown-con {
  position: absolute;
}
.dropdown-menu-con {
  display: block;
}
</style>