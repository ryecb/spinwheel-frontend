import './SettingsModal.css';

function SettingsModal({ isOpen, onClose, confettiEnabled, onToggleConfetti }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="modal settings-modal">
        <h2>{'\u2699\uFE0F'} Settings</h2>
        <div className="setting-row">
          <input
            type="checkbox"
            id="confettiCheckbox"
            checked={confettiEnabled}
            onChange={(e) => onToggleConfetti(e.target.checked)}
          />
          <label htmlFor="confettiCheckbox">Confetti effect</label>
        </div>
        <button className="settings-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SettingsModal;
