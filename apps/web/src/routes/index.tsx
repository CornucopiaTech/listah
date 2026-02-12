import { createFileRoute} from '@tanstack/react-router';


import Box from '@mui/material/Box';
import AppNavBar from '@/components/common/AppNavBar';


export const Route = createFileRoute('/')({
  component: Home,
})


function Home() {
  return (
    <Box sx={{ height: '100%', }}>
      <AppNavBar />
      <div>
        Hello World. I am home
      </div>
    </Box >
  );
}
