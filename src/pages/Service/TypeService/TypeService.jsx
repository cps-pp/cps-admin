import { Tabs } from 'antd';
import ListService from './Component/ListService';
import ListMed from './Component/ListMed';
import ListDis from './Component/ListDis';
import ListQi from './Component/ListQi';

const onChange = (key) => {
  console.log(key);
};

const TabService = 1;
const TabMed = 2;
const TabQi = 3;
const TabDis = 4;



const items = [
  {
    key: '1',
    label: 'ລາຍການບໍລິການ',
    children: (
      <>
        <ListService
          dataValue={''}
          selectService={(x) => console.log(x)}
          tapService={TabService}
        />
      </>
    ),
  },
  {
    key: '2',
    label: 'ຢາ',
    children: (
      <>
        <ListMed
          dataValue={''}
          selectService={(x) => console.log(x)}
          tapService={TabMed}
        />
      </>
    ),
  },
   {
    key: '3',
    label: 'ອຸປະກອນ',
    children: (
      <>
        <ListQi
          dataValue={''}
          selectService={(x) => console.log(x)}
          tapService={TabQi}
        />
      </>
    ),
  },
  {
    key: '4',
    label: 'ພະຍາດແຂ້ວ',
    children: <>
        <ListDis
          dataValue={''}
          selectService={(x) => console.log(x)}
          tapService={TabDis}
        />
      </>,
  },
];

export default function TypeService() {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
