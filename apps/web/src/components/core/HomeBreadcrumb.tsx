

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';


import { AppH6Typography } from "@/components/core/Typography";
import { FlexStartBox  } from "@/components/core/AppBox"


export function HomeBreadcrumbs() {
  return (
    <FlexStartBox>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          <AppH6Typography> Home  </AppH6Typography>
        </Link>
      </Breadcrumbs>
    </FlexStartBox>

  );
}
