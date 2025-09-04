import { API_BASE_URL } from './config';

const BASE_URL = API_BASE_URL;

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/login/`,
  REGISTER: `${BASE_URL}/register`,
  LOGOUT: `${BASE_URL}/logout/`,
  REFRESH_TOKEN: `${BASE_URL}/refresh-token/`,
  FORGOT_PASSWORD: `${BASE_URL}/password-reset-otp-sender/`,
  RESET_PASSWORD: `${BASE_URL}/password-reset`,
  CHANGE_PASSWORD: `${BASE_URL}/change_password`,
  VERIFY_EMAIL: `${BASE_URL}/verify_email/`,
  VERIFY_EMAIL_OTP: `${BASE_URL}/validate-email-otp/`,
  VERIFY_PHONE_OTP: `${BASE_URL}/validate-phone-otp/`,
  RESEND_OTP_EMAIL: `${BASE_URL}/resend-otp-email/`,
  RESEND_OTP_PHONE: `${BASE_URL}/resend-otp-phone/`,
  LINKEDIN_LOGIN: `${BASE_URL}/user-accounts/linkedin/`,
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_PROFILE: `${BASE_URL}/get_profile`,
  UPDATE_PROFILE: `${BASE_URL}/update_profile/`,
  UPDATE_PROFILE_PIC: `${BASE_URL}/udpate_profile_pic/`,
  REMOVE_PROFILE_PHOTO: `${BASE_URL}/profile_delete`,
  GET_USER_STATUS: `${BASE_URL}/get_user_status`,
  UPDATE_EMAIL: `${BASE_URL}/update_email`,
  UPDATE_EMAIL_OTP: `${BASE_URL}/update_email_validate_otp`,
  UPDATE_PHONE: `${BASE_URL}/update_phone_number`,
  UPDATE_PHONE_OTP: `${BASE_URL}/update_phone_number_validate_otp`,
};

// ICP (VAIS) endpoints
export const ICP_ENDPOINTS = {
  GET_PRODUCTS_CATEGORY: `${BASE_URL}/get-products-category`,
  GET_PRODUCTS_SUB_CATEGORY: `${BASE_URL}/get_product_sub_category/`,
  GET_FILTERED_DATA: `${BASE_URL}/get-filtered-data/`,
  GET_ICP_SCORE: `${BASE_URL}/icp-score/`,
  GET_ICP_SPLIT: `${BASE_URL}/icp_split/`,
  GET_ABM_SCORE: `${BASE_URL}/verify_abm/`,
  GET_LAL_LIST: `${BASE_URL}/lal_list/`,
};

// Prospect endpoints
export const PROSPECT_ENDPOINTS = {
  GET_DROPDOWN: `${BASE_URL}/get_prospect_dropdown/`,
  FIND_PROSPECTS: `${BASE_URL}/find_prospect/`,
  GET_JOB_TITLE_SUGGESTIONS: `${BASE_URL}/get_job_title_suggestions`,
  DOWNLOAD_LIST: `${BASE_URL}/prospect_download_list/`,
  CREDIT_CHECK: `${BASE_URL}/prospect_credit_check/`,
  CHECK_DOMAINS: `${BASE_URL}/check_domains/`,
};

// Download endpoints
export const DOWNLOAD_ENDPOINTS = {
  MY_DOWNLOAD_LIST: `${BASE_URL}/my_download_list/`,
  GET_MY_DOWNLOADS: `${BASE_URL}/get_my_download_list/`,
  DOWNLOAD_CREDIT_CHECK: `${BASE_URL}/download_credit_check/`,
  GET_FILE: `${BASE_URL}/download_file`,
  GET_MULTIPLE_FILES: `${BASE_URL}/download_files/`,
};

// Subscription endpoints
export const SUBSCRIPTION_ENDPOINTS = {
  GET_PLANS: `${BASE_URL}/get_plans/`,
  SUBSCRIBE: `${BASE_URL}/Subscribe/`,
  GET_USER_PLAN: `${BASE_URL}/get_user_plan/`,
  BUY_ADDITIONAL_CREDIT: `${BASE_URL}/buy_additional_credit/`,
  SUBSCRIPTION_REQUEST: `${BASE_URL}/subscriptionrequest/`,
};

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  GET_STATS: `${BASE_URL}/get_dashboard_stats/`,
  GET_FILTERED_STATS: `${BASE_URL}/dashboard/`,
  GET_SPENDING_HISTORY: `${BASE_URL}/get_spending_history`,
  GET_PROFILE_DOWNLOADS: `${BASE_URL}/get_dashboard_graph`,
  GET_PIE_DOWNLOADS: `${BASE_URL}/get_dashboard_pai`,
  GET_NOTICES: `${BASE_URL}/dashbard/notices`,
};

// Support endpoints
export const SUPPORT_ENDPOINTS = {
  GET_TICKET_CATEGORIES: `${BASE_URL}/get_ticket_category/`,
  GET_TICKET_SUB_CATEGORIES: `${BASE_URL}/get_ticket_sub_category`,
  CREATE_TICKET: `${BASE_URL}/tickets_create/`,
  GET_TICKETS: `${BASE_URL}/get_support_tickets`,
  GET_TICKET_BY_ID: `${BASE_URL}/get_ticket_details`,
  DELETE_TICKETS: `${BASE_URL}/delete_tickets/`,
  ADD_COMMENTS: `${BASE_URL}/add_comments/`,
  GET_COMMENTS: `${BASE_URL}/get_ticket_comments/`,
  UPDATE_TICKET_IMAGE: (id: string) => `${BASE_URL}/tickets/${id}/update-image/`,
  GET_TICKET_GRAPH_DATA: `${BASE_URL}/get_ticket_graphdata`,
};

// Campaign endpoints
export const CAMPAIGN_ENDPOINTS = {
  GET_CAMPAIGNS: `${BASE_URL}/campaign/`,
  CREATE_CAMPAIGN: `${BASE_URL}/campaign/`,
  GET_CAMPAIGN_GRAPH_DATA: `${BASE_URL}/get-campaign-graph-table-data`,
  ACCEPT_CAMPAIGN: `${BASE_URL}/accept-campaign`,
  DELETE_CAMPAIGN: `${BASE_URL}/campaigns/soft-delete`,
  GET_USER_CAMPAIGN_TRACK: `${BASE_URL}/user-campaign-tracks`,
};

// Notification endpoints
export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATIONS: `${BASE_URL}/notification/`,
  UPDATE_NOTIFICATION: `${BASE_URL}/notification/`,
};

// User Management endpoints
export const USER_MANAGEMENT_ENDPOINTS = {
  CREATE_SUB_USER: `${BASE_URL}/createSub_user`,
  GET_ALL_STAFF: `${BASE_URL}/userstaff`,
  GET_STAFF_DETAILS: `${BASE_URL}/get_update_userstaff`,
  UPDATE_STAFF: `${BASE_URL}/get_update_userstaff`,
  DELETE_STAFF: `${BASE_URL}/userstaff`,
  BLOCK_STAFF: `${BASE_URL}/userstaff`,
};

// Miscellaneous endpoints
export const MISC_ENDPOINTS = {
  GET_ALL_TOPICS: `${BASE_URL}/topics/`,
  GET_TOPICS_WITH_URL: `${BASE_URL}/get_url_topics/`,
  GET_ALL_COUNTRIES: `${BASE_URL}/get_all_country`,
  GET_SAVED_SEARCHES: `${BASE_URL}/vaisfilter`,
  GET_FAQ: `${BASE_URL}/get-faq/`,
  GET_INTENT_RANGES: `${BASE_URL}/api/bombora-intent-ranges/`,
  GET_G2_URL: `${BASE_URL}/g2-url/`,
  CONTACT_US_EMAIL: `${BASE_URL}/contact-us-email/`,
};

// Export all endpoints as a single object for convenience
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  ICP: ICP_ENDPOINTS,
  PROSPECT: PROSPECT_ENDPOINTS,
  DOWNLOAD: DOWNLOAD_ENDPOINTS,
  SUBSCRIPTION: SUBSCRIPTION_ENDPOINTS,
  DASHBOARD: DASHBOARD_ENDPOINTS,
  SUPPORT: SUPPORT_ENDPOINTS,
  CAMPAIGN: CAMPAIGN_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  USER_MANAGEMENT: USER_MANAGEMENT_ENDPOINTS,
  MISC: MISC_ENDPOINTS,
};
