import { useRef, useCallback, useEffect } from 'react';
import './Wheel.css';

function Wheel({ items, theme, riggedEnabled, riggedItemName, onOpenSettings }) {
  const wheelRef = useRef(null);
  const currentRotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const spinButtonRef = useRef(null);
  const riggedEnabledRef = useRef(riggedEnabled);
  const riggedItemNameRef = useRef(riggedItemName);
  const itemsRef = useRef(items);

  useEffect(() => { riggedEnabledRef.current = riggedEnabled; }, [riggedEnabled]);
  useEffect(() => { riggedItemNameRef.current = riggedItemName; }, [riggedItemName]);
  useEffect(() => { itemsRef.current = items; }, [items]);

  const sliceAngle = 360 / items.length;

  const buildSliceClipPath = (angle) => {
    const startAngle = 90;
    const angle1 = startAngle;
    const angle2 = startAngle + angle;

    const rad1 = (angle1 * Math.PI) / 180;
    const rad2 = (angle2 * Math.PI) / 180;

    const x1 = 50 + 50 * Math.cos(rad1);
    const y1 = 50 - 50 * Math.sin(rad1);
    const x2 = 50 + 50 * Math.cos(rad2);
    const y2 = 50 - 50 * Math.sin(rad2);

    return `polygon(50% 50%, ${x1}% ${y1}%, ${x2}% ${y2}%)`;
  };

  const spin = useCallback(() => {
    if (isSpinningRef.current) return;

    isSpinningRef.current = true;
    if (spinButtonRef.current) spinButtonRef.current.disabled = true;

    const currentItems = itemsRef.current;
    const currentSliceAngle = 360 / currentItems.length;
    let totalRotation;

    if (riggedEnabledRef.current && riggedItemNameRef.current) {
      const targetIndex = currentItems.findIndex(
        (item) => item.name === riggedItemNameRef.current
      );
      if (targetIndex !== -1) {
        const targetSliceCenter =
          targetIndex * currentSliceAngle - currentSliceAngle / 2;
        const targetAngle = 360 - targetSliceCenter;

        const currentPos = currentRotationRef.current % 360;
        const neededRotation = (targetAngle - currentPos + 360) % 360;

        const minSpins = 5;
        const maxSpins = 10;
        const fullSpins = Math.floor(
          minSpins + Math.random() * (maxSpins - minSpins + 1)
        );
        totalRotation = fullSpins * 360 + neededRotation;
      } else {
        const randomSpins = 5 + Math.random() * 5;
        totalRotation = randomSpins * 360 + Math.random() * 360;
      }
    } else {
      const minSpins = 5;
      const maxSpins = 10;
      const randomSpins = minSpins + Math.random() * (maxSpins - minSpins);
      const randomAngle = Math.random() * 360;
      totalRotation = randomSpins * 360 + randomAngle;
    }

    const duration = 4000;
    const startTime = Date.now();
    const startRotation = currentRotationRef.current;

    function animate() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);

      currentRotationRef.current = startRotation + totalRotation * easeOut;

      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentRotationRef.current}deg)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentRotationRef.current = currentRotationRef.current % 360;
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${currentRotationRef.current}deg)`;
        }
        isSpinningRef.current = false;
        if (spinButtonRef.current) spinButtonRef.current.disabled = false;
      }
    }

    animate();
  }, []);

  const clipPath = buildSliceClipPath(sliceAngle);

  return (
    <>
      <div className="wheel-container">
        <div
          className="arrow"
          style={{ borderTopColor: theme.accentColor }}
        />
        <div className="wheel" ref={wheelRef}>
          {items.map((item, i) => (
            <div
              key={item.name + i}
              className="slice"
              style={{
                clipPath,
                transform: `rotate(${i * sliceAngle}deg)`,
                backgroundColor:
                  theme.sliceColors[i % theme.sliceColors.length],
              }}
            >
              <div className="slice-text">{item.name}</div>
            </div>
          ))}
          <div className="center-circle" />
        </div>
      </div>

      <div className="button-container">
        <button
          className="spin-button"
          ref={spinButtonRef}
          onClick={spin}
        >
          SPIN THE WHEEL
        </button>
        <button className="settings-button" onClick={onOpenSettings}>
          SETTINGS
        </button>
      </div>
    </>
  );
}

export default Wheel;
