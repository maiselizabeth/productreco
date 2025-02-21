export const Slider = ({ min, max, step, onValueChange }) => (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className="w-full mt-4"
    />
  );