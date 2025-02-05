import { Layer, MATERIALS } from '../types/mattress';

export const calculateLayerCost = (
  layer: Layer,
  length: number,
  width: number
): number => {
  const material = MATERIALS.find(m => m.id === layer.materialId);
  if (!material) return 0;

  // Convert dimensions to square units (12" x 12" blocks)
  const squareUnits = (length * width) / 144;
  // Calculate volume units considering thickness
  const volumeUnits = squareUnits * (layer.thickness / 1);
  
  return volumeUnits * material.costPerUnit;
};

export const calculateTotalCost = (
  layers: Layer[],
  length: number,
  width: number
): number => {
  const layersCost = layers.reduce(
    (total, layer) => total + calculateLayerCost(layer, length, width),
    0
  );
  
  // Add 20% for labor
  const laborCost = layersCost * 0.2;
  
  return layersCost + laborCost;
};

export const calculateRemainingHeight = (
  totalHeight: number,
  layers: Layer[]
): number => {
  const usedHeight = layers.reduce((total, layer) => total + layer.thickness, 0);
  return totalHeight - usedHeight;
};