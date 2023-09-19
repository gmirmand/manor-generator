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
            top: `${(y) * 40}px`,
            left: `${(x) * 40}px`,
            width: `${width * 40}px`,
            height: `${deep * 40}px`,
            outlineColor: color,
            fontSize: `${Math.max(6, 16 * Math.min(width / 5, deep / 5) * (1 - (name.length * 0.01)))}px`,
            }
            ">
    <span
        class="mt-2"
        :class="{'bg-white font-bold border border-black p-1 text-center': !overlay}"
    >
      {{ name }} {{ mirroring ? '[mirroring]' : '' }}
    </span>

    <template v-for="xSlot in width">
      <template
          v-for="ySlot in deep"
          :key="`${name}-${xSlot}-${ySlot}`">
        <div
            class="room w-10 h-10 border border-dashed border-black absolute text-[8px] font-bold inline-flex justify-center items-start leading-none"
            :style="{
            borderColor: color,
            color: color,
            top: `${(ySlot - 1 ) * 40}px`,
            left: `${(xSlot - 1 ) * 40}px`,
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
            top: `${(accessPoint.y) * 40}px`,
            left: `${(accessPoint.x) * 40}px`,
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
          transform: accessPoint.direction === 'south' ? 'translateY(33%)' : accessPoint.direction === 'north' ? 'translateY(-33%)' : accessPoint.direction === 'west' ? 'translateX(-33%)' : 'translateX(33%)',
        }"/>
      </div>
    </template>
  </div>
</template>

<style scoped>
</style>
