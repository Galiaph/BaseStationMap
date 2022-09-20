<template>
<div>
    <yandex-map :coords="coords" :zoom="zoom">
        <ymap-marker v-for="item in baseStations" :key="item.id" :data="item"
            marker-id="item.id"
            :coords="[item.bs_latitude, item.bs_longitude]"
            cluster-name="1"
            :balloon="{header: item.bs_comment}"
            :icon="{content: item.bs_name, color: 'green'}">
        </ymap-marker>
    </yandex-map>
</div>
</template>

<script>
//import BaseStation from './components/elements/BaseStation.vue'
export default {
    // eslint-disable-next-line
    name: 'Map',
    components: {
    },
    props: {
      baseStations: Object
    },
    data: () => ({
        coords: [46.63, 32.62],
        zoom: 12
    })
}
</script>

<style>
</style>