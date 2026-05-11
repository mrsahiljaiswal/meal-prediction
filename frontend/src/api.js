import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082",
});

export const fetchMeals = () => api.get("/api/meals");
export const placeOrder = (payload) => api.post("/api/orders", payload);
export const fetchPrediction = () => api.get("/api/inventory/predict-next-week");
export const fetchModelVsActual = (limit = 40) =>
  api.get(`/api/inventory/model-vs-actual?limit=${limit}`);

export default api;
