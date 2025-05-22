import { Tabs } from 'antd';
import { useState } from 'react';
import ListService from './Component/ListService';
import ListMed from './Component/ListMed';
import ListDis from './Component/ListDis';
import ListQi from './Component/ListQi';
import SumService from './Component/SumService';
import SumMedicin from './Component/SumMedicin';

const onChange = (key) => {
  console.log(key);
};

const TabService = 1;
const TabMed = 2;
const TabQi = 3;
const TabDis = 4;
const TabServiceSum = 5;
const TabMedSum = 6;
const TabQiSum = 7;
const TabDiseaseSum = 8;

export default function TypeService({ selectService }) {
  const [selectedServices, setSelectedServices] = useState([]);

  const handleSelectService = (service) => {
    const isExist = selectedServices.find(item => item.ser_id === service.ser_id);
    
    if (!isExist) {
      setSelectedServices(prev => [...prev, service]);
    } else {
      console.log('Service already selected');
    }
    
    if (selectService) {
      selectService(service);
    }
  };

  const handleRemoveService = (service) => {
    setSelectedServices(prev => 
      prev.filter(item => item.ser_id !== service.ser_id)
    );
  };

  const upperTabs = [
    {
      key: '1',
      label: 'ລາຍການບໍລິການ',
      children: (
        <ListService
          dataValue={''}
          selectService={handleSelectService}
          tapService={TabService}
        />
      ),
    },
    {
      key: '2',
      label: 'ຢາ',
      children: (
        <ListMed
          dataValue={''}
          selectService={handleSelectService}
          tapService={TabMed}
        />
      ),
    },
    {
      key: '3',
      label: 'ອຸປະກອນ',
      children: (
        <ListQi
          dataValue={''}
          selectService={handleSelectService}
          tapService={TabQi}
        />
      ),
    },
    {
      key: '4',
      label: 'ພະຍາດແຂ້ວ',
      children: (
        <ListDis
          dataValue={''}
          selectService={handleSelectService}
          tapService={TabDis}
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
           selectedServices={selectedServices}
           removeService={handleRemoveService}
           tapDetail={TabServiceSum}
         />
       ),
     },
    
     



     {
       key: '6',
       label: 'ສະຫຼຸບການຮັກສາຈ່າຍຢາ',
       children: (
         <SumMedicin
           dataValue={''}
           selectService={(x) => console.log(x)}
           tapService={TabQiSum}
         />
       ),
     },
     {
       key: '7',
       label: 'ສະຫຼຸບການຮັກສາຈ່າຍອຸປະກອນ',
       children: (
         <SumMedicin
           dataValue={''}
           selectService={(x) => console.log(x)}
           tapService={TabQiSum}
         />
       ),
     },

     {
       key: '8',
       label: 'ສະຫຼຸບພະຍາດ',
       children: (
         <ListMed
           dataValue={''}
           selectService={(x) => console.log(x)}
           tapService={TabDiseaseSum}
         />
       ),
     },
  ];

  return (
    <div className="space-y-6">

      
      <div className="bg-white p-4 rounded-lg shadow">
        <Tabs 
          defaultActiveKey="1" 
          items={upperTabs} 
          onChange={onChange} 
          
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <Tabs 
          defaultActiveKey="5" 
          items={lowerTabs} 
          onChange={onChange} 
        />
      </div>
    </div>
  );
}