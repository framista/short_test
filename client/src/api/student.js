import { api } from './index';

export const updateStudentTasks = (payload) => {
  try {
    const result = api.put(`/students/tasks`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const updateStudentTests = (payload) => {
  try {
    const result = api.put(`/students/tests`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const getStudentById = () => {
  try {
    const result = api.get(`/students/student`);
    return result;
  } catch (err) {
    return err;
  }
};
