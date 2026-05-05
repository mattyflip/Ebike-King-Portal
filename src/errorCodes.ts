export interface ErrorCode {
  code: string;
  meaning: string;
  solution: string;
  brands: string[];
}

export const COMMON_ERROR_CODES: ErrorCode[] = [
  {
    code: "E007",
    meaning: "Motor Circuit Failure / Hall Sensor Error",
    solution: "Check motor phase wire connections. Check 5-pin hall sensor connector for moisture or loose pins.",
    brands: ["Macfox", "Ridstar", "Happyrun", "Generic Lishui"]
  },
  {
    code: "E008",
    meaning: "Throttle Failure",
    solution: "Check throttle connector. Ensure throttle is not engaged during startup. Replace throttle if 5V signal is missing.",
    brands: ["Macfox", "Ridstar", "Riding Times", "Generic Bafang"]
  },
  {
    code: "E009",
    meaning: "Controller Failure / Phase Error",
    solution: "Check for short circuit in phase wires. If wires are fine, controller MOSFETs are likely blown.",
    brands: ["Macfox", "Dynalion", "Vanpowers"]
  },
  {
    code: "E010",
    meaning: "Communication Reception Failure (Display -> Controller)",
    solution: "Check the 5-pin main harness connector. Look for bent pins. Ensure display firmware matches controller.",
    brands: ["Vanpowers", "Ridstar", "Generic SW900/S866 Displays"]
  },
  {
    code: "04",
    meaning: "Throttle Not Homed",
    solution: "Ensure throttle is in the neutral position when turning the bike on.",
    brands: ["Bafang Generic", "Amazon Hub Motors"]
  },
  {
    code: "05",
    meaning: "Throttle Failure",
    solution: "Disconnect throttle; if error clears, replace throttle. Check wiring for nicks.",
    brands: ["Bafang Generic", "Rad Power (Older)"]
  },
  {
    code: "06",
    meaning: "Low Voltage Protection",
    solution: "Charge battery. Check battery voltage with multimeter. Check for voltage sag under load.",
    brands: ["Generic Alibaba Controllers", "Happyrun"]
  },
  {
    code: "07",
    meaning: "Over Voltage Protection",
    solution: "Ensure charger voltage matches battery. Check for faulty BMS allowing overcharge.",
    brands: ["Generic Alibaba Controllers"]
  },
  {
    code: "21",
    meaning: "Current Abnormality / Controller Short",
    solution: "Check phase wires for shorts. Disconnect motor; if error stays, replace controller.",
    brands: ["Bafang BBSHD/BBS02", "Ridstar"]
  },
  {
    code: "22",
    meaning: "Throttle Signal Abnormality",
    solution: "Check for moisture in throttle connector. Calibrate throttle voltage in display settings if possible.",
    brands: ["Bafang", "Macfox"]
  },
  {
    code: "30",
    meaning: "Communication Error",
    solution: "Check 5-pin 'Julet' connector. Swap display with a known good one to isolate.",
    brands: ["Bafang", "Riding Times", "Vanpowers", "Happyrun"]
  }
];
