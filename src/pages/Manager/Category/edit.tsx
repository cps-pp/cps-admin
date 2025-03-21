import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/Button';

const EditCate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState<any>({}); // Store category data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/manager/category/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategoryData(data.data); // Assuming the data comes under the 'data' field
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/manager/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      navigate('/category'); // Navigate back to the category list after saving
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="rounded bg-white p-6">
      <h1 className="text-xl font-semibold">Edit Category</h1>
      <div className="mt-4">
        <label className="block text-sm font-medium">Category Name</label>
        <input
          type="text"
          value={categoryData.type_name}
          onChange={(e) => setCategoryData({ ...categoryData, type_name: e.target.value })}
          className="mt-1 block w-full rounded border px-4 py-2"
        />
      </div>
      {/* Add more fields for other category properties if needed */}
      
      <Button onClick={handleSave} className="mt-4 bg-primary">Save</Button>
    </div>
  );
};

export default EditCate;
