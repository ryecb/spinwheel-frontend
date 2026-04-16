import { useState, useEffect, useCallback } from 'react';
import { fetchWheels, updateWheel } from './api/wheelApi';
import Wheel from './components/Wheel';
import SettingsModal from './components/SettingsModal';
import WheelSelector from './components/WheelSelector';
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
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    fetchWheels()
      .then((data) => {
        if (data && data.length > 0) {
          setWheels(data);
          setActiveWheel(data[0]);
        } else {
          setWheels([FALLBACK_WHEEL]);
          setActiveWheel(FALLBACK_WHEEL);
        }
      })
      .catch(() => {
        setWheels([FALLBACK_WHEEL]);
        setActiveWheel(FALLBACK_WHEEL);
      });
  }, []);

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

  const handleToggleRigged = useCallback(
    async (enabled) => {
      if (!activeWheel) return;
      const updated = { ...activeWheel, riggedEnabled: enabled };
      setActiveWheel(updated);
      setWheels((prev) =>
        prev.map((w) => (w.id === updated.id ? updated : w))
      );
      if (activeWheel.id !== 0) {
        try {
          await updateWheel(activeWheel.id, updated);
        } catch {
          // keep local state even if API fails
        }
      }
    },
    [activeWheel]
  );

  if (!activeWheel) return null;

  return (
    <div className="container">
      <h1>{'\u{1F3A1}'} The totally unrigged spinning wheel {'\u{1F3A1}'}</h1>

      <WheelSelector
        wheels={wheels}
        activeWheelId={activeWheel.id}
        onSelect={handleSelectWheel}
      />

      <Wheel
        items={activeWheel.items}
        theme={theme}
        riggedEnabled={activeWheel.riggedEnabled}
        riggedItemName={activeWheel.riggedItemName}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        riggedEnabled={activeWheel.riggedEnabled}
        riggedItemName={activeWheel.riggedItemName}
        onToggleRigged={handleToggleRigged}
      />
    </div>
  );
}

export default App;
