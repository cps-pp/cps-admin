import { create } from 'zustand';
import { URLBaseLocal } from '../lib/MyURLAPI';

const useStoreQi = create((set) => ({
  equipment: [],
  newEquipment: [],

  fetchInspectionEquipmentById: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `${URLBaseLocal}/src/report/prescription?id=${id}&med_type=M2`,
      );
      const data = await res.json();

      const detailed_med = data?.detail;

      if (data?.resultCode === '200') {
        set({
          newEquipment: detailed_med,
          loading: false,
        });
      } else {
        set({ error: 'Failed to fetch inspection data', loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  addMedicine: (data) => {
    set((state) => {
      const existsID = state.equipment.some(
        (item) => item.med_id === data.med_id,
      );

      if (existsID) {
        return state;
      }

      const newMedicine = {
        med_id: data.med_id,
        med_name: data.med_name,
        qty: 1,
        price: data.price,
      };

      return {
        ...state,
        equipment: [...state.equipment, newMedicine],
      };
    });
  },

  removeMedicine: (data) => {
    set((state) => {
      const filteredData = state.equipment.filter(
        (item) => item.med_id !== data.med_id,
      );
      return {
        ...state,
        equipment: filteredData,
      };
    });
  },
  addEquipmentNews: (data) => {
    set((state) => {
      const existsID = state.newEquipment.some(
        (item) => item.med_id === data.med_id,
      );

      if (existsID) {
        return state;
      }

      const customMedicine = {
        med_id: data.med_id,
        med_name: data.med_name,
        qty: 1,
        price: data.price,
      };

      return {
        ...state,
        newEquipment: [...state.newEquipment, customMedicine],
      };
    });
  },
  removeEquipmentNews: (data) => {
    set((state) => {
      const filteredData = state.newEquipment.filter(
        (item) => item.med_id !== data.med_id,
      );
      return {
        ...state,
        newEquipment: filteredData,
      };
    });
  },
  updateQtyEquipmentNews: (med_id, qty) =>
    set((state) => ({
      newEquipment: state.newEquipment.map((med) =>
        med.med_id === med_id ? { ...med, qty, total: qty * med.price } : med,
      ),
    })),
  updateQty: (med_id, qty) =>
    set((state) => ({
      equipment: state.equipment.map((med) =>
        med.med_id === med_id ? { ...med, qty, total: qty * med.price } : med,
      ),
    })),
  clearEquipment: () => set({ equipment: [], newEquipment: [] }),
}));

export default useStoreQi;
