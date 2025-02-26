import React from 'react';
import { Layer } from '../types/mattress';
import { TOP_LAYER_MATERIALS, CORE_LAYER_MATERIALS, BOTTOM_LAYER_MATERIALS } from '../App';

interface MattressPreviewProps {
  layers: Layer[];
  totalHeight: number;
}

export const MattressPreview: React.FC<MattressPreviewProps> = ({
  layers,
  totalHeight
}) => {
  // Combine all materials for lookup
  const ALL_MATERIALS = [
    ...TOP_LAYER_MATERIALS,
    ...CORE_LAYER_MATERIALS,
    ...BOTTOM_LAYER_MATERIALS
  ];

  // Calculate preview height based on viewport
  const PREVIEW_HEIGHT = 400; // Fixed height in pixels

  return (
    // <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6 sticky top-6">
      // In MattressPreview.tsx
      <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h3 className="text-xl font-semibold mb-6">Mattress Preview</h3>
      
      {/* Container with fixed height and border */}
      <div 
        className="relative w-full border-2 border-gray-300 rounded-lg overflow-hidden"
        style={{ height: `${PREVIEW_HEIGHT}px` }}
      >
        {layers.map((layer, index) => {
          const material = ALL_MATERIALS.find(m => m.id === layer.materialId);
          const heightPercentage = (layer.thickness / totalHeight) * 100;
          const pixelHeight = (heightPercentage / 100) * PREVIEW_HEIGHT;
          
          // Calculate position from bottom
          const bottomPosition = layers
            .slice(0, index)
            .reduce((acc, l) => acc + (l.thickness / totalHeight) * PREVIEW_HEIGHT, 0);
          
          // Generate a consistent color based on material type
          const getColorByMaterial = (materialId: string) => {
            if (TOP_LAYER_MATERIALS.some(m => m.id === materialId)) {
              return 'bg-blue-100';
            } else if (CORE_LAYER_MATERIALS.some(m => m.id === materialId)) {
              return 'bg-yellow-50';
            } else {
              return 'bg-green-100';
            }
          };

          return (
            <div
              key={layer.id}
              className={`w-full absolute left-0 transition-all duration-300 ${getColorByMaterial(layer.materialId)}`}
              style={{
                height: `${pixelHeight}px`,
                bottom: `${bottomPosition}px`,
                borderTop: '1px solid rgba(0,0,0,0.1)',
                borderBottom: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div className="text-xs p-2 font-medium truncate">
                {material?.name} ({layer.thickness}mm)
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        <div className="text-sm font-medium">Legend:</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border border-gray-300"></div>
          <span className="text-sm">Top Layer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-gray-300"></div>
          <span className="text-sm">Core Layer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-gray-300"></div>
          <span className="text-sm">Bottom Layer</span>
        </div>
      </div>

      {/* Dimensions Display */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <div className="text-sm">
          <div className="flex justify-between">
            <span>Total Height:</span>
            <span className="font-medium">{totalHeight}mm</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Layers:</span>
            <span className="font-medium">{layers.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};