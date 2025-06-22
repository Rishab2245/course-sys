import axios from 'axios';

const API_BASE_URL = 'https://course-sys-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Course API functions
export const courseAPI = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (courseId) => api.get(`/courses/${courseId}`),
  createCourse: (course) => api.post('/courses', course),
  updateCourse: (courseId, course) => api.put(`/courses/${courseId}`, course),
  deleteCourse: (courseId) => api.delete(`/courses/${courseId}`),
};

// Course Instance API functions
export const courseInstanceAPI = {
  createCourseInstance: (instance) => api.post('/instances', instance),
  getCourseInstancesByYearAndSemester: (year, semester) => api.get(`/instances/${year}/${semester}`),
  getCourseInstance: (year, semester, courseId) => api.get(`/instances/${year}/${semester}/${courseId}`),
  deleteCourseInstance: (year, semester, courseId) => api.delete(`/instances/${year}/${semester}/${courseId}`),
};

export default api;

