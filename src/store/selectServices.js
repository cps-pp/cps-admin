import { create } from 'zustand';

const useStoreServices = create((set) => ({
  services: [],
  addService: (data) => {
    set((state) => {
      {
        const addData = Array.from(new Set([...state.services, data]));
        let checkID = addData.filter((item) => item.ser_id == data.ser_id);
        return{
            ...state,
            services: checkID
        }
      }
    });
  },
}));

export default useStoreServices;
