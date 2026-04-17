import { useState, useEffect, useCallback } from 'react';
import { fetchWheels, createWheel, updateWheel, deleteWheel } from './api/wheelApi';
import Wheel from './components/Wheel';
import WheelSelector from './components/WheelSelector';
import WheelEditor from './components/WheelEditor';
import './App.css';

const DEFAULT_THEME = {
  sliceColors: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#FF8C94', '#A8E6CF', '#FFD3B6', '#FFAAA5', '#FF8B94',
  ],
  backgroundStart: '#667eea',
  backgroundEnd: '#764ba2',
  accentColor: '#ff4444',
};

const FALLBACK_WHEEL = {
  id: 0,
  name: 'PM Demo',
  riggedEnabled: true,
  riggedItemName: 'Loreli',
  items: [
    { name: 'Sophie', position: 0 },
    { name: 'Marcus', position: 1 },
    { name: 'Elena', position: 2 },
    { name: 'Loreli', position: 3 },
    { name: 'Olivia', position: 4 },
    { name: 'Lucas', position: 5 },
    { name: 'Emma', position: 6 },
    { name: 'Noah', position: 7 },
    { name: 'Aria', position: 8 },
    { name: 'James', position: 9 },
    { name: 'Maya', position: 10 },
    { name: 'Leo', position: 11 },
    { name: 'Zoe', position: 12 },
    { name: 'Alex', position: 13 },
    { name: 'Claire', position: 14 },
  ],
};

function App() {
  const [wheels, setWheels] = useState([]);
  const [activeWheel, setActiveWheel] = useState(null);
  const [theme] = useState(DEFAULT_THEME);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingWheel, setEditingWheel] = useState(null);

  const loadWheels = useCallback(async () => {
    try {
      const data = await fetchWheels();
      if (data && data.length > 0) {
        setWheels(data);
        return data;
      }
    } catch {
      // fall through
    }
    setWheels([FALLBACK_WHEEL]);
    return [FALLBACK_WHEEL];
  }, []);

  useEffect(() => {
    loadWheels().then((data) => setActiveWheel(data[0]));
  }, [loadWheels]);

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${theme.backgroundStart} 0%, ${theme.backgroundEnd} 100%)`;
  }, [theme]);

  const handleSelectWheel = useCallback(
    (wheelId) => {
      const selected = wheels.find((w) => w.id === wheelId);
      if (selected) setActiveWheel(selected);
    },
    [wheels]
  );

  const handleNewWheel = () => {
    setEditingWheel(null);
    setEditorOpen(true);
  };

  const handleEditWheel = () => {
    setEditingWheel(activeWheel);
    setEditorOpen(true);
  };

  const handleSaveWheel = async (wheelData, existingId) => {
    try {
      if (existingId) {
        const saved = await updateWheel(existingId, wheelData);
        setWheels((prev) => prev.map((w) => (w.id === existingId ? saved : w)));
        setActiveWheel(saved);
      } else {
        const saved = await createWheel(wheelData);
        setWheels((prev) => [...prev, saved]);
        setActiveWheel(saved);
      }
    } catch {
      // stay on current state
    }
    setEditorOpen(false);
  };

  const handleDeleteWheel = async (wheelId) => {
    try {
      await deleteWheel(wheelId);
      const remaining = wheels.filter((w) => w.id !== wheelId);
      if (remaining.length === 0) {
        const data = await loadWheels();
        setActiveWheel(data[0]);
      } else {
        setWheels(remaining);
        setActiveWheel(remaining[0]);
      }
    } catch {
      // stay on current state
    }
    setEditorOpen(false);
  };

  if (!activeWheel) return null;

  return (
    <div className="container">
      <h1>{'\u{1F3A1}'} The Fairest Wheel {'\u{1F3A1}'}</h1>

      <WheelSelector
        wheels={wheels}
        activeWheelId={activeWheel.id}
        onSelect={handleSelectWheel}
        onNew={handleNewWheel}
        onEdit={handleEditWheel}
      />

      <Wheel
        items={activeWheel.items}
        theme={theme}
        riggedEnabled={activeWheel.riggedEnabled}
        riggedItemName={activeWheel.riggedItemName}
      />

      <WheelEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveWheel}
        onDelete={handleDeleteWheel}
        wheel={editingWheel}
      />
    </div>
  );
}

export default App;
