import { styled } from '@mui/material/styles';
import Tooltip, { type TooltipProps, tooltipClasses } from '@mui/material/Tooltip';


export const AppTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip describeChild {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    // boxShadow: theme.shadows[1],
    fontSize: "0.85rem",
  },
  // Target the internal arrow class
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.dark,
  },
}));
