import { CourseRequest, User } from '../types';

const STORAGE_KEYS = {
  USER: 'edtech_user',
  REQUESTS: 'edtech_requests',
  LOGIN_STATE: 'edtech_logged_in',
};

export const saveUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const isLoggedIn = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.LOGIN_STATE) === 'true';
};

export const setLoggedIn = (status: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.LOGIN_STATE, status.toString());
  if (status && !getUser()) {
    saveUser({
      name: 'Parent User',
      childAge: 8,
      isLoggedIn: true,
    });
  }
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LOGIN_STATE);
};

export const saveCourseRequest = (request: Omit<CourseRequest, 'id' | 'timestamp'>): void => {
  const requests = getCourseRequests();
  const newRequest: CourseRequest = {
    ...request,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  requests.push(newRequest);
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
};

export const getCourseRequests = (): CourseRequest[] => {
  const requestsData = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  return requestsData ? JSON.parse(requestsData) : [];
};
