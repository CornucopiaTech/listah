import { Fragment } from "react";


import { AppHeroPaper } from "@/components/core/AppPaper";
import { AppButtonContained } from "@/components/core/AppButton";
import { AppHeroTypography, AppH6Typography } from "@/components/core/Typography";


export function Landing(){
  return (
    <Fragment>
        <AppHeroPaper>
          <img src="/logo.png" width={120} height={120} />
        <AppHeroTypography>Simplify your life, one list at a time</AppHeroTypography>
        <AppH6Typography> Effortlessly manage task, shopping, and project lists. All in one place.</AppH6Typography>
        <AppButtonContained label="Get Started - Free"/>
      </AppHeroPaper>
    </Fragment>
  )
}
