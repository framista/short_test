import { api } from './index';

export const getAllTasksForTask = (task) => {
  try {
    return api.get(`/tests?task=${task}`);
  } catch (err) {
    return err;
  }
};
