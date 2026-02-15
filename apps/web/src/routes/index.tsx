import { createFileRoute} from '@tanstack/react-router';


import Box from '@mui/material/Box';
// import AppNavBar from '@/components/common/AppNavBar';
import { Landing } from '@/pages/Landing';


export const Route = createFileRoute('/')({
  component: Landing,
})


function Home() {
  return (
    <Box sx={{ height: '100%', }}>
      {/* <AppNavBar /> */}
      <div>
        Hello World. I am home
      </div>
    </Box >
  );
}
