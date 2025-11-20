import { SAUDI_CITIES } from "../constants/formConfig";

const CitySelect = ({ value, onChange, error, required }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        المدينة {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name="city"
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#B38025] focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        required={required}
      >
        <option value="">اختر المدينة</option>
        {SAUDI_CITIES.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CitySelect;
