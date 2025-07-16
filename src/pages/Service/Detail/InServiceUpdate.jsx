import { useEffect, useState } from 'react';
import { CopyPlus } from 'lucide-react';
import AntdTextArea from '../../../components/Forms/AntdTextArea';
import BoxDate from '../../../components/Date';
import useStoreServices from '../../../store/selectServices';
import ListServiceUpdate from './ListServiceUpdate';
import ListDisUpdate from './ListDisUpdate';
import { Divider, InputNumber, Table, Tabs } from 'antd';
import { iconTrash } from '@/configs/icon';
import useStoreDisease from '../../../store/selectDis';
import SelectBoxId from '../../../components/Forms/SelectID';
import { useAppDispatch } from '@/redux/hook';
import { URLBaseLocal } from '../../../lib/MyURLAPI';
import { openAlert } from '@/redux/reducer/alert';

const InServiceUpdate = ({ dataPatient, callValue }) => {
  const dispatch = useAppDispatch();
  const [employees, setEmployees] = useState([]);
  const [intivalue, setIntivalue] = useState({});
  const [selectEmpUpdated, setSelectEmpUpdated] = useState('');
  const [loading, setLoading] = useState(true); // เพิ่ม loading state

  const register = () => ({});
  const errors = {};

  useEffect(() => {
    if (dataPatient?.in_id) {
      setIntivalue(dataPatient);
      setSelectEmpUpdated(dataPatient.emp_id_updated || '');
    }
  }, [dataPatient?.in_id]);

  useEffect(() => {
    if (intivalue && callValue) {
      callValue(intivalue);
    }
  }, [intivalue, callValue]);

  const handleChangeInput = (name, value) => {
    const updated = { ...intivalue, [name]: value };
    setIntivalue(updated);
    if (callValue) {
      callValue(updated);
    }
  };

  const handleEmpChange = (value) => {
    setSelectEmpUpdated(value);
    handleChangeInput('emp_id_updated', value);
  };

  const handleDateChange = (value) => {
    handleChangeInput('date', value);
  };

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        setLoading(true);
        console.log(
          'Fetching employees from:',
          `${URLBaseLocal}/src/manager/emp`,
        );

        const response = await fetch(`${URLBaseLocal}/src/manager/emp`);
        const data = await response.json();

        console.log('API Response:', response.status, data);

        if (response.ok) {
          const employeeData = data.data || data; // รองรับทั้งสองรูปแบบ

          if (Array.isArray(employeeData)) {
            setEmployees(
              employeeData.map((em) => ({
                id: em.emp_id,
                name: em.emp_name,
                surname: em.emp_surname,
                role: em.role,
              })),
            );
          } else {
            console.error('Employee data is not an array:', employeeData);
            setEmployees([]);
          }
        } else {
          console.error('Failed to fetch employees', data);
          dispatch(
            openAlert({
              type: 'error',
              title: 'ເກີດຂໍ້ຜິດພາດ',
              message: data.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນພະນັກງານໄດ້',
            }),
          );
        }
      } catch (error) {
        console.error('Error fetching employees', error);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີຟເວີ',
          }),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEmp();
  }, [dispatch]);

  console.log('Employees:', employees);
  console.log('Loading:', loading);
  console.log('Initial value:', intivalue);

  // เพิ่มการตรวจสอบ loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    


    return `${day}/${month}/${year} ${date.getHours()}:${date.getMinutes()}`;
  }
  return (
    <div className="rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <label className="text-sm text-gray-600 mb-1 block">
            ລະຫັດ/ຊື່ຄົນເຈັບ
          </label>
          <p className="w-full rounded border text-purple-700 font-medium border-stroke bg-transparent py-3 px-4 outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white capitalize cursor-pointer">
            {intivalue?.patient_id || 'N/A'} -{' '}
            {intivalue?.patient_name || 'N/A'}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            ເລກທີປິ່ນປົວ
          </label>
          <p className="w-full rounded border border-stroke bg-gray-50 py-3 px-4 outline-none">
            {intivalue?.in_id || 'N/A'}
          </p>
        </div>

        <div className="">
          <label className="text-sm text-gray-600 mb-1 block">
            ວັນທີປິ່ນປົວ
          </label>
          <input
            type=""
            name="date"
            placeholder="ເລືອກວັນທີ"
            className="w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary text-black dark:text-white capitalize"
            value={formatDateForInput(intivalue?.date)}
            onChange={(e) => handleChangeInput('date', e.target.value)}
            aria-label="ວັນທີປິ່ນປົວ"
          />
        </div>

        <AntdTextArea
          label="ອາການເບື່ອງຕົ້ນ (Symptom)"
          name="symptom"
          rows={1}
          placeholder="ປ້ອນອາການ"
          onChange={(e) => handleChangeInput('symptom', e.target.value)}
          value={intivalue?.symptom || ''}
        />

        <AntdTextArea
          label="ບົ່ງມະຕິ (Checkup)"
          name="checkup"
          rows={1}
          placeholder="ປ້ອນຂໍ້ມູນບົ່ງມະຕິ"
          onChange={(e) => handleChangeInput('checkup', e.target.value)}
          value={intivalue?.checkup || ''}
        />

        <AntdTextArea
          label="ພະຍາດ (diseases Now)"
          name="diseases_now"
          rows={1}
          placeholder="ປ້ອນຜົນກວດ"
          onChange={(e) => handleChangeInput('diseases_now', e.target.value)}
          value={intivalue?.diseases_now || ''}
        />

        <AntdTextArea
          label="ໝາຍເຫດ"
          name="note"
          rows={1}
          placeholder="ປ້ອນລາຍລະອຽດເພີ່ມເຕີມຖ້າມີ"
          onChange={(e) => handleChangeInput('note', e.target.value)}
          value={intivalue?.note || ''}
        />

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            ພະນັກງານ (ຜູ້ແກ້ໄຂ)
          </label>
          <select
            name="emp_id_updated"
            value={selectEmpUpdated}
            onChange={(e) => handleEmpChange(e.target.value)}
            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4.5 outline-none transition 
               focus:border-primary active:border-primary text-black capitalize"
          >
            <option value="">-- ເລືອກພະນັກງານ --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.surname} - {emp.role}
              </option>
            ))}
          </select>
          {employees.length === 0 && !loading && (
            <p className="text-red-500 text-sm mt-1">ບໍ່ມີຂໍ້ມູນພະນັກງານ</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto mb-8">
        <TypeServiceUpdate listData={intivalue} />
      </div>
    </div>
  );
};

