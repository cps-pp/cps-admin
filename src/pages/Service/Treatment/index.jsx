// import React, { useEffect, useState } from 'react';
// import { FileText } from 'lucide-react';
// import Button from '@/components/Button';
// import TypeService from '../TypeService/TypeService';
// import { useForm } from 'react-hook-form';
// import SelectPatientPopup from '../TypeService/Component/SelectPatientPopup';
// import AntdTextArea from '../../../components/Forms/AntdTextArea';
// import BoxDate from '../../../components/Date';
// import InputBox from '../../../components/Forms/Input_new';
// import useStoreServices from '../../../store/selectServices';
// import BillPopup from './BillPopup';
// import useStoreMed from '../../../store/selectMed';
// import useStoreQi from '../../../store/selectQi';

// import { Tabs } from 'antd';
// import InTreatmentService from './inTreatment';
// import InMedTag from './inMedTag';
// const onChange = (key) => {
//   console.log(key);
// };
// const Treatment = () => {
//   const items = [
//     {
//       key: '1',
//           label: <span className="text-lg font-semibold">ການປິ່ນປົວ</span>,
//       children: <InTreatmentService />,
//     },
//     {
//       key: '2',
//       label: <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>,
//       children: <InMedTag />,
//     },
//   ];
//   return (
//     <div className="rounded-lg bg-white pt-4 p-4 dark:bg-boxdark shadow-md">
//       {/* <div className="mb-6 border-b border-stroke dark:border-strokedark pb-4">
//         <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
//           ບໍລິການ
//         </h1>
//       </div> */}

//       <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
//     </div>
//   );
// };

// export default Treatment;
// ใน Treatment.jsx
import { FileText, Save } from 'lucide-react'; 
import { Tabs } from 'antd';
import InTreatmentService from './inTreatment';
import InMedTag from './inMedTag';
import { useState } from 'react';
import BillPopup from './BillPopup';
import useStoreServices from '../../../store/selectServices';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import { useForm } from 'react-hook-form';

