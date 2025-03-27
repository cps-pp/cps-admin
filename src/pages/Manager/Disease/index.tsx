import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { DiseaseHeaders } from './column/diseasw';

const DiseasePage: React.FC = () => {
  const [diseases, setDiseases] = useState<any[]>([]); // Data of diseases
  const [filteredDiseases, setFilteredDiseases] = useState<any[]>([]); // Filtered diseases
  const [showModal, setShowModal] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // Search query input by the user
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/manager/disease`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data); // Debugging
        setDiseases(data.data); // Store disease data
        setFilteredDiseases(data.data); // Set filtered diseases initially to all
      } catch (error) {
        console.error('Error fetching diseases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDiseases(diseases);
    } else {
      const filtered = diseases.filter(disease => 
        disease.disease_name.toLowerCase().includes(searchQuery.toLowerCase())
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
  
      // Update the diseases state
      setDiseases((prevDiseases) =>
        prevDiseases.filter(
          (disease) => disease.disease_id !== selectedDiseaseId
        ),
      );
      
      setShowModal(false);
      setSelectedDiseaseId(null); 
    } catch (error) {
      console.error('Error deleting disease:', error);
    }
  };
  
  const handleEditDisease = (id: string) => {
    navigate(`/disease/edit/${id}`);
  };



  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">ຈັດການຂໍ້ມູນພະຍາດແຂ້ວ</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/disease/create')}
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

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບຂໍ້ມູນຂອງໂຣກນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteDisease} 
      />
    </div>
  );
};

export default DiseasePage;
