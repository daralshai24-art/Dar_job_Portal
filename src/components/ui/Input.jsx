export default function Input({ label, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className="w-full border rounded-md px-3 py-2 focus:ring outline-none"
      />
    </div>
  );
}
