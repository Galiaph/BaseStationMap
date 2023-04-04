<template>
  <ymap-marker v-if="show"
      :marker-id="name + id"
      :cluster-name="color"
      :coords="geoLocation"
      :balloon="{header: comment}"
      :icon="{content: name, color: getColor(color, status)}">
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
    color: Number,
    status: Number,
    show: Boolean
  },
  methods: {
    getColor: function (id, st) {
      if (st == '0')
          return 'red'
      switch (id) {
        case 1:
          return 'blue'
        case 2:
          return 'pink'
        case 3:
          return 'yellow'
        case 4:
          return 'green'
        case 5:
          return 'olive'
        default:
          return 'grey'
      }
    }
  }
}
</script>

<style scoped>
</style>