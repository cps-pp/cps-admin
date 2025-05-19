import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from 'antd';
import moment from 'moment';

const DatePickerWithTime = ({ control, name, label, errors, rules }) => (
  <div className="mb-4">
    <label className="block mb-1">{label}</label>
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm"
          {...field}
          value={field.value ? moment(field.value) : null}
          onChange={(value) => field.onChange(value?.toISOString())}
          className="w-full"
        />
      )}
    />
    {errors?.[name] && (
      <span className="text-red-500 text-sm">{errors[name]?.message}</span>
    )}
  </div>
);
