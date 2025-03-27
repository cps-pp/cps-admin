import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { ExchangeHeaders } from './column/exchange';

const ExchangePage: React.FC = () => {
  const [exchanges, setExchanges] = useState<any[]>([]); 
  const [filteredExchanges, setFilteredExchanges] = useState<any[]>([]); 
  const [showModal, setShowModal] = useState(false);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchanges = async () => { 
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/manager/exchange`, { 
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);
        setExchanges(data.data);
        setFilteredExchanges(data.data);
      } catch (error) {
        console.error('Error fetching exchanges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges(); 
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExchanges(exchanges); 
    } else {
      const filtered = exchanges.filter(exchange => 
        exchange.ser_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExchanges(filtered);
    }
  }, [searchQuery, exchanges]); 

  const openDeleteModal = (id: string) => () => {
    setSelectedExchangeId(id); 
    setShowModal(true);
  };

  const handleDeleteExchange = async () => { 
    if (!selectedExchangeId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/manager/exchange/${selectedExchangeId}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setExchanges((prevExchanges) => 
        prevExchanges.filter(
          (exchange) => exchange.ex_id !== selectedExchangeId
        ),
      );

      setShowModal(false);
      setSelectedExchangeId(null); 
    } catch (error) {
      console.error('Error deleting exchange:', error); 
    }
  };

  const handleEditExchange = (id: string) => { 
    navigate(`/exchange/edit/${id}`);
  };

  const handleViewExchange = (id: string) => { 
    navigate(`/exchange/detail/${id}`);
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການຂໍ້ມູນອັດຕາແລກປ່ຽນ
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/exchange/create')}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມອັດຕາແລກປ່ຽນ
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
                {ExchangeHeaders.map((header, index) => (
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
              {filteredExchanges.length > 0 ? ( 
                filteredExchanges.map((exchange, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{exchange.ex_id}</td> 
                    <td className="px-4 py-4">{exchange.ex_type}</td> 
                    <td className="px-4 py-4">{(exchange.ex_rate * 1).toLocaleString()}</td>


                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewExchange(exchange.ex_id)} 
                        onDelete={openDeleteModal(exchange.ex_id)} 
                        onEdit={() => handleEditExchange(exchange.ex_id)} 
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
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteExchange} 
      />
    </div>
  );
};

export default ExchangePage;

