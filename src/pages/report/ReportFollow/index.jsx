import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '@/components/Forms/Search';
import { Empty } from 'antd';
import TablePaginationDemo from '@/components/Tables/Pagination_two';
import { Eye, Printer } from 'lucide-react';
import { URLBaseLocal } from '../../../lib/MyURLAPI';

const ReportFollowPatient = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [genderFilter, setGenderFilter] = useState('');

  const navigate = useNavigate();
  

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URLBaseLocal}/src/report/patient`);
      const data = await response.json();
      if (data.resultCode === '200') {
        const filtered = (data.data || []).filter(
          (p) => p.patient_id !== 'PT0',
        );
        setPatients(filtered);
        setFilteredPatients(filtered);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const visiblePatients = patients.filter((p) => p.patient_id !== 'PT0');

    const filtered = visiblePatients.filter((patient) =>
      patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (genderFilter === '' || patient.gender === genderFilter)
    );

    setFilteredPatients(filtered);
  }, [searchQuery, genderFilter, patients]);

  const handleRowClick = (patient) => {
    navigate(`/follow-inspection/detail/${patient.patient_id}`, {
      state: { patient },
    });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedPatients = filteredPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // ฟังก์ชันสำหรับพิมพ์รายงานทั้งหมด
  const handlePrintAllReports = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const generatePatientReport = (patient) => `
      <div style="page-break-after: always; margin-bottom: 40px;">
        <h3 style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
          ລາຍງານການຕິດຕາມ - ${patient.patient_name} ${patient.patient_surname}
        </h3>
        
        <div style="margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; width: 30%;"><strong>ລະຫັດຄົນເຈັບ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.patient_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ຊື່:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.patient_name} ${patient.patient_surname}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ເພດ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.gender}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ວັນເກີດ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${new Date(patient.dob).toLocaleDateString('en-GB')}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ເບີໂທ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.phone1}${patient.phone2 ? ', ' + patient.phone2 : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ທີ່ຢູ່:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.village} ${patient.district} ${patient.province}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #333;">ຂໍ້ມູນທາງການແພດ</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5; width: 30%;"><strong>ອາການ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.symptom || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ພະຍາດປັດຈຸບັນ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.diseases_now || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ການກວດ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.checkup || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f5f5f5;"><strong>ໝາຍເຫດ:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${patient.note || '-'}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #333;">ບໍລິການທີ່ໃຊ້</h4>
          <div style="border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
            ${patient.services?.map(s => `• ${s.name}`).join('<br/>') || 'ບໍ່ມີບໍລິການ'}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #333;">ການຈ່າຍຢາ / ອຸປະກອນ</h4>
          <div style="border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
            ${patient.medicines?.map(m => `• ${m.name} (${m.qty})`).join('<br/>') || 'ບໍ່ມີການຈ່າຍຢາ'}
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin-bottom: 10px; color: #333;">ປະຫວັດການຈ່າຍ</h4>
          <div style="border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9;">
            ${patient.history?.map(h => `• ${h.date} : ${h.detail}`).join('<br/>') || 'ບໍ່ມີປະຫວັດ'}
          </div>
        </div>
      </div>
    `;

    const content = `
      <html>
        <head>
          <title>ລາຍງານການຕິດຕາມທັງໝົດ</title>
          <style>
            body { 
              font-family: 'Noto Sans Lao', sans-serif; 
              padding: 20px; 
              line-height: 1.6;
              color: #333;
            }
            h1 { 
              text-align: center; 
              margin-bottom: 30px; 
              color: #2c3e50;
              border-bottom: 3px solid #3498db;
              padding-bottom: 15px;
            }
            h3 { 
              color: #2c3e50; 
              margin-top: 30px;
            }
            h4 { 
              color: #34495e; 
              margin-top: 20px;
            }
            .summary {
              background-color: #ecf0f1;
              padding: 15px;
              border-radius: 5px;
              margin-bottom: 30px;
              text-align: center;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>ລາຍງານການຕິດຕາມຄົນເຈັບທັງໝົດ</h1>
          
          <div class="summary">
            <strong>ສະຫຼຸບ:</strong> ມີຄົນເຈັບທັງໝົດ ${filteredPatients.length} ຄົນ
            <br/>
            <strong>ວັນທີ່ພິມ:</strong> ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-GB')}
          </div>

          ${filteredPatients.map(patient => generatePatientReport(patient)).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div className="rounded bg-white pt-4 border border-stroke">
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark">
            ລາຍຊື່ຄົນເຈັບ
          </h1>
          
          {/* ปุ่ม Print รายงานทั้งหมด */}
          <button
            onClick={handlePrintAllReports}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded border border-primary bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            disabled={filteredPatients.length === 0}
          >
            <Printer className="w-4 h-4" />
            ພິມລາຍງານທັງໝົດ ({filteredPatients.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <Search
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາຊື່ຄົນເຈັບ..."
            className="rounded border border-stroke"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            onChange={(e) => setGenderFilter(e.target.value)}
            className="rounded border border-stroke py-2 px-4"
          >
            <option value="">--ເລືອກເພດ--</option>
            <option value="ຊາຍ">ຊາຍ</option>
            <option value="ຍິງ">ຍິງ</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke text-form-input">
                <th className="px-4 py-3">ລະຫັດຄົນເຈັບ</th>
                <th className="px-4 py-3">ຊື່</th>
                <th className="px-4 py-3">ເພດ</th>
                <th className="px-4 py-3">ວັນເກີດ</th>
                <th className="px-4 py-3">ເບີໂທ 1</th>
                <th className="px-4 py-3">ເບີໂທ 2</th>
                <th className="px-4 py-3">ທີ່ຢູ່</th>
                <th className="px-4 py-3">ຈັດການ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((patient, index) => (
                  <tr
                    key={index}
                    className="border-b border-stroke hover:bg-secondary2/5 cursor-pointer"
                    onClick={() => handleRowClick(patient)}
                  >
                    <td className="px-4 py-4">{patient.patient_id}</td>
                    <td className="px-4 py-4">
                      {patient.patient_name} {patient.patient_surname}
                    </td>
                    <td className="px-4 py-4">{patient.gender}</td>
                    <td className="px-4 py-4">
                      {new Date(patient.dob).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-4">{patient.phone1}</td>
                    <td className="px-4 py-4">{patient.phone2 || '-'}</td>
                    <td className="px-4 py-4">
                      {patient.village} {patient.district} {patient.province}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(
                            `/follow-inspection/detail/${patient.patient_id}`,
                          );
                        }}
                        className="inline-flex items-center gap-2 px-4 py-1 text-md font-medium rounded border border-secondary2/40 bg-secondary2/10 text-secondary2 hover:bg-secondary2/15 disabled:opacity-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />  ເບີ່ງຂໍ້ມູນ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-4 text-center text-gray-500">
                    <div className="text-center">
                      <div className="w-32 h-32 flex items-center justify-center mx-auto">
                        <Empty description={false} />
                      </div>
                      <p className="text-lg">ບໍ່ພົບຂໍ້ມູນ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
      <TablePaginationDemo
        count={filteredPatients.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  );
};

export default ReportFollowPatient;
