



import {
  forwardRef,
} from "react";



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
          width: '50%',
          marginRight: "10px",
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
