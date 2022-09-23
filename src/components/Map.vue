<template>
    <yandex-map :coords="coords" :zoom="zoom">
        <ymap-marker v-for="(item, index) in baseStations" :key="index" :data="item"
            marker-id="item.id"
            :coords="[item.bs_latitude, item.bs_longitude]"
            cluster-name="1"
            :balloon="{header: item.bs_comment}"
            :icon="{content: item.bs_name, color: 'green'}">
        </ymap-marker>
    </yandex-map>
</template>

<script>
export default {
    // eslint-disable-next-line
    name: 'Map',
    components: { 
    },
    props: {
      baseStations: Object,
      operators: Object
    },
    data: () => ({
        coords: [46.63, 32.62],
        zoom: 12
    })
    // computed: {
    //     comBaseStations () {
    //         return this.baseStations.filter(element => element.show === true)
    //     }
    // }
}
</script>

<style>
</style>