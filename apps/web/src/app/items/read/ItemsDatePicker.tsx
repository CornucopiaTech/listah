"use client"

import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';

export default function DateFieldValue() {
  const initialValue = '2022-04-17';
  const [value, setValue] = React.useState<Dayjs | null>(dayjs(initialValue));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateField', 'DateField']}>
        <DateField label="Created From" defaultValue={dayjs(initialValue)} />
        <DateField
          label="Created To"
          // value={dayjs(value)}
          value={value}
          onChange={(newValue) => setValue(dayjs(newValue))}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
