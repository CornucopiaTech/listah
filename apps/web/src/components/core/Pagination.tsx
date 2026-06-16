

import {
  styled,
  // useTheme,
} from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';


// import type { AppTheme } from '@/system/theme';


export const AppCentredPagination = styled(Pagination)(() => ({
  justifyContent: 'center', alignContent: 'center',
  display: 'flex', flexWrap: 'wrap',
  alignItems: 'center'
}));

export const AppPagination = styled(Pagination)(() => ({
  justifyContent: 'center', alignContent: 'center',
  display: 'flex', flexWrap: 'wrap',
  alignItems: 'center'
}));
