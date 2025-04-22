// src/api/getAppointments.ts
export const getAppointments = async () => {
    try {
      const res = await fetch('http://localhost:4000/appoint/appointment');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  };
  