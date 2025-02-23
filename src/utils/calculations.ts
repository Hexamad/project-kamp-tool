// import { Layer, MATERIALS } from '../types/mattress';

// export const calculateLayerCost = (
//   layer: Layer,
//   length: number,
//   width: number
// ): number => {
//   const material = MATERIALS.find(m => m.id === layer.materialId);
//   if (!material) return 0;

//   // Convert dimensions to square units (12" x 12" blocks)
//   const squareUnits = (length * width) / 144;
//   // Calculate volume units considering thickness
//   const volumeUnits = squareUnits * (layer.thickness / 1);
  
//   return volumeUnits * material.costPerUnit;
// };

// export const calculateTotalCost = (
//   layers: Layer[],
//   length: number,
//   width: number
// ): number => {
//   const layersCost = layers.reduce(
//     (total, layer) => total + calculateLayerCost(layer, length, width),
//     0
//   );
  
//   // Add 20% for labor
//   const laborCost = layersCost * 0.2;
  
//   return layersCost + laborCost;
// };

// export const calculateRemainingHeight = (
//   totalHeight: number,
//   layers: Layer[]
// ): number => {
//   const usedHeight = layers.reduce((total, layer) => total + layer.thickness, 0);
//   return totalHeight - usedHeight;
// };


import { Layer, Material, MATERIALS } from '../types/mattress';

interface CostFactors {
  laborCostPercentage: number;
  wastagePercentage: number;
  overheadCostPercentage: number;
}

const DEFAULT_COST_FACTORS: CostFactors = {
  laborCostPercentage: 20,
  wastagePercentage: 10,
  overheadCostPercentage: 15
};

export const calculateLayerCost = (
  layer: Layer,
  length: number,
  width: number
): number => {
  const material = MATERIALS.find(m => m.id === layer.materialId);
  if (!material) return 0;

  // Convert dimensions to square meters
  const areaInSquareMeters = (length * width) / 1000000; // converting from mm² to m²
  
  // Calculate volume in cubic meters
  const volumeInCubicMeters = areaInSquareMeters * (layer.thickness / 1000);
  
  // Base material cost
  const baseCost = volumeInCubicMeters * material.costPerUnit;
  
  // Add wastage cost
  const wastage = baseCost * (DEFAULT_COST_FACTORS.wastagePercentage / 100);
  
  return baseCost + wastage;
};

export const calculateTotalCost = (
  layers: Layer[],
  length: number,
  width: number
): number => {
  const baseCost = layers.reduce(
    (total, layer) => total + calculateLayerCost(layer, length, width),
    0
  );
  
  // Add labor cost
  const laborCost = baseCost * (DEFAULT_COST_FACTORS.laborCostPercentage / 100);
  
  // Add overhead cost
  const overheadCost = baseCost * (DEFAULT_COST_FACTORS.overheadCostPercentage / 100);
  
  return Math.round((baseCost + laborCost + overheadCost) * 100) / 100;
};

export const calculateRemainingHeight = (
  totalHeight: number,
  layers: Layer[]
): number => {
  const usedHeight = layers.reduce((total, layer) => total + layer.thickness, 0);
  return Math.max(0, totalHeight - usedHeight);
};