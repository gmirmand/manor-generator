<script>
import {defineComponent} from 'vue'
import RoomGeneration from "./RoomGeneration.vue";
import {dynamicRooms, dynamicSlots, garageRoom, hallRoom, kitchenRoom} from "../assets/rooms.js";

export default defineComponent({
  name: "ManorGeneration",
  components: { RoomGeneration },
  props: {
    manorWidth: {
      type: Number,
      default: 10,
    },
    manorDeep: {
      type: Number,
      default: 10,
    },
    demo: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      slotMatrix: [],
      rooms: [],
      infos: [],
    }
  },

  computed: {
    roomsDynamic() {
      // for each room, we generate all the possible size as a room
      // we return an array of rooms
      const rooms = [];
      dynamicRooms.forEach((room) => {
        room.sizes.forEach((size) => {
          rooms.push({
            ...room,
            width: size.width,
            deep: size.deep,
          })
        })
      })

      return rooms;
    }
  },

  methods: {
    reset() {
      // clear all setTimeout
      let id = window.setTimeout(function () {
      }, 0);
      while (id--) {
        window.clearTimeout(id); // will do nothing if no timeout with id is present
      }

      // reset
      this.slotMatrix = [];
      this.rooms = [];
      this.infos = [];

      this.setupMatrix();
    },
    setupMatrix() {
      this.$emit("update:canRegenerate", false);

      // we generate the matrix
      for (let y = 0; y < this.manorDeep; y++) {
        for (let x = 0; x < this.manorWidth; x++) {
          this.slotMatrix.push({
            id: `${x}-${y}`,
            name: `${x}-${y}`,
            x,
            y,
          })
        }
      }

      // we place the hall
      // he always is at the middle bottom
      // we calculate top left coordinates
      // based on the width and deep and matrix size
      const hallX = Math.floor((this.manorWidth - hallRoom.width) / 2);
      const hallY = this.manorDeep - hallRoom.deep;
      this.addRoom({
        ...hallRoom,
        x: hallX,
        y: hallY,
      }, "add hall - static room // middle bottom").then(() => {
        // we place a corridor
        // starting on top of the hall
        // and go up to the top of the manor
        const corridorX = hallX + 1;
        const corridorY = 0
        const corridorDeep = this.manorDeep - hallRoom.deep;
        this.addRoom({
          name: "top-corridor",
          color: "blue",
          width: 1,
          deep: corridorDeep,
          x: corridorX,
          y: corridorY,
        }, "top-corridor - static room // top of the hall").then(() => {
          // we place a corridor
          // starting on left of the hall
          // and go left to the left of the manor
          const corridorX2 = 0;
          const corridorY2 = hallY + 1
          const corridorWidth2 = hallX;
          this.addRoom({
            name: "left-corridor",
            color: "blue",
            width: corridorWidth2,
            deep: 1,
            x: corridorX2,
            y: corridorY2,
          }, "left-corridor - static room // left of the hall").then(() => {
            // we place a corridor
            // starting on right of the hall
            // and go right to the right of the manor
            const corridorX3 = hallX + hallRoom.width;
            const corridorY3 = hallY + 1
            const corridorWidth3 = this.manorWidth - corridorX3;
            this.addRoom({
              name: "right-corridor",
              color: "blue",
              width: corridorWidth3,
              deep: 1,
              x: corridorX3,
              y: corridorY3,
            }, "right-corridor - static room // right of the hall").then(() => {
              // we place the kitchen
              // it is always directly on top of the right corridor next to the hall
              const kitchenX = corridorX3;
              const kitchenY = corridorY3 - kitchenRoom.deep;
              this.addRoom({
                ...kitchenRoom,
                x: kitchenX,
                y: kitchenY,
              }, "kitchen - static room - top of the right corridor // next to the hall").then(() => {
                // we place the garage
                // it is always directly on bottom of the left corridor next to the hall
                const garageX = hallX - garageRoom.width;
                const garageY = corridorY2 + 1;
                this.addRoom({
                  ...garageRoom,
                  x: garageX,
                  y: garageY,
                }, "garage - static room - bottom of the left corridor // next to the hall").then(() => {
                  this.generateDynamics();
                })
              })
            })
          })
        })
      })
    },
    generateDynamics() {
      const placedRooms = [];
      const promises = [];
      // delete existing dynamic rooms
      this.rooms = this.rooms
          .filter((room) => {
        return !this.roomsDynamic.find((roomDynamic) => {
          return roomDynamic.name === room.name;
        })
      })

      // delete existing dynamic slots
      this.rooms = this.rooms
          .filter((room) => {
            return !dynamicSlots.find((slot) => {
              return room.name === `slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y}`;
            })
          })


      // we define room slots that we will populate with rooms picked randomly between non-static rooms
      // we place two 2x2 slots
      // two 3x2 slots
      // and one 3x3 slot

      // we place then manually
      // we place a 2x2 at 8-7
      // we place a 2x2 at 5-1
      // we place a 2x3 at 6-7
      // we place a 3x2 at 0-4
      // we place a 3x3 at 1-1
      // we place the slots

      // we shuffle the dynamicSlots
      dynamicSlots.sort(() => Math.random() - 0.5);
      dynamicSlots.forEach((slot, index) => {
        promises.push(
            this.addRoom({
                  name: `slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y}`,
                  overlay: true,
                  color: "purple",
                  ...slot,
                }, `slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y} - static room - slot`)
                .then(() => {
                  // we pick a random room that fit exactly in the slot
                  // the room can be rotated
                  const roomsFitting = this.roomsDynamic
                      .filter((room) => {
                        return room.width === slot.width && room.deep === slot.deep || room.width === slot.deep && room.deep === slot.width;
                      })

                  // we pick a room for this :
                  // we first check room that have not reached minInstances
                  // if no room, we pick a random room that have not reached maxInstances
                  // if no room, we pick a random room
                  const roomsFittingNotMaxed = roomsFitting.filter((room) => {
                    return !placedRooms.filter((roomPlaced) => {
                      return roomPlaced.name === room.name;
                    }).length || placedRooms.filter((roomPlaced) => {
                      return roomPlaced.name === room.name;
                    }).length < room.maxInstances;
                  })
                  const roomsFittingNotMaxedNotMin = roomsFittingNotMaxed.filter((room) => {
                    return !placedRooms.filter((roomPlaced) => {
                      return roomPlaced.name === room.name;
                    }).length || placedRooms.filter((roomPlaced) => {
                      return roomPlaced.name === room.name;
                    }).length < room.minInstances;
                  })
                  // if no room don't match needed conditions, we pick a allowed room
                  const roomsFittingNotMaxedRandom = roomsFittingNotMaxedNotMin.length
                      ? roomsFittingNotMaxedNotMin[Math.floor(Math.random() * roomsFittingNotMaxedNotMin.length)]
                      : roomsFittingNotMaxed[Math.floor(Math.random() * roomsFittingNotMaxed.length)];

                  if(roomsFittingNotMaxedRandom) {
                    // we rotate the room to fit the slot
                    // if width and deep are different
                    const rotation = roomsFittingNotMaxedRandom.width === slot.width ? 0 : 1;
                    // delete the slot rooms
                    // this.rooms = this.rooms.filter((room) => {
                    //   return room.name !== `slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y}`;
                    // });

                    // we place the room
                    placedRooms.push(roomsFittingNotMaxedRandom);
                    this.addRoom({
                      ...roomsFittingNotMaxedRandom,
                      x: slot.x,
                      y: slot.y,
                      width: rotation % 2 === 0 ? roomsFittingNotMaxedRandom.width : roomsFittingNotMaxedRandom.deep,
                      deep: rotation % 2 === 0 ? roomsFittingNotMaxedRandom.deep : roomsFittingNotMaxedRandom.width,
                    }, `room ${roomsFittingNotMaxedRandom.name} - dynamic room - slot`)
                  } else {
                    this.addInfo(`no room found for slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y}`, "red");
                  }
                })
        )

        // setTimeout(() => {
        // }, this.demo ? this.demo / 2 / dynamicSlots.length * index : index * 100);
      })

      Promise.all(promises)
          .then(() => {
            this.end();
          })
    },

    // it's a promise that wait 1s to see the evolution
    addRoom: async function (room, message) {
      return new Promise((resolve) => {
        this.addInfo(message, room.color);

        setTimeout(() => {
          this.rooms.push(room);
          this.$nextTick(() => {
            this.$refs["rooms-log"].scrollTop = this.$refs["rooms-log"].scrollHeight;
          })

          setTimeout(() => {
            resolve();
          }, this.demo - this.demo / 3)
        }, this.demo / 3)
      })
    },
    addInfo(message, color = "white") {
      this.infos.push({
        message,
        color,
      })

      this.$nextTick(() => {
        this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight;
      })
    },
    end() {
      // we unchecked the demo in the parent
      this.$emit("update:canRegenerate", true);
    },
  },

  watch: {
    manorWidth() {
      this.reset();
    }
    ,
    manorDeep() {
      this.reset();
    }
    ,
    demo() {
      this.reset();
    },
  }
  ,

  mounted() {
    this.setupMatrix();
  }
  ,
})
</script>

