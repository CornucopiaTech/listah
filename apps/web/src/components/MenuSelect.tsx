import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface IMenuItems {
  label: string | number,
  value: string | number,
}
interface IMenuSelectProps {
  defaultValue: string | number,
  handleChange?: any,
  menuItems: IMenuItems[],
  label?: string,
  formHelperText?: string,
  labelId?: string,
  id?: string
}

export default function MenuSelect(props: IMenuSelectProps) {
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id={props.labelId ? props.labelId : "SelectMenuLabel"}>{props.label}</InputLabel>
        <Select
          labelId={props.labelId ? props.labelId : "SelectMenuLabel"}
          id={props.id ? props.id : ""}
          value={props.defaultValue}
          label={props.label}
          onChange={props.handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
            props.menuItems.map(
              (val: any, ) => (<MenuItem value={val.value}>{val.label}</MenuItem>)
            )
          }
        </Select>
        <FormHelperText>{props.formHelperText}</FormHelperText>
      </FormControl>
    </div>
  );
}
