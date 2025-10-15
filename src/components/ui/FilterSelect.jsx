/**
 * FilterSelect
 * - value: string
 * - onChange: (value) => void
 * - options: [{ value, label }] OR object map will be normalized
 * - includeAllOption: boolean (default true)
 * - allLabel: string
 * - disabled
 */
export function FilterSelect({
  value,
  onChange,
  options = [],
  includeAllOption = true,
  allLabel = "الكل",
  disabled = false,
}) {
  // normalize object map to array
  const normalized =
    Array.isArray(options) && options.length
      ? options
      : Object.entries(options || {}).map(([val, label]) => ({ value: val, label }));

  return (
    <select
      value={value ?? (includeAllOption ? "all" : "")}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
    >
      {includeAllOption && <option value="all">{allLabel}</option>}
      {normalized.map((opt) => (
        <option key={String(opt.value)} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
