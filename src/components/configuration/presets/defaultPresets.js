export const defaultPresets = [
  {
    name: "original",
    label: "Original blobs configuration",
    isEditable: false,
    type: "discrete",
    neighbourhoodType: "round",
    getConfiguration: () => ({
      neighbourhoods: [
        {
          rings: [
            {minRadius: 0, maxRadius: 3},
          ],
        },
        {
          rings: [
            {minRadius: 4, maxRadius: 7},
          ],
        },
      ],
      rules: [
        {min: 12, max: 15, result: false, neighbourhoodIndex: 1},
        {min: 43, max: 55, result: true, neighbourhoodIndex: 0},
        {min: 10, max: 28, result: false, neighbourhoodIndex: 0},
        {min: 75, max: 85, result: false, neighbourhoodIndex: 1},
        {min: 35, max: 50, result: false, neighbourhoodIndex: 1},
        {min: 21, max: 22, result: true, neighbourhoodIndex: 1},
      ],
    }),
  },
  {
    name: "sustainable",
    label: "Sustainable blobs",
    isEditable: false,
    type: "discrete",
    neighbourhoodType: "round",
    getConfiguration: () => ({
      neighbourhoods: [
        {
          rings: [
            {minRadius: 0, maxRadius: 3},
          ],
        },
        {
          rings: [
            {minRadius: 4, maxRadius: 7},
          ],
        },
      ],
      rules: [
        {min: 6, max: 14, result: false, neighbourhoodIndex: 1},
        {min: 43, max: 55, result: true, neighbourhoodIndex: 0},
        {min: 10, max: 28, result: false, neighbourhoodIndex: 0},
        {min: 75, max: 85, result: false, neighbourhoodIndex: 1},
        {min: 35, max: 50, result: false, neighbourhoodIndex: 1},
        {min: 21, max: 22, result: true, neighbourhoodIndex: 1},
      ],
    }),
  },
  {
    name: "worms",
    label: "Original worms configuration",
    isEditable: false,
    type: "discrete",
    neighbourhoodType: "round",
    getConfiguration: () => ({
      neighbourhoods: [
        {
          rings: [
            {minRadius: 0, maxRadius: 3},
          ],
        },
        {
          rings: [
            {minRadius: 4, maxRadius: 7},
          ],
        },
      ],
      rules: [
        {min: 15, max: 18, result: false, neighbourhoodIndex: 1},
        {min: 44.5, max: 68, result: true, neighbourhoodIndex: 0},
        {min: 15, max: 28, result: false, neighbourhoodIndex: 0},
        {min: 75, max: 85, result: false, neighbourhoodIndex: 1},
        {min: 34.3, max: 58, result: false, neighbourhoodIndex: 1},
        {min: 18.5, max: 20, result: true, neighbourhoodIndex: 1},
      ],
    }),
  },
  {
    name: "pickles",
    label: "Original pickles configuration",
    isEditable: false,
    type: "discrete",
    neighbourhoodType: "round",
    getConfiguration: () => ({
      neighbourhoods: [
        {
          rings: [
            {minRadius: 0, maxRadius: 14},
          ],
        },
        {
          rings: [
            {minRadius: 0, maxRadius: 1},
            {minRadius: 3, maxRadius: 5},
            {minRadius: 7, maxRadius: 8},
          ],
        },
        {
          rings: [
            {minRadius: 0, maxRadius: 11},
          ],
        },
        {
          rings: [
            {minRadius: 1, maxRadius: 5},
            {minRadius: 6, maxRadius: 8},
            {minRadius: 9, maxRadius: 13},
            {minRadius: 14, maxRadius: 16},
          ],
        },
      ],
      rules: [
        // {min: 63.5899371948242, max: 25.7917227783203, result: true,  neighbourhoodIndex: 3},
        // {min: 88.4922902221680, max: 76.0411137084961, result: false, neighbourhoodIndex: 3},
        {min:  3.5574790039063, max: 13.3405462646484, result: false, neighbourhoodIndex: 3},
        {min: 88.9369750976563, max: 97.8306726074219, result: true,  neighbourhoodIndex: 3},
        
        // {min: 67.1474161987305, max: 48.9153363037109, result: true,  neighbourhoodIndex: 2},
        {min: 19.5661345214844, max: 21.7895588989258, result: false, neighbourhoodIndex: 2},
        // {min: 75.5964288330078, max: 53.8068699340820, result: true,  neighbourhoodIndex: 2},
        {min: 34.2407354125977, max: 38.2428992919922, result: true,  neighbourhoodIndex: 2},
        
        {min:  5.7809033813477, max: 11.1171218872070, result: false, neighbourhoodIndex: 1},
        {min: 48.4706514282227, max: 67.1474161987305, result: true,  neighbourhoodIndex: 1},
        // {min: 45.3578572998047, max:  5.7809033813477, result: true,  neighbourhoodIndex: 1},
        {min: 34.2407354125977, max: 37.7982144165039, result: true,  neighbourhoodIndex: 1},
        
        // {min: 78.7092229614258, max: 44.9131724243164, result: false, neighbourhoodIndex: 0},
        {min: 53.3621850585938, max: 91.1603994750977, result: false, neighbourhoodIndex: 0},
        // {min: 87.6029204711914, max: 76.4857985839844, result: true,  neighbourhoodIndex: 0},
        {min: 26.2364076538086, max: 90.2710297241211, result: false, neighbourhoodIndex: 0},
      ],
    }),
  },
  {
    name: "conway",
    label: "Conway's Game of Life",
    isEditable: false,
    type: "discrete",
    neighbourhoodType: "round",
    getConfiguration: () => ({
      neighbourhoods: [
        {
          rings: [
            {minRadius: 0, maxRadius: 1},
          ],
        },
      ],
      rules: [
        {min: (0 / 9 - 0 / 18) * 100, max: (1 / 9 + 1 / 18) * 100, result: false, neighbourhoodIndex: 0},
        {min: (3 / 9 - 1 / 18) * 100, max: (3 / 9 + 1 / 18) * 100, result: true, neighbourhoodIndex: 0},
        {min: (4 / 9 - 1 / 18) * 100, max: (9 / 9 + 0 / 18) * 100, result: false, neighbourhoodIndex: 0},
      ],
    }),
  },
  {
    name: "conway-bugs",
    label: "Conway's Bugs",
    isEditable: false,
    type: "discrete",
    neighbourhoodType: "square",
    getConfiguration: () => ({
      neighbourhoods: [
        {
          rings: [
            {minRadius: 0, maxRadius: 5},
          ],
        },
      ],
      rules: [
        {min: (58 / 121 - 1 / 242) * 100, max: (121 / 121 + 0 / 242) * 100, result: false, neighbourhoodIndex: 0},
        {min: (34 / 121 - 1 / 242) * 100, max: (45 / 121 + 1 / 242) * 100, result: true, neighbourhoodIndex: 0},
        {min: (0 / 121 - 0 / 242) * 100, max: (33 / 121 + 1 / 242) * 100, result: false, neighbourhoodIndex: 0},
      ],
    }),
  },
  {
    name: "teeth",
    label: "Original flying teeth",
    isEditable: false,
    type: "continuous",
    neighbourhoodType: "round",
    getConfiguration: () => ({
      neighbourhoods: [
        {
          rings: [
            {minRadius: 1, maxRadius: 15},
          ],
        },
        {
          rings: [
            {minRadius: 0, maxRadius: 2},
            {minRadius: 3, maxRadius: 4},
            {minRadius: 9, maxRadius: 11},
            {minRadius: 12, maxRadius: 16},
          ],
        },
        {
          rings: [
            {minRadius: 4, maxRadius: 15},
          ],
        },
        {
          rings: [
            {minRadius: 1, maxRadius: 2},
            {minRadius: 3, maxRadius: 7},
            {minRadius: 11, maxRadius: 12},
          ],
        },
      ],
      rules: [
        {min: 2.8978473175048827, max: 8.049575881958008, result: 1, neighbourhoodIndex: 3},
        // {min: 13.362295964050294, max: 10.62544016418457, result: -1, neighbourhoodIndex: 3},
        // {min: 28.33450710449219, max: 0.9659491058349609, result: -1, neighbourhoodIndex: 3},
        {min: 13.040312928771972, max: 41.05283699798584, result: 1, neighbourhoodIndex: 3},

        // {min: 3.219830352783203, max: 0.16099151763916016, result: 1, neighbourhoodIndex: 2},
        {min: 7.888584364318847, max: 33.486235668945313, result: -1, neighbourhoodIndex: 2},
        // {min: 21.73385488128662, max: 12.557338375854493, result: -1, neighbourhoodIndex: 2},
        {min: 4.024787940979004, max: 10.947423199462891, result: -1, neighbourhoodIndex: 2},

        {min: 5.4737115997314456, max: 14.167253552246095, result: 1, neighbourhoodIndex: 1},
        // {min: 28.97847317504883, max: 28.817481657409666, result: 1, neighbourhoodIndex: 1},
        {min: 24.631702198791505, max: 26.241617375183107, result: -1, neighbourhoodIndex: 1},
        // {min: 34.452184774780276, max: 2.2538812469482424, result: -1, neighbourhoodIndex: 1},

        // {min: 16.904109352111818, max: 5.151728564453125, result: -1, neighbourhoodIndex: 0},
        {min: 1.770906694030762, max: 39.764904856872557, result: -1, neighbourhoodIndex: 0},
        // {min: 15.616177210998536, max: 0.48297455291748045, result: -1, neighbourhoodIndex: 0},
        {min: 16.099151763916017, max: 21.25088032836914, result: 1, neighbourhoodIndex: 0},
      ],
    }),
  },
];
