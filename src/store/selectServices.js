
import { create } from 'zustand'
import { URLBaseLocal } from '../lib/MyURLAPI';

const useStoreServices = create((set) => ({
  services: [],
  newServices: [],
  dataInspectionBy: null,

  addService: (data) => {

    set((state) => {
      {
        const addData = Array.from(new Set([...state.services, data]));
        const customData = addData.map((item) => {
          return {
            ser_id: item.ser_id,
            ser_name: item.ser_name,
            qty: 1,
            price: item.price,
          }
        })
        // Check same id
        const existsID = state.services.some(item => item.ser_id === data.ser_id);
        if (existsID) { return state }

        // if (exists) {
        //   return {
        //     ...state,
        //     services: state.services.map(item => item.ser_id === data.ser_id ? { ...item, qty: item.qty + 1 } : item)
        //   }
        // }
        return {
          ...state,
          services: customData
        }
      }
    });
  },
  removeService: (data) => {
    set((state) => {
      const filteredData = state.services.filter((item) => item.ser_id !== data.ser_id);
      return {
        ...state,
        services: filteredData
      }
    });
  },
  addServiceNews: (data) => {
    set((state) => {
      const exists = state.newServices.some(s => s.ser_id === data.ser_id);
      const updated = exists
        ? state.newServices
        : [...state.newServices, { ...data, qty: 1 }];

      return { newServices: updated };
    });
  },
  removeServiceNews: (data) => {
    set((state) => {
      const filteredData = state.newServices.filter((item) => item.ser_id !== data.ser_id);
      return {
        ...state,
        newServices: filteredData
      }
    });
  },
  fetchInspectionById: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${URLBaseLocal}/src/report/inspection/${id}`);
      const data = await res.json();

      const detailed_services = data?.data?.services

      if (data?.resultCode === '200') {
        set({
          dataInspectionBy: data.data,
          newServices: detailed_services,
          loading: false
        });
      } else {
        set({ error: 'Failed to fetch inspection data', loading: false });
      }

    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}))

export default useStoreServices;