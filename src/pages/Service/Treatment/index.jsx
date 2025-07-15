import {
  FileText,
  Pill,
  RotateCcw,
  RotateCcwIcon,
  Stethoscope,
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
import { URLBaseLocal } from '../../../lib/MyURLAPI';
import Button from '@/components/Button';

const Treatment = () => {
  const [loading, setLoading] = useState(false);
  const { services } = useStoreServices();
  const { medicines } = useStoreMed();
  const { equipment } = useStoreQi();
  const { dis } = useStoreDisease();

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
  const [isReloading, setIsReloading] = useState(false);

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
  const [selectEmpCreate, setSelectEmpCreate] = useState('');
  const [createdAt, setCreatedAt] = useState('');
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
      const response = await fetch(`${URLBaseLocal}/src/invoice/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: grandTotal,
          in_id: inspectionId,
        }),
      });

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
    console.log('NO INSPECTION ID');
    if (!inspectionId) {
      dispatch(
        openAlert({
          type: 'warning',
          title: 'ກະລຸນາເລືອກຄົນເຈັບ',
          message: 'ກ່ອນບັນທຶກການປິ່ນປົວ ກະລຸນາເລືອກຄົນເຈັບກ່ອນ',
        }),
      );
      return;
    }

    setLoading(true);

    let newService = services.map((item) => ({
      ser_id: item.ser_id,
      qty: item.qty,
      price: item.price,
    }));

    const sendData = {
      diseases_now: intivalue.diseases_now || '',
      diseases: dis.join(', ') || '',
      symptom: intivalue.symptom || '',
      note: intivalue.note || '',
      checkup: intivalue.checkup || '',
      detailed: newService,
      emp_id_create: selectEmpCreate,
      created_at: createdAt,
    };

    try {
      const response = await fetch(
        `${URLBaseLocal}/src/in/inspection/${inspectionId}`,
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

      setSavedServices([...services]);
      setSavedInspectionData({
        in_id: inspectionId,
        date: formData.date,
        symptom: intivalue.symptom,
        checkup: intivalue.checkup,
        diseases_now: intivalue.diseases_now,
        note: intivalue.note,
        emp_id_create: selectEmpCreate,
        created_at: createdAt,
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
    // Validation สำหรับ Medicine
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

    const sendMed = { data: medicineData };

    try {
      const stockCheckResponse = await fetch(
        `${URLBaseLocal}/src/stock/checkstock`,
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
        `${URLBaseLocal}/src/stock/prescription/${inspectionId}`,
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
          message: 'ລະບົບໄດ້ບັນທຶກການຈ່າຍຢາຮຽບຮອຍແລ້ວ',
        }),
      );
    } catch (error) {
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

  return (
    <>
      <Alerts />
      <div className="flex justify-between items-center mb-4">
        <div className="text-md md:text-lg lg:text-xl font-semibold text-strokedark  ">
          ຫນ້າປິ່ວປົວ ແລະ ບົ່ງມະຕິ
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsReloading(true);
              handleRefresh();
              setTimeout(() => {
                setIsReloading(false);
              }, 500);
            }}
            disabled={loading || isReloading}
            className={`
        inline-flex items-center gap-2 px-4 py-2 text-md font-medium rounded 
        border border-Third3 bg-Third3/10 text-secondary2 
        hover:bg-blue-Third3/20 disabled:opacity-50 
        transition-all duration-300 ease-in-out
        ${isReloading ? 'bg-Third3 cursor-not-allowed' : 'hover:scale-105'}
      `}
          >
            <RotateCcw
              className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`}
            />
            <span>{isReloading ? 'ກຳລັງໂຫຼດ...' : 'ໂຫຼດໃໝ່'}</span>
          </button>

          <button
            type="button"
            onClick={handleShowBill}
            // disabled={!isTreatmentSaved && !isMedicineSaved}
            className={`${
              isTreatmentSaved || isMedicineSaved
                ? 'bg-emerald-500 hover:emerald-500'
                : 'bg-emerald-500 cursor-not-allowed opacity-60'
            } text-white text-md px-6 py-2 rounded shadow flex items-center gap-2 transition duration-300`}
          >
            <FileText className="w-4 h-4" />
            ກົດເບິ່ງໃບບິນ
          </button>

          <button
            type="button"
            onClick={handleTreatmentSubmit}
            // disabled={loading || !inspectionId}
            className={`${
              loading || !inspectionId
                ? 'bg-Third2 hover:bg-Third3'
                : 'bg-Third3 hover:bg-Third3 '
            } text-white text-md px-6 py-2 rounded shadow flex items-center gap-2 transition duration-300`}
          >
            <Stethoscope className="w-4 h-4" />
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການປິ່ນປົວ'}
          </button>

          <button
            type="button"
            onClick={handleMedicineSubmit}
            // disabled={
            //   loading ||
            //   !inspectionId ||
            //   (medicines.length === 0 && equipment.length === 0)
            // }
            className={`${
              loading ||
              !inspectionId ||
              (medicines.length === 0 && equipment.length === 0)
                ? 'bg-Third2 hover:bg-Third3'
                : 'bg-Third3 hover:bg-Third4'
            } text-white text-md px-6 py-2 rounded shadow flex items-center gap-2 transition duration-300`}
          >
            <Pill className="w-4 h-4" />
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກການຈ່າຍຢາ'}
          </button>
        </div>
      </div>

      <div className="rounded bg-white pt-4 p-4  shadow-md relative ">
        <Tabs
          defaultActiveKey="1"
          items={[
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
                  loading={loading}
                  isTreatmentSaved={isTreatmentSaved}
                  refreshKey={refreshKey}
                  dispatch={dispatch}
                  selectEmpCreate={selectEmpCreate}
                  setSelectEmpCreate={setSelectEmpCreate}
                  createdAt={createdAt}
                  setCreatedAt={setCreatedAt}
                />
              ),
            },
            {
              key: '2',
              label: (
                <span className="text-lg font-semibold">
                  ການຈ່າຍຢາ ແລະ ອຸປະກອນ
                </span>
              ),
              children: (
                <InMedTag
                  loading={loading}
                  inspectionId={inspectionId}
                  isMedicineSaved={isMedicineSaved}
                  refreshKey={refreshKey}
                />
              ),
            },
          ]}
        />

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
