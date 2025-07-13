import * as React from 'react';
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText

} from '@mui/material';
import {
  FixedSizeList,
  ListChildComponentProps,
  VariableSizeList as List
} from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { getDemoItems } from '@/repository/fetcher';



function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function VirtualizedList() {
  return (
    <Box sx={{ width: '100%', height: '50%', bgcolor: 'background.paper' }}>
      <AutoSizer>
        {
          ({height, width}) => (<FixedSizeList
            height={height}
            width={width}
            itemSize={46}
            itemCount={2000}
            overscanCount={5}>
          {renderRow}
        </FixedSizeList>)
      }
      </AutoSizer>

    </Box>
  );
}

// These row heights are arbitrary.
// Yours should be based on the content of the row.



export function VariableSizedVirtualizedList(){
  const rowHeights = new Array(1000)
    .fill(true)
    .map(() => 25 + Math.round(Math.random() * 50));
  const getItemSize = (index) => rowHeights[index];

  const Row = ({ index, style }) => (
    <div style={style}>Row {index}</div>
  );

  return (
    <Box sx={{ width: '100%', height: '50%', bgcolor: 'lime' }}>
      <AutoSizer>
        {
          ({height, width}) => (
            <List
                height={height}
                width={width}
                itemCount={1000}
                itemSize={getItemSize}
                >
              {Row}
            </List>
          )
        }
      </AutoSizer>
    </Box>
  );
}


export function ItemsList(){
  const data = getDemoItems([], [], []);

  function renderItemRow(props: ListChildComponentProps) {
    const { index, isScrolling, style } = props;

    return (
      <div style={style}>{isScrolling ? 'Scrolling' : data[index].summary}</div>
    );
    // return (
    //   <ListItem style={style} key={index} component="div" disablePadding>
    //     <ListItemButton>
    //       <ListItemText primary={data[index].summary} />
    //     </ListItemButton>
    //   </ListItem>
    // );
  }


  return (
    <Box sx={{ width: '100%', height: '50%', bgcolor: 'background.paper' }}>
      <AutoSizer>
        {
          ({height, width}) => (
            <FixedSizeList
                height={height}
                width={width}
                itemSize={46}
                itemCount={2000}
                // overscanCount={5}
                >
              {renderItemRow}
            </FixedSizeList>
          )
        }
      </AutoSizer>
    </Box>
  );
}
