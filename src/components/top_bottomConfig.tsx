import React from 'react';
import { Layer, MATERIALS } from '../types/mattress';
import { Layers } from 'lucide-react';

interface LayerConfigProps {
  tblayer: Layer;
  onUpdate: (updatedLayer: Layer) => void;
  onDelete: () => void;
  isLast: boolean;
}

export const LayerConfig: React.FC<LayerConfigProps> = ({
  tblayer,
  onUpdate,
  onDelete,
  isLast
}) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-shrink-0">
        <Layers className="w-6 h-6 text-indigo-600" />
      </div>
      
      <div className="flex-grow grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <select
            value={tblayer.materialId}
            onChange={(e) =>
              onUpdate({ ...tblayer, materialId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {MATERIALS.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}
              </option>
            ))}
          </select>
        </div>
        
      </div>
      
      {!isLast && (
        <button
          onClick={onDelete}
          className="flex-shrink-0 text-red-600 hover:text-red-700"
        >
          Remove
        </button>
      )}
    </div>
  );
};