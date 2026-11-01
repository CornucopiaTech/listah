import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import {
  useNavigate,
} from '@tanstack/react-router';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';





// Internal
import type {
  IBreadcrumbContext,
} from "@/domain/entities";
import {
  useBreadcrumb,
} from "@/hooks/context";




export function AppBreadcrumb({ sx }: { sx?: any }): ReactNode {
  const {
    route,
    parent,
    breadcrumbClick,
    breadcrumbTail,
  } = useBreadcrumb() as unknown as IBreadcrumbContext;
  const title = (parent == "/tags" || route == "/tags") ? "Tags" : (parent == "/filters" || route == "/filters") ? "Filters" : "Items";
  const navigate = useNavigate();
  const maxPrint = 10;
  const titlePlus = title?.length >= maxPrint ? "..." : "";
  const tail = breadcrumbTail || "";
  const tailPlus = tail.length >= maxPrint ? "..." : "";


  return (<Fragment>
    <Breadcrumbs aria-label="breadcrumb" sx={sx}>
      <Link underline="hover" color="inherit" onClick={() => navigate({ to: "/" })}>
        <Typography variant="h6" component="div" textAlign={"left"} sx={{}}> Home </Typography>
      </Link>
      <Link underline="hover" color="inherit" onClick={breadcrumbClick}>
        <Typography variant="h6" component="div" textAlign={"left"} sx={{}}> {title.substring(0, maxPrint) + titlePlus} </Typography>
      </Link>
      <Typography variant="h6" component="div" textAlign={"left"}> {tail?.substring(0, maxPrint) + tailPlus} </Typography>
    </Breadcrumbs>
  </Fragment>)
}
