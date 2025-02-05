import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Download, Plus } from 'lucide-react';
import { Layer, MattressConfig, MATERIALS } from './types/mattress';
import { calculateRemainingHeight, calculateTotalCost } from './utils/calculations';
import { generateMattressPDF } from './utils/pdfUtils';
import { LayerConfig } from './components/LayerConfig';
import { MattressPreview } from './components/MattressPreview';

function App() {
  const [config, setConfig] = useState<MattressConfig>(() => {
    const saved = localStorage.getItem('currentConfig');
    return saved ? JSON.parse(saved) : {
      length: 80,
      width: 60,
      totalHeight: 300,
      layers: [
        {
          id: nanoid(),
          materialId: 'memory-foam',
          thickness: 50
        }
      ],
      timestamp: Date.now()
    };
  });

  useEffect(() => {
    localStorage.setItem('currentConfig', JSON.stringify(config));
  }, [config]);

  const remainingHeight = calculateRemainingHeight(config.totalHeight, config.layers);
  const totalCost = calculateTotalCost(config.layers, config.length, config.width);

  const addLayer = () => {
    if (config.layers.length >= 7) return;
    
    setConfig(prev => ({
      ...prev,
      layers: [
        ...prev.layers,
        {
          id: nanoid(),
          materialId: 'memory-foam',
          thickness: Math.min(50, remainingHeight)
        }
      ]
    }));
  };

  const updateLayer = (index: number, updatedLayer: Layer) => {
    const newLayers = [...config.layers];
    newLayers[index] = updatedLayer;
    setConfig(prev => ({ ...prev, layers: newLayers }));
  };

  const removeLayer = (index: number) => {
    setConfig(prev => ({
      ...prev,
      layers: prev.layers.filter((_, i) => i !== index)
    }));
  };

  const saveConfiguration = () => {
    const savedConfigs = JSON.parse(localStorage.getItem('mattressConfigs') || '[]');
    const newConfig = { ...config, timestamp: Date.now() };
    localStorage.setItem(
      'mattressConfigs',
      JSON.stringify([...savedConfigs, newConfig])
    );
    alert('Configuration saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">Mattress Dimensions</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Length (inches)
                  </label>
                  <input
                    type="number"
                    value={config.length}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        length: Number(e.target.value)
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Width (inches)
                  </label>
                  <input
                    type="number"
                    value={config.width}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        width: Number(e.target.value)
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total Height (mm)
                  </label>
                  <input
                    type="number"
                    value={config.totalHeight}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        totalHeight: Number(e.target.value)
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Layers Configuration</h2>
                <button
                  onClick={addLayer}
                  disabled={config.layers.length >= 7}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Layer
                </button>
              </div>
              
              <div className="space-y-4">
                {config.layers.map((layer, index) => (
                  <LayerConfig
                    key={layer.id}
                    layer={layer}
                    onUpdate={(updatedLayer) => updateLayer(index, updatedLayer)}
                    onDelete={() => removeLayer(index)}
                    isLast={config.layers.length === 1}
                  />
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">
                    Remaining Height:
                  </span>
                  <span className="text-lg font-semibold">
                    {remainingHeight}mm
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium text-gray-500">
                    Total Cost (incl. labor):
                  </span>
                  <span className="text-lg font-semibold">
                    ₹{totalCost.toLocaleString('en-IN', {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={saveConfiguration}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Save Configuration
              </button>
              <button
                onClick={() => generateMattressPDF(config, totalCost)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </button>
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <MattressPreview
              layers={config.layers}
              totalHeight={config.totalHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;