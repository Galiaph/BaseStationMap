<template>
  <Headers :operators="operatorGroup" @selected="select_oper($event)" @selected_st="select_st($event)" @searchBase="search_base($event)" />
  <div id="map" class="cnt">
    <Map :baseStations="baseStationsGroup" :operators="operatorGroup" :coords="coord" :zooms="zoom" />
  </div>
</template>

<script>
import Headers from '../components/Headers.vue'
import Map from '../components/Map.vue'
import axios from 'axios'
// import { loadYmap } from 'vue-yandex-maps'

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

        // console.log(this.ymaps)

        // var myPolyline = new this.ymaps.Polyline([
        //     // Указываем координаты вершин.
        //     [55.80, 37.50],
        //     [55.80, 37.40],
        //     [55.70, 37.50],
        //     [55.70, 37.40]
        // ], {}, {
        //     // Задаем опции геообъекта.
        //     // Цвет с прозрачностью.
        //     strokeColor: "#00000088",
        //     // Ширину линии.
        //     strokeWidth: 4,
        //     // Максимально допустимое количество вершин в ломаной.
        //     editorMaxPoints: 6,
        //     // Добавляем в контекстное меню новый пункт, позволяющий удалить ломаную.
        //     editorMenuManager: function (items) {
        //         items.push({
        //             title: "Удалить линию",
        //             onClick: function () {
        //                 this.myMap.geoObjects.remove(myPolyline)
        //             }
        //         })
        //         return items
        //     }
        // })

        // // Добавляем линию на карту.
        // this.myMap.geoObjects.add(myPolyline)

        // // Включаем режим редактирования.
        // myPolyline.editor.startEditing()
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
      delBaseStationById: async function (id) {
        this.baseStationsGroup = this.baseStationsGroup.filter(item => item.bs_operator != id)
      },
    },
    mounted: async function () {
      // const settings = {
      //     apiKey: '28cc09a4-4cc8-4c92-bd21-2ee1e9d192b8',
      //     lang: 'ru_RU',
      //     coordorder: 'latlong',
      //     enterprise: false,
      //     version: '2.1'
      // }
      // await loadYmap(settings)
      // // eslint-disable-next-line
      // this.ymaps = ymaps
      // this.myMap = new this.ymaps.Map("map", {
      //     center: this.coord,
      //     zoom: this.zoom
      // }, {
      //     searchControlProvider: 'yandex#search'
      // })

      try {
        this.getOperators()
        // this.getBaseStationById(1)
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