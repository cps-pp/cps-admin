import React from 'react';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import TypeMedicine from '../TypeService/TypeMedicine';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import ButtonBox from '../../../components/Button';
import { Save } from 'lucide-react';

const InMedTag = ({ onMedicineSubmit, loading, inspectionId, refreshKey }) => {
  const { medicines } = useStoreMed();
  const { equipment } = useStoreQi();
  const dispatch = useAppDispatch();

  const allMedicines = [
    ...medicines.map((med) => ({
      ...med,
      name: med.med_name || med.name,
    })),
    ...equipment.map((item) => ({
      ...item,
      name: item.med_name || item.name,
    })),
  ];
  // const handleClick = () => {
  //   console.log('inspectionId:', inspectionId);
  //   if (!inspectionId) {
  //     dispatch(
  //       openAlert({
  //         type: 'warning',
  //         title: 'ກະລຸນາເລືອກຄົນເຈັບ',
  //         message: 'ກ່ອນບັນທຶກການປິ່ນປົວ ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
  //       }),
  //     );
  //     return;
  //   }

  //   onMedicineSubmit();
  // };

  return (
    <>
      <div></div>
      <Alerts />
      <TypeMedicine refreshKey={refreshKey} medicines={allMedicines} />
      <div className="py-4 flex justify-end">
        <button
          onClick={() => {
            console.log('inspectionId:', inspectionId);
            if (!inspectionId) {
              dispatch(
                openAlert({
                  type: 'warning',
                  title: 'ກະລຸນາເລືອກຄົນເຈັບ',
                  message: 'ກ່ອນບັນທຶກການຈ່າຍຢາ ແລະ ອຸປະກອນ ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
                }),
              );
              return;
            }
            onMedicineSubmit();
          }}
          className={`px-6 py-2 rounded flex items-center gap-2 transition
    bg-green-600 text-white hover:bg-green-700`}
        >
          <Save className="w-5 h-5" />
          {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
        </button>
      </div>
    </>
  );
};

export default InMedTag;