<template>
  <div class="inline-flex flex-wrap mr-4 justify-center items-center">
    <div ref="logs" class="mr-4 w-64 h-[300px] overflow-auto order-2 sm:order-1">
      Déroulement de la génération:
      <ul class="bg-black text-white p-2 text-xs h-max">
        <transition-group name="info" tag="div">
          <li
              class="last:font-bold last:text-green-400"
              v-for="info in infos" :key="info.message"
              :style="{color: info.color}">
            >> {{ info.message }}
          </li>
        </transition-group>
      </ul>
    </div>

    <!-- manor grid -->
    <!-- generate a visual grid with border pointed -->
    <!-- the wall manor is 400px by 400px -->
    <!-- the grid is 40x40 -->
    <div class="border-4 border-black inline-block sm:scale-100 scale-75 order-1 sm:order-2">
      <div
          class="grid gap-0 relative"
          :style="{
            gridTemplateRows: `repeat(${manorDeep}, 40px)`,
            gridTemplateColumns: `repeat(${manorWidth}, 40px)`,
          }">
        <div
            v-for="slot in slotMatrix"
            :key="slot.id"
            class="slot w-10 h-10 border border-black border-dashed flex justify-center items-end opacity-50 text-xs">
          {{ slot.name }}
        </div>

        <!-- we place the rooms -->
        <transition-group
            name="room"
            tag="div">
          <RoomGeneration
              v-for="room in rooms"
              :key="room.name"
              :name="room.name"
              :x="room.x"
              :y="room.y"
              :width="room.width"
              :deep="room.deep"
              :color="room.color"
              :overlay="room.overlay"
          />
        </transition-group>
      </div>
    </div>

    <!-- log rooms -->
    <div
        ref="rooms-log"
        class="ml-4 w-64 max-h-[400px] overflow-auto order-3 sm:order-3">
      <pre>{{ rooms }}</pre>
    </div>
  </div>
</template>

<style scoped>
.room-enter-active, .room-leave-active {
  transition: all 1s;
}

.room-enter-from, .room-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.info-enter-active, .info-leave-active {
  transition: all 1s;
}

.info-enter-from, .info-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
