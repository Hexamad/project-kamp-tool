type LengthUnit = 'mm' | 'inch' | 'feet';
type HeightUnit = 'mm' | 'inch';

export const convertToMM = (value: number, fromUnit: LengthUnit | HeightUnit): number => {
  switch (fromUnit) {
    case 'inch':
      return value * 25.4; // 1 inch = 25.4 mm
    case 'feet':
      return value * 304.8; // 1 foot = 304.8 mm
    default: // mm
      return value;
  }
};

export const convertFromMM = (mmValue: number, toUnit: LengthUnit | HeightUnit): number => {
  switch (toUnit) {
    case 'inch':
      return mmValue / 25.4;
    case 'feet':
      return mmValue / 304.8;
    default: // mm
      return mmValue;
  }
};
