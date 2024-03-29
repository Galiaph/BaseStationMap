<script>
/* eslint-disable */
import { h } from 'vue';
import * as utils from '../../vue-yandex-maps/utils.js';

const MARKER_TYPES = [
  'placemark',
  'polyline',
  'rectangle',
  'polygon',
  'circle',
];

const defaultMarkerEvents = [
  'balloonclose',
  'balloonopen',
  'click',
  'geometrychange',
  'editorstatechange',
  'contextmenu',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'hintclose',
  'hintopen',
  'mouseenter',
  'mouseleave',
];

export default {
  name: 'Test',
  inject: ['useObjectManager', 'addMarker', 'deleteMarker', 'compareValues', 'makeComponentBalloonTemplate'],
  props: {
    coords: Array,
    hintContent: String,
    icon: Object,
    balloon: Object,
    edit: {
      type: Boolean,
      default: false
    },
    drawing: {
      type: Boolean,
      default: false
    },
    markerType: {
      type: String,
      validator(val) {
        return MARKER_TYPES.includes(val.toLowerCase());
      },
      default: 'placemark',
    },
    markerFill: Object,
    markerStroke: Object,
    clusterName: [String, Number],
    circleRadius: {
      validator(val) {
        return !Number.isNaN(val);
      },
      default: 1000,
    },
    balloonTemplate: String,
    markerId: {
      type: [String, Number],
      required: true,
    },
    properties: Object,
    options: Object,
    balloonComponentProps: {
      type: Object,
      default: () => ({}),
    },
    markerEvents: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({ unwatchArr: [] }),
  render() {
    return this.$slots.balloon && h('div', { style: 'display: none;' }, [this.$slots.balloon()]);
  },
  mounted() {
    Object.keys(this.$props).forEach((prop) => {
      if (prop === 'balloonComponentProps' || prop === 'edit' || prop === 'drawing' || prop === 'coords' || prop === 'options' || prop === 'properties') return;
      this.unwatchArr.push(this.$watch(
        prop,
        (newVal, oldVal) => this.compareValues({
          newVal,
          oldVal,
          marker: this.defineMarker(),
        }),
      ));
    });

    const temp = this.defineMarker()

    this.unwatchArr.push(this.$watch('edit', (newVal, oldVal) => {
      if (oldVal) {
        temp.editor.stopEditing()
      } else {
        temp.editor.startEditing()
      }
    }))

    this.unwatchArr.push(this.$watch('drawing', (newVal, oldVal) => {
      if (!oldVal) {
        temp.editor.startDrawing()
      }
    }))

    this.unwatchArr.push(this.$watch('coords', (newVal, oldVal) => {
      temp.geometry.setCoordinates(newVal)
    }))

    this.unwatchArr.push(this.$watch('options', (newVal, oldVal) => {
      temp.options.set({
        strokeColor: newVal.strokeColor,
        strokeWidth: newVal.strokeWidth,
        preset: newVal.preset
      })
    }))

    this.unwatchArr.push(this.$watch('properties', (newVal, oldVal) => {
      temp.properties.set('hintContent', newVal.hintContent)
    }))

    this.addMarker(temp)
  },
  methods: {
    defineMarker() {
      const marker = {
        markerId: this.markerId,
        markerType: this.markerType || 'placemark',
        coords: utils.setCoordsToNumeric(this.coords),
        hintContent: this.hintContent,
        markerFill: this.markerFill,
        circleRadius: +this.circleRadius,
        clusterName: this.clusterName,
        markerStroke: this.markerStroke,
        balloon: this.balloon,
        properties: this.properties,
        options: this.options,
        balloonOptions: {},
      };

      let balloonContentLayout = null;

      if (this.balloonTemplate) {
        balloonContentLayout = ymaps.templateLayoutFactory
          .createClass(this.balloonTemplate);
      }

      if (this.$slots.balloon) {
        balloonContentLayout = ymaps.templateLayoutFactory
          .createClass(this.$slots.balloon()[0].elm.outerHTML);
      }

      if (this.makeComponentBalloonTemplate) {
        balloonContentLayout = this.makeComponentBalloonTemplate(this, marker);
      }

      if (balloonContentLayout != null) {
        marker.balloonOptions.balloonContentLayout = balloonContentLayout;
      }

      if (this.icon && ['default#image', 'default#imageWithContent'].includes(this.icon.layout)) {
        marker.iconContent = this.icon.content;
        marker.iconLayout = this.icon.layout;
        marker.iconImageHref = this.icon.imageHref;
        marker.iconImageSize = this.icon.imageSize;
        marker.iconImageOffset = this.icon.imageOffset;
        marker.iconContentOffset = this.icon.contentOffset;
        if (this.icon.contentLayout && typeof this.icon.contentLayout === 'string') {
          marker.iconContentLayout = ymaps.templateLayoutFactory
            .createClass(this.icon.contentLayout);
        }
      } else {
        marker.icon = this.icon;
      }

      const markerType = utils.createMarkerType(marker.markerType, this.useObjectManager);
      const initialProps = {
        hintContent: marker.hintContent,
        iconContent: marker.icon ? marker.icon.content : marker.iconContent,
        markerId: marker.markerId,
      };

      const balloonProps = marker.balloon ? {
        balloonContentHeader: marker.balloon.header,
        balloonContentBody: marker.balloon.body,
        balloonContentFooter: marker.balloon.footer,
      } : {};

      const properties = Object.assign(initialProps, balloonProps, marker.properties);

      const iconOptions = marker.iconLayout ? {
        iconLayout: marker.iconLayout,
        iconImageHref: marker.iconImageHref,
        iconImageSize: marker.iconImageSize,
        iconImageOffset: marker.iconImageOffset,
        iconContentOffset: marker.iconContentOffset,
        iconContentLayout: marker.iconContentLayout,
      } : { preset: marker.icon && `islands#${utils.getIconPreset(marker)}Icon` };

      const strokeOptions = marker.markerStroke ? {
        strokeColor: marker.markerStroke.color || '0066ffff',
        strokeOpacity: parseFloat(marker.markerStroke.opacity) >= 0
          ? parseFloat(marker.markerStroke.opacity) : 1,
        strokeStyle: marker.markerStroke.style,
        strokeWidth: parseFloat(marker.markerStroke.width) >= 0
          ? parseFloat(marker.markerStroke.width) : 1,
      } : {};

      const fillOptions = marker.markerFill ? {
        fill: marker.markerFill.enabled || true,
        fillColor: marker.markerFill.color || '0066ff99',
        fillOpacity: parseFloat(marker.markerFill.opacity) >= 0
          ? parseFloat(marker.markerFill.opacity) : 1,
        fillImageHref: marker.markerFill.imageHref || '',
      } : {};

      const options = Object.assign(
        iconOptions,
        strokeOptions,
        fillOptions,
        marker.balloonOptions,
        marker.options,
      );

      if (markerType === 'Circle') {
        marker.coords = [marker.coords, marker.circleRadius];
      }

      const obj = {
        properties,
        options,
        markerType,
        coords: marker.coords,
        clusterName: marker.clusterName,
      };

      const mapMarker = utils.createMarker(obj, this.useObjectManager, this.$emit);
      if (!this.useObjectManager) {
        const events = this.markerEvents.length ? this.markerEvents : defaultMarkerEvents;
        events.forEach(_ => mapMarker.events.add(_, e => this.$emit(_, e)));
      }

      return mapMarker;
    },
  },
  beforeUnmount() {
    this.unwatchArr.forEach(f => f());
    this.deleteMarker(this.markerId);
  },
};

</script>

<style>
</style>