import { FileText, User, Pill, Stethoscope, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Tabs } from 'antd';
import InTreatmentService from './inTreatment';
import InMedTag from './inMedTag';
import { useState ,useEffect } from 'react';
import BillPopup from './BillPopup';
import useStoreServices from '../../../store/selectServices';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import { useForm } from 'react-hook-form';


const Treatment = () => {
  const [activeTab, setActiveTab] = useState('treatment');
  const [loading, setLoading] = useState(false);
  const { services } = useStoreServices();
  const { medicines } = useStoreMed();
  const { equipment } = useStoreQi();
  const [showPopup, setShowPopup] = useState(false);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [inspectionId, setInspectionId] = useState(null);
  const [isInvoiceGenerated, setIsInvoiceGenerated] = useState(false);
  const [savedServices, setSavedServices] = useState([]);
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [savedInspectionData, setSavedInspectionData] = useState(null);
  const [savedPatientData, setSavedPatientData] = useState(null);
  const [isTreatmentSaved, setIsTreatmentSaved] = useState(false);
  const [isMedicineSaved, setIsMedicineSaved] = useState(false);
  // เพิ่ม state สำหรับเก็บ invoiceData
  const [invoiceData, setInvoiceData] = useState(null);

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

  // ฟังก์ชันสร้าง invoice

   const generateInvoice = async () => {
    const totalServiceCost = savedServices.reduce(
      (total, service) => total + service.price * service.qty,
      0,
    );
    const totalMedicineCost = savedMedicines.reduce(
      (total, medicine) => total + medicine.price * medicine.qty,
      0,
    );
    const grandTotal = totalServiceCost + totalMedicineCost;

    try {
      const response = await fetch(
        'http://localhost:4000/src/invoice/invoice',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: grandTotal,
            in_id: inspectionId,
          }),
        },
      );

      if (response.ok) {
        const resData = await response.json();
        const invoice = resData.data;
        console.log('Invoice generated:', invoice);
        setInvoiceData(invoice);
        setIsInvoiceGenerated(true); // ตั้งค่าว่าสร้าง invoice แล้ว
        return invoice;
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      return null;
    }
  };
  const handleRefresh = () => {
    // Reset form data
    setFormData({
      patient_id: '',
      in_id: '',
      date: '',
    });
    
    setIntivalue({
      diseases_now: '',
      symptom: '',
      note: '',
      checkup: '',
    });
    
    // Reset patient and inspection
    setSelectedPatient(null);
    setInspectionId(null);
    
    // Reset saved data
    setSavedServices([]);
    setSavedMedicines([]);
    setSavedInspectionData(null);
    setSavedPatientData(null);
    
    // Reset flags
    setIsTreatmentSaved(false);
    setIsMedicineSaved(false);
    setIsInvoiceGenerated(false);
    setInvoiceData(null);
    
    // Reset loading state
    setLoading(false);
    
    // Clear services, medicines, equipment stores
    // คุณอาจต้องเพิ่ม clear functions ใน stores
    // dispatch(clearServices?.()); // ถ้ามี action สำหรับ clear
    // dispatch(clearMedicines?.()); // ถ้ามี action สำหรับ clear
    // dispatch(clearEquipment?.()); // ถ้ามี action สำหรับ clear
    
    console.log('Data refreshed successfully');
  };

  // const handleShowBill = async () => {
  //   try {
  //     if (!invoiceData || !isInvoiceGenerated) {
  //       console.log('Creating new invoice...');
  //       const newInvoice = await generateInvoice();
  //       if (newInvoice) {
  //         setShowBillPopup(true);
  //       }
  //     } else {
  //       setShowBillPopup(true);
  //     }
  //   } catch (error) {
  //     console.error('Error in handleShowBill:', error);
  //   }
  // };

  // // เมื่อมีการเปลี่ยนแปลง inspection, services, หรือ medicines ให้รีเซ็ต invoice
  // useEffect(() => {
  //   if (savedServices.length > 0 || savedMedicines.length > 0) {
  //     setIsInvoiceGenerated(false); // รีเซ็ตสถานะการสร้าง invoice
  //     setInvoiceData(null); // เคลียร์ invoice เดิม
  //   }
  // }, [savedServices, savedMedicines, inspectionId]);


  // const generateInvoice = async () => {
  //   const totalServiceCost = savedServices.reduce(
  //     (total, service) => total + service.price * service.qty,
  //     0,
  //   );
  //   const totalMedicineCost = savedMedicines.reduce(
  //     (total, medicine) => total + medicine.price * medicine.qty,
  //     0,
  //   );
  //   const grandTotal = totalServiceCost + totalMedicineCost;

  //   try {
  //     const response = await fetch(
  //       'http://localhost:4000/src/invoice/invoice',
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           total: grandTotal,
  //           in_id: inspectionId,
  //         }),
  //       },
  //     );

  //     if (response.ok) {
  //       const resData = await response.json();
  //       const invoice = resData.data;
  //       console.log('Invoice generated:', invoice);
  //       setInvoiceData(invoice);
  //       return invoice;
  //     }
  //   } catch (error) {
  //     console.error('Failed to generate invoice:', error);
  //     return null;
  //   }
  // };

  // ฟังก์ชันบันทึกการรักษา
  const handleTreatmentSubmit = async () => {
    console.log('Starting treatment submit...');
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
      console.log('Treatment response:', result);

      setSavedServices([...services]);
      setSavedInspectionData({
        in_id: inspectionId,
        date: formData.date,
        symptom: intivalue.symptom,
        checkup: intivalue.checkup,
        diseases_now: intivalue.diseases_now,
        note: intivalue.note,
      });
      setSavedPatientData(selectedPatient);
      setIsTreatmentSaved(true);
      
    

      dispatch(
        openAlert({
          type: 'success',
          title: 'ບັນທຶກການປິ່ນປົວສຳເລັດ',
          message: 'ຂໍ້ມູນການປິ່ນປົວໄດ້ຖືກບັນທຶກແລ້ວ',
        }),
      );
    } catch (error) {
      console.error('Error submitting treatment:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ບັນທຶກການປິ່ນປົວບໍ່ສຳເລັດ',
          message: 'ມີຂໍ້ຜິດພາດ: ' + error.message,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันบันทึกการจ่ายยา
  const handleMedicineSubmit = async () => {
    console.log('Starting medicine submit...');
    setLoading(true);

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

    console.log(medicineData);

    const sendMed = { data: medicineData };

    try {
      const stockCheckResponse = await fetch(
        'http://localhost:4000/src/stock/checkstock',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: medicineData.map((item) => ({
              med_id: item.med_id,
              med_qty: item.qty,
              price: item.price,
            })),
          }),
        },
      );

      const stockResult = await stockCheckResponse.json();

      if (stockResult.resultCode === '400') {
        const stockList = stockResult.stock || [];

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
        return;
      }

      const deductResponse = await fetch(
        `http://localhost:4000/src/stock/prescription/${inspectionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: medicineData.map((item) => ({
              med_id: item.med_id,
              med_qty: item.qty,
              price: item.price,
            })),
          }),
        },
      );

      if (!deductResponse.ok) {
        throw new Error(`Failed to deduct stock: ${deductResponse.status}`);
      }

      const deductResult = await deductResponse.json();
      console.log('Stock deduction response:', deductResult);

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
      setIsMedicineSaved(true);
      


      dispatch(
        openAlert({
          type: 'success',
          title: 'ບັນທຶກການຈ່າຍຢາສຳເລັດ',
          message: 'ລະບົບໄດ້ບັນທຶກການຈ່າຍຢາແລະຕັດສິນຄ້າອອກຈາກສາງແລ້ວ',
        }),
      );
    } catch (error) {
      console.error('Error submitting medicine:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ບັນທຶກການຈ່າຍຢາບໍ່ສຳເລັດ',
          message: 'ມີຂໍ້ຜິດພາດ: ' + error.message,
        }),
      );
    } finally {
      setLoading(false);
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

    if (!isTreatmentSaved && !isMedicineSaved) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ກະລຸນາບັນທຶກຂໍ້ມູນກ່ອນ',
          message: 'ທ່ານຕ້ອງບັນທຶກຂໍ້ມູນການປິ່ນປົວຫຼືການຈ່າຍຢາກ່ອນເບິ່ງໃບບິນ',
        }),
      );
      return;
    }

    if (!invoiceData) {
      await generateInvoice();
    }

    setShowBillPopup(true);
  };

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
          onTreatmentSubmit={handleTreatmentSubmit}
          loading={loading}
          isTreatmentSaved={isTreatmentSaved}
        />
      ),
    },
    {
      key: '2',
      label: (
        <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>
      ),
      children: (
        <InMedTag
          onMedicineSubmit={handleMedicineSubmit}
          loading={loading}
          inspectionId={inspectionId}
          isMedicineSaved={isMedicineSaved}
        />
      ),
    },
  ];

  return (
    <>
    
      <div className="rounded bg-white pt-4 p-4  shadow-md relative ">
        <Tabs defaultActiveKey="1" items={items} />
        <button
          type="button"
          onClick={handleShowBill}
          disabled={!isTreatmentSaved && !isMedicineSaved}
          className={`${
            isTreatmentSaved || isMedicineSaved
              ? 'bg-slate-500 hover:bg-slate-600'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white text-md px-6 py-2 rounded flex items-center gap-2 transition`}
        >
          <FileText className="w-5 h-5" />
          ກົດເບິ່ງໃບບິນ
        </button>

        <BillPopup
          isOpen={showBillPopup}
          onClose={() => setShowBillPopup(false)}
          patientData={selectedPatient}
          inspectionData={savedInspectionData}
          services={savedServices}
          medicines={savedMedicines}
          invoiceData={invoiceData} 
              onRefresh={handleRefresh}
        />

        <Alerts />
      </div>
    </>
  );
};

export default Treatment;
// const Treatment = () => {
//   const [loading, setLoading] = useState(false);
//   const { services } = useStoreServices();
//   const { medicines } = useStoreMed();
//   const { equipment } = useStoreQi();
//   const [showPopup, setShowPopup] = useState(false);
//   const [showBillPopup, setShowBillPopup] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [inspectionId, setInspectionId] = useState(null);
// const [invoiceData, setInvoiceData] = useState(null);
//   const [savedServices, setSavedServices] = useState([]);
//   const [savedMedicines, setSavedMedicines] = useState([]);
//   const [savedInspectionData, setSavedInspectionData] = useState(null);
//   const [savedPatientData, setSavedPatientData] = useState(null);
//   const [isTreatmentSaved, setIsTreatmentSaved] = useState(false);
//   const [isMedicineSaved, setIsMedicineSaved] = useState(false);

//   const [formData, setFormData] = useState({
//     patient_id: '',
//     in_id: '',
//     date: '',
//   });
//   const [intivalue, setIntivalue] = useState({
//     diseases_now: '',
//     symptom: '',
//     note: '',
//     checkup: '',
//   });
//   const dispatch = useAppDispatch();

//   const {
//     register,
//     setValue,
//     formState: { errors },
//   } = useForm();

//   // ฟังก์ชันบันทึกการรักษา
//   const handleTreatmentSubmit = async () => {
//     console.log('Starting treatment submit...');
//     setLoading(true);

//     let newService = services.map((item) => ({
//       ser_id: item.ser_id,
//       qty: item.qty,
//       price: item.price,
//     }));

//     const sendData = {
//       diseases_now: intivalue.diseases_now || '',
//       symptom: intivalue.symptom || '',
//       note: intivalue.note || '',
//       checkup: intivalue.checkup || '',
//       detailed: newService,
//     };

//     try {
//       const response = await fetch(
//         `http://localhost:4000/src/in/inspection/${inspectionId}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(sendData),
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('Treatment response:', result);

//       setSavedServices([...services]);
//       setSavedInspectionData({
//         in_id: inspectionId,
//         date: formData.date,
//         symptom: intivalue.symptom,
//         checkup: intivalue.checkup,
//         diseases_now: intivalue.diseases_now,
//         note: intivalue.note,
//       });
//       setSavedPatientData(selectedPatient);
//       setIsTreatmentSaved(true);

//       dispatch(
//         openAlert({
//           type: 'success',
//           title: 'ບັນທຶກການປິ່ນປົວສຳເລັດ',
//           message: 'ຂໍ້ມູນການປິ່ນປົວໄດ້ຖືກບັນທຶກແລ້ວ',
//         }),
//       );
//     } catch (error) {
//       console.error('Error submitting treatment:', error);
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ບັນທຶກການປິ່ນປົວບໍ່ສຳເລັດ',
//           message: 'ມີຂໍ້ຜິດພາດ: ' + error.message,
//         }),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ฟังก์ชันบันทึกการจ่ายยา
//   const handleMedicineSubmit = async () => {
//     console.log('Starting medicine submit...');
//     setLoading(true);

//     const medicineData = [
//       ...medicines.map((med) => ({
//         med_id: med.med_id,
//         qty: med.qty,
//         price: med.price,
//       })),
//       ...equipment.map((item) => ({
//         med_id: item.med_id,
//         qty: item.qty,
//         price: item.price,
//       })),
//     ];

//     console.log(medicineData);

//     const sendMed = { data: medicineData };

//     try {
//       // ตรวจสอบสต็อกก่อน
//       const stockCheckResponse = await fetch(
//         'http://localhost:4000/src/stock/checkstock',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             data: medicineData.map((item) => ({
//               med_id: item.med_id,
//               med_qty: item.qty,
//               price: item.price,
//             })),
//           }),
//         },
//       );

//       const stockResult = await stockCheckResponse.json();

//       if (stockResult.resultCode === '400') {
//         const stockList = stockResult.stock || [];

//         const jsxMessage = (
//           <div>
//             <p>
//               <strong>ລາຍການຈ່າຍມີຈຳນວນບໍ່ພຽງພໍ:</strong>
//             </p>
//             <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
//               {stockList.map((item) => (
//                 <li key={item.med_id}>
//                   ລະຫັດ: <strong>{item.med_id}</strong> — ສັ່ງຈ່າຍ:{' '}
//                   {item.order_qty}, ມີໃນລະບົບ: {item.available}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         );

//         dispatch(
//           openAlert({
//             type: 'error',
//             title: 'ສິນຄ້າບໍ່ພຽງພໍ',
//             message: jsxMessage,
//           }),
//         );
//         return;
//       }

      
//       // const medicineRes = await fetch(
//       //   `http://localhost:4000/src/in/inspectionmedicines/${inspectionId}`,
//       //   {
//       //     method: 'PUT',
//       //     headers: { 'Content-Type': 'application/json' },
//       //     body: JSON.stringify(sendMed),
//       //   },
//       // );

//       // if (!medicineRes.ok) {
//       //   throw new Error(`HTTP error! status: ${medicineRes.status}`);
//       // }

//       // const results = await medicineRes.json();
//       // console.log('Medicine response:', results);

//       // ตัดสต็อก
//       const deductResponse = await fetch(
//         `http://localhost:4000/src/stock/prescription/${inspectionId}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             data: medicineData.map((item) => ({
//               med_id: item.med_id,
//               med_qty: item.qty,
//               price: item.price,
//             })),
//           }),
//         },
//       );

//       if (!deductResponse.ok) {
//         throw new Error(`Failed to deduct stock: ${deductResponse.status}`);
//       }

//       const deductResult = await deductResponse.json();
//       console.log('Stock deduction response:', deductResult);

//       setSavedMedicines([
//         ...medicines.map((med) => ({
//           ...med,
//           name: med.med_name || med.name,
//         })),
//         ...equipment.map((item) => ({
//           ...item,
//           name: item.med_name || item.name,
//         })),
//       ]);
//       setIsMedicineSaved(true);

//       dispatch(
//         openAlert({
//           type: 'success',
//           title: 'ບັນທຶກການຈ່າຍຢາສຳເລັດ',
//           message: 'ລະບົບໄດ້ບັນທຶກການຈ່າຍຢາແລະຕັດສິນຄ້າອອກຈາກສາງແລ້ວ',
//         }),
//       );
//     } catch (error) {
//       console.error('Error submitting medicine:', error);
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ບັນທຶກການຈ່າຍຢາບໍ່ສຳເລັດ',
//           message: 'ມີຂໍ້ຜິດພາດ: ' + error.message,
//         }),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowBill = async () => {
//     if (!inspectionId) {
//       dispatch(
//         openAlert({
//           type: 'warning',
//           title: 'ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
//           message: 'ທ່ານຕ້ອງເລືອກຄົນເຈັບແລະມີຂໍ້ມູນການປິ່ນປົວກ່ອນ',
//         }),
//       );
//       return;
//     }

//     if (!selectedPatient) {
//       dispatch(
//         openAlert({
//           type: 'warning',
//           title: 'ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
//           message: 'ທ່ານຕ້ອງເລືອກຄົນເຈັບກ່ອນເບິ່ງໃບບິນ',
//         }),
//       );
//       return;
//     }

//     if (!isTreatmentSaved && !isMedicineSaved) {
//       dispatch(
//         openAlert({
//           type: 'warning',
//           title: 'ກະລຸນາບັນທຶກຂໍ້ມູນກ່ອນ',
//           message: 'ທ່ານຕ້ອງບັນທຶກຂໍ້ມູນການປິ່ນປົວຫຼືການຈ່າຍຢາກ່ອນເບິ່ງໃບບິນ',
//         }),
//       );
//       return;
//     }

//     setShowBillPopup(true);
//   };

//   const items = [
//     {
//       key: '1',
//       label: <span className="text-lg font-semibold">ການປິ່ນປົວ</span>,
//       children: (
//         <InTreatmentService
//           selectedPatient={selectedPatient}
//           setSelectedPatient={setSelectedPatient}
//           inspectionId={inspectionId}
//           setInspectionId={setInspectionId}
//           formData={formData}
//           setFormData={setFormData}
//           intivalue={intivalue}
//           setIntivalue={setIntivalue}
//           setValue={setValue}
//           register={register}
//           errors={errors}
//           onTreatmentSubmit={handleTreatmentSubmit}
//           loading={loading}
//           isTreatmentSaved={isTreatmentSaved}
//         />
//       ),
//     },
//     {
//       key: '2',
//       label: (
//         <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>
//       ),
//       children: (
//         <InMedTag
//           onMedicineSubmit={handleMedicineSubmit}
//           loading={loading}
//           inspectionId={inspectionId}
//           isMedicineSaved={isMedicineSaved}
//         />
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
//           <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark flex items-center gap-3">
//             <Stethoscope className="w-8 h-8 text-blue-500" />
//             ບົ່ງມະຕິ ແລະ ປິ່ນປົວ
//           </h1>
//         </div>

//       <div className="rounded bg-white pt-4 p-4  shadow-md relative ">
//         <Tabs defaultActiveKey="1" items={items} />
//         <button
//           type="button"
//           onClick={handleShowBill}
//           disabled={!isTreatmentSaved && !isMedicineSaved}
//           className={`${
//             isTreatmentSaved || isMedicineSaved
//               ? 'bg-slate-500 hover:bg-slate-600'
//               : 'bg-gray-400 cursor-not-allowed'
//           } text-white text-md px-6 py-2 rounded flex items-center gap-2 transition`}
//         >
//           <FileText className="w-5 h-5" />
//           ກົດເບິ່ງໃບບິນ
//         </button>


//         <BillPopup
//           isOpen={showBillPopup}
//           onClose={() => setShowBillPopup(false)}
//           patientData={selectedPatient}
//           inspectionData={savedInspectionData}
//           services={savedServices}
//           medicines={savedMedicines}
//         />

//         <Alerts />
//       </div>
//     </>
//   );
// };

// export default Treatment;



// import { FileText, Save } from 'lucide-react';
// import { Tabs } from 'antd';
// import InTreatmentService from './inTreatment';
// import InMedTag from './inMedTag';
// import { useState } from 'react';
// import BillPopup from './BillPopup';
// import useStoreServices from '../../../store/selectServices';
// import useStoreMed from '../../../store/selectMed';
// import useStoreQi from '../../../store/selectQi';
// import { openAlert } from '@/redux/reducer/alert';
// import { useAppDispatch } from '@/redux/hook';
// import Alerts from '@/components/Alerts';
// import { useForm } from 'react-hook-form';
// const Treatment = () => {
//   const [loading, setLoading] = useState(false);
//   const { services } = useStoreServices();
//   const { medicines } = useStoreMed();
//   const { equipment } = useStoreQi();
//   const [showPopup, setShowPopup] = useState(false);
//   const [showBillPopup, setShowBillPopup] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [inspectionId, setInspectionId] = useState(null);

//   const [savedServices, setSavedServices] = useState([]);
//   const [savedMedicines, setSavedMedicines] = useState([]);
//   const [savedInspectionData, setSavedInspectionData] = useState(null);
//   const [savedPatientData, setSavedPatientData] = useState(null);
//   const [isTreatmentSaved, setIsTreatmentSaved] = useState(false);
//   const [isMedicineSaved, setIsMedicineSaved] = useState(false);

//   const [formData, setFormData] = useState({
//     patient_id: '',
//     in_id: '',
//     date: '',
//   });
//   const [intivalue, setIntivalue] = useState({
//     diseases_now: '',
//     symptom: '',
//     note: '',
//     checkup: '',
//   });
//   const dispatch = useAppDispatch();

//   const {
//     register,
//     setValue,
//     formState: { errors },
//   } = useForm();

//   // ฟังก์ชันบันทึกการรักษา
//   const handleTreatmentSubmit = async () => {
//     console.log('Starting treatment submit...');
//     setLoading(true);

//     let newService = services.map((item) => ({
//       ser_id: item.ser_id,
//       qty: item.qty,
//       price: item.price,
//     }));

//     const sendData = {
//       diseases_now: intivalue.diseases_now || '',
//       symptom: intivalue.symptom || '',
//       note: intivalue.note || '',
//       checkup: intivalue.checkup || '',
//       detailed: newService,
//     };

//     try {
//       const response = await fetch(
//         `http://localhost:4000/src/in/inspection/${inspectionId}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(sendData),
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('Inspection response:', result);

//       setSavedServices([...services]);
//       setSavedInspectionData({
//         in_id: inspectionId,
//         date: formData.date,
//         symptom: intivalue.symptom,
//         checkup: intivalue.checkup,
//         diseases_now: intivalue.diseases_now,
//         note: intivalue.note,
//       });
//       setSavedPatientData(selectedPatient);
//       setIsTreatmentSaved(true);

//       dispatch(
//         openAlert({
//           type: 'success',
//           title: 'ບັນທຶກການປິ່ນປົວສຳເລັດ',
//           message: 'ລະບົບໄດ້ບັນທຶກຂໍ້ມູນການປິ່ນປົວແລ້ວ',
//         }),
//       );
//     } catch (error) {
//       console.error('Error submitting treatment:', error);
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ບັນທຶກການປິ່ນປົວບໍ່ສຳເລັດ',
//           message: 'ມີຂໍ້ຜິດພາດ: ' + error.message,
//         }),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ฟังก์ชันบันทึกการจ่ายยาและอุปกรณ์
//   const handleMedicineSubmit = async () => {
//     console.log('Starting medicine submit...');
//     setLoading(true);

//     const medicineData = [
//       ...medicines.map((med) => ({
//         med_id: med.med_id,
//         qty: med.qty,
//         price: med.price,
//       })),
//       ...equipment.map((item) => ({
//         med_id: item.med_id,
//         qty: item.qty,
//         price: item.price,
//       })),
//     ];

//     const sendMed = { data: medicineData };

//     try {
//       // ตรวจสอบสต็อกก่อน
//       const stockCheckResponse = await fetch(
//         'http://localhost:4000/src/stock/checkstock',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ data: medicineData.map(item => ({
//             med_id: item.med_id,
//             med_qty: item.qty,
//             price: item.price,
//           })) }),
//         },
//       );

//       const stockResult = await stockCheckResponse.json();

//       if (stockResult.resultCode === '400') {
//         const stockList = stockResult.stock || [];

//         const jsxMessage = (
//           <div>
//             <p>
//               <strong>ລາຍການຈ່າຍມີຈຳນວນບໍ່ພຽງພໍ:</strong>
//             </p>
//             <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
//               {stockList.map((item) => (
//                 <li key={item.med_id}>
//                   ລະຫັດ: <strong>{item.med_id}</strong> — ສັ່ງຈ່າຍ:{' '}
//                   {item.order_qty}, ມີໃນລະບົບ: {item.available}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         );

//         dispatch(
//           openAlert({
//             type: 'error',
//             title: 'ສິນຄ້າບໍ່ພຽງພໍ',
//             message: jsxMessage,
//           }),
//         );
//         return;
//       }

//       // บันทึกข้อมูลยา
//       const medicineRes = await fetch(
//         `http://localhost:4000/src/in/inspectionmedicines/${inspectionId}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(sendMed),
//         },
//       );

//       if (!medicineRes.ok) {
//         throw new Error(`HTTP error! status: ${medicineRes.status}`);
//       }

//       const results = await medicineRes.json();
//       console.log('Medicine response:', results);

//       // ตัดสต็อก
//       const stockDeductResponse = await fetch(
//         `http://localhost:4000/src/stock/prescription/${inspectionId}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ data: medicineData.map(item => ({
//             med_id: item.med_id,
//             med_qty: item.qty,
//             price: item.price,
//           })) }),
//         },
//       );

//       if (!stockDeductResponse.ok) {
//         throw new Error(`Failed to deduct stock: ${stockDeductResponse.status}`);
//       }

//       setSavedMedicines([
//         ...medicines.map((med) => ({
//           ...med,
//           name: med.med_name || med.name,
//         })),
//         ...equipment.map((item) => ({
//           ...item,
//           name: item.med_name || item.name,
//         })),
//       ]);
//       setIsMedicineSaved(true);

//       dispatch(
//         openAlert({
//           type: 'success',
//           title: 'ບັນທຶກການຈ່າຍຢາສຳເລັດ',
//           message: 'ລະບົບໄດ້ບັນທຶກການຈ່າຍຢາແລະຕັດສິນຄ້າແລ້ວ',
//         }),
//       );
//     } catch (error) {
//       console.error('Error submitting medicine:', error);
//       dispatch(
//         openAlert({
//           type: 'error',
//           title: 'ບັນທຶກການຈ່າຍຢາບໍ່ສຳເລັດ',
//           message: 'ມີຂໍ້ຜິດພາດ: ' + error.message,
//         }),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleShowBill = async () => {
//     if (!inspectionId) {
//       dispatch(
//         openAlert({
//           type: 'warning',
//           title: 'ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
//           message: 'ທ່ານຕ້ອງເລືອກຄົນເຈັບແລະມີຂໍ້ມູນການປິ່ນປົວກ່ອນ',
//         }),
//       );
//       return;
//     }

//     if (!selectedPatient) {
//       dispatch(
//         openAlert({
//           type: 'warning',
//           title: 'ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
//           message: 'ທ່ານຕ້ອງເລືອກຄົນເຈັບກ່ອນເບິ່ງໃບບິນ',
//         }),
//       );
//       return;
//     }

//     if (!isTreatmentSaved || !isMedicineSaved) {
//       dispatch(
//         openAlert({
//           type: 'warning',
//           title: 'ກະລຸນາບັນທຶກຂໍ້ມູນກ່ອນ',
//           message: 'ທ່ານຕ້ອງບັນທຶກທັງການປິ່ນປົວແລະການຈ່າຍຢາກ່ອນເບິ່ງໃບບິນ',
//         }),
//       );
//       return;
//     }

//     setShowBillPopup(true);
//   };

//   const items = [
//     {
//       key: '1',
//       label: <span className="text-lg font-semibold">ການປິ່ນປົວ</span>,
//       children: (
//         <InTreatmentService
//           selectedPatient={selectedPatient}
//           setSelectedPatient={setSelectedPatient}
//           inspectionId={inspectionId}
//           setInspectionId={setInspectionId}
//           formData={formData}
//           setFormData={setFormData}
//           intivalue={intivalue}
//           setIntivalue={setIntivalue}
//           setValue={setValue}
//           register={register}
//           errors={errors}
//           onSubmit={handleTreatmentSubmit}
//           loading={loading}
//           isSaved={isTreatmentSaved}
//         />
//       ),
//     },
//     {
//       key: '2',
//       label: (
//         <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>
//       ),
//       children: (
//         <InMedTag
//           onSubmit={handleMedicineSubmit}
//           loading={loading}
//           isSaved={isMedicineSaved}
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="rounded-lg bg-white pt-4 p-4 dark:bg-boxdark shadow-md relative">
//       <Tabs defaultActiveKey="1" items={items} />

//       <div
//         className="fixed bottom-0 flex justify-end items-center py-2 bg-white p-4 z-50"
//         style={{
//           right: '-500px',
//           width: 'calc(100% + 250px)',
//         }}
//       >
//         <button
//           type="button"
//           onClick={handleShowBill}
//           disabled={!isTreatmentSaved || !isMedicineSaved}
//           className={`${
//             isTreatmentSaved && isMedicineSaved
//               ? 'bg-slate-500 hover:bg-slate-600'
//               : 'bg-gray-400 cursor-not-allowed'
//           } text-white text-md px-6 py-2 mr-[550px] rounded flex items-center gap-2 transition`}
//         >
//           <FileText className="w-5 h-5" />
//           ກົດເບິ່ງໃບບິນ
//         </button>
//       </div>

//       <BillPopup
//         isOpen={showBillPopup}
//         onClose={() => setShowBillPopup(false)}
//         patientData={selectedPatient}
//         inspectionData={savedInspectionData}
//         services={savedServices}
//         medicines={savedMedicines}
//       />

//       <Alerts />
//     </div>
//   );
// };

// // InTreatmentService.js - หน้าการรักษา
// const InTreatmentService = ({
//   selectedPatient,
//   setSelectedPatient,
//   inspectionId,
//   setInspectionId,
//   formData,
//   setFormData,
//   intivalue,
//   setIntivalue,
//   setValue,
//   register,
//   errors,
//   onSubmit,
//   loading,
//   isSaved,
// }) => {
//   const [patients, setPatients] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const { services } = useStoreServices();

//   const getGenderLabel = (gender) => {
//     if (gender === 'male') return 'ຊາຍ';
//     if (gender === 'female') return 'ຍິງ';
//     return '';
//   };

//   const getDob = (dob) => {
//     return dob ? dob : '';
//   };

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     try {
//       const res = await fetch('http://localhost:4000/src/manager/patient');
//       const data = await res.json();
//       setPatients(data.data);
//     } catch (err) {
//       console.error('Error fetching patients:', err);
//     }
//   };

//   const handlePatientSelect = async (patientData) => {
//     console.log('Selected patient:', patientData);
//     setSelectedPatient(patientData);

//     setFormData((prev) => ({
//       ...prev,
//       patient_id: patientData.patient_id,
//     }));

//     try {
//       const res = await fetch(
//         `http://localhost:4000/src/in/inspection/${patientData.patient_id}`,
//       );
//       const result = await res.json();

//       console.log('Inspection API response:', result);

//       if (res.ok && result?.data?.in_id) {
//         const inspection = result.data;
//         setInspectionId(inspection.in_id);
//         setFormData((prev) => ({
//           ...prev,
//           in_id: inspection.in_id,
//           date: inspection.date,
//         }));
//         console.log('Inspection ID set:', inspection.in_id);
//       } else {
//         console.warn('No inspection data found or invalid response:', result);
//       }
//     } catch (err) {
//       console.error('Error fetching inspection data:', err);
//     }
//   };

//   const [idPatient, setIdPatient] = useState('');
//   const [checkID, setCheckID] = useState(false);

//   useEffect(() => {
//     if (checkID) {
//       setIdPatient(idPatient);
//     }
//   }, [checkID]);

//   return (
//     <div>
//       {/* เนื้อหาของหน้าการรักษา */}
//       {/* ... existing form content ... */}

//       {/* ปุ่มบันทึกการรักษา */}
//       <div className="py-4 flex justify-end border-t mt-4">
//         <button
//           onClick={onSubmit}
//           disabled={loading || !inspectionId}
//           className={`${
//             inspectionId && !loading
//               ? 'bg-blue-600 hover:bg-blue-700'
//               : 'bg-gray-400 cursor-not-allowed'
//           } text-white px-6 py-2 rounded flex items-center gap-2 transition`}
//         >
//           {loading ? (
//             'ກຳລັງບັນທຶກ...'
//           ) : (
//             <>
//               <Save className="w-5 h-5" />
//               {isSaved ? 'ບັນທຶກແລ້ວ' : 'ບັນທຶກການປິ່ນປົວ'}
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// // InMedTag.js - หน้าการจ่ายยา
// const InMedTag = ({ onSubmit, loading, isSaved }) => {
//   const { medicines } = useStoreMed();
//   const { equipment } = useStoreQi();
//   const dispatch = useAppDispatch();

//   const allMedicines = [
//     ...medicines.map((med) => ({
//       ...med,
//       name: med.med_name || med.name,
//     })),
//     ...equipment.map((item) => ({
//       ...item,
//       name: item.med_name || item.name,
//     })),
//   ];

//   const hasItems = allMedicines.length > 0;

//   return (
//     <>
//       <Alerts />
//       <TypeMedicine medicines={allMedicines} />

//       {/* ปุ่มบันทึกการจ่ายยา */}
//       <div className="py-4 flex justify-end border-t mt-4">
//         <button
//           onClick={onSubmit}
//           disabled={loading || !hasItems}
//           className={`${
//             hasItems && !loading
//               ? 'bg-green-600 hover:bg-green-700'
//               : 'bg-gray-400 cursor-not-allowed'
//           } text-white px-6 py-2 rounded flex items-center gap-2 transition`}
//         >
//           {loading ? (
//             'ກຳລັງບັນທຶກ...'
//           ) : (
//             <>
//               <Save className="w-5 h-5" />
//               {isSaved ? 'ບັນທຶກແລ້ວ' : 'ບັນທຶກການຈ່າຍຢາ'}
//             </>
//           )}
//         </button>
//       </div>
//     </>
//   );
// };

// export default Treatment;
