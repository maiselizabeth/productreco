export const Button = ({ children, onClick, className }) => (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white py-2 px-4 rounded-2xl hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );