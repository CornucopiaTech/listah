import type { ReactElement } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents, Virtuoso } from 'react-virtuoso';



export default function ListVirtualized({ items }: { items: string[] }): ReactElement {
  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={items}
      itemContent={(_, item) => (
        <div
          style={{
            padding: '0.5rem',
            height: `${item.size}px`,
            borderBottom: `1px solid var(--border)`
          }}
        >
          <div>{item}</div>
        </div>
      )}
    />
  );
}
