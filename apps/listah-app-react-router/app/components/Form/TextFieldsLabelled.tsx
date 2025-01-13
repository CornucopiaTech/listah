import * as React from 'react';
import TextField from '@mui/material/TextField';
import { dispatch, useAppSelector } from '~/store';

import type { TagChangePayloadInterface } from '~/hooks/reducers/items/itemViewSlice';
// ToDo:
// When creating an item in the list, user should specify the particular fields are shown in the accordion summary so that information stored in those fields is displayed in the accordion summary without needing to expand the accordion
export default function TextFieldsLabelled(props) {
	if (props.status == 'editing'){
		return (
			<TextField
			  required
			  multiline
			  key={'TextField-' + props.value}
			  label={props.label}
			  value={props.value}
				onChange={(e) => dispatch(props.handleFieldChange({ current: e.target.value, previous: props.value } as TagChangePayloadInterface))}
			  size={props.size}
			  sx={props.style}
			/>
	  );
	} else {
		return (
			<TextField
				disabled
				required
				multiline
				key={'TextField-' + props.value}
				label={props.label}
				value={props.value}
				onChange={(e) => props.handleFieldChange({ current: e.target.value, previous: props.value } as TagChangePayloadInterface)}
				size={props.size}
				sx={props.style}
			/>
	  );
	}

}
