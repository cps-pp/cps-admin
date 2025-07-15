import BackButton from '@/components/BackButton';
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const DetailEmployee = () => {
  const { id } = useParams();
  const location = useLocation();
  const [employee, setEmployee] = useState(location.state?.employee || null);
  const [loading, setLoading] = useState(!location.state?.employee);

  useEffect(() => {
    if (!employee) {
      const fetchEmployeeById = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:4000/src/manager/emp/${id}`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setEmployee(data.data);
        } catch (error) {
          console.error('Error fetching employee details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployeeById();
    }
  }, [id, employee]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderDetailItem = (label, value) => (
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-md text-form-strokedark">{value || '-'}</span>
    </div>
  );

  if (loading)
    return <div className="text-center p-6 text-gray-600">Loading employee details...</div>;

  if (!employee)
    return <div className="text-center p-6 text-red-500">ບໍ່ພົບຂໍ້ມູນພະນັກງານ</div>;

  return (
    <div className="rounded-lg bg-white shadow-md dark:bg-boxdark p-6 mx-auto">
      <div className="flex items-center gap-4 border-b border-gray-300 pb-4 mb-6">
        <BackButton />
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
          ລາຍລະອຽດພະນັກງານ
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
        {renderDetailItem('ລະຫັດ', employee.emp_id)}
        {renderDetailItem('ຊື່ຫມໍ', employee.emp_name)}
        {renderDetailItem('ນາມສະກຸນ', employee.emp_surname)}
        {renderDetailItem('ເພດ', employee.gender)}
        {renderDetailItem('ວັນເດືອນປີເກີດ', formatDate(employee.dob))}
        {renderDetailItem('ເບີຕິດຕໍ່', employee.phone)}
        {renderDetailItem('ທີ່ຢູ່', employee.address)}
        {renderDetailItem('ຕຳແໜ່ງ', employee.role)}
      </div>
    </div>
  );
};

export default DetailEmployee;