const TypeServiceUpdate = ({ listData }) => {
  const [listDataServices, setlistDataServices] = useState([]);
  const [listDisease, setListDisease] = useState([]);
  const { newServices, removeServiceNews, updateQty } = useStoreServices();
  const { disUpdate, removeDiseaseUpdate } = useStoreDisease();

  useEffect(() => {
    setlistDataServices(newServices ?? []);
    setListDisease(disUpdate ?? []);
  }, [newServices, disUpdate]);

  const handleQtyChange = (ser_id, newQty) => {
    const updated = listDataServices.map((item) =>
      item.ser_id === ser_id ? { ...item, qty: newQty } : item,
    );
    setlistDataServices(updated);

    if (updateQty) {
      updateQty(ser_id, newQty);
    }
  };

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
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(value) => handleQtyChange(record.ser_id, value)}
        />
      ),
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
      <h1 className="text-lg font-semibold text-form-strokedark py-2 text-left flex items-center gap-2">
        <CopyPlus className="w-5 h-5" />
        ເພີ່ມລາຍການບໍລິການ
      </h1>
      <div className="p-2 border border-stroke rounded">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: 'ລາຍການບໍລິການ',
              children: (
                <ListServiceUpdate dataValue={listData} tapService={1} />
              ),
            },
            {
              key: '4',
              label: 'ພະຍາດແຂ້ວ',
              children: <ListDisUpdate dataValue={listData} tapService={4} />,
            },
          ]}
        />
      </div>

      <h1 className="text-lg font-semibold text-form-strokedark py-4 text-left flex items-center gap-2">
        ສະຫຼຸບການລາຍການທັງໝົດ
      </h1>
      <div className="p-2 rounded border border-stroke">
        <h5 className="mb-2 font-bold ">ສະຫຼຸບການຮັກສາ</h5>
        <Table
          columns={columnsService}
          dataSource={listDataServices}
          pagination={{ pageSize: 4, size: 'middle' }}
          size="small"
          locale={{ emptyText: 'ບໍ່ມີຂໍ້ມູນ' }}
          rowKey="ser_id"
        />
      </div>

      <div className="p-2 mt-4 rounded border border-stroke">
        <h5 className=" font-bold border-b border-stroke py-1 mb-3 ">
          ສະຫຼຸບພະຍາດ
        </h5>
        {listDisease && listDisease.length > 0 ? (
          <ul>
            {listDisease.map((name, index) => (
              <div key={index}>
                <li className="flex justify-between">
                  <span>{name}</span>
                  <button
                    onClick={() => removeDiseaseUpdate(index)}
                    className="text-red-500 hover:text-red-600 p-1 rounded "
                  >
                    {iconTrash}
                  </button>
                </li>
                {index !== listDisease.length - 1 && (
                  <Divider className="my-2" />
                )}
              </div>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">ບໍ່ມີຂໍ້ມູນພະຍາດ</p>
        )}
      </div>
    </>
  );
};

export default InServiceUpdate;
