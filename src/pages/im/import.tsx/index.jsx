import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { TableAction } from '@/components/Tables/TableAction';
import ConfirmModal from '@/components/Modal';
import { iconAdd, PDF } from '@/configs/icon';
import { HeadersImport } from './column/im';
import CreateImport from './create';
import { useAppDispatch } from '@/redux/hook';
import { openAlert } from '@/redux/reducer/alert';
import Alerts from '@/components/Alerts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import EditImport from './edit';
import autoTable from 'jspdf-autotable';
<<<<<<< HEAD:src/pages/im/import.tsx/index.jsx
=======
// Fix TypeScript error by extending jsPDF type with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
interface ImportData {
  im_id: string;
  im_date: string;
  qty: number;
  expired: string;
  lot: string;
  file: string;
  sup_id: string;
  med_id: string;
  emp_id_create: number;
  emp_id_updated: number;
  created_at: string;
  update_by: string;
}
>>>>>>> 04c0b8aa93908363f1af5f8ef9006db261d3577b:src/pages/im/import.tsx/index.tsx

const ImportPage = () => {
  const [filterIm, setFilterIm] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [Im, setIm] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();

  const fetchImport = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/im/import`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setIm(data.data);
      setFilterIm(data.data);
    } catch (error) {
      console.error('Error fetching imports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImport();
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/emp');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEmpName(data.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const getDoctorName = (emp_id) => {
    const emp = empName.find((employee) => employee.emp_id === emp_id);
    return emp ? (
      <>
        {emp.emp_name} {emp.emp_surname}
      </>
    ) : (
      <span className="text-purple-600">-</span>
    );
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilterIm(Im);
    } else {
      const filtered = Im.filter((item) =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilterIm(filtered);
    }
  }, [searchQuery, Im]);

  const openDeleteModal = (id) => () => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(
        `http://localhost:4000/src/im/import/${selectedId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('ບໍ່ສາມາດລົບລາຍການນຳເຂົ້າໄດ້');

      setIm((prev) => prev.filter((im) => im.im_id !== selectedId));

      setShowModal(false);
      setSelectedId(null);
      dispatch(
        openAlert({
          type: 'success',
          title: 'ລົບຂໍ້ມູນສຳເລັດ',
          message: 'ລົບຂໍ້ມູນລາຍການນຳເຂົ້າສຳເລັດແລ້ວ',
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

  const handleEditMedicine = (id) => {
    setSelectedId(id);
    setShowEditModal(true);
  };
<<<<<<< HEAD:src/pages/im/import.tsx/index.jsx

  const handleDownloadFile = async (fileName) => {
    console.log('exportPDF clicked');
    try {
      const response = await fetch(
        `http://localhost:4000/im/import/download/${fileName}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) throw new Error('ไม่สามารถดาวน์โหลดไฟล์ได้');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    const tableColumn = HeadersImport.map((header) => header.name);

    const tableRows = filterIm.map((im) => [
      im.im_id,
      new Date(im.im_date).toLocaleDateString('th-TH'),
      im.qty,
      new Date(im.expired).toLocaleDateString('th-TH'),
      im.lot,
      im.file,
      im.sup_id,
      im.med_id,
      new Date(im.created_at).toLocaleDateString('th-TH'),
      im.updated_at ? new Date(im.updated_at).toLocaleDateString('th-TH') : '-',
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
=======
const handleDownloadFile = async (fileName: string) => {
   console.log('exportPDF clicked');
  try {
    const response = await fetch(`http://localhost:4000/im/import/download/${fileName}`, {
      method: 'GET',
>>>>>>> 04c0b8aa93908363f1af5f8ef9006db261d3577b:src/pages/im/import.tsx/index.tsx
    });

    doc.text('ລາຍການນຳເຂົ້າ', 14, 15);
    doc.save('import_report.pdf');
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການລາຍການນຳເຂົ້າ
        </h1>
        <div className="flex items-center gap-2">
          <Button onClick={exportPDF} icon={PDF} className="bg-primary">
            Export
          </Button>

          <Button
            onClick={() => setShowAddModal(true)}
            icon={iconAdd}
            className="bg-primary"
          >
            ເພີ່ມລາຍການ
          </Button>
        </div>
      </div>

      <div className="grid w-full gap-4 p-4">
        <Search
          type="text"
          name="search"
          placeholder="ຄົ້ນຫາ..."
          className="rounded border border-stroke dark:border-strokedark"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm min-w-max table-auto border-collapse overflow-hidden rounded-lg">
          <thead>
            <tr className="text-left bg-secondary2 text-white">
              {HeadersImport.map((header, index) => (
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
            {filterIm.length > 0 ? (
              filterIm.map((im, index) => (
                <tr
                  key={index}
                  className="border-b text-sm border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-4">{im.im_id}</td>
                  <td className="px-4 py-4">
                    {new Date(im.im_date).toLocaleDateString('th-TH', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="px-4 py-4">{im.qty}</td>
                  <td className="px-4 py-4">
                    {new Date(im.expired).toLocaleDateString('th-TH', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-4">{im.lot}</td>

                  <td className="px-4 py-4">
  {im?.file ? (
    <button
      onClick={() => handleDownloadFile(im.file)}
      className="text-blue-500 hover:underline font-semibold"
    >
      ດາວໂຫລດ
    </button>
  ) : (
    <span className="text-purple-600">ບໍ່ພົບໄຟລ</span>
  )}
</td>


                  <td className="px-4 py-4">{im.sup_id}</td>
                  <td className="px-4 py-4">{im.med_id}</td>
                  <td className="px-4 py-4">
                    {getDoctorName(im.emp_id_create)}{' '}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(im.created_at).toLocaleDateString('th-TH', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-4">
                    {getDoctorName(im?.emp_id_updated)}
                    {''}
                  </td>
                  <td className="px-4 py-4">
                    {im?.update_by &&
                    !isNaN(new Date(im.update_by).getTime()) ? (
                      new Date(im.update_by).toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    ) : (
                      <span className="text-purple-600">-</span>
                    )}
                  </td>

                  <td className="px-3 py-4 text-center">
                    <TableAction
                      onDelete={openDeleteModal(im.im_id)}
                      onEdit={() => handleEditMedicine(im.im_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <tr>
                  <td colSpan={12} className="py-4 text-center text-gray-500">
                    ບໍ່ມີຂໍ້ມູນ
                  </td>
                </tr>
              </tr>
            )}
          </tbody>
        </table>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div
              className="
        rounded
        w-full max-w-lg     
        md:max-w-2xl        
        lg:max-w-5xl       
        relative
        overflow-auto
        max-h-[90vh]
      "
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close modal"
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

              <CreateImport setShow={setShowAddModal} getList={fetchImport} />
            </div>
          </div>
        )}

        {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div        className="
        rounded
        w-full max-w-lg     
        md:max-w-2xl        
        lg:max-w-5xl       
        relative
        overflow-auto
        max-h-[90vh]
      "
            >
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

              <EditImport
                id={selectedId}
                onClose={() => setShowEditModal(false)}
                setShow={setShowEditModal}
                getList={fetchImport}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        message="ທ່ານຕ້ອງການລົບລາຍການນີ້ອອກຈາກລະບົບບໍ່？"
        handleConfirm={handleDelete}
      />
    </div>
  );
};

export default ImportPage;
