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
 const handleSubmit = () => {
    if (!inspectionId) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
          message:
            'ທ່ານຕ້ອງເລືອກຄົນເຈັບແລະມີຂໍ້ມູນການປິ່ນປົວກ່ອນບັນທຶກການຈ່າຍຢາ',
        }),
      );
      return;
    }

    if (medicines.length === 0 && equipment.length === 0) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ບໍ່ມີລາຍການຢາ',
          message: 'ກະລຸນາເລືອກຢາຫຼືອຸປະກອນກ່ອນບັນທຶກ',
        }),
      );
      return;
    }

    onMedicineSubmit();
  };
  return (
    <>
      <div></div>
      <Alerts />
      <TypeMedicine refreshKey={refreshKey} medicines={allMedicines} />
        <div className="py-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !inspectionId ||
              (medicines.length === 0 && equipment.length === 0)
            }
            className={`px-6 py-2 rounded flex items-center gap-2 transition ${
              loading ||
              !inspectionId ||
              (medicines.length === 0 && equipment.length === 0)
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Save className="w-5 h-5" />
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </button>
      </div>
    </>
  );
};

export default InMedTag;
