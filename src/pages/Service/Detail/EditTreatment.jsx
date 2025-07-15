import { FileText, Pill, RotateCcw, Stethoscope } from 'lucide-react';
import { Button, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import Alerts from '@/components/Alerts';
import InMedicine from './inMedicineUpdate';
import BillPopup from '../Treatment/BillPopup';
import { useParams } from 'react-router-dom';
import { URLBaseLocal } from '../../../lib/MyURLAPI';
import InServiceUpdate from './InServiceUpdate';
import useStoreServices from '../../../store/selectServices';
import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import useStoreDisease from '../../../store/selectDis';
import { useAppDispatch } from '@/redux/hook';

import { openAlert } from '@/redux/reducer/alert';
const token = localStorage.getItem(ACCESS_TOKEN_KEY);

const EditTreatment = () => {
  const { id } = useParams();
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const [dataPatien, setDataPatien] = useState({});
  const [newData, setNewData] = useState({});
  const dispatch = useAppDispatch();
  const { newServices, fetchInspectionById, dataInspectionBy } =
    useStoreServices();
  const { newMedicines, fetchInspectionMedById } = useStoreMed();
  const { newEquipment, fetchInspectionEquipmentById } = useStoreQi();
  const { getDiseasesForUpdate, disUpdate } = useStoreDisease();
  const [invoiceData, setInvoiceData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchInspectionById(id);
      fetchInspectionMedById(id);
      fetchInspectionEquipmentById(id);
    }
  }, [id]);

  // Separate useEffect to call getDiseasesForUpdate after dataInspectionBy is loaded
  useEffect(() => {
    if (dataInspectionBy) {
      getDiseasesForUpdate();
    }
  }, [dataInspectionBy]);

  useEffect(() => {
    setDataPatien(dataInspectionBy);
  }, [dataInspectionBy]);

  // ฟังก์ชันสำหรับรีโหลดข้อมูลเฉพาะหน้านี้
  const reloadData = async () => {
    setIsReloading(true);
    try {
      // รีเซ็ตข้อมูลก่อน
      setDataPatien({});
      setNewData({});
      setInvoiceData(null);

      // เรียก API ใหม่
      if (id) {
        await Promise.all([
          fetchInspectionById(id),
          fetchInspectionMedById(id),
          fetchInspectionEquipmentById(id),
        ]);
      }

      // รีโหลดข้อมูลโรคถ้าจำเป็น
      if (dataInspectionBy) {
        await getDiseasesForUpdate();
      }

      console.log('ข้อมูลถูกรีโหลดแล้ว');
    } catch (error) {
      console.error('Error reloading data:', error);
    } finally {
      setIsReloading(false);
    }
  };

  const submitEditPatient = async () => {
    try {
      const newPatient = {
        diseases_now: newData?.diseases_now,
        diseases: disUpdate.join(',') ? disUpdate.join(',') : '',
        symptom: newData?.symptom,
        checkup: newData?.checkup,
        note: newData?.note,
        detailed: newServices,
      };

      const resP = await fetch(
        `${URLBaseLocal}/src/in/inspection/${dataPatien?.in_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPatient),
        },
      );

      if (resP.data.resultCode === '200') {
        console.log('Update Inspection success');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const submitMedicine = async () => {
    try {
      const payloadMed = {
        data: [
          ...newMedicines.map((med) => ({
            med_id: med.med_id,
            med_qty: med.qty,
            price: med.price,
          })),
          ...newEquipment.map((item) => ({
            med_id: item.med_id,
            med_qty: item.qty,
            price: item.price,
          })),
        ],
      };

      const res = await fetch(
        `${URLBaseLocal}/src/stock/prescription/${dataPatien?.in_id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadMed),
        },
      );

      if (res.data.resultCode === '200') {
        dispatch(
              openAlert({
                type: 'success',
                title: 'ສຳເລັດ',
                message: 'ແກ້ໄຂຂໍ້ມູນປິ່ວປົວສຳເລັດແລ້ວ',
              }),
            );
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  const handleShowBill = async () => {
    if (!invoiceData && dataPatien?.in_id) {
      try {
        const totalServiceCost = newServices.reduce(
          (total, s) => total + s.price * s.qty,
          0,
        );
        const totalMedicineCost = [...newMedicines, ...newEquipment].reduce(
          (total, m) => total + m.price * m.qty,
          0,
        );
        const grandTotal = totalServiceCost + totalMedicineCost;

        const res = await fetch(`${URLBaseLocal}/src/invoice/invoice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: grandTotal,
            in_id: dataPatien.in_id,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          setInvoiceData(result.data);
          setShowBillPopup(true);
        } else {
          console.error('Cannot create invoice');
        }
      } catch (err) {
        console.error('Error generating invoice:', err);
      }
    } else {
      setShowBillPopup(true);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-md md:text-lg lg:text-xl font-semibold text-strokedark  ">
          ແກ້ໄຂປິ່ວປົວ ແລະ ບົ່ງມະຕິ
        </div>

        <div className="flex justify-end gap-5">
          <button
            onClick={reloadData}
            disabled={isReloading}
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
            className="bg-emerald-500 hover:emerald-500 text-white text-md px-6 py-2 rounded flex items-center gap-2 transition"
          >
            <FileText className="w-5 h-5" />
            ກົດເບິ່ງໃບບິນ
          </button>

          <button
            type="button"
            onClick={submitEditPatient}
            className="bg-Third3 hover:bg-Third4  text-white px-6 py-2 rounded flex items-center gap-2 transition"
          >
            <Pill className="w-4 h-4" />
            ແກ້ໄຂຂໍ້ມູນປົວໃໝ່
          </button>
          <button
            className="h-[40px] bg-Third2 hover:bg-Third3  text-white  px-6 py-2 rounded flex items-center gap-2 transition"
            onClick={submitMedicine}
          >
            <Stethoscope className="w-4 h-4" />
            ແກ້ໄຂຂໍ້ມູນຢາໃໝ່
          </button>
        </div>
      </div>
      <div className="rounded bg-white pt-4 p-4 shadow-md relative">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: <span className="text-lg font-semibold">ການປິ່ນປົວ</span>,
              children: (
                <InServiceUpdate
                  dataPatient={dataPatien}
                  callValue={(x) => setNewData(x)}
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
              children: <InMedicine dataPatient={dataPatien} />,
            },
          ]}
        />

        <BillPopup
          isOpen={showBillPopup}
          onClose={() => setShowBillPopup(false)}
          patientData={dataPatien}
          inspectionData={newData}
          services={newServices}
          medicines={[...newMedicines, ...newEquipment]}
          invoiceData={invoiceData}
          onRefresh={reloadData}
        />

        <Alerts />
      </div>
    </>
  );
};

export default EditTreatment;
