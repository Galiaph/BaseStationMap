<template>
    <yandex-map :coords="coords" :zoom="zooms">
        <baseStationsArr v-for="(item) of baseStations" :key="item" :id="item.id" :show="item.show" :comment="item.bs_comment" :status="item.bs_status" :geoLocation="[item.bs_latitude, item.bs_longitude]" :name="item.bs_name" :color="item.bs_operator" />
    </yandex-map>
</template>

<script>
import baseStationsArr from './elements/BaseStation.vue'
export default {
    // eslint-disable-next-line
    name: 'Map',
    components: { 
        baseStationsArr
    },
    props: {
      baseStations: Object,
      operators: Object,
      coords: Array,
      zooms: Number
    },
    data: () => ({
    })
}
</script>

<style>
</style>