<template>
  <ymap-marker
      marker-id='data.marker_id'
      :balloon="{header: 'data.balloon'}"
      :icon="{color: 'getColor(data.operator_color)', content: 'data.content'}"
      :coords="data.coords"
      cluster-name="1">
    </ymap-marker>
</template>

<script>
export default {
  name: 'BaseStation',
  props: {
    data: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
