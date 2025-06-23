import { create } from 'zustand'

const useStoreDisease = create((set) => ({
  dis: [],

  addDisease: (data) => {
    set((state) => {
      const existsID = state.dis.some(item => item.disease_id === data.disease_id);
      
      if (existsID) { 
        return state 
      }
      
      const newDisease = {
        disease_id: data.disease_id,
        disease_name: data.disease_name,
        qty: 1,
        price: data.price,
      };
      
      return {
        ...state,
        dis: [...state.dis, newDisease]
      };
    });
  },

  removeDisease: (data) => {
    set((state) => {
      const filteredData = state.dis.filter((item) => item.disease_id !== data.disease_id);
      return {
        ...state,
        dis: filteredData
      }
    });
  },

  updateQty: (disease_id, qty) =>
    set((state) => ({
      dis: state.dis.map((med) =>
        med.disease_id === disease_id
          ? { ...med, qty, total: qty * med.price }
          : med
      ),
    })),
}))

export default useStoreDisease;
