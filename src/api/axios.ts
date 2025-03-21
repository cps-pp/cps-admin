
import axios from 'axios';

const axiosCreate = axios.create({
  baseURL: 'http://localhost:4000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosCreate;

// // src/api/axios.ts

// // กำหนดค่า TOKEN_KEY เป็นชื่อของ header ที่จะใช้ในการส่ง token ไปพร้อมกับคำขอ API
// export const TOKEN_KEY = 'Authorization'; // หรือ 'X-Auth-Token' ขึ้นอยู่กับการตั้งค่าของ API

// // ตัวอย่าง axios instance ที่ใช้กับ token
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:3000',
//   headers: {
//     [TOKEN_KEY]: `Bearer ${localStorage.getItem('authToken')}`, // ดึง token จาก localStorage
//   },
// });

// // ส่งออก axios instance
// export default axiosInstance;
