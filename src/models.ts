export interface EbikeModel {
  id: string;
  name: string;
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
    id: 'onyx-rcr',
    name: 'Onyx RCR',
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
    specs: {
      voltage: '60V',
      controller: 'Kelly KLS',
      motorType: 'Hub Motor',
      motorWattage: '2000W',
      displayModel: 'Onyx Standard'
    }
  }
];
