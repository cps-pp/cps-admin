import {
  FileText,
  User,
  Pill,
  Stethoscope,
  Calendar,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Tabs } from 'antd';
import InTreatmentService from './inTreatment';
import InMedTag from './inMedTag';
import { useState, useEffect } from 'react';
import BillPopup from './BillPopup';
import useStoreServices from '../../../store/selectServices';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import Alerts from '@/components/Alerts';
import { useForm } from 'react-hook-form';
import useStoreDisease from '../../../store/selectDis';


const Treatment = () => {
  const [activeTab, setActiveTab] = useState('1');

  const [loading, setLoading] = useState(false);
  const { services } = useStoreServices();
  const { medicines } = useStoreMed();
  const { equipment } = useStoreQi();
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
  const [refreshKey, setRefreshKey] = useState(0);
  const [invoiceData, setInvoiceData] = useState(null);
  // ---Clear Store--
  const { clearServices } = useStoreServices();
  const { clearEquipment } = useStoreQi();
  const { clearMedicine } = useStoreMed();
  const { clearDisease } = useStoreDisease();
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
        setIsInvoiceGenerated(true); 
        return invoice;
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      return null;
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);

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
    clearServices();
    clearMedicine();
    clearEquipment();
    clearDisease();

    setSelectedPatient(null);
    setInspectionId(null);
    setSavedServices([]);
    setSavedMedicines([]);
    setSavedInspectionData(null);
    setSavedPatientData(null);
    setIsTreatmentSaved(false);
    setIsMedicineSaved(false);
    setIsInvoiceGenerated(false);
    setInvoiceData(null);
    setLoading(false);
  };


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
          // refreshKey={refreshKey}
           dispatch={dispatch}
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
     
          //  refreshKey={refreshKey}
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
