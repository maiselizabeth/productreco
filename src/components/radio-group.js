export const RadioGroup = ({ children, onValueChange }) => (
    <div onChange={(e) => onValueChange(e.target.value)}>{children}</div>
  );
  export const RadioGroupItem = ({ value, label }) => (
    <label className="block my-2">
      <input type="radio" value={value} name="radio-group" className="mr-2" />
      {label}
    </label>
  );