const Treatment = () => {
  const [loading, setLoading] = useState(false);
  const { services } = useStoreServices();
  const { medicines } = useStoreMed();
  const { equipment } = useStoreQi();
  const [showPopup, setShowPopup] = useState(false);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [inspectionId, setInspectionId] = useState(null);
  
  // เพิ่ม state สำหรับเก็บรายการที่บันทึกแล้ว
  const [savedServices, setSavedServices] = useState([]);
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [savedInspectionData, setSavedInspectionData] = useState(null);
  const [savedPatientData, setSavedPatientData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    in_id: '',
    date: '',
  });
  const [intivalue, setIntivalue] = useState({
    diseases_now: '',
    symptom: '',
    note: '',
    checkup: '',
  });
  const dispatch = useAppDispatch();

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const items = [
    {
      key: '1',
      label: <span className="text-lg font-semibold">ການປິ່ນປົວ</span>,
      children: (
        <InTreatmentService
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          inspectionId={inspectionId}
          setInspectionId={setInspectionId}
          formData={formData}
          setFormData={setFormData}
          intivalue={intivalue}
          setIntivalue={setIntivalue}
          setValue={setValue}
          register={register}
          errors={errors}
        />
      ),
    },
    {
      key: '2',
      label: (
        <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>
      ),
      children: <InMedTag />,
    },
  ];

  const HandlenSubmit = async () => {
    console.log('Starting submit...');
    setLoading(true);

    let newService = services.map((item) => ({
      ser_id: item.ser_id,
      qty: item.qty,
      price: item.price,
    }));

    const sendData = {
      diseases_now: intivalue.diseases_now || '',
      symptom: intivalue.symptom || '',
      note: intivalue.note || '',
      checkup: intivalue.checkup || '',
      detailed: newService,
    };

    const medicineData = [
      ...medicines.map((med) => ({
        med_id: med.med_id,
        qty: med.qty,
        price: med.price,
      })),
      ...equipment.map((item) => ({
        med_id: item.med_id,
        qty: item.qty,
        price: item.price,
      })),
    ];

    const sendMed = { data: medicineData };

    try {
      const response = await fetch(
        `http://localhost:4000/src/in/inspection/${inspectionId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sendData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Inspection response:', result);

      const medicineRes = await fetch(
        `http://localhost:4000/src/in/inspectionmedicines/${inspectionId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sendMed),
        },
      );

      if (!medicineRes.ok) {
        // throw new Error(`HTTP error! status: ${medicineRes.status}`);
      }

      const results = await medicineRes.json();
      console.log('equipment response:', results);

      setSavedServices([...services]);
      setSavedMedicines([
        ...medicines.map((med) => ({
          ...med,
          name: med.med_name || med.name,
        })),
        ...equipment.map((item) => ({
          ...item,
          name: item.med_name || item.name,
        })),
      ]);
      setSavedInspectionData({
        in_id: inspectionId,
        date: formData.date,
        symptom: intivalue.symptom,
        checkup: intivalue.checkup,
        diseases_now: intivalue.diseases_now,
        note: intivalue.note,
      });
      setSavedPatientData(selectedPatient); 
      setIsSaved(true);

      // alert('ບັນທຶກສຳເລັດ');

  
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('ມີຂໍ້ຜິດພາດ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkStockBeforeBill = async () => {
    // if (!isSaved) {
    //   dispatch(
    //     openAlert({
    //       type: 'warning',
    //       title: 'ກະລຸນາບັນທຶກການປິ່ນປົວກ່ອນ',
    //       message: 'ທ່ານຕ້ອງບັນທຶກຂໍ້ມູນການປິ່ນປົວກ່ອນເບິ່ງໃບບິນ',
    //     }),
    //   );
    //   return false;
    // }

    const medicineData = [
      ...medicines.map((med) => ({
        med_id: med.med_id,
        med_qty: med.qty,
        price: med.price,
      })),
      ...equipment.map((item) => ({
        med_id: item.med_id,
        med_qty: item.qty,
        price: item.price,
      })),
    ];

    try {
      const response = await fetch(
        'http://localhost:4000/src/stock/checkstock',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: medicineData }),
        },
      );

      const result = await response.json();

      if (result.resultCode === '400') {
        const stockList = result.stock || [];

        const jsxMessage = (
          <div>
            <p>
              <strong>ລາຍການຈ່າຍມີຈຳນວນບໍ່ພຽງພໍ:</strong>
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              {stockList.map((item) => (
                <li key={item.med_id}>
                  ລະຫັດ: <strong>{item.med_id}</strong> — ສັ່ງຈ່າຍ:{' '}
                  {item.order_qty}, ມີໃນລະບົບ: {item.available}
                </li>
              ))}
            </ul>
          </div>
        );

        dispatch(
          openAlert({
            type: 'error',
            title: 'ສິນຄ້າບໍ່ພຽງພໍ',
            message: jsxMessage,
          }),
        );

        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking stock:', error);
      return false;
    }
  };

  // เพิ่มฟังก์ชันสำหรับตัดสต็อก
  const deductStock = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/src/stock/prescription/${inspectionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to deduct stock: ${response.status}`);
      }

      const result = await response.json();
      console.log('Stock deduction response:', result);
      
      dispatch(
        openAlert({
          type: 'success',
          title: 'ຕັດສິນຄ້າສຳເລັດ',
          message: 'ລະບົບໄດ້ຕັດສິນຄ້າອອກຈາກສາງແລ້ວ',
        }),
      );

      return true;
    } catch (error) {
      console.error('Error deducting stock:', error);
      // dispatch(
      //   openAlert({
      //     type: 'error',
      //     title: 'ຕັດສິນຄ້າບໍ່ສຳເລັດ',
      //     message: 'ເກີດຂໍ້ຜິດພາດໃນການຕັດສິນຄ້າ: ' + error.message,
      //   }),
      // );
      return false;
    }
  };

  const handleShowBill = async () => {
    if (!inspectionId) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
          message: 'ທ່ານຕ້ອງເລືອກຄົນເຈັບແລະມີຂໍ້ມູນການປິ່ນປົວກ່ອນ',
        }),
      );
      return;
    }

    if (!selectedPatient) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
          message: 'ທ່ານຕ້ອງເລືອກຄົນເຈັບກ່ອນເບິ່ງໃບບິນ',
        }),
      );
      return;
    }

    if (!isSaved) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ກະລຸນາບັນທຶກການປິ່ນປົວກ່ອນເບິ່ງໃບບິນ',
          message: 'ທ່ານຕ້ອງບັນທຶກຂໍ້ມູນການປິ່ນປົວ (ລວມທັງຂໍ້ມູນຄົນເຈັບ) ກ່ອນເບິ່ງໃບບິນ',
        }),
      );
      return;
    }

    const isStockOk = await checkStockBeforeBill();
    if (!isStockOk) return;

    setShowBillPopup(true);
  };

  const handleSaveAndCheckStock = async () => {
    const isStockOk = await checkStockBeforeBill();
    if (!isStockOk) return;

    // บันทึกข้อมูลก่อน
    await HandlenSubmit();
    
    // ตัดสต็อกหลังจากบันทึกสำเร็จ
    await deductStock();
  };

  return (
    <div className="rounded-lg bg-white pt-4 p-4 dark:bg-boxdark shadow-md relative ">
      <Tabs defaultActiveKey="1" items={items} />

      <div
        className="fixed bottom-0 flex justify-end items-center py-2 bg-white p-4  z-50"
        style={{
          right: '-500px',
          width: 'calc(100% + 250px)',
        }}
      >
       <button
  type="button"
  onClick={handleShowBill}
  disabled={!isSaved}
  className={`${
    isSaved 
      ? 'bg-slate-500 hover:bg-slate-600' 
      : 'bg-gray-400 cursor-not-allowed'
  } text-white text-md px-6 py-2 mr-[4px] rounded flex items-center gap-2 transition`}
>
  <FileText className="w-5 h-5" /> {/* ไอคอนใบบิล */}
  ກົດເບິ່ງໃບບິນ
</button>

<button
  onClick={handleSaveAndCheckStock}
  disabled={loading || !inspectionId}
  className="ml-4 bg-green-600 text-white px-5 mr-[550px] py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
>
  {loading ? 'ກຳລັງບັນທຶກ...' : (
    <>
      <Save className="w-5 h-5" /> {/* ไอคอนบันทึก */}
      ບັນທຶກ
    </>
  )}
</button>
      </div>

      {/* ใช้ข้อมูลที่บันทึกแล้วในใบบิล */}
      <BillPopup
        isOpen={showBillPopup}
        onClose={() => setShowBillPopup(false)}
        patientData={selectedPatient}
        inspectionData={savedInspectionData}
        services={savedServices}
        medicines={savedMedicines}
      />

      <Alerts />
    </div>
  );
};

export default Treatment;