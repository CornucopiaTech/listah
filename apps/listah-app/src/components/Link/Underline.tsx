/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();

export default function UnderlineLink(props) {
  return (
    <Box
      sx={props.style}
      onClick={preventDefault}
    >
      <Link href={props.linkUrl} underline="hover">
        {props.linkLabel}
      </Link>
    </Box>
  );
}
