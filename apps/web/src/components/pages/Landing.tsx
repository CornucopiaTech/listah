import { Fragment } from "react";
import { SignInButton } from '@clerk/react';


import { AppHeroPaper } from "@/components/core/AppPaper";
import { AppButtonContained } from "@/components/core/AppButton";
import { AppHeroTypography, AppH6Typography } from "@/components/core/Typography";
import { AppH6ButtonTypography } from "@/components/core/ButtonTypography";
import { AppContainer } from '@/components/layout/AppContainer';

export function Landing() {
  return (
    <Fragment>
      <AppContainer mw="md">
        <AppHeroPaper>
          {/* <img src="/logo.png" width={120} height={120} /> */}
          <AppHeroTypography>Simplify your life, one list at a time</AppHeroTypography>
          <AppH6Typography> Effortlessly manage task, shopping, and project lists. <br />All in one place.</AppH6Typography>
          <SignInButton mode="modal">
            <AppButtonContained variant='contained' href="">
              <AppH6ButtonTypography >
                Get Started - Free
              </AppH6ButtonTypography>
            </AppButtonContained>
          </SignInButton>
        </AppHeroPaper>
      </AppContainer>
    </Fragment>
  )
}
