import axios from 'axios';
import {
  updateStudentTasks,
  updateStudentTests,
  getStudentById,
} from './student';
import { getAllTasksForTask } from './task';

export const api = axios.create({
  baseURL: 'http://amalus.no-ip.org:3009/api',
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('key-jwt-pwr-19'),
  },
});

const apis = {
  getStudentById,
  updateStudentTasks,
  updateStudentTests,
  getAllTasksForTask,
};

export default apis;
