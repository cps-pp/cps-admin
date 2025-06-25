import { create } from 'zustand'

const useStoreQi = create((set) => ({
  equipment: [],

  addMedicine: (data) => {
    set((state) => {
      const existsID = state.equipment.some(item => item.med_id === data.med_id);
      
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
        equipment: [...state.equipment, newMedicine]
      };
    });
  },

  removeMedicine: (data) => {
    set((state) => {
      const filteredData = state.equipment.filter((item) => item.med_id !== data.med_id);
      return {
        ...state,
        equipment: filteredData
      }
    });
  },

  updateQty: (med_id, qty) =>
    set((state) => ({
      equipment: state.equipment.map((med) =>
        med.med_id === med_id
          ? { ...med, qty, total: qty * med.price }
          : med
      ),
    })),
        clearEquipment: () => set({ equipment: [] }),
}))

export default useStoreQi;

