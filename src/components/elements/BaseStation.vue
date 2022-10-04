<template>
  <ymap-marker
            marker-id="id"
            :coords="geoLocation"
            :balloon="{header: comment}"
            :icon="{content: name, color: getColor(color)}">
    </ymap-marker>
</template>

<script>
export default {
  name: 'BaseStation',
  props: {
    id: Number,
    geoLocation: Array,
    comment: String,
    name: String,
    color: Number
  },
  methods: {
    getColor: function (id) {
      switch (id) {
        case 1:
          return 'green'
        case 2:
          return 'yellow'
        case 3:
          return 'blue'
        case 4:
          return 'red'
        default:
          return 'pink'
      }
    }
  }
}
</script>

<style scoped>
</style>