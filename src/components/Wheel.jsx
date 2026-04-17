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

  const buildArcPath = (startDeg, endDeg, r, cx, cy) => {
    const startRad = (startDeg * Math.PI) / 180;
    const endRad = (endDeg * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
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

  const r = 50;
  const cx = 50;
  const cy = 50;
  const fontSize = Math.max(10, Math.min(16, sliceAngle * 0.7));
  const textDistance = 33;

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
          <svg viewBox="0 0 100 100" className="wheel-svg">
            {items.map((item, i) => {
              const startDeg = -90 + i * sliceAngle;
              const endDeg = startDeg + sliceAngle;
              const midDeg = startDeg + sliceAngle / 2;
              const midRad = (midDeg * Math.PI) / 180;
              const textX = cx + textDistance * Math.cos(midRad);
              const textY = cy + textDistance * Math.sin(midRad);
              const textRotate = midDeg;

              return (
                <g key={item.name + i}>
                  <path
                    d={buildArcPath(startDeg, endDeg, r, cx, cy)}
                    fill={theme.sliceColors[i % theme.sliceColors.length]}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="0.3"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${textRotate}, ${textX}, ${textY})`}
                    className="slice-text-svg"
                    fontSize={fontSize * (100 / 500)}
                  >
                    {item.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="center-circle" onClick={spin}>
          <span className="center-label">SPIN</span>
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
