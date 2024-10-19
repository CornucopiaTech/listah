import * as React from 'react';

import Button from '@mui/material/Button';



export default function CardButton(props) {

  return (
	<Button key={props.key}
			size="small">{props.label}
	</Button>
  );
}
