import { SignIn } from '@clerk/nextjs';
import Box from '@mui/material/Box';

import styles from "./page.module.css";

export default function Page() {
  return (
    <Box className={styles.signInBox}>
      <SignIn />
    </Box>
  )
}
