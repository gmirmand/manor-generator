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
      matrix: [],
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
      this.matrix = [];
      this.rooms = [];
      this.infos = [];

      this.setupMatrix();
    },
    setupMatrix() {
      this.$emit("update:canRegenerate", false);

      // we generate the matrix
      // [[{x:0, y:0}][{x:1, y:0}][{x:2, y:0}]]
      // [[{x:0, y:1}][{x:1, y:1}][{x:2, y:1}]]
      // [[{x:0, y:2}][{x:1, y:2}][{x:2, y:2}]]

      for (let y = 0; y < this.manorDeep; y++) {
        this.matrix.push([]);
        for (let x = 0; x < this.manorWidth; x++) {
          this.matrix[y].push({
            x,
            y,
          })
        }
      }


      // we manually place the hall
      this.addRoom({
        ...hallRoom,
        x: 5,
        y: 3,
      }, "add hall - static room // middle south").then(() => {
        // we manually place a corridor
        this.addRoom({
          name: "north-corridor",
          color: "blue",
          width: 1,
          deep: 5,
          x: 0,
          y: 4,
        }, "north-corridor - static room // north of the hall").then(() => {
          // we manually place a corridor
          this.addRoom({
            name: "west-corridor",
            color: "blue",
            width: 3,
            deep: 1,
            x: 6,
            y: 0,
          }, "west-corridor - static room // west of the hall").then(() => {
            // we manually place a corridor
            this.addRoom({
              name: "east-corridor",
              color: "blue",
              width: 4,
              deep: 1,
              x: 6,
              y: 6,
            }, "east-corridor - static room // east of the hall").then(() => {
              // we manually place the kitchen
              this.addRoom({
                ...kitchenRoom,
                x: 3,
                y: 6,
              }, "kitchen - static room - north of the east corridor // next to the hall").then(() => {
                // we manually place the garage
                this.addRoom({
                  ...garageRoom,
                  x: 7,
                  y: 0,
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
      // we mirror the room
      // on the X axis (north/south)
      return {
        ...room,
        mirroring: true,
        access: room.access.map((accessPoint) => {
          return {
            ...accessPoint,
            direction: accessPoint.direction === "west" ? "east" : accessPoint.direction === "east" ? "west" : accessPoint.direction,
            y: room.width - accessPoint.y - 1,
          }
        })
      }
    },
    testRoomWithSlot(room, slot) {
      if (room.width === slot.width && room.deep === slot.deep) {
        // we check if any slot access match any room access
        const slotAccess = slot.access;
        const roomAccess = room.access;
        const accessMatch = slotAccess
            .some((slotAccessPoint) => {
              return roomAccess
                  .some((roomAccessPoint) => {
                    return slotAccessPoint.x === roomAccessPoint.x && slotAccessPoint.y === roomAccessPoint.y && slotAccessPoint.direction === roomAccessPoint.direction;
                  })
            })

        // if a neighbour has the same name, we return false
        // TODO est-ce qu'on check si deux pièces sont voisines ?
        const noNeighbourSameName = true;

        return accessMatch && noNeighbourSameName;
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
                // we get the associated room
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
                          if (slotAccessPoint.isUsed) {
                            // we add the access to the room in matrix
                            this.matrix[room.y][room.x] = {
                              ...this.matrix[room.y][room.x],
                              access: {
                                x: slotAccessPoint.x,
                                y: slotAccessPoint.y,
                                direction: slotAccessPoint.direction,
                              }
                            }
                          }

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
      // we push needed info in output matrix
      const { x, y, width, deep } = room;
      this.matrix[y][x] = {
        ...this.matrix[y][x],
        room: {
          name: room.name,
          width,
          deep,
        }
      }

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
      // test if each room reach minInstances
      this.addStep(`Test if each room reach minInstances`, "blue")
          .then(() => {
            const roomsNotMin = this.roomsDynamic
                .filter((room) => {
                  return room.minInstances && this.rooms.filter((roomPlaced) => {
                    return roomPlaced.name === room.name;
                  }).length < room.minInstances;
                });

            if (roomsNotMin.length) {
              this.addStep(`Rooms not reaching minInstances: ${roomsNotMin.map((room) => room.name).join(", ")}`, "red")
                  .then(() => {
                    this.addStep(`Generation failed`, "red")
                        .then(() => {
                          this.$emit("update:canRegenerate", true);
                        })
                  })
            } else {
              this.addStep(`Each room reach minInstances`, "blue")
                  .then(() => {
                    this.addStep(`Generation succeed`, "green")
                        .then(() => {
                          this.$emit("update:canRegenerate", true);
                        })
                  })
            }
          })

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
  <div class="inline-flex flex-wrap mr-4 justify-center items-start">
    <div class="mr-4 w-64 order-2 sm:order-1 flex flex-col">
      <h3>
        Déroulement :
      </h3>
      <ul ref="logs" class="bg-black text-white p-2 text-xs h-[300px] overflow-auto">
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
    <div class="flex flex-col order-1 sm:order-2">
      <h3>
        Preview :
      </h3>

      <span class="text-xs mb-2">
        X : forward/backward<br>
        Y : left/right<br>
        Z . up/down
        </span>

      <div class="text-xs text-center">
        north
      </div>
      <div class="border-4 border-black inline-block sm:scale-100 scale-75">
        <div
            class="grid gap-0 relative"
            :style="{
            gridTemplateRows: `repeat(${manorDeep}, 40px)`,
            gridTemplateColumns: `repeat(${manorWidth}, 40px)`,
          }">
          <template v-for="row in matrix">
            <template
                v-for="slot in row"
                :key="`${slot.x}-${slot.y}`">
              <div
                  class="slot w-10 h-10 border border-black border-dashed opacity-50 text-xs text-center leading-none flex flex-col justify-center">
                <small class="block opacity-50">x - y</small>
                {{ slot.y }} - {{ slot.x }}
              </div>
            </template>
          </template>

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
      <div class="text-xs text-center">
        south
      </div>

      <div class="order-2">
        Matrice :

        <div class="flex">
          <div
              v-for="row in matrix">
            <div
                v-for="slot in row"
                :key="slot.id"
                class="slot w-10 h-10 border border-black/50 border-dashed flex justify-center items-end text-xs">
              <div
                  class="matrix-slot text-white text-[8px] w-full h-full flex justify-center items-center relative bg-black/50"
                  :class="{
                  'bg-green-400': slot.room,
                  }"
              >
                {{ slot.x }} - {{ slot.y }}

                <!-- on hover, we display informations in a popup -->
                <div class="matrix-slot__info absolute bg-black z-10 top-full">
                <pre>
                  {{ slot }}
                </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
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

.matrix-slot {
  cursor: pointer;
}

.matrix-slot__info {
  display: none;
}

.matrix-slot:hover .matrix-slot__info {
  display: block;
}
</style>
