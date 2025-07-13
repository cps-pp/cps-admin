import { create } from 'zustand'
import useStoreServices from './selectServices';

const useStoreDisease = create((set) => ({
  dis: [],
  disUpdate: [],

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

  addDiseaseUpdate: (data) => {
    set((state) => ({
      disUpdate: [...state.disUpdate, ...data.map(item => item.disease_name)]
    }));
  },

  removeDiseaseUpdate: (indexToRemove) => {
    set((state) => ({
      disUpdate: state.disUpdate.filter((_, index) => index !== indexToRemove),
    }));
  },

  getDiseasesForUpdate: () => {
    const data = useStoreServices.getState().dataInspectionBy
    const splitDiseases = data.diseases?.split(',').map(d => d.trim()) || []
    set({ disUpdate: splitDiseases })
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
