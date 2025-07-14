import { create } from 'zustand'
import useStoreServices from './selectServices';

const useStoreDisease = create((set) => ({
  dis: [],
  disUpdate: [],
<<<<<<< HEAD
=======

>>>>>>> test-3
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

<<<<<<< HEAD
=======
  addDiseaseUpdate: (data) => {
    set((state) => ({
      disUpdate: [...state.disUpdate, ...data.map(item => item.disease_name)]
    }));
  },

>>>>>>> test-3
  removeDiseaseUpdate: (indexToRemove) => {
    set((state) => ({
      disUpdate: state.disUpdate.filter((_, index) => index !== indexToRemove),
    }));
  },
<<<<<<< HEAD
=======

  getDiseasesForUpdate: () => {
    const data = useStoreServices.getState().dataInspectionBy
    const splitDiseases = data.diseases?.split(',').map(d => d.trim()) || []
    set({ disUpdate: splitDiseases })
  },
>>>>>>> test-3

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
