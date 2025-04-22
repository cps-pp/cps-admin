import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { MedicinesHeaders } from './column/medicines';
import CreateMedicines from './create';
import EditMedicines from './edit';

const MedicinesPage: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showAddMedicinesModal, setShowAddMedicinesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/manager/medicines`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMedicines(data.data);
      setFilteredMedicines(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        setCategories(data.data);
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

  const handleViewMedicine = (id: string) => {
    navigate(`/medicines/detail/${id}`);
  };

  const getTypeName = (medtype_id: number) => {
    const category = categories.find((cat) => cat.medtype_id === medtype_id);
    return category ? category.type_name : 'ບໍ່ລະບຸປະເພດ';
  };

  const handleEditMedicine = (id: string) => {
    setSelectedId(id);
    setShowEditModal(true);
  };
  
  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນຢາ ແລະ ອຸປະກອນ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddMedicinesModal(true)}
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
                    {/* <td
                      className={`px-4 py-4 ${medicine.status === 'ໝົດ' ? 'text-red-500' : 'text-green-500'}`}
                    >
                      {medicine.status}
                    </td> */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          medicine.status === 'ຍັງມີ'
                            ? 'bg-green-100 text-green-700'
                            : medicine.status === 'ໝົດ'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {medicine.status}
                      </span>
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
                        // onView={() => handleViewMedicine(medicine.med_id)}
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

      {showAddMedicinesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-lg w-full max-w-2xl relative px-4 ">
            <button
              onClick={() => setShowAddMedicinesModal(false)}
              className="absolute px-4 top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <CreateMedicines
              setShow={setShowAddMedicinesModal}
              getListMedicines={fetchMedicines}
            />
          </div>
        </div>
      )}
      {showEditModal && selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="rounded-lg w-full max-w-2xl bg-white relative ">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute  top-4 right-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <EditMedicines
              id={selectedId}
              onClose={() => setShowEditModal(false)}
              setShow={setShowEditModal}
              getList={fetchMedicines}
            />

          </div>
        </div>
      )}

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
