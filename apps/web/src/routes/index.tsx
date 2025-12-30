import { createFileRoute } from '@tanstack/react-router';
import { Suspense, Fragment } from 'react';


import AppNavBar from '@/components/common/AppNavBar';
import Loading from '@/components/common/Loading';

import {
  Box,
} from '@mui/material';


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="text-center">
      {/* <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">


      </header> */}

      <Box sx={{ height: '100%' }}>
        <AppNavBar />
        <Suspense fallback={<Loading />}>
          <div> This is the Home Page</div>
        </Suspense>
      </Box>
    </div>
  )
}
