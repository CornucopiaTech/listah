import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import AccordionButton from '@/components/Button/Accordion';




export default function BasicAccordion (props) {
	const accordionActions = props.accordionActions.map((item) => (
		<AccordionButton key={item} label={item} />
	));


  return (
    <div>
      <Accordion key={props.accordionSummary}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${props.accordionIndex}-content`}
          id={`panel${props.accordionIndex}-header`}
        >
          {props.accordionSummary}
        </AccordionSummary>
        <AccordionDetails>
          {props.children}
        </AccordionDetails>
		<AccordionActions>
		{accordionActions}
        </AccordionActions>
      </Accordion>
    </div>
  );
}

// export default function AccordionUsage( props, { children }) {
// 	const accordionComponents = props.accordionContent.map((item) => (

// 	))
//   return (
//     <div>
//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1-content"
//           id="panel1-header"
//         >
//           Accordion 1
//         </AccordionSummary>
//         <AccordionDetails>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
//           malesuada lacus ex, sit amet blandit leo lobortis eget.
//         </AccordionDetails>
//       </Accordion>
//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel2-content"
//           id="panel2-header"
//         >
//           Accordion 2
//         </AccordionSummary>
//         <AccordionDetails>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
//           malesuada lacus ex, sit amet blandit leo lobortis eget.
//         </AccordionDetails>
//       </Accordion>
//       <Accordion defaultExpanded>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel3-content"
//           id="panel3-header"
//         >
//           Accordion Actions
//         </AccordionSummary>
//         <AccordionDetails>
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
//           malesuada lacus ex, sit amet blandit leo lobortis eget.
//         </AccordionDetails>
//         <AccordionActions>
//           <Button>Cancel</Button>
//           <Button>Agree</Button>
//         </AccordionActions>
//       </Accordion>
//     </div>
//   );
// }
