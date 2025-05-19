import { Tabs } from 'antd';
import ListService from './Component/ListService';
import ListMed from './Component/ListMed';
import ListDis from './Component/ListDis';

const onChange = (key) => {
  console.log(key);
};

const TabService = 1;
const TabMed = 2;



const items = [
  {
    key: '1',
    label: 'ສະຫຼຸບການຮັກສາ',
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
    label: 'ສະຫຼຸບການຮັກສາຈ່າຍຢາ ແລະ ອຸປະກອນ',
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
    label: 'ສະຫຼຸບພະຍາດ',
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
];

export default function Summary() {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}
