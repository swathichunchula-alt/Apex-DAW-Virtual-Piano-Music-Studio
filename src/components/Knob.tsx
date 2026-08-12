import React, { useRef } from 'react';

interface KnobProps {
  label: string;
  value: number; // current value
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
}

export const Knob: React.FC<KnobProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startVal = useRef(value);

  // Map value to rotation angle (-135deg to +135deg)
  const pct = (value - min) / (max - min);
  const angle = -135 + pct * 270;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startVal.current = value;

    const handleMouseMove = (me: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaY = startY.current - me.clientY;
      const range = max - min;
      const deltaVal = (deltaY / 150) * range;
      let newVal = startVal.current + deltaVal;

      if (step) {
        newVal = Math.round(newVal / step) * step;
      }
      newVal = Math.max(min, Math.min(max, newVal));
      onChange(Number(newVal.toFixed(2)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? step : -step;
    let newVal = value + delta;
    newVal = Math.max(min, Math.min(max, newVal));
    onChange(Number(newVal.toFixed(2)));
  };

  return (
    <div className="knob-control" onWheel={handleWheel}>
      <span className="knob-label">{label}</span>
      <div className="knob-outer" onMouseDown={handleMouseDown} title="Drag up/down or scroll wheel to adjust">
        <div className="knob-dial" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="knob-indicator" />
        </div>
      </div>
      <span className="knob-value">{value}{unit}</span>
    </div>
  );
};
