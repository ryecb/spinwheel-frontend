import './WheelSelector.css';

function WheelSelector({ wheels, activeWheelId, onSelect, onNew, onEdit }) {
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
      <div className="wheel-action-buttons">
        <button className="wheel-action-button" onClick={onEdit} title="Edit wheel">
          {'\u270E'}
        </button>
        <button className="wheel-action-button" onClick={onNew} title="New wheel">
          +
        </button>
      </div>
    </div>
  );
}

export default WheelSelector;
