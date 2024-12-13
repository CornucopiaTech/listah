import * as React from 'react';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';


export default function AccordionNoDivider(props: any) {
  return (
	<Accordion>
	<AccordionSummary>{props.accordionSummary}</AccordionSummary>
	<AccordionDetails>
		{props.children}
	</AccordionDetails>
  </Accordion>
  );
}

export function AccordionGroupNoDivider(props: any) {
	let accordions = props.accordionGroup.map((accInst: any) =>(
		<AccordionNoDivider {...accInst}/>
	  ));
  return (
    <AccordionGroup disableDivider sx={{ maxWidth: props.maxWidth }}>
      {accordions}
    </AccordionGroup>
  );
}

// export function AccordionGroupNoDivider(props: any) {
// 	let accordions = props.accordionGroup.map((accInst: any) =>(
// 		<Accordion>
// 			<AccordionSummary>{accInst.accordionSummary}</AccordionSummary>
// 			<AccordionDetails>
// 			{accInst.accordionDetails}
// 			</AccordionDetails>
//       	</Accordion>
// 	  ));
//   return (
//     <AccordionGroup disableDivider sx={{ maxWidth: props.maxWidth }}>
//       {accordions}
//     </AccordionGroup>
//   );
// }
