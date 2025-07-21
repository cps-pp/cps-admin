import React from 'react';
import { Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import ImportHistory from './ImportHistory';
import CreateImport from './create';

const ImportPage = () => {
const navigate = useNavigate()

  const items = [
    {
      key: '1',
      label: 'ນຳເຂົ້າ',
      children: <CreateImport tab={1} />, 
    },
    {
      key: '2', 
      label: 'ປະຫວັດນຳເຂົ້າ',
       children: <ImportHistory tab={2} />,
    },
  ];


  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 overflow-auto p-4 bg-white">
        <Tabs 
          defaultActiveKey="1" 
          items={items} 
          onChange={onChange}
        />
      </div>
    </div>
  );
};



export default ImportPage;
