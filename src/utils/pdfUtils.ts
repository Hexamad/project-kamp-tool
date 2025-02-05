import { jsPDF } from 'jspdf';
import { Layer, MATERIALS, MattressConfig } from '../types/mattress';
import { calculateLayerCost } from './calculations';

// Create a canvas element to draw the mattress preview
const createMattressCanvas = (layers: Layer[], totalHeight: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;

  // Fill white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw mattress layers
  let currentY = canvas.height;
  layers.forEach((layer, index) => {
    const heightPercentage = (layer.thickness / totalHeight);
    const layerHeight = canvas.height * heightPercentage;
    
    // Draw layer
    ctx.fillStyle = `hsl(${(index * 40) % 360}, 70%, 85%)`;
    ctx.fillRect(50, currentY - layerHeight, canvas.width - 100, layerHeight);
    
    // Draw border
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.strokeRect(50, currentY - layerHeight, canvas.width - 100, layerHeight);
    
    // Add layer label
    const material = MATERIALS.find(m => m.id === layer.materialId);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText(`${material?.name} (${layer.thickness}mm)`, 60, currentY - layerHeight/2);
    
    currentY -= layerHeight;
  });

  return canvas;
};

export const generateMattressPDF = (config: MattressConfig, totalCost: number) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(20);
  doc.text('Mattress Configuration Report', pageWidth / 2, 20, { align: 'center' });
  
  // Date and Time
  doc.setFontSize(12);
  const dateOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN', dateOptions)}`, 20, 35);
  
  // Dimensions
  doc.setFontSize(16);
  doc.text('Mattress Dimensions', 20, 50);
  doc.setFontSize(12);
  doc.text(`Length: ${config.length} inches`, 30, 60);
  doc.text(`Width: ${config.width} inches`, 30, 70);
  doc.text(`Total Height: ${config.totalHeight} mm`, 30, 80);
  
  // Add mattress visualization
  const canvas = createMattressCanvas(config.layers, config.totalHeight);
  doc.addImage(canvas.toDataURL(), 'PNG', 20, 90, 170, 80);
  
  // Layers and Costs
  doc.setFontSize(16);
  doc.text('Layer Configuration & Costs', 20, 190);
  doc.setFontSize(12);
  
  let yPos = 200;
  let subtotal = 0;
  
  config.layers.forEach((layer, index) => {
    const material = MATERIALS.find(m => m.id === layer.materialId);
    const layerCost = calculateLayerCost(layer, config.length, config.width);
    subtotal += layerCost;
    
    // Layer information with cost
    doc.text(`${index + 1}. ${material?.name}`, 30, yPos);
    doc.text(`Thickness: ${layer.thickness}mm`, 40, yPos + 7);
    doc.text(`Cost: ₹${layerCost.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`, 40, yPos + 14);
    
    yPos += 25;
  });
  
  // Cost Breakdown
  doc.setFontSize(16);
  doc.text('Cost Summary', 20, yPos + 10);
  doc.setFontSize(12);
  
  // Subtotal
  doc.text(`Subtotal: ₹${subtotal.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })}`, 30, yPos + 25);
  
  // Labor Cost (20% of subtotal)
  const laborCost = subtotal * 0.2;
  doc.text(`Labor Cost (20%): ₹${laborCost.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })}`, 30, yPos + 35);
  
  // Total Cost
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(`Total Cost: ₹${totalCost.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  })}`, 30, yPos + 50);
  
  doc.save('mattress-configuration.pdf');
};