import { create } from 'zustand';
import { URLBaseLocal } from '../lib/MyURLAPI';

const useInspectionStore = create((set) => ({
    dataInspectionBy: null,
    loading: false,
    error: null,

    fetchInspectionById: async (id) => {
        set({ loading: true, error: null });

        try {
            const res = await fetch(`${URLBaseLocal}/src/report/inspection/${id}`);
            const data = await res.json();

            if (data?.resultCode === '200') {
                set({ dataInspectionBy: data.data, loading: false });
            } else {
                set({ error: 'Failed to fetch inspection data', loading: false });
            }

        } catch (err) {
            set({ error: err.message, loading: false });
        }
    }
}));

export default useInspectionStore;