import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { DiseaseHeaders } from './column/diseasw';
import CreateDisease from './create';
import EditDisease from './edit';

const DiseasePage: React.FC = () => {
  const [diseases, setDiseases] = useState<any[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDiseaseModal, setShowAddDiseaseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/manager/disease`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDiseases(data.data);
      setFilteredDiseases(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDiseases(diseases);
    } else {
      const filtered = diseases.filter((disease) =>
        disease.disease_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredDiseases(filtered);
    }
  }, [searchQuery, diseases]);

  const openDeleteModal = (id: string) => () => {
    setSelectedDiseaseId(id);
    setShowModal(true);
  };

  const handleDeleteDisease = async () => {
    if (!selectedDiseaseId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/manager/disease/${selectedDiseaseId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setDiseases((prevDiseases) =>
        prevDiseases.filter(
          (disease) => disease.disease_id !== selectedDiseaseId,
        ),
      );

      setShowModal(false);
      setSelectedDiseaseId(null);
    } catch (error) {
      console.error('Error deleting disease:', error);
    }
  };

  const handleEditDisease = (id: string) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນພະຍາດແຂ້ວ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowAddDiseaseModal(true)}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມຂໍ້ມູນພະຍາດແຂ້ວ
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
          <table className="w-full min-w-max table-auto border-collapse ">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100 text-left dark:bg-meta-4 bg-blue-100">
                {DiseaseHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 "
                  >
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDiseases.length > 0 ? (
                filteredDiseases.map((disease, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{disease.disease_id}</td>
                    <td className="px-4 py-4">{disease.disease_name}</td>

                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewDisease(disease.disease_id)}
                        onDelete={openDeleteModal(disease.disease_id)}
                        onEdit={() => handleEditDisease(disease.disease_id)}
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
      {showAddDiseaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="rounded-lg w-full max-w-2xl relative px-4 ">
            <button
              onClick={() => setShowAddDiseaseModal(false)}
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

            <CreateDisease
              setShow={setShowAddDiseaseModal}
              getListDisease={fetchDiseases}
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

            <EditDisease
              id={selectedId}
              onClose={() => setShowEditModal(false)}
              setShow={setShowEditModal}
              getListDisease={fetchDiseases}

            />
          </div>
        </div>
      )}
      
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຂໍ້ມູນຂອງພະຍາດນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteDisease}
      />
    </div>
  );
};

export default DiseasePage;
