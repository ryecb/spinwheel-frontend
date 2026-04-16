import './WheelSelector.css';

function WheelSelector({ wheels, activeWheelId, onSelect }) {
  if (!wheels || wheels.length < 2) return null;

  return (
    <div className="wheel-selector">
      <select
        value={activeWheelId}
        onChange={(e) => onSelect(Number(e.target.value))}
      >
        {wheels.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default WheelSelector;
