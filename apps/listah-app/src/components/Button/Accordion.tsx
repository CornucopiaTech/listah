import Button from '@mui/material/Button';



export default function AccordionButton(props) {

  return (
	<Button key={props.key}
			size="small">{props.label}
	</Button>
  );
}
