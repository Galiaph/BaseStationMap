<template>
    <yandex-map :coords="coords" :zoom="zoom">
        <baseStationsArr v-for="(item, index) of baseStations" :show="item.show" :key="index" :id="item.id" :comment="item.bs_comment" :status="item.bs_status" :geoLocation="[item.bs_latitude, item.bs_longitude]" :name="item.bs_name" :color="item.bs_operator" />
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
      operators: Object
    },
    data: () => ({
        coords: [46.63, 32.62],
        zoom: 12
    })
}
</script>

<style>
</style>