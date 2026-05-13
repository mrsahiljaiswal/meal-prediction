import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082",
});

// export const placeOrder = (payload) => api.post("/api/orders", payload);
export const fetchPrediction = (centerId) =>
  api.get("/api/inventory/predict-next-week", { params: { centerId } });
export const fetchModelVsActual = (limit = 40, centerId) =>
  api.get("/api/inventory/model-vs-actual", { params: { limit, centerId } });
const BASE_URL = "http://localhost:8082/api";

// Fetch inventory dynamically for the logged-in center
export const fetchInventory = async (centerId) => {
  const response = await fetch(`${BASE_URL}/inventory/center/${centerId}`);
  if (!response.ok) throw new Error("Failed to fetch inventory");
  return response.json();
};

export const fetchMeals = async (centerId) => {
  const path = centerId ? `/meals/center/${centerId}` : "/meals";
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) throw new Error("Failed to fetch meals");
  return response.json();
};

// Place order associating the center and employee
export const placeOrder = async (orderData, centerId, empId) => {
  const payload = { ...orderData, centerId, empId };
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to place order");
  return response.json();
};
export default api;
