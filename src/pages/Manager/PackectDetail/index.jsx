import { useEffect, useState } from 'react';
import { iconAdd } from '@/configs/icon';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import Alerts from '@/components/Alerts';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import TablePaginationDemo from '@/components/Tables/Pagination_two';

const PacketHeaders = [
  { name: 'ລະຫັດ' },
  { name: 'ລະຫັດແພັກແກັດ' },
  { name: 'ລະຫັດຢາແລະອຸປະກອນ' },
  { name: 'ຈັດການ' },
];

const PackectDetail = () => {
  const [packets, setPackets] = useState([]);
  const [filteredPackets, setFilteredPackets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPacketId, setSelectedPacketId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();

  const fetchPackets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/manager/packetdetail`);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setPackets(data);
      setFilteredPackets(data);
    } catch (error) {
      console.error('Error fetching packets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackets();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPackets(packets);
    } else {
      const filtered = packets.filter((packet) =>
        packet.packet_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredPackets(filtered);
    }
  }, [searchQuery, packets]);

  const openDeleteModal = (id) => () => {
    setSelectedPacketId(id);
    setShowModal(true);
  };

  const handleDeletePacket = async () => {
    if (!selectedPacketId) return;
    try {
      const response = await fetch(
        `http://localhost:4000/src/manager/packetdetail/${selectedPacketId}`,
        {
          method: 'DELETE',
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      setPackets((prev) =>
        prev.filter((p) => p.packet_id !== selectedPacketId),
      );
      setShowModal(false);
      setSelectedPacketId(null);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ສຳເລັດ',
          message: 'ລົບ Packet ສຳເລັດແລ້ວ',
        }),
      );
    } catch (error) {
      dispatch(
        openAlert({
          type: 'error',
          title: 'ຜິດພາດ',
          message: 'ລົບ Packet ບໍ່ສຳເລັດ',
        }),
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
const paginatedPackets = (filteredPackets || []).slice(
  page * rowsPerPage,
  page * rowsPerPage + rowsPerPage
);

  return (
    <>
      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />

        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ຈັດການລາຍອຽດແພັກແກັກ
          </h1>
          <Button
            onClick={() => setShowAddModal(true)}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມຂໍ້ມູນ
          </Button>
        </div>

        <div className="grid w-full gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່ແພັກແກັກ..."
            className="rounded border border-stroke dark:border-strokedark"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse rounded-lg">
            <thead>
              <tr className="bg-secondary2 text-white text-left">
                {PacketHeaders.map((header, index) => (
                  <th key={index} className="px-4 py-3 font-medium">
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedPackets.length > 0 ? (
                paginatedPackets.map((packet, index) => (
                  <tr
                    key={index}
                     className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-4">{packet.packetdetail_id}</td>
                    <td className="px-4 py-4">{packet.ser_id}</td>
                    <td className="px-4 py-4">{packet.med_id}</td>
                  
                    <td className="px-4 py-4 text-center">
                      <TableAction
                        onEdit={() => handleEdit(packet.packetdetail_id)}
                        onDelete={openDeleteModal(packet.packetdetail_id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    ບໍ່ພົບຂໍ້ມູນ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="rounded-lg w-full max-w-2xl relative px-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-3 right-6 text-gray-500 hover:text-gray-700"
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
              <CreatePacket setShow={setShowAddModal} getList={fetchPackets} />
            </div>
          </div>
        )}

        {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="rounded-lg w-full max-w-2xl bg-white relative">
              <button
                onClick={() => setShowEditModal(false)}
                className="absolute top-4 right-2 text-gray-500 hover:text-gray-700"
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
              <EditPacket
                id={selectedId}
                setShow={setShowEditModal}
                getList={fetchPackets}
              />
            </div>
          </div>
        )}
      </div>
      <TablePaginationDemo
        count={paginatedPackets.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        onConfirm={handleDeletePacket}
        message="ທ່ານແນ່ໃຈບໍວ່າຈະລົບແພັກແກັກນີ້?"
      />
    </>
  );
};

export default PackectDetail;
