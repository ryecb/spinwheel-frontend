import './SettingsModal.css';

function SettingsModal({ isOpen, onClose, riggedEnabled, riggedItemName, onToggleRigged }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <h2>{'\u2699\uFE0F'} Settings</h2>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="riggedCheckbox"
            checked={riggedEnabled}
            onChange={(e) => onToggleRigged(e.target.checked)}
          />
          <label htmlFor="riggedCheckbox">
            Stop always at {riggedItemName}
          </label>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
