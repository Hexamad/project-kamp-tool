import html2pdf from 'html2pdf.js';
import { MattressConfig } from '../types/mattress';
import { calculateTotalCost, calculateLayerCost } from './calculations';
import { TOP_LAYER_MATERIALS, CORE_LAYER_MATERIALS, BOTTOM_LAYER_MATERIALS } from '../App';
import { convertFromMM } from './conversions';

interface PDFOptions {
  lengthUnit: 'mm' | 'cm' | 'inch' | 'feet';
  widthUnit: 'mm' | 'cm' | 'inch' | 'feet';
  heightUnit: 'mm' | 'cm' | 'inch';
}

const createPDFContent = (
  config: MattressConfig,
  options: PDFOptions
): HTMLElement => {
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';

  // Helper function for formatted values
  const formatValue = (mmValue: number, unit: string) => {
    return `${convertFromMM(mmValue, unit as any).toFixed(2)} ${unit}`;
  };

  // Title Section
  const title = document.createElement('h1');
  title.style.textAlign = 'center';
  title.style.fontSize = '24px';
  title.style.marginBottom = '20px';
  title.textContent = 'Mattress Configuration Report';
  container.appendChild(title);

  // Dimensions Table
  const dimensionsTable = document.createElement('table');
  dimensionsTable.style.width = '100%';
  dimensionsTable.style.marginBottom = '20px';
  dimensionsTable.innerHTML = `
    <tr>
      <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Dimension</th>
      <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Value</th>
    </tr>
    <tr>
      <td style="padding: 8px;">Length</td>
      <td style="padding: 8px;">${formatValue(config.length, options.lengthUnit)}</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Width</td>
      <td style="padding: 8px;">${formatValue(config.width, options.widthUnit)}</td>
    </tr>
    <tr>
      <td style="padding: 8px;">Total Height</td>
      <td style="padding: 8px;">${formatValue(config.totalHeight, options.heightUnit)}</td>
    </tr>
  `;
  container.appendChild(dimensionsTable);

  // Layers Section
  const allLayers = [
    ...config.topLayers,
    ...config.coreLayers,
    ...config.bottomLayers
  ];

  const layersTitle = document.createElement('h2');
  layersTitle.style.fontSize = '20px';
  layersTitle.style.marginBottom = '15px';
  layersTitle.textContent = 'Layer Configuration';
  container.appendChild(layersTitle);

  allLayers.forEach((layer, index) => {
    const materials = [
      ...TOP_LAYER_MATERIALS,
      ...CORE_LAYER_MATERIALS,
      ...BOTTOM_LAYER_MATERIALS
    ];
    const material = materials.find(m => m.id === layer.materialId);
    const layerCost = calculateLayerCost(layer, config.length, config.width);

    const layerDiv = document.createElement('div');
    layerDiv.style.marginBottom = '15px';
    layerDiv.style.padding = '15px';
    layerDiv.style.border = '1px solid #eee';
    layerDiv.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px;">
        ${index + 1}. ${material?.name}
      </div>
      <div style="display: flex; justify-content: space-between;">
        <div>Thickness: ${formatValue(layer.thickness, options.heightUnit)}</div>
        <div>Cost: ₹${layerCost.toLocaleString('en-IN', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        })}</div>
      </div>
    `;
    container.appendChild(layerDiv);
  });

  // Cost Summary
  const totalCost = calculateTotalCost(allLayers, config.length, config.width);
  const costSummary = document.createElement('div');
  costSummary.style.marginTop = '20px';
  costSummary.innerHTML = `
    <h2 style="font-size: 20px; margin-bottom: 15px;">Cost Summary</h2>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
      <div style="font-size: 18px; font-weight: bold; text-align: center;">
        Total Cost: ₹${totalCost.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </div>
    </div>
  `;
  container.appendChild(costSummary);

  return container;
};

export const generateMattressPDF = async (config: MattressConfig, options: PDFOptions) => {
  const element = createPDFContent(config, options);
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-9999px';
  tempContainer.appendChild(element);
  document.body.appendChild(tempContainer);

  const pdfOptions = {
    margin: 10,
    filename: `mattress-config-${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: true
    },
    jsPDF: { 
      unit: 'mm',
      format: 'a4',
      orientation: "portrait" as "portrait"
    }
  };

  try {
    await html2pdf().set(pdfOptions).from(element).save();
  } catch (error) {
    console.error('PDF generation failed:', error);
  } finally {
    document.body.removeChild(tempContainer);
  }
};
