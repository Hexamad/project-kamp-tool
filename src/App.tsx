import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Download, Plus } from 'lucide-react';
import { Layer, MattressConfig } from './types/mattress';
import { calculateRemainingHeight, calculateTotalCost } from './utils/calculations';
import { generateMattressPDF } from './utils/pdfUtils';
import LayerConfig from './components/LayerConfig';
import { MattressPreview } from './components/MattressPreview';


const TOP_LAYER_MATERIALS = [
  {
    id: 'ROTTO',
    name: 'ROTTO FABRIC WITH QUILTING',
    costPerUnit: 20.95,
    description: 'Responsive and durable natural latex'
  },


  {
    id: 'satin',
    name: 'SATIN FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'cotlook',
    name: 'COTLOOK FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'stretchable',
    name: 'STRETCHABLE FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'COTTONFABRIC',
    name: 'COTTON FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'KNITTEDFABRIC',
    name: 'KNITTED FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'REXIN',
    name: 'REXIN',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'FABRIC',
    name: 'FABRIC',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
];

const CORE_LAYER_MATERIALS = [
  {
    id: 'LowDensity ',
    name: 'LOW DENSITY PU FOAM',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'HDPU',
    name: 'HD PU Foam',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'SUPERSOFT',
    name: 'SUPER SOFT FOAM',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'MEMORYFOAM',
    name: 'MEMORY FOAM SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'GELMEMORY',
    name: 'GEL MEMORY FOAM SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'latexSHEET',
    name: 'LATEX SHEET',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'latex7',
    name: 'LATEX 7 ZONE SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'COIRSHEET',
    name: 'COIR SHEET',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'REBONDEDSHEETS',
    name: 'REBONDED SHEETS',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'HRFoam',
    name: 'HR Foam',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },


  {
    id: 'FIRERTARDANT',
    name: 'FIRE RETARDANT',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'EPE',
    name: 'EPE',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'FELT',
    name: 'FELT',
    costPerUnit: 20.55,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'BONNEL',
    name: 'BONNEL',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'POCKET',
    name: 'POCKET',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

];

const BOTTOM_LAYER_MATERIALS = [
  {
    id: 'ROTTO',
    name: 'ROTTO FABRIC WITH QUILTING',
    costPerUnit: 20.95,
    description: 'Responsive and durable natural latex'
  },


  {
    id: 'satin',
    name: 'SATIN FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },

  {
    id: 'cotlook',
    name: 'COTLOOK FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'stretchable',
    name: 'STRETCHABLE FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'COTTONFABRIC',
    name: 'COTTON FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'KNITTEDFABRIC',
    name: 'KNITTED FABRIC WITH QUILTING',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'REXIN',
    name: 'REXIN',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
  {
    id: 'FABRIC',
    name: 'FABRIC',
    costPerUnit: 20.75,
    description: 'Responsive and durable natural latex'
  },
];

type Unit = 'mm' | 'inch' | 'feet';
type HeightUnit = 'mm' |'cm' | 'inch';

const convertToMM = (value: number, fromUnit: Unit | HeightUnit): number => {
  switch (fromUnit) {
    case 'cm': return value * 10;
    case 'inch': return value * 25.4;
    case 'feet': return value * 304.8;
    default: return value;
  }
};

const convertFromMM = (mmValue: number, toUnit: Unit | HeightUnit): number => {
  switch (toUnit) {
    case 'inch': return mmValue / 25.4;
    case 'feet': return mmValue / 304.8;
    default: return mmValue;
  }
};

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: Unit | HeightUnit;
  onUnitChange: (unit: Unit | HeightUnit) => void;
  allowedUnits: (Unit | HeightUnit)[];
}

const DimensionInput: React.FC<DimensionInputProps> = ({
  label,
  value,
  onChange,
  unit,
  onUnitChange,
  allowedUnits
}) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue)) onChange(numValue);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          value={value.toFixed(2)}
          onChange={handleValueChange}
          className="w-full rounded-md border p-2"
        />
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as Unit | HeightUnit)}
          className="rounded-md border p-2"
        >
          {allowedUnits.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const DEFAULT_CONFIG: MattressConfig = {
  length: 1000,  // mm
  width: 900,    // mm
  totalHeight: 300,  // mm
  topLayers: [],
  coreLayers: [],
  bottomLayers: [],
  timestamp: Date.now()
};

function App() {
  const [lengthUnit, setLengthUnit] = useState<Unit>('mm');
  const [widthUnit, setWidthUnit] = useState<Unit>('mm');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('mm');
  const [config, setConfig] = useState<MattressConfig>(DEFAULT_CONFIG);

  // Persist config to localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('mattressConfig');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  useEffect(() => {
    localStorage.setItem('mattressConfig', JSON.stringify(config));
  }, [config]);

  const handleDimensionChange = (field: keyof MattressConfig) => 
    (value: number, unit: Unit | HeightUnit) => {
      const mmValue = convertToMM(value, unit);
      setConfig(prev => ({ ...prev, [field]: mmValue }));
    };

  const addLayer = (section: 'topLayers' | 'coreLayers' | 'bottomLayers') => {
    const materials = {
      topLayers: TOP_LAYER_MATERIALS,
      coreLayers: CORE_LAYER_MATERIALS,
      bottomLayers: BOTTOM_LAYER_MATERIALS
    }[section][0].id;

    setConfig(prev => ({
      ...prev,
      [section]: [...prev[section], {
        id: nanoid(),
        materialId: materials,
        thickness: section === 'coreLayers' ? 
          convertToMM(50, heightUnit) : // Default 50mm for core
          convertToMM(30, heightUnit)   // Default 30mm for top/bottom
      }]
    }));
  };

  const updateLayer = (section: 'topLayers' | 'coreLayers' | 'bottomLayers', index: number, updates: Partial<Layer>) => {
    setConfig(prev => {
      const layers = [...prev[section]];
      layers[index] = { ...layers[index], ...updates };
      return { ...prev, [section]: layers };
    });
  };

  const deleteLayer = (section: 'topLayers' | 'coreLayers' | 'bottomLayers', index: number) => {
    setConfig(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      <div className="space-y-4 sm:space-y-6">
        
          {/* Dimension Controls */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Dimensions</h2> 
          <div className="space-y-3 sm:space-y-4"> 
            
              <DimensionInput
                label="Length"
                value={convertFromMM(config.length, lengthUnit)}
                onChange={(v) => handleDimensionChange('length')(v, lengthUnit)}
                unit={lengthUnit}
                onUnitChange={(unit) => setLengthUnit(unit as Unit)}
                allowedUnits={['mm', 'cm', 'inch', 'feet']}
                 
              />
              <DimensionInput
                label="Width"
                value={convertFromMM(config.width, widthUnit)}
                onChange={(v) => handleDimensionChange('width')(v, widthUnit)}
                unit={widthUnit}
                onUnitChange={(unit) => setWidthUnit(unit as Unit)}
                allowedUnits={['mm', 'cm', 'inch', 'feet']}
              />
              <DimensionInput
                label="Total Height"
                value={convertFromMM(config.totalHeight, heightUnit)}
                onChange={(v) => handleDimensionChange('totalHeight')(v, heightUnit)}
                unit={heightUnit}
                onUnitChange={(unit) => setHeightUnit(unit as HeightUnit)}
                allowedUnits={['mm', 'cm', 'inch']}
              />
            </div>
          </div>

          {/* Layer Configuration Sections */}
          {['top', 'core', 'bottom'].map((section) => (
          <div key={section} className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">
                {section.charAt(0).toUpperCase() + section.slice(1)} Layers
              </h3>
              <button
                onClick={() => addLayer(`${section}Layers` as any)}
                className="bg-indigo-600 text-white rounded-md hover:bg-indigo-700 w-full sm:w-auto text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2"
              >
                 <Plus className="inline mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Add Layer
                </button>
              </div>
              {(config as any)[`${section}Layers`].map((layer: Layer, index: number) => (
                <LayerConfig
                  key={layer.id}
                  layer={layer}
                  materials={
                    section === 'top' ? TOP_LAYER_MATERIALS :
                    section === 'core' ? CORE_LAYER_MATERIALS :
                    BOTTOM_LAYER_MATERIALS
                  }
                  unit={heightUnit}
                  showThickness={section === 'core'}
                  onUpdate={(updates) => updateLayer(`${section}Layers` as any, index, updates)}
                  onDelete={() => deleteLayer(`${section}Layers` as any, index)}
                />
              ))}
            </div>
          ))}

          {/* Summary Section */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm sm:text-base">
            <div className="flex justify-between sm:block">
              <span>Remaining Height:</span>
              <span className="font-bold sm:ml-2">
                {convertFromMM(
                  calculateRemainingHeight(config.totalHeight, config.coreLayers),
                  heightUnit
                ).toFixed(2)}{heightUnit}
              </span>
            </div>
            <div className="flex justify-between sm:block">
              <span>Total Cost:</span>
              <span className="font-bold sm:ml-2">
                ₹{calculateTotalCost([...config.topLayers, ...config.coreLayers, ...config.bottomLayers], config.length, config.width).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
          
<button
  onClick={() => generateMattressPDF(config, {
    lengthUnit,   // From state
    widthUnit,    // From state
    heightUnit:heightUnit  // From state
  })}
  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
<Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
  Generate PDF
</button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-8 mt-4 sm:mt-0">
          <MattressPreview 
            layers={[...config.topLayers, ...config.coreLayers, ...config.bottomLayers]}
            totalHeight={config.totalHeight}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
export { TOP_LAYER_MATERIALS, CORE_LAYER_MATERIALS, BOTTOM_LAYER_MATERIALS };
export type { Layer };
export type { HeightUnit}