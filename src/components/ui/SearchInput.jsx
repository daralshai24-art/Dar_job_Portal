//src\components\ui\SearchInput.jsx
import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";

/**
 * SearchInput
 * - value: current value
 * - onChange: (value) => void
 * - placeholder
 * - debounce: ms (optional). default 300ms
 * - disabled
 * - ariaLabel
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "",
  debounce = 300,
  disabled = false,
  ariaLabel = "بحث",
}) {
  const [local, setLocal] = useState(value ?? "");
  const timer = useRef(null);

  // Keep local in sync when parent value changes (e.g. clearing filters externally)
  useEffect(() => {
    setLocal(value ?? "");
  }, [value]);

  useEffect(() => {
    if (debounce <= 0) {
      onChange(local);
      return;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onChange(local);
    }, debounce);

    return () => clearTimeout(timer.current);
  }, [local, debounce, onChange]);

  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
        aria-hidden="true"
      />
      <input
        type="text"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        disabled={disabled}
        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  );
}
