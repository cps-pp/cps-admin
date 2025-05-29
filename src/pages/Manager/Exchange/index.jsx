import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { ExchangeHeaders } from './column/exchange.js';
import CreateExChange from './create.jsx';
import EditExChange from './edit.jsx';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import TablePaginationDemo from '@/components/Tables/Pagination_two';

const ExchangePage = () => {
  const [exchanges, setExchanges] = useState([]);
  const [filteredExchanges, setFilteredExchanges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedExchangeId, setSelectedExchangeId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [existingIds, setExistingIds] = useState([]);

  // ✅ เก็บ reference ของ handleCloseForm จาก CreateExChange
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/manager/exchange`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setExchanges(data.data);
      setFilteredExchanges(data.data);
      // ✅ เก็บรหัสทั้งหมดไว้
      const ids = data.data.map((exchange) => exchange.ex_id);
      setExistingIds(ids);

    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredExchanges(exchanges);
    } else {
      const filtered = exchanges.filter((exchange) =>
        exchange.ser_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExchanges(filtered);
    }
  }, [searchQuery, exchanges]);

  const openDeleteModal = (id) => () => {
    setSelectedExchangeId(id);
    setShowModal(true);
  };

  const handleDeleteExchange = async () => {
    if (!selectedExchangeId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/exchange/${selectedExchangeId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setExchanges((prevExchanges) =>
        prevExchanges.filter((exchange) => exchange.ex_id !== selectedExchangeId)
      );

      setShowModal(false);
      setSelectedExchangeId(null);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນອັດຕາແລກປ່ຽນສຳເລັດແລ້ວ',
        })
      );
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ລົບຂໍ້ມູນບໍ່ສຳເລັດ',
          message: 'ເກີດຂໍ້ຜິດພາດໃນການລົບຂໍ້ມູນ',
        })
      );
    }
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Handler สำหรับปุ่ม X ที่จะใช้ฟังก์ชันจาก CreateExChange
  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {
      // เรียกใช้ฟังก์ชันที่ได้รับมาจาก CreateExChange
      createFormCloseHandler();
    } else {
      // fallback ถ้าไม่มี handler
      setShowAddModal(false);
    }
  };

  const paginatedEx = filteredExchanges.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />

        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການຂໍ້ມູນອັດຕາແລກປ່ຽນ
          </h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
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

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-lg">
            <thead>
              <tr className="text-left bg-secondary2 text-white">
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
              {paginatedEx.length > 0 ? (
                paginatedEx.map((exchange, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{exchange.ex_id}</td>
                    <td className="px-4 py-4">{exchange.ex_type}</td>
                    <td className="px-4 py-4">
                      {(exchange.ex_rate * 1).toLocaleString()}
                    </td>

                    <td className="px-3 py-4 text-center">
                      <TableAction
                        // onView={() => handleViewExchange(exchange.ex_id)}
                        onDelete={openDeleteModal(exchange.ex_id)}
                        onEdit={() => handleEdit(exchange.ex_id)}
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

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-lg w-full max-w-2xl relative px-4 ">
              {/* ✅ ปุ่ม X ที่ใช้ฟังก์ชันป้องกันจาก CreateExChange */}
              <button
                onClick={handleCloseAddModal}
                className="absolute px-4 top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
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

              <CreateExChange
                setShow={setShowAddModal}
                getList={fetchExchanges}
                existingIds={existingIds}
                onCloseCallback={setCreateFormCloseHandler} // ✅ ส่ง callback function
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

              <EditExChange
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchExchanges}
              />
            </div>
          </div>
        )}
      </div>
      <TablePaginationDemo
        count={filteredExchanges.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      {/* <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບອັດຕາແລກປ່ຽນນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDeleteExchange}
      /> */}
 </>
  );
};

export default ExchangePage;


