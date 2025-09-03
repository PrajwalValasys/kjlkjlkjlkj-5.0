import { apiClient } from '../config';
import { API_ENDPOINTS } from '../endpoints';

export interface ICPRequestPayload {
  product_subcategory?: string;
  product_category?: string;
  geolocation?: string[];
  intent_topics?: string[];
  // Additional optional fields can be added as needed
}

const icpService = {
  // Call ICP score API
  getIcpScore: async (payload: ICPRequestPayload) => {
    const response = await apiClient.post(API_ENDPOINTS.ICP.GET_ICP_SCORE, payload);
    return response.data;
  },

  // Convenience wrappers for other ICP-related endpoints (optional)
  getProductsCategory: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ICP.GET_PRODUCTS_CATEGORY);
    return response.data;
  },

  getProductsSubCategory: async (category?: string) => {
    const url = API_ENDPOINTS.ICP.GET_PRODUCTS_SUB_CATEGORY + (category ? `?category=${encodeURIComponent(category)}` : '');
    const response = await apiClient.get(url);
    return response.data;
  },
  // Get list of countries / geolocations (from miscellaneous endpoints)
  getAllCountries: async () => {
    // endpoint lives under MISC in endpoints.ts
    const response = await apiClient.get((API_ENDPOINTS as any).MISC?.GET_ALL_COUNTRIES || '/get_all_country');
    return response.data;
  },
  // Get saved searches / filters for the user
  getSavedSearches: async () => {
    const response = await apiClient.get((API_ENDPOINTS as any).MISC?.GET_SAVED_SEARCHES || '/vaisfilter');
    return response.data;
  },
};

export default icpService;
