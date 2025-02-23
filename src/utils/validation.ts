// validation.ts

export interface ValidationRules {
    minLength: number;
    maxLength: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    minLayerThickness: number;
    maxLayerThickness: number;
  }
  
  export const MATTRESS_CONSTRAINTS: ValidationRules = {
    minLength: 180,  // 6 feet in mm
    maxLength: 2100, // 7 feet in mm
    minWidth: 900,   // 3 feet in mm
    maxWidth: 1800,  // 6 feet in mm
    minHeight: 150,  // minimum mattress height
    maxHeight: 400,  // maximum mattress height
    minLayerThickness: 25,
    maxLayerThickness: 150
  };
  
  export function validateDimensions(length: number, width: number, height: number): string[] {
    const errors: string[] = [];
    
    if (length < MATTRESS_CONSTRAINTS.minLength || length > MATTRESS_CONSTRAINTS.maxLength) {
      errors.push(`Length must be between ${MATTRESS_CONSTRAINTS.minLength}mm and ${MATTRESS_CONSTRAINTS.maxLength}mm`);
    }
    
    if (width < MATTRESS_CONSTRAINTS.minWidth || width > MATTRESS_CONSTRAINTS.maxWidth) {
      errors.push(`Width must be between ${MATTRESS_CONSTRAINTS.minWidth}mm and ${MATTRESS_CONSTRAINTS.maxWidth}mm`);
    }
    
    if (height < MATTRESS_CONSTRAINTS.minHeight || height > MATTRESS_CONSTRAINTS.maxHeight) {
      errors.push(`Height must be between ${MATTRESS_CONSTRAINTS.minHeight}mm and ${MATTRESS_CONSTRAINTS.maxHeight}mm`);
    }
    
    return errors;
  }
  
  export function validateLayerThickness(thickness: number): string[] {
    const errors: string[] = [];
    
    if (thickness < MATTRESS_CONSTRAINTS.minLayerThickness || thickness > MATTRESS_CONSTRAINTS.maxLayerThickness) {
      errors.push(`Layer thickness must be between ${MATTRESS_CONSTRAINTS.minLayerThickness}mm and ${MATTRESS_CONSTRAINTS.maxLayerThickness}mm`);
    }
    
    return errors;
  }