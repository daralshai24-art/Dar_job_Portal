const FormHeader = ({ mode }) => (
  <div className="text-center mb-2">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">
      {mode === "create" ? "إضافة وظيفة جديدة" : "تعديل الوظيفة"}
    </h2>
    <p className="text-gray-600 text-sm">
      {mode === "create" 
        ? "املأ البيانات التالية لنشر الوظيفة" 
        : "قم بتعديل بيانات الوظيفة ثم احفظ التغييرات"
      }
    </p>
  </div>
);

export default FormHeader;