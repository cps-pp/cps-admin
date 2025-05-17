
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, FileText, Save } from 'lucide-react';
import Dropdown from '@/components/Forms/Dropdown';
import Search from '@/components/Forms/Search';
import PatientDropdown from './PatientDropdown';
import Button from '@/components/Button';
import { services } from './data';

interface Service {
  ser_id: string;
  ser_name: string;
}

interface Disease {
  disease_id: string;
  disease_name: string;
}

interface Medicine {
  med_id: string;
  med_name: string;
}

interface TreatmentItem {
  id: number;
  service: string;
  quantity: number;
  price: number;
  doctor: string;
  totalPrice: number;
}

interface MedicationItem {
  id: number;
  medicine: string;
  quantity: number;
  price: number;
  total: number;
}

const Treatment: React.FC = () => {
  const [searchPatient, setSearchPatient] = useState('');
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [medicinesList, setMedicinesList] = useState<Medicine[]>([]);
  const [diseaseList, setDiseaseList] = useState<Disease[]>([]);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isGeneralPatient, setIsGeneralPatient] = useState(false);
  const [activeTab, setActiveTab] = useState('treatment'); // 'treatment' or 'medication'

  useEffect(() => {
    fetchServiceList();
    fetchDiseaseList();
    fetchTreatments();
    fetchMedicines();
    fetchPatients();
    fetchMedications();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/src/manager/patient');
      const data = await res.json();
      setPatients(data.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceList = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/servicelist');
      const data = await res.json();
      setServiceList(data.data);
    } catch (err) {
      console.error('Error fetching service list:', err);
    }
  };

  const fetchDiseaseList = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/disease');
      const data = await res.json();
      setDiseaseList(data.data);
    } catch (err) {
      console.error('Error fetching disease list:', err);
    }
  };

  const fetchTreatments = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/treatment');
      const data = await res.json();
      setTreatments(data.data);
    } catch (err) {
      console.error('Error fetching treatments:', err);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await fetch('http://localhost:4000/src/manager/medicines');
      const data = await res.json();
      setMedicinesList(data.data);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    }
  };

  const fetchMedications = async () => {
    // Sample data - replace with actual API call
    setMedications([
      {
        id: 1,
        medicine: 'Amoxicillin 500mg',
        quantity: 20,
        price: 5000,
        total: 100000,
      },
      {
        id: 2,
        medicine: 'Paracetamol 500mg',
        quantity: 10,
        price: 2000,
        total: 20000,
      },
      {
        id: 3,
        medicine: 'Ibuprofen 400mg',
        quantity: 15,
        price: 3000,
        total: 45000,
      },
    ]);
  };

  useEffect(() => {
    if (searchPatient) {
      const filtered = patients.filter(
        (p) =>
          p.patient_id?.toLowerCase().includes(searchPatient.toLowerCase()) ||
          p.patient_name?.toLowerCase().includes(searchPatient.toLowerCase()) ||
          p.patient_surname
            ?.toLowerCase()
            .includes(searchPatient.toLowerCase()),
      );
      setFilteredPatients(filtered);
    } else {
      setFilteredPatients([]);
    }
  }, [searchPatient, patients]);

  return (
    <div className="rounded-lg bg-white pt-4 p-4 dark:bg-boxdark shadow-md">
      {/* Header */}
      <div className="mb-6 border-b border-stroke dark:border-strokedark pb-4">
        <h1 className="text-md md:text-lg lg:text-xl font-medium text-strokedark dark:text-bodydark3">
          ບໍລິການ
        </h1>
      </div>

      {/* Filters */}
      <div className="grid gap-6 mb-6">
        {/* Search box with dropdown */}
        <div className="relative col-span-1">
          <Search
            label="Search"
            type="text"
            name="search"
            placeholder="ຄົ້ນຫາລະຫັດຄົນເຈັບ..."
            className="rounded border border-stroke dark:border-strokedark w-full"
            onChange={(e) => setSearchPatient(e.target.value)}
          />
          <PatientDropdown
            patients={filteredPatients}
            onSelect={(patient) => {
              setSearchPatient(
                `${patient.patient_id} - ${patient.patient_name} - ${patient.patient_surname}`,
              );
              setSelectedPatient(patient);
              setFilteredPatients([]);
            }}
          />
        </div>

      </div>
     <div className="flex items-start gap-6">
  {/* Checkbox Group */}
  <div className="flex flex-col gap-4">
    <label className="inline-flex items-center gap-2 text-md text-gray-700 dark:text-bodydark">
      <input
        type="checkbox"
        className="accent-primary w-5 h-5 rounded focus:ring-2 focus:ring-purple-400"
        checked={isGeneralPatient}
        onChange={(e) => {
          setIsGeneralPatient(e.target.checked);
          if (e.target.checked) setSelectedPatient(null);
        }}
      />
      <span>ຄົນເຈັບທົ່ວໄປ (General)</span>
    </label>
    <label className="inline-flex items-center gap-2 text-md text-gray-700 dark:text-bodydark">
      <input
        type="checkbox"
        className="accent-primary w-5 h-5 rounded focus:ring-2 focus:ring-purple-400"
        checked={!isGeneralPatient}
        onChange={(e) => {
          setIsGeneralPatient(!e.target.checked);
          if (e.target.checked) setSelectedPatient(null);
        }}
      />
      <span>ຄົນເຈັບຈັດຟັນ (Orthodontic)</span>
    </label>
  </div>

  {/* Patient Info Box */}
  <div className="w-full max-w-md h-14 mt-1 mb-8 rounded border border-stroke dark:border-strokedark bg-white dark:bg-form-input px-4 flex items-center">
    {isGeneralPatient ? (
      <p className="text-md font-semibold text-primary dark:text-bodydark3">
        ຄົນເຈັບທົ່ວໄປ
      </p>
    ) : selectedPatient ? (
      <div className="text-md text-gray-700 dark:text-bodydark3 truncate">
        <span className="font-semibold">ລະຫັດ:</span> {selectedPatient.patient_id} |{' '}
        <span className="font-semibold">ຊື່:</span> {selectedPatient.patient_name} {selectedPatient.patient_surname}
      </div>
    ) : (
      <p className="text-sm text-gray-400">ຍັງບໍ່ໄດ້ເລືອກຄົນເຈັບ</p>
    )}
  </div>
</div>


      {/* Check and Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Dropdown
          placeholder="ເລືອກລາຍການບໍລິການ"
          label="Service List"
          value=""
          options={serviceList.map((s) => ({
            value: s.ser_id,
            label: s.ser_name,
          }))}
          onChange={(e) => console.log('Selected service:', e.target.value)}
          name=""
        />

        <Dropdown
          placeholder="ເລືອກພະຍາດແຂ້ວ"
          label="Disease List"
          value=""
          options={diseaseList.map((d) => ({
            value: d.disease_id,
            label: d.disease_name,
          }))}
          onChange={(e) => console.log('Selected disease:', e.target.value)}
          name=""
        />

        <Dropdown
          placeholder="ເລືອກຢາແລະອຸປະກອນ"
          label="Medicines List"
          value=""
          options={medicinesList.map((m) => ({
            value: m.med_id,
            label: m.med_name,
          }))}
          onChange={(e) => console.log('Selected medicine:', e.target.value)}
          name=""
        />
      </div>

      {/* Table 1 here*/}
      <div>
        <div className="overflow-x-auto shadow mb-8">
          <h1>services list</h1>
          <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-t-lg">
            <thead>
              <tr className="bg-secondary2 text-white text-left">
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 ">
                  #
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 ">
                  ID Service
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 ">
                  Service
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 ">
                  Price
                </th>

                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300 ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{t.id}</td>
                  <td className="px-4 py-2 break-words">{t.service}</td>
                  <td className="px-4 py-2">{t.quantity}</td>
                  <td className="px-4 py-2">{t.price.toLocaleString()}</td>
                  <td className="px-4 py-2 break-words">{t.doctor}</td>
                  <td className="px-4 py-2">{t.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <Save size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs Table2 */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'treatment'
                  ? 'text-primary border-b-2 border-primary'
                  : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('treatment')}
            >
              ສະຫລຸບການຮັກສາ
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg ${
                activeTab === 'medication'
                  ? 'text-primary border-b-2 border-primary'
                  : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('medication')}
            >
              ສະຫລຸບການໃຫ້ຢາ
            </button>
          </li>
        </ul>
      </div>

      <div className="overflow-x-auto shadow">
        {activeTab === 'treatment' ? (
          <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-t-lg">
            <thead>
              <tr className="bg-secondary2 text-white text-left">
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  #
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Service List
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Qty
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Price
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Doctor
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Total
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{t.id}</td>
                  <td className="px-4 py-2 break-words">{t.service}</td>
                  <td className="px-4 py-2">{t.quantity}</td>
                  <td className="px-4 py-2">{t.price.toLocaleString()}</td>
                  <td className="px-4 py-2 break-words">{t.doctor}</td>
                  <td className="px-4 py-2">{t.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <Save size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-max table-auto border-collapse overflow-hidden rounded-t-lg">
            <thead>
              <tr className="bg-secondary2 text-white text-left">
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  #
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Medicine
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Qty
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Price
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Total
                </th>
                <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {medications.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-stroke dark:border-strokedark hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-2">{m.id}</td>
                  <td className="px-4 py-2 break-words">{m.medicine}</td>
                  <td className="px-4 py-2">{m.quantity}</td>
                  <td className="px-4 py-2">{m.price.toLocaleString()}</td>
                  <td className="px-4 py-2">{m.total.toLocaleString()}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <Save size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition">
          <FileText className="mr-2" size={20} />
          Print
        </button>

        <div className="flex space-x-4">
          <button className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600 flex items-center transition">
            <FileText className="mr-2" size={20} />
            Bill
          </button>

          <Button variant="save" type="submit" disabled={loading}>
            {loading ? 'ກຳລັງບັນທຶກ...' : 'ບັນທຶກ'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Treatment;
