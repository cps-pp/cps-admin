import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { MedicinesHeaders } from './column/medicines';

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]); // Data ของยาทั้งหมด
  const [filteredMedicines, setFilteredMedicines] = useState<any[]>([]); // Data ที่กรองแล้ว
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState(''); // ค่าของการค้นหาที่ผู้ใช้ป้อน
  const [categories, setCategories] = useState<any[]>([]); // Data ของหมวดหมู่ประเภทยา
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:4000/manager/medicines`,
          {
            method: 'GET',
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMedicines(data.data); // บันทึกข้อมูลยา
        setFilteredMedicines(data.data); // เริ่มต้นให้ผลลัพธ์เป็นทั้งหมด
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/manager/category`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data.data); // บันทึกข้อมูลหมวดหมู่
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter((medicine) =>
        medicine.med_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery, medicines]);

  const openDeleteModal = (id: string) => () => {
    setSelectedMedicineId(id);
    setShowModal(true);
  };

  const handleDeleteMedicine = async () => {
    if (!selectedMedicineId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/manager/medicines/${selectedMedicineId}`,
        { method: 'DELETE' },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setMedicines((prevMedicines) =>
        prevMedicines.filter(
          (medicine) => medicine.med_id !== selectedMedicineId,
        ),
      );
      setShowModal(false);
      setSelectedMedicineId(null);
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const handleEditMedicine = (id: string) => {
    navigate(`/medicines/edit/${id}`);
  };

  const handleViewMedicine = (id: string) => {
    navigate(`/medicines/detail/${id}`);
  };

  // Function to get the type name based on medtype_id
  const getTypeName = (medtype_id: number) => {
    const category = categories.find((cat) => cat.medtype_id === medtype_id);
    return category ? category.type_name : 'ບໍ່ລະບຸປະເພດ';
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນຢາ ແລະ ອຸປະກອນ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/medicines/create')}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມຂໍ້ມູນ
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 p-4">
        <Search
          type="text"
          name="search"
          placeholder="ຄົ້ນຫາຊື່..."
          className="rounded border border-stroke dark:border-strokedark"
          onChange={(e) => {
            const query = e.target.value;
            setSearchQuery(query);
          }}
        />
      </div>

      <div className="text-md text-strokedark dark:text-bodydark3">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-left dark:bg-meta-4 bg-blue-100">
                {MedicinesHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300"
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{medicine.med_id}</td>
                    <td className="px-4 py-4">{medicine.med_name}</td>
                    <td className="px-4 py-4">{medicine.qty}</td>
                    <td
                      className={`px-4 py-4 ${medicine.status === 'ໝົດ' ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {medicine.status}
                    </td>

                    <td className="px-4 py-4">
                      {(medicine.price * 1).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      {new Date(medicine.expired).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      {getTypeName(medicine.medtype_id)}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <TableAction
                        onView={() => handleViewMedicine(medicine.med_id)}
                        onDelete={openDeleteModal(medicine.med_id)} // Pass medicine id
                        onEdit={() => handleEditMedicine(medicine.med_id)} // Pass medicine id
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຢານີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteMedicine}
      />
    </div>
  );
};

export default MedicinesPage;
