// userService.ts
import axios from 'axios';

const API_URL = "http://localhost/api";

export const userService = {
  async getUsers() {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  }
};
