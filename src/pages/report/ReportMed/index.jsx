import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Search from '@/components/Forms/Search';
import { useAppDispatch } from '@/redux/hook';
import { Package, AlertTriangle, XCircle, Printer } from 'lucide-react';
import Alerts from '@/components/Alerts';

const ReportStock = () => {
  const [filterStock, setFilterStock] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, medicine, equipment
  const [statusFilter, setStatusFilter] = useState(''); // สำหรับกรองตามสถานะ
  
  // State สำหรับสถิติ
  const [summaryStats, setSummaryStats] = useState({

    totalItems: 0,
    almostOutOfStock: 0,
    outOfStock: 0,
  });

  const dispatch = useAppDispatch();

  // ฟังก์ชันคำนวณสถิติ
  const calculateStats = (stockData) => {
    if (!stockData || !Array.isArray(stockData)) {
      setSummaryStats({
        totalItems: 0,
        almostOutOfStock: 0,
        outOfStock: 0,
      });
      return;
    }

    let almostOutCount = 0;
    let outOfStockCount = 0;
    
    stockData.forEach(item => {
      if (item.status === 'ກຳລັງຈະໝົດ') {
        almostOutCount++;
      } else if (item.status === 'ໝົດ') {
        outOfStockCount++;
      }
    });

    setSummaryStats({
      totalItems: stockData.length,
      almostOutOfStock: almostOutCount,
      outOfStock: outOfStockCount,
    });
  };

  // ดึงข้อมูลสต็อก
  const fetchStock = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/src/report/stock`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const stockData = data.data || []; // ป้องกัน undefined
      setStock(stockData);
      setFilterStock(stockData);
      
      // คำนวณสถิติ
      calculateStats(stockData);
    } catch (error) {
      console.error('Error fetching stock:', error);
      // ตั้งค่าเริ่มต้นเป็น array ว่างในกรณีที่เกิดข้อผิดพลาด
      setStock([]);
      setFilterStock([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setSearchQuery('');
    setStatusFilter('');
  };

  // ฟังก์ชันกรองข้อมูล
  const applyFilters = () => {
    if (!stock || !Array.isArray(stock)) {
      setFilterStock([]);
      return;
    }

    let filtered = [...stock];

    // กรองตามแท็บ
    if (activeTab === 'medicine') {
      filtered = filtered.filter(item => 
        item.type_name === 'ຢາ' || item.type_name === 'ยา'
      );
    } else if (activeTab === 'equipment') {
      filtered = filtered.filter(item => 
        item.type_name === 'ອຸປະກອນ' || item.type_name === 'อุปกรณ์'
      );
    }

    // กรองตาม search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((item) =>
        Object.values(item)
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // กรองตามสถานะ
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilterStock(filtered);
  };

  // เรียกใช้ฟังก์ชันกรองเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, stock, activeTab]);

  // ฟังก์ชันล้างตัวกรอง
  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
  };

  // ฟังก์ชันกำหนดสีสถานะ
  const getStatusColor = (status) => {
    switch (status) {
      case 'ພຽງພໍ':
        return 'text-green-600 bg-green-50';
      case 'ກຳລັງຈະໝົດ':
        return 'text-yellow-600 bg-yellow-50';
      case 'ໝົດ':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // ฟังก์ชันสำหรับพิมพ์รายงาน
  const handlePrintReport = () => {
    const reportData = filterStock;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ລາຍງານສະຕ໋ອກຢາແລະອຸປະກອນ</title>
        <style>
          @page {
            size: A4;
            margin: 20mm;
          }
          
          body {
            font-family: 'phetsarath ot', serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            color: #2c5aa0;
          }
          
          .report-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
          }
          
          .report-info div {
            flex: 1;
          }
          
          .report-info strong {
            color: #2c5aa0;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          
          th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #2c5aa0;
          }
          
          .text-center {
            text-align: center;
          }
          
          .status-enough {
            background-color: #d4edda;
            color: #155724;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .status-running-out {
            background-color: #fff3cd;
            color: #856404;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .status-out {
            background-color: #f8d7da;
            color: #721c24;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .type-medicine {
            background-color: #d4edda;
            color: #155724;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .type-equipment {
            background-color: #e2e3f0;
            color: #6f42c1;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
          }
          
          @media print {
            body {
              font-size: 12px;
            }
            
            .header h1 {
              font-size: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ລາຍງານສະຕ໋ອກຢາແລະອຸປະກອນ</h1>
          <p>Medicine and Equipment Stock Report</p>
        </div>
        
        <div class="report-info">
          <div>
            <p><strong>ວັນທີ່ອອກລາຍງານ:</strong> ${new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}</p>
          </div>
          <div>
            <p><strong>ຈຳນວນລາຍການທັງໝົດ:</strong> ${reportData.length} ລາຍການ</p>
          </div>
          <div>
            ${activeTab === 'medicine' ? `<p><strong>ປະເພດ:</strong> ຢາ</p>` : ''}
            ${activeTab === 'equipment' ? `<p><strong>ປະເພດ:</strong> ອຸປະກອນ</p>` : ''}
            ${statusFilter ? `<p><strong>ສະຖານະ:</strong> ${statusFilter}</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center" style="width: 60px;">ລຳດັບ</th>
              <th>ລະຫັດ</th>
              <th>ຊື່</th>
              <th class="text-center">ປະເພດ</th>
              <th class="text-center">ຈຳນວນ</th>
              <th class="text-center">ສະຖານະ</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map((item, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td>${item.med_id}</td>
                <td>${item.med_name}</td>
                <td class="text-center">
                  <span class="${
                    item.type_name === 'ຢາ' || item.type_name === 'ยา' 
                      ? 'type-medicine' 
                      : 'type-equipment'
                  }">
                    ${item.type_name}
                  </span>
                </td>
                <td class="text-center">${item.qty}</td>
                <td class="text-center">
                  <span class="${
                    item.status === 'ພຽງພໍ' ? 'status-enough' :
                    item.status === 'ກຳລັງຈະໝົດ' ? 'status-running-out' : 'status-out'
                  }">
                    ${item.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();

      // ปิด popup หลังจากผู้ใช้ "พิมพ์หรือยกเลิก" dialog print
      printWindow.onafterprint = () => {
        printWindow.close();
      };

      // เรียกหน้าต่างพิมพ์
      printWindow.print();

      // fallback: ปิดหลัง 5 วินาที ถ้า onafterprint ไม่ทำงาน
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 5000);
    };
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 2xl:gap-7.5 w-full mb-6">
        {/* Total Items */}
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-blue-100">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">
                ລາຍການທັງໝົດ
              </h4>
              <p className="text-xl font-bold text-blue-700">
                {summaryStats.totalItems} ລາຍການ
              </p>
            </div>
          </div>
        </div>

        {/* Almost Out of Stock */}
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">
                ກຳລັງຈະໝົດ
              </h4>
              <p className="text-xl font-bold text-yellow-600">
                {summaryStats.almostOutOfStock} ລາຍການ
              </p>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-sm border border-stroke bg-white p-4">
          <div className="flex items-center">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-strokedark">
                ໝົດ
              </h4>
              <p className="text-xl font-bold text-red-600">
                {summaryStats.outOfStock} ລາຍການ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded bg-white pt-4 dark:bg-boxdark">
        <Alerts />
        <div className="flex items-center justify-between border-b border-stroke px-4 pb-4 dark:border-strokedark flex-wrap gap-2">
          <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
            ລາຍງານການຢາແລະອຸປະກອນ
          </h1>
          
          <div className="ml-auto">
            <Button
              onClick={handlePrintReport}
              className="bg-secondary2 hover:bg-secondary3"
            >
              <Printer className="w-4 h-4" />
              ພິມລາຍງານ
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-4 mt-4">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'all' 
                ? 'bg-slate-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ທັງໝົດ
          </button>
          <button
            onClick={() => handleTabChange('medicine')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'medicine' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ຢາ
          </button>
          <button
            onClick={() => handleTabChange('equipment')}
            className={`px-4 py-2 rounded transition-colors ${
              activeTab === 'equipment' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            ອຸປະກອນ
          </button>
        </div>

        {/* ส่วนของตัวกรอง */}
        <div className="grid w-full gap-4 p-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {/* Search Box */}
            <Search
              type="text"
              name="search"
              placeholder="ຄົ້ນຫາ..."
              className="rounded border border-stroke dark:border-strokedark"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}

            />


            {/* ตัวกรองตามสถานะ */}
            <select
              className="border border-stroke dark:border-strokedark rounded p-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">-- ກອງຕາມສະຖານະ --</option>
              <option value="ພຽງພໍ">ພຽງພໍ</option>
              <option value="ກຳລັງຈະໝົດ">ກຳລັງຈະໝົດ</option>
              <option value="ໝົດ">ໝົດ</option>
            </select>

            {/* ปุ่มล้างตัวกรอง */}
            <Button
              onClick={clearAllFilters}
              className="bg-slate-600 hover:bg-slate-800 text-white"
            >
              ລ້າງຕົວກອງ
            </Button>
          </div>
        </div>

        {/* ตาราง */}
        <div className="overflow-x-auto shadow-md">
          <table className="w-full min-w-max table-auto">
            <thead>
              <tr className="text-left bg-gray border border-stroke">
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">
                  ລະຫັດ
                </th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">
                  ຊື່
                </th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">
                  ປະເພດ
                </th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">
                  ຈຳນວນ
                </th>
                <th className="px-4 py-3 tracking-wide text-form-input font-semibold">
                  ສະຖານະ
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    ກຳລັງໂຫລດ...
                  </td>
                </tr>
              ) : filterStock.length > 0 ? (
                filterStock.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b text-md border-stroke hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium">{item.med_id}</td>
                    <td className="px-4 py-4">{item.med_name}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        item.type_name === 'ຢາ' || item.type_name === 'ยา' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.type_name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-semibold">
                      {item.qty}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
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


    </>
  );
};

export default ReportStock;