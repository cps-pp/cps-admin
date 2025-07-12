import { Divider, Input, Table } from 'antd';
import React from 'react';
import { iconTrash } from '@/configs/icon';
import useStoreDisease from '../../../../store/selectDis';

const { TextArea } = Input;

export default function SumDiseases() {
  const { removeDisease, dis } = useStoreDisease();

  return (
    <div>
      <ul>
        {dis?.map((name, index) => (
          <div key={index}>
            <li className="flex justify-between">
              <span>{name}</span>
              <button
                onClick={() => removeDisease(index)}
                className="text-red-500 hover:text-red-600 p-1 rounded"
              >
                {iconTrash}
              </button>
            </li>
            {index !== dis.length - 1 && <Divider className="my-2" />}
          </div>
        ))}
      </ul>
    </div>
  );
}
