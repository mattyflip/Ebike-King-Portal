export interface EbikeModel {
  id: string;
  name: string;
  category?: 'commuter' | 'performance' | 'delivery' | 'utility';
  specs: {
    voltage: string;
    controller: string;
    motorType: string;
    motorWattage: string;
    displayModel: string;
  };
}

export const EBIKE_MODELS: EbikeModel[] = [
  // --- COMMUTER & EVERYDAY ---
  {
    id: 'aventon-level-2',
    name: 'Aventon Level.2',
    category: 'commuter',
    specs: {
      voltage: '48V',
      controller: '48V 20A Brushless',
      motorType: 'Rear Hub Motor',
      motorWattage: '500W (750W Peak)',
      displayModel: 'BC-280 Full Color LCD'
    }
  },
  {
    id: 'velotric-discover-1',
    name: 'Velotric Discover 1',
    category: 'commuter',
    specs: {
      voltage: '48V',
      controller: '48V Brushless',
      motorType: 'Rear Hub Motor',
      motorWattage: '500W (900W Peak)',
      displayModel: '3.5" Backlit LCD'
    }
  },
  {
    id: 'ride1up-700-series',
    name: 'Ride1Up 700 Series',
    category: 'commuter',
    specs: {
      voltage: '48V',
      controller: '48V 22A Sine Wave',
      motorType: 'Geared Hub Motor',
      motorWattage: '750W',
      displayModel: 'KD218 Color LCD'
    }
  },
  {
    id: 'vanpowers-city-vanture',
    name: 'Vanpowers City Vanture',
    category: 'commuter',
    specs: {
      voltage: '36V',
      controller: '36V Brushless',
      motorType: 'Rear Hub Motor',
      motorWattage: '350W',
      displayModel: 'Integrated OLED'
    }
  },
  {
    id: 'electra-townie-go-7d',
    name: 'Electra Townie Go! 7D',
    category: 'commuter',
    specs: {
      voltage: '36V',
      controller: 'Hyena System',
      motorType: 'Rear Hub Motor',
      motorWattage: '250W (40Nm)',
      displayModel: 'LED Controller'
    }
  },
  {
    id: 'rad-radrunner-2',
    name: 'Rad Power Bikes RadRunner 2',
    category: 'commuter',
    specs: {
      voltage: '48V',
      controller: '48V 15A Rad Custom',
      motorType: 'Geared Hub Motor',
      motorWattage: '750W',
      displayModel: 'Rad LED Display'
    }
  },
  {
    id: 'lectric-xp-3',
    name: 'Lectric XP 3.0',
    category: 'commuter',
    specs: {
      voltage: '48V',
      controller: '48V Brushless',
      motorType: 'Rear Hub Motor',
      motorWattage: '500W (1000W Peak)',
      displayModel: 'M5 LCD Display'
    }
  },

  // --- PERFORMANCE & MOPED ---
  {
    id: 'ride1up-revv-1',
    name: 'Ride1Up Revv 1',
    category: 'performance',
    specs: {
      voltage: '52V',
      controller: '52V 28A-35A Sine Wave',
      motorType: 'Bafang Hub Motor',
      motorWattage: '750W (Nominal) / 1500W (Peak)',
      displayModel: 'Center Color LCD'
    }
  },
  {
    id: 'super73-s2',
    name: 'Super73 S2',
    category: 'performance',
    specs: {
      voltage: '48V',
      controller: '48V Peak-Performance',
      motorType: 'Brushless DC Hub Motor',
      motorWattage: '750W (Nominal) / 2000W (Peak)',
      displayModel: 'Super73 Smart App / LCD'
    }
  },
  {
    id: 'goat-motor-goat-v3',
    name: 'Goat Power Motor Goat V3',
    category: 'performance',
    specs: {
      voltage: '60V',
      controller: '60V 35A Sine Wave',
      motorType: 'High-Torque Hub Motor',
      motorWattage: '1000W (Nom) / 1500W+ (Peak)',
      displayModel: 'Full Color LCD'
    }
  },
  {
    id: 'macfox-x2',
    name: 'Macfox X2',
    category: 'performance',
    specs: {
      voltage: '48V',
      controller: '48V Brushless',
      motorType: 'Geared Hub Motor',
      motorWattage: '750W (1000W Peak)',
      displayModel: 'Backlit LCD'
    }
  },
  {
    id: 'macfox-x1',
    name: 'Macfox X1 / X1S',
    category: 'performance',
    specs: {
      voltage: '48V',
      controller: '48V Brushless',
      motorType: 'Geared Hub Motor',
      motorWattage: '500W (750W Peak)',
      displayModel: 'Backlit LCD'
    }
  },
  {
    id: 'ridstar-q20-pro',
    name: 'Ridstar Q20 Pro',
    category: 'performance',
    specs: {
      voltage: '52V',
      controller: 'Dual 52V Controllers',
      motorType: 'Dual Hub Motors',
      motorWattage: '2000W (Total)',
      displayModel: 'SW900 Advanced LCD'
    }
  },
  {
    id: 'bigniu-72v-pro',
    name: 'Bigniu 72V High-Power',
    category: 'performance',
    specs: {
      voltage: '72V',
      controller: '72V 45A-60A Brushless',
      motorType: 'Large Hub Motor',
      motorWattage: '2000W - 3000W',
      displayModel: 'Digital Motorcycle-style LCD'
    }
  },
  {
    id: 'onyx-rcr',
    name: 'Onyx RCR',
    category: 'performance',
    specs: {
      voltage: '72V',
      controller: 'Kelly KLS7230S',
      motorType: 'Hub Motor (QS Motors)',
      motorWattage: '3000W (Peak 13kW+)',
      displayModel: 'Onyx Standard'
    }
  },
  {
    id: 'surron-x',
    name: 'Sur-Ron Light Bee X',
    category: 'performance',
    specs: {
      voltage: '60V',
      controller: 'X-Version Sine Wave',
      motorType: 'Mid-Drive BLDC',
      motorWattage: '6000W Peak',
      displayModel: 'Sur-Ron Digital'
    }
  },
  {
    id: 'talaria-sting',
    name: 'Talaria Sting R (MX4)',
    category: 'performance',
    specs: {
      voltage: '60V',
      controller: 'Sting Factory Sine Wave',
      motorType: 'IPM Mid-Drive',
      motorWattage: '8000W Peak',
      displayModel: 'Talaria OLED'
    }
  },

  // --- DELIVERY & UTILITY ---
  {
    id: 'arrow-10',
    name: 'Arrow 10 (Delivery)',
    category: 'delivery',
    specs: {
      voltage: '48V',
      controller: '48V 22A KT-style',
      motorType: 'High Speed Hub Motor',
      motorWattage: '500W',
      displayModel: 'SW900 LCD'
    }
  },
  {
    id: 'fly-7',
    name: 'Fly-7 (Delivery)',
    category: 'delivery',
    specs: {
      voltage: '48V',
      controller: '48V 22A Fly Custom',
      motorType: 'Hub Motor',
      motorWattage: '750W',
      displayModel: 'LCD Digital'
    }
  },
  {
    id: 'senada-herald',
    name: 'Senada Herald',
    category: 'delivery',
    specs: {
      voltage: '48V',
      controller: '48V 22A Brushless',
      motorType: 'Rear Hub Motor',
      motorWattage: '1000W Peak / 750W Sus',
      displayModel: 'M5 LCD Display'
    }
  },
  {
    id: 'sondors-madmod',
    name: 'Sondors MadMod',
    category: 'delivery',
    specs: {
      voltage: '48V',
      controller: '48V Brushless',
      motorType: 'Rear Hub Motor',
      motorWattage: '750W',
      displayModel: 'Integrated Color LCD'
    }
  },
  {
    id: 'bob-ebike-ph',
    name: 'BOB E-Trike (Passenger)',
    category: 'delivery',
    specs: {
      voltage: '48V/60V',
      controller: 'Differential Brushless',
      motorType: 'Differential Hub Motor',
      motorWattage: '500W - 800W',
      displayModel: 'Digital Dash'
    }
  },
  {
    id: 'velotric-nomad-1',
    name: 'Velotric Nomad 1',
    category: 'delivery',
    specs: {
      voltage: '48V',
      controller: '48V Brushless',
      motorType: 'Rear Hub Motor',
      motorWattage: '750W (1200W Peak)',
      displayModel: '3.5" Backlit LCD'
    }
  },
  {
    id: 'tern-gsd-s10',
    name: 'Tern GSD S10',
    category: 'delivery',
    specs: {
      voltage: '36V',
      controller: 'Bosch Cargo Line',
      motorType: 'Bosch Mid-Drive',
      motorWattage: '250W (85Nm Torque)',
      displayModel: 'Bosch Purion'
    }
  }
];