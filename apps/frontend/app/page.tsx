"use client"
import { Container, Grid, SimpleGrid, Skeleton, rem } from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import {AppNavbar} from '../components/Navbar/AppNav';
import {HomeCard} from "../components/HomeCards/HomeCards";


const PRIMARY_COL_HEIGHT = rem(300);
const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

export default function HomePage() {
  return (
    <>

      <Container>
      {/* <Container my="md"> */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {/* <Skeleton animate={false}> */}
          <AppNavbar />
            {/* </Skeleton> */}

          <Grid gutter="md">
            <Grid.Col>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
            <Grid.Col span={6}>
              <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Container>




    {/* <AppNavbar/> */}
    {/* <HomeCard/> */}
    </>
  );
}
