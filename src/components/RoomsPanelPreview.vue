<script>
import {defineComponent} from 'vue';
import {dynamicRooms, staticRooms} from "../assets/rooms.js";
import RoomGeneration from "./RoomGeneration.vue";

export default defineComponent({
  name: "RoomsPanelPreview",
  components: { RoomGeneration },
  data() {
    return {
      staticRooms,
      dynamicRooms,
    }
  },
})
</script>

<template>
  <div class="m-4">
    <h2 class="text-2xl mb-4">
      Layouts
    </h2>

    <div class="bg-yellow-100 p-4 mb-4">
      <h3 class="text-xl mb-4">
        Static rooms :
      </h3>
      <div class="flex flex-wrap">
        <template v-for="room in staticRooms">
          <RoomGeneration
              class="relative mr-4 mb-4"
              :name="room.name"
              :x="room.x"
              :y="room.y"
              :width="room.width"
              :deep="room.deep"
              :color="room.color"
              :overlay="room.overlay"
              :access="room.access"
          />
        </template>
      </div>
    </div>

    <div class="bg-purple-200 p-4">
      <h3 class="text-xl">
        Dynamic rooms :
      </h3>
      <div class="flex flex-wrap">
        <template v-for="room in dynamicRooms">
          <div class="border border-dashed p-4 m-2">
            <h4 class="text-lg">
              {{ room.name }} - min:{{ room.minInstances || 'none' }} - max:{{ room.maxInstances || 'none' }}
            </h4>
            <template v-for="roomSize in room.sizes">
              <RoomGeneration
                  class="relative mr-4 mb-4"
                  :name="room.name"
                  :x="roomSize.x"
                  :y="roomSize.y"
                  :width="roomSize.width"
                  :deep="roomSize.deep"
                  :color="room.color"
                  :overlay="room.overlay"
                  :access="roomSize.access"
              />
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
