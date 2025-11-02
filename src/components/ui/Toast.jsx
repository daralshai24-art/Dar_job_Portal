export default function Toast({ message, type }) {
  return (
    <div className={`fixed bottom-4 right-4 px-4 py-2 text-white rounded-md shadow-md
      ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
      {message}
    </div>
  );
}
