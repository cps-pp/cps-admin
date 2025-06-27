import React, { useState, useEffect } from 'react';

const ExchangeRateModal = ({ isOpen, onClose, onSubmit, missingRates }) => {
  const [rates, setRates] = useState({
    'BATH': '',
    'Dollar': '',
    'YUAN': ''
  });
  const [currentRates, setCurrentRates] = useState({
    'BATH': null,
    'Dollar': null,
    'YUAN': null
  });
  const [loading, setLoading] = useState(false);
  const [loadingCurrentRates, setLoadingCurrentRates] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCurrentRates = async () => {
    setLoadingCurrentRates(true);
    try {
      const response = await fetch(`http://localhost:4000/src/manager/exchange`);
      if (response.ok) {
        const data = await response.json();
        const formattedRates = {
          'BATH': data.baht || null,
          'Dollar': data.dollar || null,
          'YUAN': data.yuan || null
        };
        setCurrentRates(formattedRates);
      }
    } catch (error) {
      console.error('Error fetching current rates:', error);
    } finally {
      setLoadingCurrentRates(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setRates({
        'BATH': '',
        'Dollar': '',
        'YUAN': ''
      });
      setErrors({});
      fetchCurrentRates();
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(rates).forEach(currency => {
      if (!rates[currency] || rates[currency].trim() === '') {
        newErrors[currency] = 'ກະລຸນາໃສ່ອັດຕາແລກປ່ຽນ';
      } else if (isNaN(rates[currency]) || parseFloat(rates[currency]) <= 0) {
        newErrors[currency] = 'ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(rates);
    } catch (error) {
      console.error('Error submitting rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (currency, value) => {
    setRates(prev => ({
      ...prev,
      [currency]: value
    }));
    
    // ล้าง error เมื่อมีการแก้ไข
    if (errors[currency]) {
      setErrors(prev => ({
        ...prev,
        [currency]: ''
      }));
    }
  };

  const getCurrencySymbol = (currency) => {
    switch(currency) {
      case 'BATH': return '฿';
      case 'Dollar': return '$';
      case 'YUAN': return '¥';
      default: return '';
    }
  };

  const getCurrencyName = (currency) => {
    switch(currency) {
      case 'BATH': return 'BATH';
      case 'Dollar': return 'Dollar';
      case 'YUAN': return 'YUAN';
      default: return currency;
    }
  };

  if (!isOpen) return null;

  return (
  <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-form-strokedark">
               ອັບເດດອັດຕາແລກປ່ຽນ
            </h2>
            <div className="text-sm text-red-600 font-medium">
              * ບັງຄັບໃສ່ຂໍ້ມູນ
            </div>
          </div>
          
          <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ ກະລຸນາອັບເດດອັດຕາແລກປ່ຽນສຳລັບວັນນີ້ກ່ອນໃຊ້ງານລະບົບ
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              ວັນທີ: {new Date().toLocaleDateString('lo-LA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="space-y-4">
            {Object.keys(rates).map((currency) => (
              <div key={currency} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {getCurrencySymbol(currency)} {getCurrencyName(currency)}
                  <span className="text-red-500 ml-1">*</span>
                  {currentRates[currency] && (
                    <span className="ml-2 text-xs text-gray-500">
                      (ປັດຈຸບັນ: {parseFloat(currentRates[currency]).toLocaleString()} ກີບ)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={rates[currency]}
                    onChange={(e) => handleInputChange(currency, e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[currency] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={currentRates[currency] ? 
                      `ຄ່າປັດຈຸບັນ: ${currentRates[currency]}` : 
                      'ໃສ່ອັດຕາແລກປ່ຽນ'
                    }
                  />
                  <div className="absolute right-3 top-2 text-gray-500 text-sm">
                    ກີບ
                  </div>
                </div>
                {errors[currency] && (
                  <p className="text-red-500 text-xs">{errors[currency]}</p>
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-3 mt-6">
            
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-6 py-2 rounded text-white font-medium transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>ກຳລັງບັນທຶກ...</span>
                  </div>
                ) : (
                  'ບັນທຶກອັດຕາແລກປ່ຽນ'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ExchangeRateModal;