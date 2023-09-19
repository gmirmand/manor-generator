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
            access: size.access,
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
      // he always is at the middle south
      const hallX = Math.floor((this.manorWidth - hallRoom.width) / 2);
      const hallY = this.manorDeep - hallRoom.deep;
      this.addRoom({
        ...hallRoom,
        x: hallX,
        y: hallY,
      }, "add hall - static room // middle south").then(() => {
        // we place a corridor
        // starting on north of the hall
        const corridorX = hallX + 1;
        const corridorY = 0
        const corridorDeep = this.manorDeep - hallRoom.deep;
        this.addRoom({
          name: "north-corridor",
          color: "blue",
          width: 1,
          deep: corridorDeep,
          x: corridorX,
          y: corridorY,
        }, "north-corridor - static room // north of the hall").then(() => {
          // we place a corridor
          // starting on west of the hall
          const corridorX2 = 0;
          const corridorY2 = hallY + 1
          const corridorWidth2 = hallX;
          this.addRoom({
            name: "west-corridor",
            color: "blue",
            width: corridorWidth2,
            deep: 1,
            x: corridorX2,
            y: corridorY2,
          }, "west-corridor - static room // west of the hall").then(() => {
            // we place a corridor
            // starting on east of the hall
            const corridorX3 = hallX + hallRoom.width;
            const corridorY3 = hallY + 1
            const corridorWidth3 = this.manorWidth - corridorX3;
            this.addRoom({
              name: "east-corridor",
              color: "blue",
              width: corridorWidth3,
              deep: 1,
              x: corridorX3,
              y: corridorY3,
            }, "east-corridor - static room // east of the hall").then(() => {
              // we place the kitchen
              // it is always directly on north of the east corridor next to the hall
              const kitchenX = corridorX3;
              const kitchenY = corridorY3 - kitchenRoom.deep;
              this.addRoom({
                ...kitchenRoom,
                x: kitchenX,
                y: kitchenY,
              }, "kitchen - static room - north of the east corridor // next to the hall").then(() => {
                // we place the garage
                // it is always directly on south of the west corridor next to the hall
                const garageX = hallX - garageRoom.width;
                const garageY = corridorY2 + 1;
                this.addRoom({
                  ...garageRoom,
                  x: garageX,
                  y: garageY,
                }, "garage - static room - south of the west corridor // next to the hall").then(() => {
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

      // we shuffle the dynamicSlots
      dynamicSlots.sort(() => Math.random() - 0.5);

      // we place the dynamic slots
      const slotsPromises = dynamicSlots.map((slot) => new Promise((resolve) => {
        // we place the slot
        setTimeout(() => {
          this.addRoom({
                ...slot,
                name: `slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y}`,
                overlay: true,
                access: slot.access?.map((accessPoint) => {
                  return { ...accessPoint, isUsed: false }
                }),
                color: "purple",
              }, `slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y} - static room - slot`)
              .then(() => {
                resolve(slot);
              })
        }, this.demo / 3 * dynamicSlots.indexOf(slot))
      }));

      Promise.all(slotsPromises)
          .then((slots) => {
            const roomsPromises = slots.map((slot) => new Promise((resolve) => {
              setTimeout(() => {
                const dynamicsRoomsAndMirrored = this.roomsDynamic.map((room) => {
                  return [room, this.mirroringRoom(room)];
                }).flat();
                // we check rooms fitting the slot
                const roomsFitting = dynamicsRoomsAndMirrored.filter((room) => {
                  return room.width === slot.width && room.deep === slot.deep && this.testRoomWithSlot(room, slot);
                });

                // we get rooms that hasn't reached maxInstances
                const roomsFittingNotMaxed = roomsFitting.filter((room) => {
                  return !placedRooms.filter((roomPlaced) => {
                    return roomPlaced.name === room.name;
                  }).length || placedRooms.filter((roomPlaced) => {
                    return roomPlaced.name === room.name;
                  }).length < room.maxInstances || !room.maxInstances;
                });

                // we get rooms that hasn't reached minInstances
                const roomsFittingNotMin = roomsFitting.filter((room) => {
                  return !placedRooms.filter((roomPlaced) => {
                    return roomPlaced.name === room.name;
                  }).length || placedRooms.filter((roomPlaced) => {
                    return roomPlaced.name === room.name;
                  }).length < room.minInstances;
                });

                // we prioritize rooms that hasn't reached minInstances
                // if no room is found, we take rooms that hasn't reached maxInstances
                const placeableRooms = roomsFittingNotMin.length ? roomsFittingNotMin : roomsFittingNotMaxed;

                if (placeableRooms.length === 0) {
                  this.addStep(`no room found for slot ${slot.width}x${slot.deep}_${slot.x}-${slot.y}`, "red");
                  resolve();
                } else {
                  // we pick a random room in placeableRooms
                  const placedRoom = placeableRooms[Math.floor(Math.random() * placeableRooms.length)];

                  // we add the room to the placedRooms
                  placedRooms.push(placedRoom);
                  this.addRoom({
                    ...placedRoom,
                    x: slot.x,
                    y: slot.y,
                  }, `pick room ${placedRoom.name} - dynamic room - slot`).then(() => {
                    resolve();
                  })
                }
              }, this.demo / 3 * slots.indexOf(slot))
            }));

            Promise.all(roomsPromises)
                .then(() => {
                  // we define slots access
                  // with setTimout and addStep, it's a promise that wait 1s to see the evolution
                  this.addStep(`Define slots access`, "blue")
                      .then(() => {
                        this.defineSlotsAccess().then(() => {
                          this.addStep(`Slots access defined`, "blue")
                              .then(() => {
                                this.end();
                              })
                        })
                      })
                })
          })
    },

    mirroringRoom(room) {
      return {
        ...room,
        mirroring: true,
        access: room.access.map((accessPoint) => {
          return {
            ...accessPoint,
            x: room.width - accessPoint.x - 1,
            direction: accessPoint.direction === "west" ? "east" : accessPoint.direction === "east" ? "west" : accessPoint.direction,
          }
        })
      }
    },
    testRoomWithSlot(room, slot) {
      if (room.width === slot.width && room.deep === slot.deep) {
        // we check if any slot access match any room access
        const slotAccess = slot.access;
        const roomAccess = room.access;
        return slotAccess.some((slotAccessPoint) => {
          return roomAccess.some((roomAccessPoint) => {
            return slotAccessPoint.x === roomAccessPoint.x && slotAccessPoint.y === roomAccessPoint.y && slotAccessPoint.direction === roomAccessPoint.direction;
          })
        })
      } else {
        return false;
      }
    },
    defineSlotsAccess() {
      return new Promise((resolve) => {
        // we delete dynamic slots (room with overlay) access that don't match the associated room access
        const promises = [];

        this.rooms
            .forEach((room, index) => {
              if (room.overlay) {
                // Nous obtenons la salle associée.
                const associatedRoom = this.rooms.find((roomAssociated) => {
                  return roomAssociated.x === room.x && roomAssociated.y === room.y && !roomAssociated.overlay;
                });

                room.access
                    .forEach((slotAccessPoint) => {
                      promises.push(new Promise((resolve) => {
                        setTimeout(() => {
                          slotAccessPoint.isUsed = associatedRoom?.access.some((associatedAccessPoint) => {
                            return slotAccessPoint.x === associatedAccessPoint.x && slotAccessPoint.y === associatedAccessPoint.y && slotAccessPoint.direction === associatedAccessPoint.direction;
                          });

                          this.addInfo(`slot ${room.width}x${room.deep}_${room.x}-${room.y} access ${slotAccessPoint.x}-${slotAccessPoint.y} ${slotAccessPoint.direction} is ${slotAccessPoint.isUsed ? 'used' : 'not used'}`)

                          resolve();
                        }, this.demo / 3 * index)
                      }))
                    });
              }
            });

        Promise.all(promises)
            .then(() => {
              resolve();
            })
      });
    },
    addStep(message, color = "white") {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.addInfo(message, color);
          this.$nextTick(() => {
            this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight;
          })
          resolve();
        }, this.demo / 3)
      })
    },
    addRoom(room, message) {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.rooms.push(room);
          this.addStep(message, room.color)
              .then(() => {
                resolve();
              })
        }, this.demo / 3)
      })
    },
    addInfo(message, color = "white") {
      this.infos.push({
        message,
        color,
      });
      this.$nextTick(() => {
        this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight;
      })
    },
    end() {
      // we unchecked the demo in the parent
      console.log("end")
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
              :access="room.access"
              :mirroring="room.mirroring"
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
