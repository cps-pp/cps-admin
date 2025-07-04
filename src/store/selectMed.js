import { create } from 'zustand'
import { URLBaseLocal } from '../lib/MyURLAPI';

const useStoreMed = create((set, get) => ({
  medicines: [],
  newMedicines: [],
  fetchInspectionMedById: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`${URLBaseLocal}/src/report/prescription?id=${id}&med_type=M1`);
      const data = await res.json();

      const detailed_med = data?.detail
      // console.log(detailed_med)
      if (data?.resultCode === '200') {
        set({
          newMedicines: detailed_med,
          loading: false
        });
      } else {
        set({ error: 'Failed to fetch inspection data', loading: false });
      }

    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
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
  addMedicineNews: (data) => {
    set((state) => {
      const existsID = state.newMedicines.some(item => item.med_id === data.med_id);

      if (existsID) {
        return state
      }

      const customMedicine = {
        med_id: data.med_id,
        med_name: data.med_name,
        qty: 1,
        price: data.price,
      };

      return {
        ...state,
        newMedicines: [...state.newMedicines, customMedicine]
      };
    });
  },
  removeMedicineNews: (data) => {
    set((state) => {
      const filteredData = state.newMedicines.filter((item) => item.med_id !== data.med_id);
      return {
        ...state,
        newMedicines: filteredData
      }
    });
  },
  updateQtyMedicineNews: (med_id, qty) =>
    set((state) => ({
      newMedicines: state.newMedicines.map((med) =>
        med.med_id === med_id
          ? { ...med, qty, total: qty * med.price }
          : med
      ),
    })),
  updateQty: (med_id, qty) =>
    set((state) => ({
      medicines: state.medicines.map((med) =>
        med.med_id === med_id
          ? { ...med, qty, total: qty * med.price }
          : med
      ),
    })),
}))

export default useStoreMed;