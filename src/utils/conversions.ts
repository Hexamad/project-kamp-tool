import { calculateRemainingHeight } from "./calculations";

type LengthUnit = 'mm' | 'cm' | 'inch' | 'feet';
export type HeightUnit = 'mm' | 'cm' | 'inch';

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

export const convertFromMM = (value: number, unit: 'mm' | 'cm' | 'inch' | 'feet'): number => {
  switch (unit) {
    case 'inch':
      return value / 25.4;
    case 'feet':
      return value / 304.8;
    case 'cm':
      return value / 10;
    default:
      return value;
  }
};


