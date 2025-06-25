
import { create } from 'zustand'

const useStoreServices = create((set) => ({
  services: [],

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
    clearServices: () => {
    set({ services: [] });
  },
}))

export default useStoreServices;