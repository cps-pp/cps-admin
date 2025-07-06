import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Tag, Select } from 'antd';
const { Option } = Select;
export default function HomeSupplier({ tab }) {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const [form] = Form.useForm();

    useEffect(() => {
        if (tab === 3) { fetchSuppliers(); }
    }, [tab]);

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:4000/src/supplier');
            const json = await res.json();
            if (res.ok) {
                setSuppliers(json.data || []);
            } else {
                message.error(json.message || 'Failed to load suppliers');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            message.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingSupplier(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingSupplier(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const isEdit = !!editingSupplier;
            const url = isEdit
                ? `http://localhost:4000/src/supplier/${editingSupplier.sup_id}`
                : 'http://localhost:4000/src/supplier/';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const json = await res.json();
            if (res.ok) {
                message.success(isEdit ? 'Supplier updated' : 'Supplier created');
                setIsModalVisible(false);
                fetchSuppliers();
            } else {
                message.error(json.message || 'Submission failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'ລະຫັດ',
            dataIndex: 'sup_id',
            key: 'sup_id',
        },
        {
            title: 'ຊື່ນາມ ຫລື ອົງການ',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        {
            title: 'ທີ່ຢູ່',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'ເບີໂທ',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'ສະຖານະ',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        }, {
            title: 'ຈັດການ',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => handleEdit(record)} type="link">
                    Edit
                </Button>
            ),
        },
    ];


    return (
        <div className="max-w-5xl mx-auto bg-white shadow p-4 mt-6 rounded">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">ລາຍການຜູ້ສະໜອງ</h2>
                <Button type="primary" onClick={handleAddNew}>
                    + ເພີ່ມໃໝ່
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={suppliers}
                rowKey="sup_id"
                loading={loading}
                bordered
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title={editingSupplier ? 'ແກ້ໄຂຜູ້ສະໜອງ' : 'ສ້າງຜູ້ສະໜອງ'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSubmit}
                okText={editingSupplier ? 'ແກ້ໄຂ' : 'ບັນທຶກ'}
                cancelText="ຍົກເລີກ"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="company_name"
                        label="ຊື່ນາມ ຫລື ອົງການ"
                        rules={[{ required: true, message: 'Please enter company name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="ທີ່ຢູ່"
                    // rules={[{ required: true, message: 'Please enter address' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="ເບີໂທ"
                    // rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                        <Input />
                    </Form.Item>

                    {editingSupplier && (
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Please select status' }]}
                        >
                            <Select placeholder="Select status">
                                <Option value="ACTIVE">ສະແດງ</Option>
                                <Option value="UNACTIVE">ບໍ່ສະແດງ</Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    )
}
