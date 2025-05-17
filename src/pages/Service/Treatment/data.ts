// src/data.ts

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experienceYears: number;
  availability: string[];
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface Appointment {
  id: number;
  patientName: string;
  doctorId: number;
  serviceId: number;
  dateTime: string;
}

export const doctors: Doctor[] = [
  { id: 1, name: "ดร. สมชาย", specialization: "ทันตแพทย์ทั่วไป", experienceYears: 10, availability: ["จันทร์", "พุธ", "ศุกร์"] },
  { id: 2, name: "ดร. สุดารัตน์", specialization: "ทันตแพทย์ประจำครอบครัว", experienceYears: 8, availability: ["อังคาร", "พฤหัสบดี", "เสาร์"] }
];

export const services: Service[] = [
  { id: 1, name: "ขูดหินปูน", description: "บริการขูดหินปูนเพื่อสุขภาพช่องปาก", price: 500 },
  { id: 2, name: "ตรวจสุขภาพช่องปาก", description: "การตรวจสอบช่องปากและฟันเพื่อการรักษา", price: 300 }
];
