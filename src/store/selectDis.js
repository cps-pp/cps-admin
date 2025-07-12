import { create } from 'zustand'

const useStoreDisease = create((set) => ({
  dis: [],
  disUpdate: [],
  addDisease: (data) => {
    set((state) => ({
      dis: [...state.dis, ...data.map(item => item.disease_name)]
    }));
  },

  removeDisease: (indexToRemove) => {
    set((state) => ({
      dis: state.dis.filter((_, index) => index !== indexToRemove),
    }));
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
