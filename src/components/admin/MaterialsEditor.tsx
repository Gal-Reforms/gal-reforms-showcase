import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface MaterialsEditorProps {
  materials: Record<string, any>;
  onChange: (materials: Record<string, any>) => void;
}

export function MaterialsEditor({ materials, onChange }: MaterialsEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const materialsArray = Object.entries(materials || {});

  const addMaterial = () => {
    if (newKey.trim() && newValue.trim()) {
      const updatedMaterials = {
        ...materials,
        [newKey.trim()]: newValue.trim()
      };
      onChange(updatedMaterials);
      setNewKey('');
      setNewValue('');
    }
  };

  const removeMaterial = (key: string) => {
    const updatedMaterials = { ...materials };
    delete updatedMaterials[key];
    onChange(updatedMaterials);
  };

  const updateMaterial = (oldKey: string, newKey: string, newValue: string) => {
    const updatedMaterials = { ...materials };
    
    // Remove old key if it changed
    if (oldKey !== newKey) {
      delete updatedMaterials[oldKey];
    }
    
    // Set new value
    updatedMaterials[newKey] = newValue;
    onChange(updatedMaterials);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Materiais Utilizados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Materials */}
        {materialsArray.map(([key, value], index) => (
          <MaterialRow
            key={`${key}-${index}`}
            materialKey={key}
            materialValue={String(value)}
            onUpdate={(newKey, newValue) => updateMaterial(key, newKey, newValue)}
            onRemove={() => removeMaterial(key)}
          />
        ))}

        {/* Add New Material */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="new-material-key">Material</Label>
            <Input
              id="new-material-key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Ex: Piso"
              onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-material-value">Especificação</Label>
            <div className="flex space-x-2">
              <Input
                id="new-material-value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex: Porcelanato 60x60cm"
                onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
              />
              <Button 
                type="button" 
                onClick={addMaterial}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {materialsArray.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum material adicionado ainda. Adicione materiais para descrever o que foi utilizado no projeto.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface MaterialRowProps {
  materialKey: string;
  materialValue: string;
  onUpdate: (key: string, value: string) => void;
  onRemove: () => void;
}

function MaterialRow({ materialKey, materialValue, onUpdate, onRemove }: MaterialRowProps) {
  const [key, setKey] = useState(materialKey);
  const [value, setValue] = useState(materialValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (key.trim() && value.trim()) {
      onUpdate(key.trim(), value.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setKey(materialKey);
    setValue(materialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 border rounded-lg">
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Material"
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
        />
        <div className="flex space-x-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Especificação"
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
          <Button size="sm" onClick={handleSave}>
            Salvar
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
        <span className="font-medium">{materialKey}</span>
        <span className="text-muted-foreground">{materialValue}</span>
      </div>
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
        >
          Editar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
