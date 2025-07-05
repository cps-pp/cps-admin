// TypeService.jsx
import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ListService from './Component/ListService';
import ListDis from './Component/ListDis';
import SumService from './Component/SumService';
import SumDiseases from './Component/SumDis';
import { CopyPlus, Activity } from 'lucide-react';
export default function TypeService({ selectService, value ,refreshKey,inspectionId  }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDis, setSelectedDis] = useState([]);
  const [allSelectedItems, setAllSelectedItems] = useState([]);

  useEffect(() => {
    if (!inspectionId) {
      setSelectedServices([]);
      setSelectedDis([]);
      setAllSelectedItems([]);
      return;
    }

    async function loadExistingData() {
      try {
        const res = await fetch(`http://localhost:4000/src/report/inspection/${inspectionId}`);
        const data = await res.json();

        if (data.resultCode === '200' && data.data) {
          const servicesFromAPI = data.data.services || []; 
          const diseasesFromAPI = data.data.diseases || [];

          setSelectedServices(servicesFromAPI);
          setSelectedDis(diseasesFromAPI);

          setAllSelectedItems([
            ...servicesFromAPI.map(s => ({ ...s, itemType: 'service' })),
            ...diseasesFromAPI.map(d => ({ ...d, itemType: 'disease' })),
          ]);
        } else {
          setSelectedServices([]);
          setSelectedDis([]);
          setAllSelectedItems([]);
        }
      } catch (error) {
        console.error('Error loading existing data:', error);
        setSelectedServices([]);
        setSelectedDis([]);
        setAllSelectedItems([]);
      }
    }

    loadExistingData();
  }, [inspectionId, refreshKey]);


  
  const handleSelectService = (service) => {
    if (!selectedServices.find((item) => item.ser_id === service.ser_id)) {
      const serviceWithType = { ...service, itemType: 'service' };
      setSelectedServices((prev) => [...prev, service]);
      setAllSelectedItems((prev) => [...prev, serviceWithType]);
    }
    selectService?.(service);
  };

  const handleRemoveService = (service) => {
    setSelectedServices((prev) =>
      prev.filter((item) => item.ser_id !== service.ser_id),
    );
    setAllSelectedItems((prev) =>
      prev.filter(
        (item) =>
          !(item.ser_id === service.ser_id && item.itemType === 'service'),
      ),
    );
  };

  const handleSelectDis = (service) => {
    if (
      !selectedDis.find(
        (item) =>
          item.dis_id === service.dis_id ||
          item.disease_id === service.disease_id,
      )
    ) {
      const diseaseWithType = { ...service, itemType: 'disease' };
      setSelectedDis((prev) => [...prev, service]);
      setAllSelectedItems((prev) => [...prev, diseaseWithType]);
    }
    selectService?.(service);
  };

  const handleRemoveDis = (service) => {
    setSelectedDis((prev) =>
      prev.filter(
        (item) =>
          item.dis_id !== service.dis_id &&
          item.disease_id !== service.disease_id,
      ),
    );
    setAllSelectedItems((prev) =>
      prev.filter(
        (item) =>
          !(
            (item.dis_id === service.dis_id ||
              item.disease_id === service.disease_id) &&
            item.itemType === 'disease'
          ),
      ),
    );
  };

  const upperTabs = [
    {
      key: '1',
      label: 'ລາຍການບໍລິການ',
      children: (
        <ListService
          dataValue={value}
          selectService={handleSelectService}
          tapService={1}
        />
      ),
    },
    {
      key: '4',
      label: 'ພະຍາດແຂ້ວ',
      children: (
        <ListDis
          dataValue={value}
          selectService={handleSelectDis}
          tapService={4}
        />
      ),
    },
  ];

  const lowerTabs = [
    {
      key: '5',
      label: 'ສະຫຼຸບການຮັກສາ',
      children: (
        <SumService
          selectedServices={allSelectedItems}
          removeService={handleRemoveService}
          tapDetail={5}
        />
      ),
    },
    {
      key: '8',
      label: 'ສະຫຼຸບພະຍາດ',
      children: (
        <SumDiseases
          selectedServices={selectedDis}
          removeService={handleRemoveDis}
          tapService={8}
        />
      ),
    },
  ];

  return (
    <>
      <h1 className="text-lg font-semibold text-form-strokedark py-2 text-left flex items-center gap-2 ">
        <CopyPlus className="w-5 h-5" />
        ເພີ່ມລາຍການບໍລິການ
      </h1>
      <div className="p-2 rounded bg-white border border-stroke ">
        <Tabs defaultActiveKey="1" items={upperTabs} />
      </div>
      <h1 className="text-lg font-semibold text-form-strokedark py-4  text-left flex items-center gap-2 ">
        ສະຫຼຸບການລາຍການທັງໝົດ
      </h1>
      <div className="p-2  rounded bg-white border border-stroke ">
        <Tabs defaultActiveKey="5" items={lowerTabs} />
      </div>
    </>
  );
}

// import { Tabs } from 'antd';
// import { useState } from 'react';
// import ListService from './Component/ListService';
// import ListMed from './Component/ListMed';
// import ListDis from './Component/ListDis';
// import ListQi from './Component/ListQi';
// import SumService from './Component/SumService';
// import SumMedicin from './Component/SumMedicin';
// import SumQil from './Component/SumQi';
// import SumDiseases from './Component/SumDis';

// const onChange = (key) => {
//   console.log(key);
// };

// const TabService = 1;
// const TabMed = 2;
// const TabQi = 3;
// const TabDis = 4;
// const TabServiceSum = 5;
// const TabMedSum = 6;
// const TabQiSum = 7;
// const TabDiseaseSum = 8;

// export default function TypeService({ selectService, value, onChange }) {
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [selectedMedicin, setSelectedMedicin] = useState([]);
//   const [selectedQi, setSelectedQi] = useState([]);
//   const [selectedDis, setSelectedDis] = useState([]);

//   const [allSelectedItems, setAllSelectedItems] = useState([]);

//   const handleSelectService = (service) => {
//     const isExist = selectedServices.find(
//       (item) => item.ser_id === service.ser_id,
//     );

//     if (!isExist) {
//       const serviceWithType = { ...service, itemType: 'service' };
//       setSelectedServices((prev) => [...prev, service]);
//       setAllSelectedItems((prev) => [...prev, serviceWithType]);
//     } else {
//       // console.log('Service already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveService = (service) => {
//     setSelectedServices((prev) =>
//       prev.filter((item) => item.ser_id !== service.ser_id),
//     );
//     setAllSelectedItems((prev) =>
//       prev.filter((item) => !(item.ser_id === service.ser_id && item.itemType === 'service')),
//     );
//   };

//   const handleSelectMedicin = (service) => {
//     const isExist = selectedMedicin.find(
//       (item) => item.med_id === service.med_id,
//     );

//     if (!isExist) {
//       const medicineWithType = { ...service, itemType: 'medicine' };
//       setSelectedMedicin((prev) => [...prev, service]);
//       setAllSelectedItems((prev) => [...prev, medicineWithType]);
//     } else {
//       console.log('Medicine already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveMedicin = (service) => {
//     setSelectedMedicin((prev) =>
//       prev.filter((item) => item.med_id !== service.med_id),
//     );
//     setAllSelectedItems((prev) =>
//       prev.filter((item) => !(item.med_id === service.med_id && item.itemType === 'medicine')),
//     );
//   };

//   const handleSelectQi = (service) => {
//     const isExist = selectedQi.find((item) =>
//       item.med_id === service.med_id ||
//       item.med_id === service.med_id ||
//       item.id === service.id
//     );

//     if (!isExist) {
//       const equipmentWithType = { ...service, itemType: 'equipment' };
//       setSelectedQi((prev) => [...prev, service]);
//       setAllSelectedItems((prev) => [...prev, equipmentWithType]);
//       console.log('Equipment selected:', service);
//     } else {
//       console.log('Equipment already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveQi = (service) => {
//     setSelectedQi((prev) =>
//       prev.filter((item) =>
//         item.med_id !== service.med_id &&
//         item.med_id !== service.med_id &&
//         item.id !== service.id
//       ),
//     );
//     setAllSelectedItems((prev) =>
//       prev.filter((item) => !(
//         (item.med_id === service.med_id || item.med_id === service.med_id || item.id === service.id)
//         && item.itemType === 'equipment'
//       )),
//     );
//   };

//   const handleSelectDis = (service) => {
//     const isExist = selectedDis.find(
//       (item) => item.dis_id === service.dis_id || item.disease_id === service.disease_id,
//     );

//     if (!isExist) {
//       const diseaseWithType = { ...service, itemType: 'disease' };
//       setSelectedDis((prev) => [...prev, service]);
//       setAllSelectedItems((prev) => [...prev, diseaseWithType]);
//     } else {
//       console.log('Disease already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveDis = (service) => {
//     setSelectedDis((prev) =>
//       prev.filter((item) =>
//         item.dis_id !== service.dis_id &&
//         item.disease_id !== service.disease_id
//       ),
//     );
//     setAllSelectedItems((prev) =>
//       prev.filter((item) => !(
//         (item.dis_id === service.dis_id || item.disease_id === service.disease_id)
//         && item.itemType === 'disease'
//       )),
//     );
//   };

//   const handleRemoveFromSummary = (item) => {
//     if (item.itemType === 'service') {
//       handleRemoveService(item);
//     } else if (item.itemType === 'medicine') {
//       handleRemoveMedicin(item);
//     } else if (item.itemType === 'equipment') {
//       handleRemoveQi(item);
//     } else if (item.itemType === 'disease') {
//       handleRemoveDis(item);
//     }
//   };

//   const upperTabs = [
//     {
//       key: '1',
//       label: 'ລາຍການບໍລິການ',
//       children: (
//         <ListService
//           dataValue={value}
//           selectService={handleSelectService}
//           tapService={TabService}
//         />
//       ),
//     },
//     {
//       key: '2',
//       label: 'ຢາ',
//       children: (
//         <ListMed
//           dataValue={value}
//           selectService={handleSelectMedicin}
//           tapService={TabMed}
//         />
//       ),
//     },
//     {
//       key: '3',
//       label: 'ອຸປະກອນ',
//       children: (
//         <ListQi
//           dataValue={value}
//           selectService={handleSelectQi}
//           tapService={TabQi}
//         />
//       ),
//     },
//     {
//       key: '4',
//       label: 'ພະຍາດແຂ້ວ',
//       children: (
//         <ListDis
//           dataValue={value}
//           selectService={handleSelectDis}
//           tapService={TabDis}

//         />
//       ),
//     },
//   ];

//   const lowerTabs = [
//     {
//       key: '5',
//       label: 'ສະຫຼຸບການຮັກສາ',
//       children: (
//         <SumService
//           selectedServices={allSelectedItems}
//           removeService={handleRemoveFromSummary}
//           tapDetail={TabServiceSum}
//         />
//       ),
//     },

//     {
//       key: '6',
//       label: 'ສະຫຼຸບການຮັກສາຈ່າຍຢາ',
//       children: (
//         <SumMedicin
//           selectedServices={selectedMedicin}
//           removeService={handleRemoveMedicin}
//           tapDetail={TabMedSum}
//         />
//       ),
//     },

//     {
//       key: '7',
//       label: 'ສະຫຼຸບການຮັກສາຈ່າຍອຸປະກອນ',
//       children: (
//         <SumQil
//           selectedServices={selectedQi}
//           removeService={handleRemoveQi}
//           tapService={TabQiSum}
//         />
//       ),
//     },

//     {
//       key: '8',
//       label: 'ສະຫຼຸບພະຍາດ',
//       children: (
//         <SumDiseases
//           selectedServices={selectedDis}
//           removeService={handleRemoveDis}
//           tapService={TabDiseaseSum}
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className=" p-4 rounded shadow">
//         <Tabs defaultActiveKey="1" items={upperTabs} onChange={onChange} />
//       </div>

//       <div className=" p-4 rounded shadow">
//         <Tabs defaultActiveKey="5" items={lowerTabs} onChange={onChange} />
//       </div>
//     </div>
//   );
// }

// import { Tabs } from 'antd';
// import { useState } from 'react';
// import ListService from './Component/ListService';
// import ListMed from './Component/ListMed';
// import ListDis from './Component/ListDis';
// import ListQi from './Component/ListQi';
// import SumService from './Component/SumService';
// import SumMedicin from './Component/SumMedicin';
// import SumQil from './Component/SumQi';
// import SumDiseases from './Component/SumDis';

// const onChange = (key) => {
//   console.log(key);
// };

// const TabService = 1;
// const TabMed = 2;
// const TabQi = 3;
// const TabDis = 4;
// const TabServiceSum = 5;
// const TabMedSum = 6;
// const TabQiSum = 7;
// const TabDiseaseSum = 8;

// export default function TypeService({ selectService }) {
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [selectedMedicin, setSelectedMedicin] = useState([]);
//   const [selectedQi, setSelectedQi] = useState([]);
//   const [selectedDis, setSelectedDis] = useState([]);

//   const handleSelectService = (service) => {
//     const isExist = selectedServices.find(
//       (item) => item.ser_id === service.ser_id,
//     );

//     if (!isExist) {
//       setSelectedServices((prev) => [...prev, service]);
//     } else {
//       console.log('Service already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveService = (service) => {
//     setSelectedServices((prev) =>
//       prev.filter((item) => item.ser_id !== service.ser_id),
//     );
//   };

//   const handleSelectMedicin = (service) => {
//     const isExist = selectedMedicin.find(
//       (item) => item.med_id === service.med_id,
//     );

//     if (!isExist) {
//       setSelectedMedicin((prev) => [...prev, service]);
//     } else {
//       console.log('Medicine already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveMedicin = (service) => {
//     setSelectedMedicin((prev) =>
//       prev.filter((item) => item.med_id !== service.med_id),
//     );
//   };

//   const handleSelectQi = (service) => {
//     const isExist = selectedQi.find((item) =>
//       item.med_id === service.qi_id ||
//       item.equipment_id === service.equipment_id ||
//       item.id === service.id
//     );

//     if (!isExist) {
//       setSelectedQi((prev) => [...prev, service]);
//       console.log('Equipment selected:', service);
//     } else {
//       console.log('Equipment already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveQi = (service) => {
//     setSelectedQi((prev) =>
//       prev.filter((item) =>
//         item.qi_id !== service.qi_id &&
//         item.equipment_id !== service.equipment_id &&
//         item.id !== service.id
//       ),
//     );
//   };

//   const handleSelectDis = (service) => {
//     const isExist = selectedDis.find(
//       (item) => item.dis_id === service.dis_id || item.disease_id === service.disease_id,
//     );

//     if (!isExist) {
//       setSelectedDis((prev) => [...prev, service]);
//     } else {
//       console.log('Disease already selected');
//     }

//     if (selectService) {
//       selectService(service);
//     }
//   };

//   const handleRemoveDis = (service) => {
//     setSelectedDis((prev) =>
//       prev.filter((item) =>
//         item.dis_id !== service.dis_id &&
//         item.disease_id !== service.disease_id
//       ),
//     );
//   };

//   const upperTabs = [
//     {
//       key: '1',
//       label: 'ລາຍການບໍລິການ',
//       children: (
//         <ListService
//           dataValue={''}
//           selectService={handleSelectService}
//           tapService={TabService}
//         />
//       ),
//     },
//     {
//       key: '2',
//       label: 'ຢາ',
//       children: (
//         <ListMed
//           dataValue={''}
//           selectService={handleSelectMedicin}
//           tapService={TabMed}
//         />
//       ),
//     },
//     {
//       key: '3',
//       label: 'ອຸປະກອນ',
//       children: (
//         <ListQi
//           dataValue={''}
//           selectService={handleSelectQi} // ใช้ฟังก์ชันที่แก้ไขแล้ว
//           tapService={TabQi}
//         />
//       ),
//     },
//     {
//       key: '4',
//       label: 'ພະຍາດແຂ້ວ',
//       children: (
//         <ListDis
//           dataValue={''}
//           selectService={handleSelectDis} // แก้ไขให้ใช้ฟังก์ชันเฉพาะ
//           tapService={TabDis}
//         />
//       ),
//     },
//   ];

//   const lowerTabs = [
//     {
//       key: '5',
//       label: 'ສະຫຼຸບການຮັກສາ',
//       children: (
//         <SumService
//           selectedServices={selectedServices}
//           removeService={handleRemoveService}
//           tapDetail={TabServiceSum}
//         />
//       ),
//     },

//     {
//       key: '6',
//       label: 'ສະຫຼຸບການຮັກສາຈ່າຍຢາ',
//       children: (
//         <SumMedicin
//           selectedServices={selectedMedicin}
//           removeService={handleRemoveMedicin}
//           tapDetail={TabMedSum}
//         />
//       ),
//     },

//     {
//       key: '7',
//       label: 'ສະຫຼຸບການຮັກສາຈ່າຍອຸປະກອນ',
//       children: (
//         <SumQil
//           selectedServices={selectedQi}
//           removeService={handleRemoveQi}
//           tapService={TabQiSum}
//         />
//       ),
//     },

//     {
//       key: '8',
//       label: 'ສະຫຼຸບພະຍາດ',
//       children: (
//         <SumDiseases
//           selectedServices={selectedDis}
//           removeService={handleRemoveDis}
//           tapService={TabDiseaseSum}
//         />
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="bg-white p-4 rounded-lg shadow">
//         <Tabs defaultActiveKey="1" items={upperTabs} onChange={onChange} />
//       </div>

//       <div className="bg-white p-4 rounded-lg shadow">
//         <Tabs defaultActiveKey="5" items={lowerTabs} onChange={onChange} />
//       </div>
//     </div>
//   );
// }
