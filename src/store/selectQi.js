import { create } from 'zustand'

const useStoreQi = create((set) => ({
  medicine: [],

  addMedicine: (data) => {
    set((state) => {
      const existsID = state.medicine.some(item => item.med_id === data.med_id);
      
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
        medicine: [...state.medicine, newMedicine]
      };
    });
  },

  removeMedicine: (data) => {
    set((state) => {
      const filteredData = state.medicine.filter((item) => item.med_id !== data.med_id);
      return {
        ...state,
        medicine: filteredData
      }
    });
  },

  updateQty: (med_id, qty) =>
    set((state) => ({
      medicine: state.medicine.map((med) =>
        med.med_id === med_id
          ? { ...med, qty, total: qty * med.price }
          : med
      ),
    })),
}))

export default useStoreQi;


// import { create } from 'zustand'

// const useStoreQi = create((set) => ({
//   medicine: [],

//   addMedicine: (data) => {
//     // console.log(data)
//     set((state) => {
//       {
//         const addData = Array.from(new Set([...state.medicine, data]));
//         const customData = addData.map((item) => {
//           return {
//             med_id: item.med_id,
//             med_name: item.med_name,
//             qty: 1,
//             price: item.price,
//           }
          
//         })
       
//         return {
//           ...state,
//           medicine: customData
//         }
//       }
//     });
//   },
//   removeMedicine: (data) => {
//     set((state) => {
//       const filteredData = state.medicine.filter((item) => item.med_id !== data.med_id);
//       return {
//         ...state,
//         medicine: filteredData
//       }
//     });
//   },
//   updateQty: (med_id, qty) =>
//     set((state) => ({
//       medicine: state.medicine.map((med) =>
//         med.med_id === med_id
//           ? { ...med, qty, total: qty * med.price }
//           : med
//       ),
//     })),
// }))

// export default useStoreQi;