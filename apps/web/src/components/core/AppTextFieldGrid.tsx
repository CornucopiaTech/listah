



import {
  forwardRef,
} from "react";
import Box from '@mui/material/Box';



export function VirtualGridComponent() {
  return {
    // @ts-ignore
    List: forwardRef(({ style, children, ...props }, ref) => (
      <div
        // @ts-ignore
        ref={ref}
        {...props}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          ...style,
        }}
      >
        {children}
      </div>
    )),
    // @ts-ignore
    Item: ({ children, ...props }) => (
      <div
        {...props}
        style={{
          padding: '0.5rem',
          width: '20%',
          height: "50px",
          display: 'flex',
          flex: 'none',
          alignContent: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    ),
  }
}

export function getGridComponentDiv() {
  return {
    // @ts-ignore
    List: forwardRef(({ style, children, ...props }, ref) => (
      <div
        // @ts-ignore
        ref={ref} {...props}
        style={{ ...style, margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', }}
      >
        {children}
      </div>
    )),
    // @ts-ignore
    Item: ({ children, ...props }) => (
      <div
        {...props}
        style={{
          paddingTop: '20px',
          marginRight: -3,
          width: '25%',
          // width: 'auto',
          // width: '10%',
          // maxWidth: '300px',
          // minWidth: '150px',
          height: "50px",
          display: 'flex',
          flex: 'none',
          alignContent: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    ),
  }
}

export function getGridComponent() {
  return {
    // @ts-ignore
    List: forwardRef(({ style, children, ...props }, ref) => (
      <div
        // @ts-ignore
        ref={ref} {...props}
        style={{ ...style, margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', }}
      >
        {children}
      </div>
    )),
    // @ts-ignore
    Item: ({ children, ...props }) => (
      <div
        {...props}
        style={{
          width: '33%',
          height: "35px",
          display: 'flex',
          flex: 'none',
          alignContent: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    ),
  }
}

export function getGridComponentBox() {
  return {
    // @ts-ignore
    List: forwardRef(({ style, children, ...props }, ref) => (
      <Box
        // @ts-ignore
        ref={ref} {...props}
        style={{ ...style, margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', }}
      >
        {children}
      </Box>
    )),
    // @ts-ignore
    Item: ({ children, ...props }) => (
      <Box
        {...props}
        style={{
          width: '33%',
          height: "35px",
          display: 'flex',
          flex: 'none',
          alignContent: 'stretch',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    ),
  }
}
