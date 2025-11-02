export const getCategories = async () => {
  const res = await fetch("/api/admin/categories");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const createCategory = async (payload) => {
  const res = await fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateCategory = async (id, payload) => {
  const res = await fetch("/api/admin/categories", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });
  return res.json();
};

export const deactivateCategory = async (id) => {
  const res = await fetch("/api/admin/categories", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json();
};
