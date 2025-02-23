import React from 'react';
import { TOP_LAYER_MATERIALS, Layer, HeightUnit } from '../App';
// In any file needing conversions
import { convertToMM, convertFromMM } from '../utils/conversions';

interface LayerConfigProps {
  layer: Layer;
  materials: typeof TOP_LAYER_MATERIALS;
  unit: HeightUnit;
  showThickness: boolean;
  onUpdate: (updates: Partial<Layer>) => void;
  onDelete: () => void;
}

const LayerConfig: React.FC<LayerConfigProps> = ({
  layer,
  materials,
  unit,
  showThickness,
  onUpdate,
  onDelete
}) => {
  const handleThicknessChange = (value: number) => {
    const mmValue = convertToMM(value, unit);
    onUpdate({ thickness: mmValue });
  };

  return (
    <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-md mb-2">
      <select
        value={layer.materialId}
        onChange={(e) => onUpdate({ materialId: e.target.value })}
        className="flex-1 p-2 rounded-md border"
      >
        {materials.map(material => (
          <option key={material.id} value={material.id}>
            {material.name}
          </option>
        ))}
      </select>

      {showThickness && (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={convertFromMM(layer.thickness, unit).toFixed(2)}
            onChange={(e) => handleThicknessChange(parseFloat(e.target.value))}
            className="w-24 p-2 rounded-md border"
          />
          <span className="text-sm">{unit}</span>
        </div>
      )}

      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 p-2"
      >
        Delete
      </button>
    </div>
  );
};

export default LayerConfig;

