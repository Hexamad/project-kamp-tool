import html2pdf from 'html2pdf.js';
import { MattressConfig, MATERIALS } from '../types/mattress';
import { calculateLayerCost } from './calculations';

const createPDFContent = (config: MattressConfig, totalCost: number): HTMLElement => {
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';

  // Title
  const title = document.createElement('h1');
  title.style.fontSize = '24px';
  title.style.marginBottom = '20px';
  title.style.textAlign = 'center';
  title.textContent = 'Mattress Configuration Report';
  container.appendChild(title);

  // Date and Time
  const dateDiv = document.createElement('div');
  dateDiv.style.marginBottom = '20px';
  const dateOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  dateDiv.textContent = `Generated on: ${new Date().toLocaleDateString('en-IN', dateOptions)}`;
  container.appendChild(dateDiv);

  // Dimensions Section
  const dimensionsTitle = document.createElement('h2');
  dimensionsTitle.style.fontSize = '20px';
  dimensionsTitle.style.marginBottom = '10px';
  dimensionsTitle.textContent = 'Mattress Dimensions';
  container.appendChild(dimensionsTitle);

  const dimensionsList = document.createElement('ul');
  dimensionsList.style.marginBottom = '20px';
  dimensionsList.style.listStyle = 'none';
  dimensionsList.style.paddingLeft = '20px';
  dimensionsList.innerHTML = `
    <li>Length: ${config.length} inches</li>
    <li>Width: ${config.width} inches</li>
    <li>Total Height: ${config.totalHeight} mm</li>
  `;
  container.appendChild(dimensionsList);

  // Mattress Visualization
  const visualTitle = document.createElement('h2');
  visualTitle.style.fontSize = '20px';
  visualTitle.style.marginBottom = '10px';
  visualTitle.textContent = 'Mattress Visualization';
  container.appendChild(visualTitle);

  const mattressVisual = document.createElement('div');
  mattressVisual.style.border = '1px solid #ccc';
  mattressVisual.style.padding = '10px';
  mattressVisual.style.marginBottom = '20px';
  mattressVisual.style.height = '300px';
  mattressVisual.style.position = 'relative';

  config.layers.forEach((layer, index) => {
    const material = MATERIALS.find(m => m.id === layer.materialId);
    const heightPercentage = (layer.thickness / config.totalHeight) * 100;
    
    const layerDiv = document.createElement('div');
    layerDiv.style.position = 'absolute';
    layerDiv.style.left = '10%';
    layerDiv.style.width = '80%';
    layerDiv.style.height = `${heightPercentage}%`;
    layerDiv.style.bottom = `${config.layers.slice(0, index).reduce((acc, l) => acc + (l.thickness / config.totalHeight) * 100, 0)}%`;
    layerDiv.style.backgroundColor = `hsl(${(index * 40) % 360}, 70%, 85%)`;
    layerDiv.style.border = '1px solid rgba(0,0,0,0.1)';
    layerDiv.style.padding = '5px';
    layerDiv.textContent = `${material?.name} (${layer.thickness}mm)`;
    
    mattressVisual.appendChild(layerDiv);
  });
  container.appendChild(mattressVisual);

  // Layer Configuration & Costs
  const layersTitle = document.createElement('h2');
  layersTitle.style.fontSize = '20px';
  layersTitle.style.marginBottom = '10px';
  layersTitle.textContent = 'Layer Configuration & Costs';
  container.appendChild(layersTitle);

  let subtotal = 0;
  const layersList = document.createElement('div');
  layersList.style.marginBottom = '20px';
  
  config.layers.forEach((layer, index) => {
    const material = MATERIALS.find(m => m.id === layer.materialId);
    const layerCost = calculateLayerCost(layer, config.length, config.width);
    subtotal += layerCost;

    const layerDiv = document.createElement('div');
    layerDiv.style.marginBottom = '15px';
    layerDiv.style.paddingLeft = '20px';
    layerDiv.innerHTML = `
      <div style="font-weight: bold">${index + 1}. ${material?.name}</div>
      <div style="padding-left: 20px">Thickness: ${layer.thickness}mm</div>
      <div style="padding-left: 20px">Cost: ₹${layerCost.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })}</div>
    `;
    layersList.appendChild(layerDiv);
  });
  container.appendChild(layersList);

  // Cost Summary
  const summaryTitle = document.createElement('h2');
  summaryTitle.style.fontSize = '20px';
  summaryTitle.style.marginBottom = '10px';
  summaryTitle.textContent = 'Cost Summary';
  container.appendChild(summaryTitle);

  const laborCost = subtotal * 0.2;
  const summary = document.createElement('div');
  summary.style.paddingLeft = '20px';
  summary.innerHTML = `
    <div style="margin-bottom: 5px">Subtotal: ₹${subtotal.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}</div>
    <div style="margin-bottom: 5px">Labor Cost (20%): ₹${laborCost.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}</div>
    <div style="font-weight: bold; font-size: 18px; margin-top: 10px">
      Total Cost: ₹${totalCost.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      })}
    </div>
  `;
  container.appendChild(summary);

  return container;
};

export const generateMattressPDF = async (config: MattressConfig, totalCost: number) => {
  const element = createPDFContent(config, totalCost);
  document.body.appendChild(element);

  const options = {
    margin: 10,
    filename: 'mattress-configuration.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
  };

  try {
    await html2pdf().from(element).set(options).save();
  } finally {
    document.body.removeChild(element);
  }
};