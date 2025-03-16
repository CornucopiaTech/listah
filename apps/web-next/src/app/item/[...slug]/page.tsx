import Box from '@mui/material/Box';

import { AppBarHeight } from '@/components/AppNavBar';


export default async function ItemSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  console.log('slug: ', slug);
  return (
    <Box  sx={{ bgcolor: 'pink', height: `calc(100% - ${AppBarHeight})`,
          mt: AppBarHeight, p: 1 }}>
      <h1>My Page</h1>
      <h2>{slug[0]}</h2>
    </Box>
  );
}
