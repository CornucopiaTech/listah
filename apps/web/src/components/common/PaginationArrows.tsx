import {
  type ReactNode
} from 'react';
import {
  ArrowForwardIosOutlined,
  ArrowBackIosNewOutlined,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


interface ArrowProps {
  page: number,
  maxPages: number,
  enabled: boolean,
  toolTipTitle?: string,
  handleClick?: any,
  children?: React.ReactElement;
}

export function ForwardArrow(props: ArrowProps): ReactNode {
  if (props.enabled) {
    return (
      <Tooltip title={props.toolTipTitle ? props.toolTipTitle : "Next page"} arrow>
        <IconButton sx={{ ml: 5, }}>
          <ArrowForwardIosOutlined onClick={() => {props.handleClick(Math.min(props.maxPages, props.page + 1))}}/>
        </IconButton>
      </Tooltip>
    );
  }
  return(
    <Tooltip title={props.toolTipTitle ? props.toolTipTitle : "Next page"} arrow>
      <IconButton disabled sx={{ ml: 5, }}>
        <ArrowForwardIosOutlined onClick={() => {props.handleClick(Math.min(props.maxPages, props.page + 1))}}/>
      </IconButton>
    </Tooltip>
  );
}

export function BackwardArrow(props: ArrowProps): ReactNode {
  if (props.enabled) {
    return (
      <Tooltip title={props.toolTipTitle ? props.toolTipTitle : "Previous page"} arrow>
        <IconButton sx={{ mr: 5, }}>
          <ArrowBackIosNewOutlined onClick={() => {props.handleClick(Math.max(1, props.page - 1))}}/>
        </IconButton>
      </Tooltip>
    );
  }
  return(
    <Tooltip title={props.toolTipTitle ? props.toolTipTitle : "Previous page"} arrow>
      <IconButton disabled sx={{ mr: 5, }}>
        <ArrowBackIosNewOutlined onClick={() => {props.handleClick(Math.max(1, props.page - 1))}}/>
      </IconButton>
    </Tooltip>
  );
}
