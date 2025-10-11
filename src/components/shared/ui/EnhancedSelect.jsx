import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

/**
 * Enhanced Select Component with search and better UX
 */
const EnhancedSelect = ({
  label,
  error,
  icon: Icon,
  options = [],
  value,
  onChange,
  searchable = false,
  placeholder = "اختر...",
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const listboxRef = useRef(null);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredOptions[highlightedIndex].value);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredOptions, highlightedIndex]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listboxRef.current) {
      const items = listboxRef.current.children;
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const clearSelection = () => {
    onChange("");
    setSearchTerm("");
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="space-y-2" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Main select trigger */}
        <button
          type="button"
          className={`
            w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D6B666] focus:border-transparent outline-none appearance-none bg-white cursor-pointer transition-all duration-200 text-right flex items-center justify-between
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'}
            ${className}
          `.trim()}
          onClick={() => setIsOpen(!isOpen)}
          dir="rtl"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {Icon && <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />}
            <span className="flex-1 truncate">
              {selectedOption?.label || placeholder}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-3 w-3 text-gray-400" />
              </button>
            )}
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`} 
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ابحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D6B666] text-right"
                    dir="rtl"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Options list */}
            <div 
              ref={listboxRef}
              className="max-h-48 overflow-y-auto"
              role="listbox"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  {searchTerm ? "لا توجد نتائج" : "لا توجد خيارات متاحة"}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`
                      w-full px-4 py-3 text-right text-sm transition-colors border-b border-gray-100 last:border-b-0
                      ${option.value === value ? 'bg-[#D6B666] bg-opacity-10 text-[#D6B666] font-medium' : ''}
                      ${index === highlightedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}
                    `.trim()}
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default EnhancedSelect;