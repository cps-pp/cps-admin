import { useEffect, useState } from 'react';
import { CopyPlus } from 'lucide-react';
import AntdTextArea from '../../../components/Forms/AntdTextArea';
import BoxDate from '../../../components/Date';
import useStoreServices from '../../../store/selectServices';
import ListServiceUpdate from './ListServiceUpdate';
import ListDisUpdate from './ListDisUpdate';
import { Divider, Table, Tabs } from 'antd';
import { iconTrash } from '@/configs/icon';
import useStoreDisease from '../../../store/selectDis';

const InServiceUpdate = ({ dataPatient, callValue }) => {

  const [intivalue, setIntivalue] = useState({});

  useEffect(() => {
    if (dataPatient?.in_id) {
      setIntivalue(dataPatient);
    }
  }, [dataPatient?.in_id]);

  useEffect(() => {
    if (intivalue) {
      callValue(intivalue); // call callback เมื่อค่า intivalue อัปเดตจริง
    }
  }, [intivalue]);

  const handleChangeInput = (name, value) => {
    const updated = { ...intivalue, [name]: value };
    setIntivalue(updated);
    callValue(updated); // ใช้ค่าที่แน่นอน
  };


  return (
    <div className="rounded-lg  ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <label className="text-sm text-gray-600 mb-1 block">
            ລະຫັດ/ຊື່ຄົນເຈັບ
          </label>
          <p
            className="w-full rounded border text-purple-700 font-medium border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:disabled:bg-meta-4 dark:focus:border-primary dark:text-white capitalize cursor-pointer"
          >{intivalue?.patient_id} - {intivalue?.patient_name}</p>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            ເລກທີປິ່ນປົວ
          </label>
          <p
            className="w-full rounded border border-stroke bg-gray-50 py-3 px-4 outline-none"
          >{intivalue?.in_id}</p>
        </div>

        <BoxDate
          name="date"
          label="ວັນທີປິ່ນປົວ"
          select="date"
          formOptions={false}
          withTime={true}
        // value={formData.date}
        />

        <AntdTextArea
          label="ອາການເບື່ອງຕົ້ນ (Symptom)"
          name="symptom"
          rows={2}
          placeholder="ປ້ອນອາການ"
          onChange={(e) => handleChangeInput('symptom', e.target.value)}
          value={intivalue?.symptom}
        />

        <AntdTextArea
          label="ບົ່ງມະຕິ (Checkup)"
          name="checkup"
          rows={2}
          placeholder="ປ້ອນຂໍ້ມູນບບົ່ງມະຕິ"
          onChange={(e) => handleChangeInput('checkup', e.target.value)}
          value={intivalue?.checkup}
        />

        <AntdTextArea
          label="ພະຍາດ (diseases Now)"
          name="diseases_now"
          rows={2}
          placeholder="ປ້ອນຜົນກວດ"
          onChange={(e) => handleChangeInput('diseases_now', e.target.value)}
          value={intivalue?.diseases_now}
        />

        <AntdTextArea
          label="ໝາຍເຫດ"
          name="note"
          rows={2}
          placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມຖ້າມີ"
          onChange={(e) => handleChangeInput('note', e.target.value)}
          value={intivalue?.note}
        />
      </div>
      {/* {console.log(intivalue)} */}
      <div className="overflow-x-auto shadow mb-8">
        <TypeServiceUpdate listData={intivalue} />
      </div>

    </div>
  );
};

const TypeServiceUpdate = ({ listData, value }) => {
  // console.log(listData)
  const [listDataServices, setlistDataServices] = useState([]);
  const [listDisease, setListDisease] = useState([]);

  const { newServices, removeServiceNews } = useStoreServices();
<<<<<<< HEAD
  const { removeDiseaseUpdate, disUpdate, addDiseaseUpdate } = useStoreDisease();
=======
  const { disUpdate, removeDiseaseUpdate } = useStoreDisease();
>>>>>>> test-3

  useEffect(() => {
    setlistDataServices(newServices ?? []);
    setListDisease(disUpdate ?? []);
  }, [newServices, disUpdate]);


  const columnsService = [
    {
      title: 'ລະຫັດ',
      key: 'ser_id',
      dataIndex: 'ser_id',
    },
    {
      title: 'ລາຍການປິ່ນປົວ',
      key: 'ser_name',
      dataIndex: 'ser_name',
    },
    {
      title: 'ຈໍານວນ',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'ລາຄາ',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <span>{price?.toLocaleString() || '-'}</span>,
    },
    {
      title: 'ຈັດການ',
      key: 'action',
      render: (_, record) => (
        <button
          onClick={() => removeServiceNews(record)}
          className="text-red-500 hover:text-red-600 p-1 rounded"
        >
          {iconTrash}
        </button>
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
        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: 'ລາຍການບໍລິການ',
            children: (
              <ListServiceUpdate
                // inspection={listData}
                dataValue={value}
                tapService={1}
              />
            ),
          },
          {
            key: '4',
            label: 'ພະຍາດແຂ້ວ',
            children: (
              <ListDisUpdate
                dataValue={value}
                // selectService={handleSelectDis}
                tapService={4}
              />
            ),
          },
        ]} />
      </div>
      <h1 className="text-lg font-semibold text-form-strokedark py-4  text-left flex items-center gap-2 ">
        ສະຫຼຸບການລາຍການທັງໝົດ
      </h1>
      <div className="p-2  rounded bg-white border border-stroke ">
<<<<<<< HEAD
        <h5 className='font-bold'>ສະຫຼຸບການຮັກສາ</h5>
=======
        <h5 className='mb-2 font-bold'>ສະຫຼຸບການຮັກສາ</h5>
>>>>>>> test-3
        <Table
          columns={columnsService}
          dataSource={listDataServices}
          pagination={{ pageSize: 4, size: 'middle' }}
          size="small"
          locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
        />
      </div>

      <div className="p-2 mt-10 rounded bg-white border border-stroke ">
<<<<<<< HEAD
        <h5 className='font-bold mb-3'>ສະຫຼຸບພະຍາດ</h5>
        <div>
          <ul>
            {disUpdate?.map((name, index) => (
=======
        <h5 className='mb-2 font-bold'>ສະຫຼຸບພະຍາດ</h5>
        <div>
          <ul>
            {listDisease?.map((name, index) => (
>>>>>>> test-3
              <div key={index}>
                <li className="flex justify-between">
                  <span>{name}</span>
                  <button
                    onClick={() => removeDiseaseUpdate(index)}
                    className="text-red-500 hover:text-red-600 p-1 rounded"
                  >
                    {iconTrash}
                  </button>
                </li>
<<<<<<< HEAD
                {index !== disUpdate.length - 1 && <Divider className="my-2" />}
=======
                {index !== listDisease?.length - 1 && <Divider className="my-2" />}
>>>>>>> test-3
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default InServiceUpdate;
