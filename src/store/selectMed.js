import { create } from 'zustand'

const useStoreMed = create((set) => ({
  medicines: [],

  addMedicine: (data) => {
    // console.log(data)
    set((state) => {
      const existsID = state.medicines.some(item => item.med_id === data.med_id);
      
      if (existsID) { 
        return state 
      }
      
      const newMedicine = {
        med_id: data.med_id,
        med_name: data.med_name,
        qty: 1,
        price: data.price,
      };
      
      return {
        ...state,
        medicines: [...state.medicines, newMedicine]
      };
    });
  },

  removeMedicine: (data) => {
    set((state) => {
      const filteredData = state.medicines.filter((item) => item.med_id !== data.med_id);
      return {
        ...state,
        medicines: filteredData
      }
    });
  },

  updateQty: (med_id, qty) =>
    set((state) => ({
      medicines: state.medicines.map((med) =>
        med.med_id === med_id
          ? { ...med, qty, total: qty * med.price }
          : med
      ),
    })),
     clearMedicine: () => set({ medicines: [] }),
}))

export default useStoreMed;
