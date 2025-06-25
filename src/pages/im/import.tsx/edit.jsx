import { useForm } from 'react-hook-form';

import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Loader from '@/common/Loader';
import Alerts from '@/components/Alerts';
import InputBox from '@/components/Forms/Input';
import SelectBoxId from '@/components/Forms/SelectID';
import BoxDate from '@/components/Date';

const EditImport = ({ id, setShow, getList }) => {
  const {
    register,
    handleSubmit,

    setValue,
    reset,
    getValues,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useAppDispatch();
  const [employees, setEmployees] = useState([]);
  const [preorders, setPreorders] = useState([]);
  const [selectedPreorder, setSelectedPreorder] = useState('');
  const [selectEmpcreate, setSelectEmpcreate] = useState('');
  const [dateValue, setDateValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');

  // Watch form values for debugging
  const watchedValues = watch();

  // Fetch preorders and employees
  useEffect(() => {
    async function fetchData() {
      try {
        const [preorderRes, empRes] = await Promise.all([
          fetch('http://localhost:4000/src/preorder/preorder'),
          fetch('http://localhost:4000/src/manager/emp'),
        ]);

        if (preorderRes.ok) {
          const data = await preorderRes.json();
          console.log('Preorders data:', data);
          setPreorders(
            data.data.map((p) => ({
              preorder_id: p.preorder_id,
              preorder_date: p.preorder_date,
              status: p.status,
            })),
          );
        }

        if (empRes.ok) {
          const data = await empRes.json();
          console.log('Employees data:', data);
          setEmployees(
            data.data.map((e) => ({
              id: e.emp_id,
              name: e.emp_name,
              surname: e.emp_surname,
              role: e.role,
            })),
          );
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    }
    fetchData();
  }, []);

  // Fetch import data
  useEffect(() => {
    async function fetchImport() {
      if (!id) {
        console.log('No ID provided');
        return;
      }

      setLoading(true);
      setDataLoaded(false);

      try {
        console.log('Fetching import with ID:', id);
        const res = await fetch(`http://localhost:4000/src/im/import/${id}`);
        const result = await res.json();
        console.log('API Response:', result);

        if (res.ok && result.data) {
          const importData = result.data;
          console.log('Import data before processing:', importData);

          // Format date if needed
          const formattedDate = importData.im_date ?
            (importData.im_date.includes('T') ?
              importData.im_date.split('T')[0] :
              importData.im_date) : '';

          // Set ค่าใน state และ form
          setDateValue(formattedDate);
          setCurrentFileName(importData.file || '');

          const formData = {
            im_id: importData.im_id || '',
            im_date: formattedDate,
            preorder_id: importData.preorder_id || '',
            emp_id_create: importData.emp_id_create || '',
          };

          // console.log('Form data to reset:', formData);

          // Reset form with fetched data
          reset(formData);

          // Set state values
          setSelectedPreorder(importData.preorder_id || '');
          setSelectEmpcreate(importData.emp_id_create || '');

          setDataLoaded(true);
        } else {
          console.error('API Error Details:', result);
          dispatch(
            openAlert({
              type: 'error',
              title: 'ເກີດຂໍ້ຜິດພາດ',
              message: result.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນການນຳເຂົ້າໄດ້',
            }),
          );
        }
      } catch (err) {
        console.error('Error fetching import:', err);
        dispatch(
          openAlert({
            type: 'error',
            title: 'ເກີດຂໍ້ຜິດພາດ',
            message: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ',
          }),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchImport();
  }, [id, reset, dispatch, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log('Selected file:', file);
  };

  const handleSave = async (formData) => {
    setLoading(true);

    try {
      console.log('Form data before save:', formData);
      console.log('Selected states:', { selectedPreorder, selectEmpcreate });

      // Create FormData for file upload
      const formDataPayload = new FormData();
      formDataPayload.append('im_id', formData.im_id);
      formDataPayload.append('im_date', formData.im_date);
      formDataPayload.append('preorder_id', selectedPreorder || formData.preorder_id);
      formDataPayload.append('emp_id_create', selectEmpcreate || formData.emp_id_create);
      
      // Only append file if a new one is selected
      if (selectedFile) {
        formDataPayload.append('file', selectedFile);
      }

      console.log('FormData to send:', {
        im_id: formData.im_id,
        im_date: formData.im_date,
        preorder_id: selectedPreorder || formData.preorder_id,
        emp_id_create: selectEmpcreate || formData.emp_id_create,
        file: selectedFile ? selectedFile.name : 'No new file',
      });

      const res = await fetch(`http://localhost:4000/src/im/import/${id}`, {
        method: 'PUT',
        body: formDataPayload, // ไม่ต้องใส่ Content-Type header เมื่อส่ง FormData
      });

      const result = await res.json();
      console.log('Save response:', result);

      if (!res.ok) {
        throw new Error(result.error || 'ແກ້ໄຂຂໍ້ມູນບໍ່ສໍາເລັດ');
      }

      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ແກ້ໄຂຂໍ້ມູນການນຳເຂົ້າສໍາເລັດ',
        }),
      );

      await getList();

      setShow(false);
     } catch (error) {
      console.error('Save error:', error);
      dispatch(
        openAlert({
          type: 'error',
          title: 'ເກີດຂໍ້ຜິດພາດ',
          message: error.message,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching data
  if (loading && !dataLoaded) {
    return <Loader />;
  }

   return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center border-b border-stroke dark:border-strokedark pb-4 px-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ແກ້ໄຂຂໍ້ມູນການນຳເຂົ້າ
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(handleSave)}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 px-4"
      >
        {/* รหัสการนำเข้า - ไม่สามารถแก้ไขได้ */}
        <InputBox
          label="ລະຫັດການນຳເຂົ້າ"
          name="im_id"
          type="text"

          register={register}

          errors={errors}
          disabled
        />


        {/* วันที่นำเข้า - สามารถแก้ไขได้ */}
        <BoxDate
          register={register}
          errors={errors}
          name="im_date"
          label="ວັນທີນຳເຂົ້າ"
          formOptions={{ required: 'ກະລຸນາເລືອກວັນທີນຳເຂົ້າ' }}
          select={dateValue}
          setValue={(name, value) => {
            setValue(name, value);
            setDateValue(value);
          }}
        />

        {/* เลือกใบสั่งซื้อ - สามารถแก้ไขได้ */}
        <SelectBoxId
          label="ເລືອກໃບສັ່ງຊື້"
          name="preorder_id"
          value={selectedPreorder}
          options={preorders.map((preorder) => ({
            value: preorder.preorder_id,
            label: `${preorder.preorder_id} `,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກໃບສັ່ງຊື້' }}
          onSelect={(e) => {
            const newPreorder = e.target.value;
            console.log('Preorder selected:', newPreorder);
            setSelectedPreorder(newPreorder);
            setValue('preorder_id', newPreorder);
          }}
        />

        {/* พนักงาน - สามารถแก้ไขได้ */}
        <SelectBoxId
          label="ພະນັກງານ"
          name="emp_id_create"
          value={selectEmpcreate}
          options={employees.map((emp) => ({

            value: emp.id,
            label: `${emp.name} ${emp.surname} - ${emp.role}`,
          }))}
          register={register}
          errors={errors}
          formOptions={{ required: 'ກະລຸນາເລືອກພະນັກງານ' }}
          onSelect={(e) => {
            const newEmp = e.target.value;
            console.log('Employee selected:', newEmp);
            setSelectEmpcreate(newEmp);
            setValue('emp_id_create', newEmp);
          }}
        />

        {/* ไฟล์แนบ - สามารถแก้ไขได้ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ແນບໄຟລ໌
          </label>
          {currentFileName && (
            <p className="text-xs text-gray-500 mb-2">
              ຟາຍປັດຈຸບັນ: {currentFileName}
            </p>
          )}
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            ຮອງຮັບຟາຍ: PDF, ຮູບ, Word, Excel
          </p>
        </div>

        <div className="flex justify-end space-x-4 col-span-full py-4">
          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditImport;

