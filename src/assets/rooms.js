export const hallRoom = {
  name: "hall",
  color: "#ff0000",
  width: 3,
  deep: 5,
  access: [
    {
      x: 0,
      y: 1,
      direction: "west",
    },
    {
      x: 1,
      y: 0,
      direction: "north",
    },
    {
      x: 2,
      y: 1,
      direction: "east",
    }
  ]
}

// kitchen room
// this room is a static room
export const kitchenRoom = {
  name: "kitchen",
  color: "#ff8000",
  width: 3,
  deep: 3,
  access: [
    {
      x: 1,
      y: 2,
      direction: "south",
    }
  ]
}

// garage room
// this room is a static room
export const garageRoom = {
  name: "garage",
  color: "#919100",
  width: 3,
  deep: 3,
  access: [
    {
      x: 2,
      y: 0,
      direction: "north",
    }
  ]
}

// DYNAMIC ROOMS
export const dynamicSlots = [
  {
    width: 1,
    deep: 1,
    x: 3,
    y: 4,
    access: [
      {
        x: 0,
        y: 0,
        direction: "east",
      }
    ]
  },
  {
    width: 1,
    deep: 1,
    x: 5,
    y: 3,
    access: [
      {
        x: 0,
        y: 0,
        direction: "west",
      }
    ]
  },
  {
    width: 1,
    deep: 1,
    x: 5,
    y: 4,
    access: [
      {
        x: 0,
        y: 0,
        direction: "west",
      }
    ]
  },
  {
    width: 2,
    deep: 2,
    x: 8,
    y: 7,
    access: [
      {
        x: 0,
        y: 0,
        direction: "north",
      },
      {
        x: 1,
        y: 0,
        direction: "north",
      }
    ]
  },
  {
    width: 2,
    deep: 2,
    x: 5,
    y: 1,
    access: [
      {
        x: 0,
        y: 0,
        direction: "west",
      },
      {
        x: 0,
        y: 1,
        direction: "west",
      },
    ]
  },
  {
    width: 2,
    deep: 3,
    x: 6,
    y: 7,
    access: [
      {
        x: 0,
        y: 0,
        direction: "north",
      },
      {
        x: 1,
        y: 0,
        direction: "north",
      },
    ]
  },
  {
    width: 3,
    deep: 2,
    x: 0,
    y: 4,
    access: [
      {
        x: 0,
        y: 1,
        direction: "south",
      },
      {
        x: 1,
        y: 1,
        direction: "south",
      },
      {
        x: 2,
        y: 1,
        direction: "south",
      },
    ]
  },
  {
    width: 3,
    deep: 3,
    x: 1,
    y: 1,
    access: [
      {
        x: 2,
        y: 0,
        direction: "east",
      },
      {
        x: 2,
        y: 1,
        direction: "east",
      },
      {
        x: 2,
        y: 2,
        direction: "east",
      }
    ]
  },
];

// salon room
// this room is a random room
export const salonRoom = {
  name: "salon",
  color: "#ff00ff",
  sizes: [
    {
      width: 3,
      deep: 3,
      access: [
        {
          direction: "south",
          x: 1,
          y: 2,
        },
        {
          direction: "east",
          x: 2,
          y: 1,
        },
        {
          direction: "north",
          x: 0,
          y: 0,
        },
        {
          direction: "west",
          x: 0,
          y: 0,
        }
      ]
    },
    {
      width: 3,
      deep: 2,
      access: [
        {
          direction: "south",
          x: 1,
          y: 1,
        },
        {
          direction: "east",
          x: 2,
          y: 0,
        },
      ]
    },
    {
      width: 2,
      deep: 3,
      access: [
        {
          direction: "south",
          x: 0,
          y: 2,
        },
        {
          direction: "east",
          x: 1,
          y: 1,
        },
        {
          direction: "north",
          x: 0,
          y: 0,
        },
        {
          direction: "west",
          x: 0,
          y: 0,
        }
      ]
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
      access: [
        {
          direction: "south",
          x: 1,
          y: 2,
        },
        {
          direction: "east",
          x: 2,
          y: 1,
        },
      ]
    },
    {
      width: 3,
      deep: 2,
      access: [
        {
          direction: "south",
          x: 1,
          y: 1,
        },
        {
          direction: "east",
          x: 2,
          y: 0,
        },
      ]
    },
    {
      width: 2,
      deep: 3,
      access: [
        {
          direction: "south",
          x: 0,
          y: 2,
        },
        {
          direction: "east",
          x: 1,
          y: 1,
        },
        {
          direction: "north",
          x: 0,
          y: 0,
        },
        {
          direction: "west",
          x: 0,
          y: 0,
        }
      ]
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
      access: [
        {
          direction: "south",
          x: 1,
          y: 1,
        },
        {
          direction: "east",
          x: 1,
          y: 1,
        },
        {
          direction: "north",
          x: 0,
          y: 0,
        },
        {
          direction: "west",
          x: 0,
          y: 0,
        }
      ]
    },
    {
      width: 2,
      deep: 1,
      access: [
        {
          direction: "south",
          x: 1,
          y: 0,
        },
        {
          direction: "east",
          x: 1,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 2,
      access: [
        {
          direction: "south",
          x: 0,
          y: 1,
        },
        {
          direction: "east",
          x: 0,
          y: 1,
        },
      ]
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
      access: [
        {
          direction: "south",
          x: 0,
          y: 1,
        },
        {
          direction: "east",
          x: 1,
          y: 1,
        },
        {
          direction: "north",
          x: 0,
          y: 0,
        },
        {
          direction: "west",
          x: 0,
          y: 0,
        }
      ]
    },
    {
      width: 2,
      deep: 1,
      access: [
        {
          direction: "south",
          x: 0,
          y: 0,
        },
        {
          direction: "east",
          x: 1,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 2,
      access: [
        {
          direction: "south",
          x: 0,
          y: 1,
        },
        {
          direction: "east",
          x: 0,
          y: 1,
        },
      ]
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
      access: [
        {
          direction: "south",
          x: 0,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 1,
      access: [
        {
          direction: "west",
          x: 0,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 1,
      access: [
        {
          direction: "east",
          x: 0,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 1,
      access: [
        {
          direction: "north",
          x: 0,
          y: 0,
        },
      ]
    },
  ],
  minInstances: 1,
  maxInstances: 1,
}

export const closetRoom = {
  name: "closet",
  color: "#008000",
  sizes: [
    {
      width: 1,
      deep: 1,
      access: [
        {
          direction: "south",
          x: 0,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 1,
      access: [
        {
          direction: "west",
          x: 0,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 1,
      access: [
        {
          direction: "east",
          x: 0,
          y: 0,
        },
      ]
    },
    {
      width: 1,
      deep: 1,
      access: [
        {
          direction: "north",
          x: 0,
          y: 0,
        },
      ]
    },
  ],
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
  closetRoom,
];

export default [
  ...staticRooms,
  ...dynamicRooms,
];
