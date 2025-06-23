import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import CreatePreOrder from './CreatePreOrder';
import HomeSupplier from './HomeSupplier';


export default function HomePreOrder() {
    const [preorders, setPreorders] = useState([]);

    useEffect(() => {
        fetchPreorders();
    }, []);

    const fetchPreorders = async () => {
        try {
            const res = await fetch('http://localhost:4000/src/preorder');
            const json = await res.json();
            setPreorders(json.data || []);
        } catch (err) {
            console.error('Error fetching preorders:', err);
        }
    };

    const onChange = key => {
        console.log(key);
    };

    const LayoutShowTable = () => {
        const handleCancel = async (id) => {
            const confirmCancel = window.confirm(`Are you sure you want to cancel preorder ID ${id}?`);
            if (!confirmCancel) return;

            try {
                const res = await fetch(`http://localhost:4000/src/preorder/cancel/${id}`, {
                    method: 'PUT'
                });

                if (res.ok) {
                    alert('Preorder canceled successfully.');
                    fetchPreorders(); // refresh list
                } else {
                    const errorData = await res.json();
                    alert('Failed to cancel: ' + errorData.message);
                }
            } catch (err) {
                console.error('Cancel error:', err);
                alert('Something went wrong.');
            }
        };
        return (
            <div>
                <button
                    onClick={() => fetchPreorders()}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Refresh Data
                </button>
                <table className="min-w-full border rounded shadow mt-6">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Preorder ID</th>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Supplier</th>
                            <th className="border p-2">Details</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {preorders.map((order) => (
                            <tr key={order.preorder_id} className="hover:bg-gray-50">
                                <td className="border p-2 text-center">{order.preorder_id}</td>
                                <td className="border p-2 text-center">{order.preorder_date}</td>
                                <td className="border p-2 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'WAITING' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="border p-2 text-center">{order.sup_id} - {order.company_name ?? 'Unknown'}</td>
                                <td className="border p-2">
                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                        {order.details.map((detail) => (
                                            <li key={detail.detail_id}>
                                                {detail.med_id} - {detail.med_name} ({detail.qty})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border p-2 text-center">
                                    {order.status === 'WAITING' && (
                                        <button
                                            onClick={() => handleCancel(order.preorder_id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const items = [
        {
            key: '1',
            label: 'Table Preorder',
            children: <LayoutShowTable />,
        },
        {
            key: '2',
            label: 'PO Create',
            children: <CreatePreOrder tab={2} />,
        },
        {
            key: '3',
            label: 'Supplier',
            children: <HomeSupplier tab={3} />,
        },
    ];



    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-auto p-4 bg-white">
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
        </div>
    )
}
