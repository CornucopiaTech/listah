import TextField from '@mui/material/TextField';


export function TextFieldBasic(props) {
  return (
    <TextField
      multiline
      // fullWidth
      variant="standard"
      // variant="outlined"
      margin="dense"
      rows={4}
      {...props}
    />
  );
}

export function TextFieldDense(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      {...props}
    />
  );
}
export function TextFieldMultiline(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      multiline
      minRows={4}
      {...props}
    />
  );
}
export function TextFieldMultilineDense(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      multiline
      minRows={4}
      {...props}
    />
  );
}
