import React from 'react';
import { Layer, MATERIALS } from '../types/mattress';

interface MattressPreviewProps {
  layers: Layer[];
  totalHeight: number;
}

export const MattressPreview: React.FC<MattressPreviewProps> = ({
  layers,
  totalHeight
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6">Mattress Preview</h3>
      <div className="relative w-full" style={{ height: '300px' }}>
        {layers.map((layer, index) => {
          const material = MATERIALS.find(m => m.id === layer.materialId);
          const heightPercentage = (layer.thickness / totalHeight) * 100;
          
          return (
            <div
              key={layer.id}
              className="w-full absolute left-0 transition-all duration-300"
              style={{
                height: `${heightPercentage}%`,
                bottom: `${layers.slice(0, index).reduce((acc, l) => acc + (l.thickness / totalHeight) * 100, 0)}%`,
                backgroundColor: `hsl(${(index * 40) % 360}, 70%, 85%)`,
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div className="text-sm p-2 font-medium">
                {material?.name} ({layer.thickness}mm)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};