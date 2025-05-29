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


const ImportPage = () => {
  const [filterIm, setFilterIm] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [Im, setIm] = useState([]);
  const [empName, setEmpName] = useState([]);
  const [supName, setSupName] = useState([]);
  const [medName, setMedName] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const dispatch = useAppDispatch();
     // ✅ เก็บ reference ของ handleCloseForm จาก CreateCategory
  const [createFormCloseHandler, setCreateFormCloseHandler] = useState(null);

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

  // ดึงข้อมูลยา
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/medicines');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Medicine Data:", data.data);
        setMedName(data.data);
      } catch (error) {
        console.error('Error fetching medicine data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, []);

  // ฟังก์ชันแปลง med_id เป็นชื่อยา
  const getMedName = (med_id) => {
    const med = medName.find((m) => m.med_id === med_id);
    return med ? (
      <>
        {med.med_name}
      </>
    ) : (
      <span className="text-purple-600">-</span>
    );
  };

  useEffect(() => {
    fetchImport();
  }, []);

  // ดึงข้อมูลผู้สะหนอง
  useEffect(() => {
    const fetchSup = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/src/manager/supplier'); // URL ตัวอย่าง
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Supplier Data:", data.data);
        setSupName(data.data);
      } catch (error) {
        console.error('Error fetching sup data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSup();
  }, []);

  // ฟังก์ชันแปลง id เป็นชื่อผู้สะหนอง
  const getSupName = (sup_id) => {
    const sup = supName.find((s) => s.sup_id === sup_id);
    console.log("Found:", sup);
    return sup ? (
      <>
        {sup.company_name}
      </>
    ) : (
      <span className="text-purple-600">-</span>
    );
  };

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

   // ✅ Handler สำหรับปุ่ม X ที่จะใช้ฟังก์ชันจาก CreateCategory
  const handleCloseAddModal = () => {
    if (createFormCloseHandler) {
      // เรียกใช้ฟังก์ชันที่ได้รับมาจาก CreateCategory
      createFormCloseHandler();
    } else {
      // fallback ถ้าไม่มี handler
      setShowAddModal(false); // ✅ แก้ไขชื่อตัวแปรให้ถูกต้อง
    }
  };

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
    const doc = new jsPDF('landscape');

    // ใช้ฟอนต์ที่รองรับ Unicode ได้ดีที่สุด
    doc.setFont("NotoSansLao", "normal");

    // ชื่อหัวข้อ
    doc.setFontSize(16);
    doc.text('Import Report', 14, 15);

    // หัวตารางเหมือนเดิม (รักษาตามโค้ดต้นฉบับ)
    const tableColumn = [
      "ID",
      "Import Date",
      "Quantity",
      "Expire Date",
      "Lot",
      "File",
      "Supplier",
      "Medicine",
      "Created By",
      "Created Date",
      "Updated By",
      "Updated Date"
    ];

    // แปลงข้อมูล filterIm เป็น row เหมือนเดิม แต่ปรับการแสดงผล
    const tableRows = filterIm.map(item => {
      // แปลงวันที่ให้อยู่ในรูปแบบที่อ่านง่าย
      const formatDate = (dateString) => {
        if (!dateString) return 'null';
        return new Date(dateString).toLocaleDateString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      };

      // หาชื่อผู้สะหนอง
      const supplier = supName.find(s => s.sup_id === item.sup_id);
      let supplierName = supplier ? supplier.company_name : (item.sup_id || 'null');
      // ตัดชื่อให้สั้นลงถ้ายาวเกินไป เพื่อไม่ให้ล้นตาราง
      if (supplierName && supplierName.length > 20) {
        supplierName = supplierName.substring(0, 17) + '...';
      }

      // หาชื่อยา
      const medicine = medName.find(m => m.med_id === item.med_id);
      let medicineName = medicine ? medicine.med_name : (item.med_id || 'null');
      // ตัดชื่อยาให้สั้นลงถ้ายาวเกินไป
      if (medicineName && medicineName.length > 20) {
        medicineName = medicineName.substring(0, 17) + '...';
      }

      // หาชื่อผู้สร้าง
      const creator = empName.find(e => e.emp_id === item.emp_id_create);
      let creatorName = creator ? `${creator.emp_name} ${creator.emp_surname}` : (item.emp_id_create || 'null');
      // ตัดชื่อให้สั้นลงถ้ายาวเกินไป
      if (creatorName && creatorName.length > 20) {
        creatorName = creatorName.substring(0, 17) + '...';
      }

      // หาชื่อผู้อัปเดต
      const updater = empName.find(e => e.emp_id === item.emp_id_updated);
      let updaterName = updater ? `${updater.emp_name} ${updater.emp_surname}` : (item.emp_id_updated || 'null');
      // ตัดชื่อให้สั้นลงถ้ายาวเกินไป
      if (updaterName && updaterName.length > 20) {
        updaterName = updaterName.substring(0, 17) + '...';
      }

      // วันที่อัปเดต
      const updateDate = item.update_by && !isNaN(new Date(item.update_by).getTime())
        ? formatDate(item.update_by)
        : 'null';

      return [
        item.im_id || 'null',
        formatDate(item.im_date),
        item.qty || 'null',
        formatDate(item.expired),
        item.lot || 'null',
        item.file ? 'Yes' : 'null',
        supplierName,
        medicineName,
        creatorName,
        formatDate(item.created_at),
        updaterName,
        updateDate
      ];
    });

    // ใส่ตารางใน PDF - ปรับขนาดให้เหมาะสมกับ landscape
    autoTable(doc, {
      startY: 25,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 6,
        cellPadding: 1,
        font: "NotoSansLao",
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 7,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 18 }, // Import ID
        1: { cellWidth: 22 }, // Import Date
        2: { cellWidth: 18 }, // Quantity
        3: { cellWidth: 22 }, // Expire Date
        4: { cellWidth: 18 }, // Lot
        5: { cellWidth: 15 }, // File
        6: { cellWidth: 30 }, // Supplier
        7: { cellWidth: 30 }, // Medicine
        8: { cellWidth: 30 }, // Created By
        9: { cellWidth: 22 }, // Created Date
        10: { cellWidth: 30 }, // Updated By
        11: { cellWidth: 22 }, // Updated Date
      },
      margin: { top: 25, left: 5, right: 5 },
      pageBreak: 'auto',
      showHead: 'everyPage',
    });

    // เปิดในหน้าใหม่ (เหมือนเดิม)
    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    window.open(blobUrl);
  };

  return (
    <div className="rounded bg-white pt-4 dark:bg-boxdark">
      <Alerts />
      <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark flex-wrap gap-2">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ຈັດການລາຍການນຳເຂົ້າ
        </h1>

        <div className="ml-auto flex flex-wrap items-center gap-x-2 gap-y-2">
          {/* ตัวกรองตามผู้ส่ง */}
          <select
            className="border border-stroke dark:border-strokedark rounded p-2"
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setFilterIm(Im);
              } else {
                const filtered = Im.filter((item) => item.sup_id === value);
                setFilterIm(filtered);
              }
            }}
          >
            <option value="">-- ກອງຕາມຜູ້ສະໜອງ --</option>
            {[...new Set(Im.map((item) => item.sup_id))].map((id) => {
              const supplier = supName.find((s) => s.sup_id === id);
              return (
                <option key={id} value={id}>
                  {supplier ? supplier.company_name : id}
                </option>
              );
            })}
          </select>

          {/* ตัวกรองตามเดือน */}
          <input
            type="month"
            className="border border-stroke dark:border-strokedark rounded p-2"
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setFilterIm(Im);
              } else {
                const filtered = Im.filter((item) => {
                  const itemMonth = new Date(item.im_date).toISOString().slice(0, 7);
                  return itemMonth === value;
                });
                setFilterIm(filtered);
              }
            }}
          />

          {/* ปุ่ม */}
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
                    {new Date(im.im_date).toLocaleDateString('en-US', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>

                  <td className="px-4 py-4">{im.qty}</td>
                  <td className="px-4 py-4">
                    {new Date(im.expired).toLocaleDateString('en-US', {
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

                  <td className="px-4 py-4">
                    {getSupName(im.sup_id)}
                  </td>
                  <td className="px-4 py-4">
                    {getMedName(im.med_id)}
                  </td>
                  <td className="px-4 py-4">
                    {getDoctorName(im.emp_id_create)}{' '}
                  </td>
                  <td className="px-4 py-4">
                    {new Date(im.created_at).toLocaleDateString('en-US', {
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


                      new Date(im.update_by).toLocaleDateString('en-US', {
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
                <td colSpan={12} className="py-4 text-center text-gray-500">
                  ບໍ່ມີຂໍ້ມູນ
                </td>
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
              {/* ✅ ปุ่ม X ที่ใช้ฟังก์ชันป้องกันจาก CreateCategory */}
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

              <CreateImport 
              setShow={setShowAddModal} 
              getList={fetchImport}  
              onCloseCallback={setCreateFormCloseHandler} // ✅ ส่ง callback function
              />
            </div>
          </div>
        )}

        {showEditModal && selectedId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="
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

