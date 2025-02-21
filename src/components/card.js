export const Card = ({ children, className }) => (
    <div className={`bg-white rounded-2xl shadow p-6 ${className}`}>{children}</div>
  );
  export const CardContent = ({ children }) => <div>{children}</div>;