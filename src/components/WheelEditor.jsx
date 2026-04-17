import { useState, useEffect, useRef } from 'react';
import './WheelEditor.css';

const RANDOM_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
  '#FF8C94', '#A8E6CF', '#FFD3B6', '#FFAAA5', '#FF8B94',
  '#0077B6', '#00B4D8', '#90E0EF', '#E76F51', '#2A9D8F',
];

function generateRandomColors(count) {
  const shuffled = [...RANDOM_COLORS].sort(() => Math.random() - 0.5);
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(shuffled[i % shuffled.length]);
  }
  return colors;
}

function WheelEditor({ isOpen, onClose, onSave, onDelete, wheel }) {
  const isEditing = !!wheel;

  const [name, setName] = useState('');
  const [items, setItems] = useState(['']);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [riggedMode, setRiggedMode] = useState(false);
  const [riggedItemName, setRiggedItemName] = useState(null);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (wheel) {
        setName(wheel.name);
        setItems(wheel.items.map((i) => i.name));
        setRiggedItemName(wheel.riggedItemName || null);
      } else {
        setName('');
        setItems(['']);
        setRiggedItemName(null);
      }
      setEditingIndex(null);
      setEditingValue('');
      setRiggedMode(false);
      clickCountRef.current = 0;
    }
  }, [isOpen, wheel]);

  const handleNameClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      setRiggedMode((prev) => !prev);
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }
  };

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleItemChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    const removedName = items[index];
    if (riggedItemName === removedName) {
      setRiggedItemName(null);
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingValue(items[index]);
  };

  const finishEditing = () => {
    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = editingValue;
      setItems(updated);
      setEditingIndex(null);
      setEditingValue('');
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      if (editingIndex !== null) {
        finishEditing();
      } else if (index === items.length - 1 && items[index].trim()) {
        handleAddItem();
        setTimeout(() => {
          const inputs = document.querySelectorAll('.item-input');
          if (inputs[inputs.length - 1]) inputs[inputs.length - 1].focus();
        }, 0);
      }
    }
  };

  const handleRiggedSelect = (itemName) => {
    if (riggedItemName === itemName) {
      setRiggedItemName(null);
    } else {
      setRiggedItemName(itemName);
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const validItems = items.filter((i) => i.trim());
    if (!trimmedName || validItems.length < 2) return;

    const wheelData = {
      name: trimmedName,
      riggedEnabled: !!riggedItemName,
      riggedItemName: riggedItemName,
      items: validItems.map((itemName, i) => ({ name: itemName.trim(), position: i })),
    };

    onSave(wheelData, wheel?.id);
  };

  const canSave = name.trim() && items.filter((i) => i.trim()).length >= 2;

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal wheel-editor-modal">
        <h2>{isEditing ? 'Edit Wheel' : 'New Wheel'}</h2>

        <div className="editor-field">
          <label htmlFor="wheelName" onClick={handleNameClick}>
            Wheel Name
          </label>
          <input
            id="wheelName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Team Standup"
          />
        </div>

        <div className="editor-field">
          <label>
            Items <span className="hint">(min 2)</span>
            {riggedMode && (
              <span className="rigged-hint">
                {riggedItemName ? ` \u2014 rigged: ${riggedItemName}` : ' \u2014 click an item to rig'}
              </span>
            )}
          </label>
          <div className="items-list">
            {items.map((item, index) => (
              <div
                key={index}
                className={`item-row${riggedMode && item.trim() && riggedItemName === item.trim() ? ' item-rigged' : ''}`}
              >
                {riggedMode && item.trim() && (
                  <button
                    className={`rigged-toggle${riggedItemName === item.trim() ? ' rigged-active' : ''}`}
                    onClick={() => handleRiggedSelect(item.trim())}
                    title={riggedItemName === item.trim() ? 'Unrig this item' : 'Rig to this item'}
                  >
                    {riggedItemName === item.trim() ? '\u2605' : '\u2606'}
                  </button>
                )}
                {editingIndex === index ? (
                  <input
                    className="item-input"
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={finishEditing}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    autoFocus
                  />
                ) : (
                  <input
                    className="item-input"
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    onDoubleClick={() => startEditing(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder={`Item ${index + 1}`}
                  />
                )}
                <button
                  className="item-remove"
                  onClick={() => handleRemoveItem(index)}
                  disabled={items.length <= 1}
                  title="Remove item"
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <button className="add-item-button" onClick={handleAddItem}>
            + Add Item
          </button>
        </div>

        <div className="editor-actions">
          {isEditing && onDelete && (
            <button
              className="delete-button"
              onClick={() => onDelete(wheel.id)}
            >
              Delete Wheel
            </button>
          )}
          <div className="editor-actions-right">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={!canSave}
            >
              {isEditing ? 'Save Changes' : 'Create Wheel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { generateRandomColors };
export default WheelEditor;
