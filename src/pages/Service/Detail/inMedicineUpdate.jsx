import useStoreMed from '../../../store/selectMed';
import useStoreQi from '../../../store/selectQi';
import { openAlert } from '@/redux/reducer/alert';
import { useAppDispatch } from '@/redux/hook';
import { CopyPlus, Save } from 'lucide-react';
import { InputNumber, Table, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ListMedUpdate from './ListMedUpdate';
import ListQiUpdate from './ListQiUpdate';
import { iconTrash } from '@/configs/icon';


const InMedicineUpdate = ({ dataPatient }) => {

  const { newMedicines, removeMedicineNews, updateQtyMedicineNews } = useStoreMed();
  const { newEquipment, removeEquipmentNews, updateQtyEquipmentNews } = useStoreQi();

  const [listDataMed, setListDataMed] = useState([]);
  const [listDataQi, setListDataQi] = useState([]);

  useEffect(() => {
    setListDataMed(newMedicines ?? []);
    setListDataQi(newEquipment ?? []);
  }, [newMedicines, newEquipment]);

  const columnsMed = [
    {
      title: 'ລະຫັດ',
      dataIndex: 'med_id',
      key: 'med_id',
    },
    {
      title: 'ລາຍການຈ່າຍຢາ',
      dataIndex: 'med_name',
      key: 'med_name',
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: 'qty',
      key: 'qty',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => updateQtyMedicineNews(record.med_id, value)}
        />
      ),
    },

    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <a>{price?.toLocaleString()}</a>,
    },
    {
      title: 'ລວມ',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span>{total?.toLocaleString() ?? 0}</span>,
    },
    {
      title: 'ຈັດການ',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={() => removeMedicineNews(record)}
          className="text-red-500 hover:text-red-600 p-1 rounded"
        >
          {iconTrash}
        </button>
      ),
    },
  ];

  const columnsEquipment = [
    {
      title: 'ລະຫັດ',
      dataIndex: 'med_id',
      key: 'med_id',
    },
    {
      title: 'ລາຍການຈ່າຍອຸປະກອນ',
      dataIndex: 'med_name',
      key: 'med_name',
    },
    {
      title: 'ຈຳນວນ',
      dataIndex: 'qty',
      key: 'qty',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => updateQtyEquipmentNews(record.med_id, value)}
        />
      ),
    },

    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <a>{price?.toLocaleString()}</a>,
    },
    {
      title: 'ລວມ',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span>{total?.toLocaleString() ?? 0}</span>,
    },
    {
      title: 'ຈັດການ',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={() => removeEquipmentNews(record)}
          className="text-red-500 hover:text-red-600 p-1 rounded"
        >
          {iconTrash}
        </button>
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
        <Tabs defaultActiveKey="2" items={[
          {
            key: '2',
            label: 'ຢາ',
            children: (
              <ListMedUpdate
                // dataValue={value}
                // selectService={handleSelectMedicin}
                tapService={2}
              />
            ),
          },
          {
            key: '3',
            label: 'ອຸປະກອນ',
            children: (
              <ListQiUpdate
                // dataValue={value}
                // selectService={handleSelectQi}
                tapService={3}
              />
            ),
          },
        ]} />
      </div>
      <h1 className="text-lg font-semibold text-form-strokedark py-4  text-left flex items-center gap-2 ">
        ສະຫຼຸບການຈ່າຍຢາ ແລະ ອຸປະກອນ
      </h1>
      <div className="p-2 rounded bg-white border border-stroke">
        <Tabs defaultActiveKey="6" items={[
          {
            key: '6',
            label: 'ສະຫຼຸບການຈ່າຍຢາ',
            children: (
              <Table
                columns={columnsMed}
                dataSource={listDataMed}
                pagination={{ pageSize: 4, size: 'middle' }}
                size="small"
                locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
              />
            ),
          },
          {
            key: '7',
            label: 'ສະຫຼຸບການຈ່າຍອຸປະກອນ',
            children: (
              <Table
                columns={columnsEquipment}
                dataSource={listDataQi}
                pagination={{ pageSize: 4, size: 'middle' }}
                size="small"
                locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
              />
            ),
          },
        ]} />
      </div>
    </div>
  );
};
export default InMedicineUpdate;
