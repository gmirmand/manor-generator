export const hallRoom = {
  name: "hall",
  color: "#ff0000",
  width: 3,
  deep: 5,
}

// kitchen room
// this room is a static room
export const kitchenRoom = {
  name: "kitchen",
  color: "#ff8000",
  width: 3,
  deep: 3,
}

// garage room
// this room is a static room
export const garageRoom = {
  name: "garage",
  color: "#ffff00",
  width: 3,
  deep: 3,
}

// DYNAMIC ROOMS
export const dynamicSlots = [
  {
    width: 1,
    deep: 1,
    x: 3,
    y: 4,
  },
  {
    width: 1,
    deep: 1,
    x: 5,
    y: 3
  },
  {
    width: 1,
    deep: 1,
    x: 5,
    y: 4
  },
  {
    width: 2,
    deep: 2,
    x: 8,
    y: 7,
  },
  {
    width: 2,
    deep: 2,
    x: 5,
    y: 1,
  },
  {
    width: 2,
    deep: 3,
    x: 6,
    y: 7,
  },
  {
    width: 3,
    deep: 2,
    x: 0,
    y: 4,
  },
  {
    width: 3,
    deep: 3,
    x: 1,
    y: 1,
  },
];

// salon room
// this room is a random room
export const salonRoom = {
  name: "salon",
  color: "#ff00ff",
  width: 3,
  deep: 3,
  sizes: [
    {
      width: 3,
      deep: 3,
    },
    {
      width: 3,
      deep: 2,
    },
    {
      width: 2,
      deep: 3,
    },
  ],
  minInstances: 1,
  maxInstances: 1,
}

// rest room
// this room is a random room
export const restRoom = {
  name: "rest",
  color: "#8000ff",
  sizes: [
    {
      width: 3,
      deep: 3,
    },
    {
      width: 3,
      deep: 2,
    },
    {
      width: 2,
      deep: 3,
    },
  ],
  minInstances: 2,
  maxInstances: 4,
}

// bathroom room
// this room is a random room
export const bathroomRoom = {
  name: "bathroom",
  color: "#0080ff",
  sizes: [
    {
      width: 2,
      deep: 2,
    },
    {
      width: 2,
      deep: 1,
    },
    {
      width: 1,
      deep: 2,
    },
  ],
  minInstances: 1,
  maxInstances: 2,
}

// office room
// this room is a random room
export const officeRoom = {
  name: "office",
  color: "#00ff80",
  sizes: [
    {
      width: 2,
      deep: 2,
    },
    {
      width: 2,
      deep: 1,
    },
    {
      width: 1,
      deep: 2,
    },
  ],
  minInstances: 1,
  maxInstances: 1,
}

// toilet room
// this room is a random room
export const toiletRoom = {
  name: "toilet",
  color: "#00ffff",
  sizes: [
    {
      width: 1,
      deep: 1,
    },
  ],
  minInstances: 1,
  maxInstances: 2,
}

export const staticRooms = [
  hallRoom,
  kitchenRoom,
  garageRoom,
];

export const dynamicRooms = [
  salonRoom,
  restRoom,
  bathroomRoom,
  officeRoom,
  toiletRoom,
];

export default [
  ...staticRooms,
  ...dynamicRooms,
];
