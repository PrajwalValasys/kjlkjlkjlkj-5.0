import { apiClient } from '../config';
import { API_ENDPOINTS } from '../endpoints';

export interface ICPRequestPayload {
  // legacy and various backend shapes supported
  product_subcategory?: string;
  product_category?: string;
  // friendly field names used in the new UI
  product_sub_category_name?: string;
  product_category_name?: string;
  product_category_name_view?: string;
  // geolocation / location
  geolocation?: string[];
  location?: string[];
  // topics / intent topics
  intent_topics?: string[];
  topics?: string[];
  // pagination
  page?: number;
  // user id field used by backend
  user_id?: string | number | null;
  // optional filter metadata
  vais_filter_name?: string;
  is_save_filter?: boolean;
  is_credit?: boolean;
  // Any additional fields the backend may accept
  [key: string]: any;
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
  // Fetch product category for a given product subcategory id
  getProductsCategoryForSubcategory: async (subCategoryId: string | number) => {
    const id = String(subCategoryId);
    const url = `${API_ENDPOINTS.ICP.GET_PRODUCTS_CATEGORY}/${encodeURIComponent(id)}`;
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
  // If userId is provided, call `/vaisfilter/{userId}/` else fall back to `/vaisfilter`
  getSavedSearches: async (userId?: string | number) => {
    const base = ((API_ENDPOINTS as any).MISC?.GET_SAVED_SEARCHES || '/vaisfilter').replace(/\/$/, '');
    const baseWithSlash = base + '/';

    // Try multiple common shapes to be tolerant of backend variations:
    // 1) /vaisfilter/{userId}/
    // 2) /vaisfilter/?user_id={userId}
    // 3) /vaisfilter/
    try {
      if (userId) {
        const tryPath = `${base}/${encodeURIComponent(String(userId))}/`;
        try {
          const resp = await apiClient.get(tryPath);
          return resp.data;
        } catch (e) {
          // fallback to query param style
        }

        const tryQuery = `${baseWithSlash}?user_id=${encodeURIComponent(String(userId))}`;
        try {
          const resp = await apiClient.get(tryQuery);
          return resp.data;
        } catch (e) {
          // fall through to generic call
        }
      }

      const resp = await apiClient.get(baseWithSlash);
      return resp.data;
    } catch (err) {
      // Final fallback: attempt base without trailing slash
      try {
        const resp = await apiClient.get(base);
        return resp.data;
      } catch (err2) {
        console.error('[icpService.getSavedSearches] failed for base paths', { base, userId, err, err2 });
        throw err2 || err;
      }
    }
  },
  // Get a single saved search by id; if userId provided, call `/vaisfilter/{userId}/{id}/`
  getSavedSearchById: async (id: string | number, userId?: string | number) => {
    const base = ((API_ENDPOINTS as any).MISC?.GET_SAVED_SEARCHES || '/vaisfilter').replace(/\/$/, '');
    const baseWithSlash = base + '/';

    // Try path-style first, then query-style fallbacks
    try {
      if (userId) {
        const tryPath = `${base}/${encodeURIComponent(String(userId))}/${encodeURIComponent(String(id))}/`;
        try {
          const resp = await apiClient.get(tryPath);
          return resp.data;
        } catch (e) {
          // fallback to query-style
        }

        const tryQuery = `${baseWithSlash}?user_id=${encodeURIComponent(String(userId))}&id=${encodeURIComponent(String(id))}`;
        try {
          const resp = await apiClient.get(tryQuery);
          return resp.data;
        } catch (e) {
          // fall through
        }
      }

      const resp = await apiClient.get(`${base}/${encodeURIComponent(String(id))}/`);
      return resp.data;
    } catch (err) {
      console.error('[icpService.getSavedSearchById] failed', { base, id, userId, err });
      throw err;
    }
  },
  // Fetch topics by URL (GET_TOPICS_WITH_URL?topic_url=...)
  getTopicsByUrl: async (topicUrl: string) => {
    const url = `${(API_ENDPOINTS as any).MISC?.GET_TOPICS_WITH_URL}?topic_url=${encodeURIComponent(topicUrl)}`;
    const response = await apiClient.get(url);
    return response.data;
  },
  // Fetch all topics (GET_ALL_TOPICS)
  getAllTopics: async () => {
    const url = (API_ENDPOINTS as any).MISC?.GET_ALL_TOPICS || '/topics/';
    const response = await apiClient.get(url);
    return response.data;
  },
};

export default icpService;
