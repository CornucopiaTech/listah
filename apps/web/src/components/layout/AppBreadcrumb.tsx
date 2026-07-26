import {
  Fragment,
} from "react";
import type {
  ReactNode,
} from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TagIcon from '@mui/icons-material/Tag';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';




// Internal
import type {
  IBreadcrumbContext,
} from "@/domain/entities";
import {
  useBreadcrumb,
} from "@/hooks/context";




export function AppBreadcrumb(): ReactNode {
  const {
    route,
    parent,
    breadcrumbClick,
    breadcrumbTail,
    addNewItemClick,
    addNewFilterClick,
    addNewTagClick,
  } = useBreadcrumb() as unknown as IBreadcrumbContext;
  const title = (parent == "/tags" || route == "/tags") ? "Tags" : (parent == "/filters" || route == "/filters") ? "Filters" : "Items";
  const actions = [
    {
      icon: <ListAltIcon sx={{ fontSize: "2rem" }} />,
      name: 'Create new item',
      onClick: addNewItemClick,
    },
    {
      icon: <TagIcon sx={{ fontSize: "2rem" }} />,
      name: 'Create new tag',
      onClick: addNewTagClick,
      display: route == "/tags" ? undefined : "none"
    },
    {
      icon: <CategoryIcon sx={{ fontSize: "2rem" }} />,
      name: 'Create new filter',
      onClick: addNewFilterClick,
      display: route == "/filters" ? undefined : "none"
    },
  ];

  return (<Fragment>
    <Breadcrumbs aria-label="breadcrumb" sx={{}}>
      <Link underline="hover" color="inherit" onClick={breadcrumbClick}>
        <Typography variant="h6" component="div" textAlign={"left"} sx={{}}> {title} </Typography>
      </Link>
      <Typography variant="h6" component="div" textAlign={"left"}> {breadcrumbTail} </Typography>
    </Breadcrumbs>
    <SpeedDial
      direction="up"
      ariaLabel="SpeedDial basic example"
      sx={{ position: 'absolute', bottom: 16, right: 4 }}
      icon={<EditIcon sx={{ fontSize: "1.5rem" }} />} >
      {
        actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            sx={{ display: action.display }}
            onClick={action.onClick}
            slotProps={{
              tooltip: {
                title: action.name,
              },
            }}
          />
        ))}
    </SpeedDial>
  </Fragment>)
}
