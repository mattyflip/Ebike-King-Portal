export interface EbikeModel {
  id: string;
  name: string;
  category?: 'commuter' | 'performance' | 'delivery';
  specs: {
    voltage: string;
    controller: string;
    motorType: string;
    motorWattage: string;
    displayModel: string;
  };
}

export const EBIKE_MODELS: EbikeModel[] = [
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
  {
    id: 'onyx-cty2',
    name: 'Onyx CTY2',
    category: 'performance',
    specs: {
      voltage: '60V',
      controller: 'Kelly KLS',
      motorType: 'Hub Motor',
      motorWattage: '2000W',
      displayModel: 'Onyx Standard'
    }
  }
];