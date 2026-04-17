import { useRef, useCallback, useEffect } from 'react';
import './Wheel.css';

function Wheel({ items, theme, riggedEnabled, riggedItemName }) {
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
    const steps = Math.max(2, Math.ceil(angle / 45));
    const points = ['50% 50%'];

    for (let s = 0; s <= steps; s++) {
      const a = startAngle + (angle * s) / steps;
      const rad = (a * Math.PI) / 180;
      const x = 50 + 50 * Math.cos(rad);
      const y = 50 - 50 * Math.sin(rad);
      points.push(`${x}% ${y}%`);
    }

    return `polygon(${points.join(', ')})`;
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

  const midAngleDeg = 90 + sliceAngle / 2;
  const midAngleRad = (midAngleDeg * Math.PI) / 180;
  const textDistance = 33;
  const textLeft = 50 + textDistance * Math.cos(midAngleRad);
  const textTop = 50 - textDistance * Math.sin(midAngleRad);
  const textRotation = 90 - sliceAngle / 2;
  const fontSize = Math.max(10, Math.min(16, sliceAngle * 0.7));

  return (
    <>
      <div className="wheel-container">
        <div className="arrow">
          <svg viewBox="0 0 24 40" width="25" height="48" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 28 12 28s12-19 12-28C24 5.4 18.6 0 12 0z" fill="white"/>
            <circle cx="12" cy="12" r="5" fill="#2e394c"/>
          </svg>
        </div>
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
              <div
                className="slice-text"
                style={{
                  left: `${textLeft}%`,
                  top: `${textTop}%`,
                  transform: `translate(-50%, -50%) rotate(${textRotation}deg)`,
                  fontSize: `${fontSize}px`,
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
          <div className="center-circle" onClick={spin} />
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
      </div>
    </>
  );
}

export default Wheel;
