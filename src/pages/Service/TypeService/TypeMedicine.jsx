import React, { useState } from 'react';
import { Tabs } from 'antd';
import ListMed from './Component/ListMed';
import ListQi from './Component/ListQi';
import SumMedicin from './Component/SumMedicin';
import SumQil from './Component/SumQi';
import { CopyPlus, Pill } from 'lucide-react';
export default function TypeMedicine({ selectService, value }) {
  const [selectedMedicin, setSelectedMedicin] = useState([]);
  const [selectedQi, setSelectedQi] = useState([]);

  const handleSelectMedicin = (item) => {
    const exist = selectedMedicin.find((m) => m.med_id === item.med_id);
    if (!exist) setSelectedMedicin((prev) => [...prev, item]);
  };

  const handleRemoveMedicin = (item) => {
    setSelectedMedicin((prev) => prev.filter((m) => m.med_id !== item.med_id));
  };

  const handleSelectQi = (item) => {
    const exist = selectedQi.find((q) => q.id === item.id);
    if (!exist) setSelectedQi((prev) => [...prev, item]);
  };

  const handleRemoveQi = (item) => {
    setSelectedQi((prev) => prev.filter((q) => q.id !== item.id));
  };

  const upperItem = [
    {
      key: '2',
      label: 'ຢາ',
      children: (
        <ListMed
          dataValue={value}
          selectService={handleSelectMedicin}
          tapService={2}
        />
      ),
    },
    {
      key: '3',
      label: 'ອຸປະກອນ',
      children: (
        <ListQi
          dataValue={value}
          selectService={handleSelectQi}
          tapService={3}
        />
      ),
    },
  ];
  const lowerItem = [
    {
      key: '6',
      label: 'ສະຫຼຸບການຈ່າຍຢາ',
      children: (
        <SumMedicin
          selectedServices={selectedMedicin}
          removeService={handleRemoveMedicin}
          tapDetail={6}
        />
      ),
    },
    {
      key: '7',
      label: 'ສະຫຼຸບການຈ່າຍອຸປະກອນ',
      children: (
        <SumQil
          selectedServices={selectedQi}
          removeService={handleRemoveQi}
          tapService={7}
        />
      ),
    },
  ];

  return (
    <div className="">
      <h1 className="text-lg font-semibold text-form-strokedark py-4  text-left flex items-center gap-2 ">
        <CopyPlus className="w-5 h-5" />
        ເພີ່ມການຈ່າຍຢາ ແລະ  ອຸປະກອນ
      </h1>
      <div className="p-2 rounded bg-white border border-stroke">
        <Tabs defaultActiveKey="2" items={upperItem} />
      </div>
      <h1 className="text-lg font-semibold text-form-strokedark py-4  text-left flex items-center gap-2 ">
        ສະຫຼຸບການຈ່າຍຢາ ແລະ ອຸປະກອນ
      </h1>
      <div className="p-2 rounded bg-white border border-stroke">
        <Tabs defaultActiveKey="6" items={lowerItem} />
      </div>
    </div>
  );
}
