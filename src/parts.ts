export interface PartReference {
  id: string;
  category: 'Controller' | 'Motor' | 'BMS' | 'Throttle';
  name: string;
  description: string;
  wiring: { [key: string]: string };
}

export const PARTS_DATABASE: PartReference[] = [
  {
    id: 'standard-hall',
    category: 'Motor',
    name: 'Standard Hall Sensor Plug',
    description: 'Universal 5-pin or 6-pin hall sensor wiring.',
    wiring: {
      'Red': '+5V Power',
      'Black': 'Ground',
      'Yellow': 'Hall Phase A',
      'Green': 'Hall Phase B',
      'Blue': 'Hall Phase C',
      'White': 'Speed Sensor (Optional)'
    }
  },
  {
    id: 'standard-throttle',
    category: 'Throttle',
    name: 'Universal 3-Pin Throttle',
    description: 'Common wiring for twist and thumb throttles.',
    wiring: {
      'Red': '+5V Input',
      'Black': 'Ground',
      'Green/White': 'Signal (0.8V - 4.2V)'
    }
  },
  {
    id: 'daly-bms-comm',
    category: 'BMS',
    name: 'Daly BMS UART/RS485',
    description: 'Pinout for the 6-pin communication port.',
    wiring: {
      'Pin 1': 'VCC (Battery Voltage)',
      'Pin 2': 'Ground',
      'Pin 3': 'RX',
      'Pin 4': 'TX',
      'Pin 5': '485 A',
      'Pin 6': '485 B'
    }
  },
  {
    id: 'fardriver-nd',
    category: 'Controller',
    name: 'Fardriver ND Series Main',
    description: 'Primary signal connector wiring.',
    wiring: {
      'Purple': 'Electric Door Lock (Ignition)',
      'Pink': 'High Brake',
      'Brown': 'Low Brake',
      'Orange': 'Reverse',
      'Grey': 'One-Line Display Signal'
    }
  }
];
