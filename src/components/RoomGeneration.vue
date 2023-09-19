<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "RoomGeneration",
  props: {
    name: String,
    x: Number,
    y: Number,
    width: Number,
    deep: Number,
    color: String,
    overlay: Boolean,
    access: Array,
    mirroring: Boolean,
  }
})
</script>

<template>
  <div
      class="absolute text-xs inline-flex justify-center items-start leading-none outline outline-4 -outline-offset-4 italic"
      :style="{
            top: `${(x) * 40}px`,
            left: `${(y) * 40}px`,
            width: `${width * 40}px`,
            height: `${deep * 40}px`,
            outlineColor: color,
            fontSize: `${Math.max(6, 16 * Math.min(width / 5, deep / 5) * (1 - (name.length * 0.01)))}px`,
            }
            ">
    <span
        v-if="!overlay"
        class="mt-2 bg-white font-bold p-1 text-center z-10 shadow-lg"
    >
      {{ name }} {{ mirroring ? '[mirror]' : '' }}
    </span>

    <template v-for="ySlot in width">
      <template
          v-for="xSlot in deep"
          :key="`${name}-${xSlot}-${ySlot}`">
        <div
            class="room w-10 h-10 border border-dashed border-black absolute text-[8px] font-bold inline-flex justify-center items-start leading-none"
            :style="{
            borderColor: color,
            color: color,
            top: `${(xSlot - 1 ) * 40}px`,
            left: `${(ySlot - 1 ) * 40}px`,
            }
            "/>
      </template>
    </template>

    <div v-if="!overlay" class="absolute w-full h-full opacity-50 inset-0 -z-10" :style="{backgroundColor: color}"/>

    <!--  add doors  -->
    <template v-for="accessPoint in access">
      <div
          class="absolute w-10 h-10 flex"
          :style="{
            top: `${(accessPoint.x) * 40}px`,
            left: `${(accessPoint.y) * 40}px`,
            justifyContent: accessPoint.direction === 'west' ? 'flex-start' : accessPoint.direction === 'east' ? 'flex-end' : 'center',
            alignItems: accessPoint.direction === 'north' ? 'flex-start' : accessPoint.direction === 'south' ? 'flex-end' : 'center',
            zIndex: overlay ? 20 : 10,
            }"
      >
        <div
            class="rounded-full w-3 h-3 transform transition-all"
            :style="{
          background: overlay ? 'transparent' : color,
          outline: !overlay ? 'none' : accessPoint.isUsed ? '4px solid' : '2px solid',
          outlineColor: color,
          // transform: accessPoint.direction === 'south' ? 'translateY(20%)' : accessPoint.direction === 'north' ? 'translateY(-20%)' : accessPoint.direction === 'west' ? 'translateX(-20%)' : 'translateX(20%)',
        }" />
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
