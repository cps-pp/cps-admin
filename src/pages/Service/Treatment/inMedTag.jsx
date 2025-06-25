import React from 'react';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import TypeMedicine from '../TypeService/TypeMedicine';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import ButtonBox from '../../../components/Button';
import { Save } from 'lucide-react';

const InMedTag = ({
  onMedicineSubmit,
  loading,
  inspectionId,
  isMedicineSaved,
    refreshKey,
}) => {
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
  //   console.log(medicines);

  // let newService = medicines.map((med) => ({
  //   med_id: med.med_id,
  //   med_qty: med.qty,
  //   price: med.price,
  // }));
  // let newService = [
  //   ...medicines.map((med) => ({
  //     med_id: med.med_id,
  //     med_qty: med.qty,
  //     price: med.price,
  //   })),
  //   ...equipment.map((item) => ({
  //     med_id: item.med_id,
  //     med_qty: item.qty,
  //     price: item.price,
  //   })),
  // ];

  // const checkStock = async () => {
  //   try {
  //     const response = await fetch(
  //       'http://localhost:4000/src/stock/checkstock',
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ data: newService }),
  //       },
  //     );

  //     const result = await response.json();

  //     if (result.resultCode === '400') {
  //       const stockList = result.stock || [];

  //       const jsxMessage = (
  //         <div>
  //           <p>
  //             <strong>ລາຍການຈ່າຍມີຈຳນວນບໍ່ພຽງພໍ:</strong>
  //           </p>
  //           <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
  //             {stockList.map((item) => (
  //               <li key={item.med_id}>
  //                 ລະຫັດ: <strong>{item.med_id}</strong> — ສັ່ງຈ່າຍ:{' '}
  //                 {item.order_qty}, ມີໃນລະບົບ: {item.available}
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       );

  //       dispatch(
  //         openAlert({
  //           type: 'error',
  //           title: 'ສິນຄ້າບໍ່ພຽງພໍ',
  //           message: jsxMessage,
  //         }),
  //       );

  //       return false;
  //     }

  //     return true;
  //   } catch (error) {
  //     console.error('Error checking stock:', error);
  //     return false;
  //   }
  // };

  // const handleSubmit = async () => {
  //   const isStockOk = await checkStock();
  //   if (!isStockOk) return;

  //   try {
  //     const response = await fetch(
  //       `http://localhost:4000/src/stock/prescription/${id}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ data: allMedicines }),
  //       },
  //     );

  //     const result = await response.json();

  //     if (result.status) {
  //       dispatch(
  //         openAlert({
  //           type: 'success',
  //           title: 'สำเร็จ',
  //           message: 'จ่ายยาเรียบร้อยแล้ว',
  //         }),
  //       );
  //     } else {
  //       dispatch(
  //         openAlert({
  //           type: 'error',
  //           title: 'ແຈ້ງເຕືອນ',
  //           message: 'ບໍ່ສາມາດຈ່າຍຢາ ແລະ ອຸປະກອນໄດ້ກະລຸນາກວດສອບຈຳນວນທີ່ປ້ອນ',
  //         }),
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error sending prescription:', error);
  //     //   dispatch(
  //     //     openAlert({
  //     //       type: 'error',
  //     //       title: 'ແຈ້ງເຕືອນ',
  //     //       message: 'ບໍ່ສາມາດເຊື່ອມ API ',
  //     //     })
  //     //   );
  //   }
  // };

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
