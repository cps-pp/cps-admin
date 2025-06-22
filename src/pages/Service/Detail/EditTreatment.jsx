'use client';

import { FileText } from 'lucide-react';
import { Tabs } from 'antd';
import { useState } from 'react';
import Alerts from '@/components/Alerts';
import InService from './inService';
import InMedicine from './inMedicine';
import BillPopup from '../Treatment/BillPopup';


const EditTreatment = () => {
  const [showBillPopup, setShowBillPopup] = useState(false);

  const items = [
    {
      key: '1',
      label: <span className="text-lg font-semibold">ການປິ່ນປົວ</span>,
      children: (
        <InService
        />
      ),
    },
    {
      key: '2',
      label: <span className="text-lg font-semibold">ການຈ່າຍຢາ ແລະ ອຸປະກອນ</span>,
      children: (
        <InMedicine
        />
      ),
    },
  ];

  return (
    <>
      <div className='text-lg font-semibold text-form-strokedark mb-4'>
        ແກ້ໄຂລາຍການບໍລິການ
        </div>
    <div className="rounded bg-white pt-4 p-4 shadow-md relative">
    
      <Tabs defaultActiveKey="1" items={items} />

      <button
        type="button"
        onClick={() => setShowBillPopup(true)}
        className="bg-slate-500 hover:bg-slate-600 text-white text-md px-6 py-2 rounded flex items-center gap-2 transition mt-4"
      >
        <FileText className="w-5 h-5" />
        ກົດເບິ່ງໃບບິນ
      </button>

      <BillPopup
        isOpen={showBillPopup}
        onClose={() => setShowBillPopup(false)}
        patientData={{}} // mock object
        inspectionData={{}} // mock object
        services={[]} // mock array
        medicines={[]} // mock array
        invoiceData={{}} // mock object
        onRefresh={() => {}} // mock function
      />

      <Alerts />
    </div>
    </>
  );
};

export default EditTreatment;
