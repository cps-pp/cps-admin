import { FileText } from 'lucide-react';
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


const EditTreatment = () => {
  const { id } = useParams();
  const [showBillPopup, setShowBillPopup] = useState(false);

  const [dataPatien, setDataPatien] = useState({});
  const [newData, setNewData] = useState({});

  const { newServices, fetchInspectionById, dataInspectionBy } = useStoreServices();
  const { newMedicines, fetchInspectionMedById } = useStoreMed();
  const { newEquipment, fetchInspectionEquipmentById } = useStoreQi();

  useEffect(() => {
    if (id) {
      fetchInspectionById(id);
      fetchInspectionMedById(id);
      fetchInspectionEquipmentById(id);
    }
  }, [id]);

  useEffect(() => {
    setDataPatien(dataInspectionBy)
  }, [dataInspectionBy]);

  const submitEditPatient = async () => {

    try {
      const newPatient = {
        diseases_now: newData?.diseases_now,
        symptom: newData?.symptom,
        checkup: newData?.checkup,
        note: newData?.note,
        detailed: newServices
      }

      const resP = await fetch(`${URLBaseLocal}/src/in/inspection/${dataPatien?.in_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });

      if (resP.data.resultCode === '200') {
        console.log('Update Inspection success')
      }

    } catch (error) {
      console.error('Error updating patient:', error);
    }

  }

  const submitMedicine = async () => {
    try {

      //   const medicineData = [
      //   ...medicines.map((med) => ({
      //     med_id: med.med_id,
      //     qty: med.qty,
      //     price: med.price,
      //   })),
      //   ...equipment.map((item) => ({
      //     med_id: item.med_id,
      //     qty: item.qty,
      //     price: item.price,
      //   })),
      // ];

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
        ]
      }

      const res = await fetch(`${URLBaseLocal}/src/stock/prescription/${dataPatien?.in_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadMed),
      });
      // console.log(res)
      if (res.data.resultCode === '200') {
        console.log('Update Med success')
      }

    } catch (error) {
      console.error('Error updating patient:', error);
    }
  }

  return (
    <>
      <div className='text-lg font-semibold text-form-strokedark mb-4'>
        ແກ້ໄຂລາຍການບໍລິການ
      </div>
      <div className="rounded bg-white pt-4 p-4 shadow-md relative">

        <div className='flex justify-end gap-5'>
          <Button
            className='h-[40px]'
            onClick={() => window.location.reload()}>
            ໂຫລດຂໍ້ມູນໃຫມ່
          </Button>

          <button
            type="button"
            onClick={() => setShowBillPopup(true)}
            className="bg-slate-500 hover:bg-slate-600 text-white text-md px-6 py-2 rounded flex items-center gap-2 transition"
          >
            <FileText className="w-5 h-5" />
            ກົດເບິ່ງໃບບິນ
          </button>

          <Button
            className='h-[40px]'
            onClick={submitMedicine}>
            ແກ້ໄຂຂໍ້ມູນຢາໃໝ່
          </Button>

          <button
            type="button"
            onClick={submitEditPatient}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-md px-6 py-2 rounded flex items-center gap-2 transition"
          >
            ແກ້ໄຂຂໍ້ມູນປົວໃໝ່
          </button>
        </div>

        <Tabs defaultActiveKey="1" items={[{
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
          label: <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>,
          children: (
            <InMedicine
              dataPatient={dataPatien}
            />
          ),
        }]} />

        <BillPopup
          isOpen={showBillPopup}
          onClose={() => setShowBillPopup(false)}
          patientData={{}} // mock object
          inspectionData={{}} // mock object
          services={[]} // mock array
          medicines={[]} // mock array
          invoiceData={{}} // mock object
          onRefresh={() => { }} // mock function
        />



        <Alerts />
      </div>
    </>
  );
};

export default EditTreatment;
