// src/components/public/ApplicationForm/components/FileUpload.jsx
import { FileText } from "lucide-react";
import { FORM_CONFIG } from "../constants/formConfig";

const FileContent = ({ file, error, description, maxSizeText }) => (
  <div className="text-gray-600 mb-2">
    <FileText size={24} className="mx-auto mb-2 text-[#B38025]" />
    {file ? (
      <span className="text-green-600 font-medium">{file.name}</span>
    ) : (
      <>
        <p className="font-medium">اضغط لرفع الملف</p>
        <p className="text-sm text-gray-500">
          {description} (حد أقصى {maxSizeText})
        </p>
      </>
    )}
    {error && (
      <p className="mt-2 text-sm text-red-600">{error}</p>
    )}
  </div>
);

const FileUpload = ({
  file,
  onChange,
  required = false,
  error,
  label = "السيرة الذاتية *",
  name = "cv",
  accept = FORM_CONFIG.FILE.ALLOWED_EXTENSIONS,
  maxSizeText = FORM_CONFIG.FILE.MAX_SIZE_READABLE,
  description = "PDF, DOC, DOCX"
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-[#B38025]"
        }`}>
        <input
          type="file"
          name={name}
          onChange={onChange}
          accept={accept}
          className="hidden"
          id={`${name}-upload`}
          required={required}
        />
        <label htmlFor={`${name}-upload`} className="cursor-pointer block">
          <FileContent
            file={file}
            error={error}
            description={description}
            maxSizeText={maxSizeText}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;