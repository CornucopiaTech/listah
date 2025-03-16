import Box from '@mui/material/Box';



export default async function ItemSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  console.log('slug: ', slug);
  return <Box>
      <h1>My Page</h1>
      <h2>{slug[0]}</h2>
    </Box>
}
