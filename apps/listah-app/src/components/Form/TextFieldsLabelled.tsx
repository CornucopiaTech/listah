'use client';

import * as React from 'react';
import TextField from '@mui/material/TextField';

// ToDo:
// When creating an item in the list, user should specify the particular fields are shown in the accordion summary so that information stored in those fields is displayed in the accordion summary without needing to expand the accordion
export default function TextFieldsLabelled(props) {
	const [text, setText] = React.useState(props.value);
	function handleFieldChange(e){setText(e.target.value);}


	if (props.status == 'editing'){
		return (
			<TextField
			  required
			  multiline
			  key={'TextField-' + props.value}
			  label={props.label}
			  value={text}
			  onChange={handleFieldChange}
			  size={props.size}
			  sx={props.style}
			/>
	  );
	} else {
		return (
			<TextField
			  required
			  disabled
			  multiline
			  key={'TextField-' + props.value}
			  label={props.label}
			  value={text}
			  onChange={handleFieldChange}
			  size={props.size}
			  sx={props.style}
			/>
	  );
	}

}
