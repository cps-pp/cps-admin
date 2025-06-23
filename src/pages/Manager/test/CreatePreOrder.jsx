import React, { useEffect, useState } from 'react'
import { Select, Spin } from 'antd';
const { Option } = Select;

export default function CreatePreOrder({ tab }) {

    const [supId, setSupId] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(true);

    const [details, setDetails] = useState([
        { med_id: '', qty: 1 }
    ]);

    useEffect(() => {
        if (tab === 2) {
            fetchSuppliers();
            fetchMedicines();
        }
    }, [tab]);

    const fetchSuppliers = async () => {
        try {
            const res = await fetch('http://localhost:4000/src/supplier');
            const json = await res.json();
            setSuppliers(json.data || []);
        } catch (err) {
            console.error('Error fetching suppliers:', err);
        } finally {
            setLoadingSuppliers(false);
        }
    };

    const fetchMedicines = async () => {
        try {
            const res = await fetch('http://localhost:4000/src/manager/medicines');
            const json = await res.json();
            setMedicines(json.data || []);
        } catch (err) {
            console.error('Error fetching suppliers:', err);
        } finally {
            setLoadingSuppliers(false);
        }
    };

    const handleDetailChange = (index, field, value) => {
        const updated = [...details];
        updated[index][field] = value;
        setDetails(updated);
    };

    const addDetail = () => {
        setDetails([...details, { med_id: '', qty: 1 }]);
    };

    const removeDetail = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            sup_id: parseInt(supId),
            details: details.map(d => ({
                med_id: d.med_id,
                qty: parseInt(d.qty)
            }))
        };

        try {
            const res = await fetch('http://localhost:4000/src/preorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Preorder created successfully!');
                setSupId('');
                setDetails([{ med_id: '', qty: 1 }]);
            } else {
                alert('Failed to create preorder');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting form');
        }
    };


    return (
        <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded mt-6">
            <div className='flex justify-between'>
                <h2 className="text-xl font-bold mb-4">Create Preorder</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Supplier ID</label>
                    <Select
                        showSearch
                        placeholder="Select a supplier"
                        optionFilterProp="children"
                        onChange={(value) => setSupId(value)}
                        value={supId || undefined}
                        className="w-full"
                        loading={loadingSuppliers}
                        filterOption={(input, option) =>
                            (option?.children)?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {suppliers.map((sup) => (
                            <Option key={sup.sup_id} value={sup.sup_id}>
                                {sup.company_name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div>
                    <label className="block font-semibold mb-2">Details</label>
                    {details.map((detail, index) => (
                        <div key={index} className="flex gap-4 items-center mb-2">
                            <div className="flex-1">
                                <p>Medicine</p>
                                <Select
                                    showSearch
                                    placeholder="Select medicine"
                                    value={detail.med_id || undefined}
                                    onChange={(value) => handleDetailChange(index, 'med_id', value)}
                                    className="w-full"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {medicines.map((med) => (
                                        <Select.Option key={med.med_id} value={med.med_id}>
                                            {med.med_name} ({med.med_id})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <p>Qty</p>
                                <input
                                    type="number"
                                    value={detail.qty}
                                    onChange={(e) => handleDetailChange(index, 'qty', e.target.value)}
                                    className="w-24 border p-2 rounded"
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeDetail(index)}
                                className="text-red-500 hover:text-red-700 pt-5"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addDetail}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        + Add Detail
                    </button>
                </div>

                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Submit Preorder
                </button>
            </form>
        </div>
    )
}
