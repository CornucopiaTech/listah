
import type {
  ChangeEvent,
  MouseEvent,
} from "react";
import {
  formOptions,
  useForm,
} from "@tanstack/react-form";
import Button from '@mui/material/Button';
import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { z } from 'zod'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';




// Internal imports
import { ZUser } from "@/lib/model/auth";
import type { IUser } from "@/lib/model/auth";
import { DEFAULT_USER } from "@/lib/helper/defaults";
import { TextFieldBasic } from "@/components/basics/TextField";
import { CentredBox } from "@/components/basics/Box";


const { fieldContext, formContext } = createFormHookContexts()

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField: TextFieldBasic,
    NumberField: TextFieldBasic,
  },
  formComponents: {
    SubmitButton: Button,
  },
  fieldContext,
  formContext,
})




export function SignUpForm() {
  const form = useAppForm({
    defaultValues: DEFAULT_USER,
    validators: {
      // Pass a schema or function to validate
      onChange: z.object({
        username: z.string(),
        age: z.number().min(13),
      }),
    },
    onSubmit: ({ value }) => {
      // Do something with form data
      console.info('Submit value', value)
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <CentredBox sx={{
        // m: 1, width: '50ch', height: 'fit-content'
      width: '60em', justifyContent: 'center', alignContent: 'center',
      display: 'flex', flexWrap: 'wrap',
      }} >
    <form
      onSubmit={(e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
      {/* <CentredBox sx={{
        width: '100%', justifyContent: 'center', alignContent: 'center',
        display: 'flex', flexWrap: 'wrap',
        }}> */}
        <Typography gutterBottom variant="h3" component="div" sx={{  justifyContent: 'center' }}>
            Create your account
        </Typography>
        {/* Components are bound to `form` and `field` to ensure extreme type safety */}
        {/* Use `form.AppField` to render a component bound to a single field */}
        <form.Field
          name="firstName"
          children={
            (field) => <TextField
              id={"sign-up-firstname"}
              value={field.state.value}
              label="First Name"
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              sx={{ width: '50ch' }}
              size="small"
              variant="standard"
              margin="dense"
            />
          }
        />
        <form.Field
          name="lastName"
          children={
            (field) => <TextField
              id={"sign-up-lastname"}
              value={field.state.value}
              label="Last Name"
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              sx={{ width: '50ch' }}
              size="small"
              variant="standard"
              margin="dense"
            />
          }
        />
        <form.Field
          name="email"
          children={
            (field) => <TextField
              id={"sign-up-email"}
              value={field.state.value}
              label="Email"
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              sx={{ width: '50ch' }}
              size="small"
              variant="standard"
              margin="dense"
            />
          }
        />
        <form.Field
          name="phoneNumber"
          children={
            (field) => <TextField
              id={"sign-up-phoneNumber"}
              value={field.state.value}
              label="Phone Number"
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              sx={{ width: '50ch' }}
              size="small"
              variant="standard"
              margin="dense"
            />
          }
        />
        <form.Field
          name="username"
          children={
            (field) => <TextField
              id={"sign-up-username"}
              value={field.state.value}
              label="Username"
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              sx={{ width: '50ch' }}
              size="small"
              variant="standard"
              margin="dense"
            />
          }
        />
        <form.Field
          name="password"
          children={
            (field) => <TextField
              id={"sign-up-password"}
              value={field.state.value}
              label="Password"
              onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
              sx={{ width: '50ch' }}
              size="small"
              variant="standard"
              margin="dense"
              type="password"
            />
          }
        />
        {/* Components in `form.AppForm` have access to the form context */}
          {/* <form.AppForm> */}
            {/* <form.SubmitButton /> */}
          <Button
            type="submit"
            variant="contained"
            // onClick={() => {form.reset()}}
            sx={{
              // m: 1, width: '50ch', height: 'fit-content'
              width: '32em', justifyContent: 'center', alignContent: 'center',
              display: 'flex', flexWrap: 'wrap', my: 2,
            }}
            onClick={form.handleSubmit}
          >
            Submit
          </Button>
          {/* </form.AppForm> */}
      {/* </CentredBox> */}
    </form>
    </CentredBox>
  )

  // return (
  //   <CentredBox sx={{
  //       // m: 1, width: '50ch', height: 'fit-content'
  //     width: '60em', justifyContent: 'center', alignContent: 'center',
  //     display: 'flex', flexWrap: 'wrap',
  //     }} >
  //   <form
  //     onSubmit={(e: MouseEvent<HTMLButtonElement>) => {
  //         e.preventDefault()
  //         e.stopPropagation()
  //       }}
  //     >
  //     {/* <CentredBox sx={{
  //       width: '100%', justifyContent: 'center', alignContent: 'center',
  //       display: 'flex', flexWrap: 'wrap',
  //       }}> */}
  //       <Typography gutterBottom variant="h3" component="div" sx={{  justifyContent: 'center' }}>
  //           Create your account
  //       </Typography>
  //       {/* Components are bound to `form` and `field` to ensure extreme type safety */}
  //       {/* Use `form.AppField` to render a component bound to a single field */}
  //       <form.AppField
  //         name="firstName"
  //         children={
  //           (field) => <field.TextField
  //             id={"sign-up-firstname"}
  //             value={field.state.value}
  //             label="First Name"
  //             onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //             sx={{ width: '50ch' }}
  //             size="small"
  //           />
  //         }
  //       />
  //       <form.AppField
  //         name="lastName"
  //         children={
  //           (field) => <field.TextField
  //             id={"sign-up-lastname"}
  //             value={field.state.value}
  //             label="Last Name"
  //             onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //             sx={{ width: '50ch' }}
  //             size="small"
  //           />
  //         }
  //       />
  //       <form.AppField
  //         name="email"
  //         children={
  //           (field) => <field.TextField
  //             id={"sign-up-email"}
  //             value={field.state.value}
  //             label="Email"
  //             onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //             sx={{ width: '50ch' }}
  //             size="small"
  //           />
  //         }
  //       />
  //       <form.AppField
  //         name="phoneNumber"
  //         children={
  //           (field) => <field.TextField
  //             id={"sign-up-phoneNumber"}
  //             value={field.state.value}
  //             label="Phone Number"
  //             onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //             sx={{ width: '50ch' }}
  //             size="small"
  //           />
  //         }
  //       />
  //       <form.AppField
  //         name="username"
  //         children={
  //           (field) => <field.TextField
  //             id={"sign-up-username"}
  //             value={field.state.value}
  //             label="Username"
  //             onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //             sx={{ width: '50ch' }}
  //             size="small"
  //           />
  //         }
  //       />
  //       <form.AppField
  //         name="password"
  //         children={
  //           (field) => <field.TextField
  //             id={"sign-up-password"}
  //             value={field.state.value}
  //             label="Password"
  //             onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //             sx={{ width: '50ch' }}
  //             size="small"
  //             type="password"
  //           />
  //         }
  //       />
  //       {/* Components in `form.AppForm` have access to the form context */}
  //         {/* <form.AppForm> */}
  //           {/* <form.SubmitButton /> */}
  //         <Button
  //           type="submit"
  //           variant="contained"
  //           // onClick={() => {form.reset()}}
  //           sx={{
  //             // m: 1, width: '50ch', height: 'fit-content'
  //             width: '32em', justifyContent: 'center', alignContent: 'center',
  //             display: 'flex', flexWrap: 'wrap', my: 2,
  //           }}
  //           onClick={form.handleSubmit}
  //         >
  //           Submit
  //         </Button>
  //         {/* </form.AppForm> */}
  //     {/* </CentredBox> */}
  //   </form>
  //   </CentredBox>
  // )

  // return (
  //   // <CentredBox sx={{ m: 1, width: '100%', height: 'fit-content'  }} >
  //   <form
  //     onSubmit={(e: MouseEvent<HTMLButtonElement>) => {
  //         e.preventDefault()
  //         form.handleSubmit()
  //       }}
  //     >
  //     <Card sx={{
  //       width: '80%', justifyContent: 'center', alignContent: 'center',
  //       display: 'flex', flexWrap: 'wrap',
  //       }}>
  //       <CardContent>
  //         <Typography gutterBottom variant="h5" component="div" sx={{ m: 1, }}>
  //           Sign Up
  //         </Typography>
  //         {/* Components are bound to `form` and `field` to ensure extreme type safety */}
  //         {/* Use `form.AppField` to render a component bound to a single field */}
  //         <form.AppField
  //           name="username"
  //           children={
  //             (field) => <field.TextField
  //               id={"sign-up-username"}
  //               value={field.state.value}
  //               label="Username"
  //               onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //               sx={{ width: '50ch' }}
  //               size="small"
  //             />
  //           }
  //         />
  //         <form.AppField
  //           name="firstName"
  //           children={
  //             (field) => <field.TextField
  //               id={"sign-up-firstname"}
  //               value={field.state.value}
  //               label="First Name"
  //               onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //               sx={{ width: '50ch' }}
  //               size="small"
  //             />
  //           }
  //         />
  //         <form.AppField
  //           name="lastName"
  //           children={
  //             (field) => <field.TextField
  //               id={"sign-up-lastname"}
  //               value={field.state.value}
  //               label="Last Name"
  //               onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //               sx={{ width: '50ch' }}
  //               size="small"
  //             />
  //           }
  //         />
  //         <form.AppField
  //           name="email"
  //           children={
  //             (field) => <field.TextField
  //               id={"sign-up-email"}
  //               value={field.state.value}
  //               label="Email"
  //               onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //               sx={{ width: '50ch' }}
  //               size="small"
  //             />
  //           }
  //         />
  //         <form.AppField
  //           name="phoneNumber"
  //           children={
  //             (field) => <field.TextField
  //               id={"sign-up-phoneNumber"}
  //               value={field.state.value}
  //               label="Phone Number"
  //               onChange={(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => field.handleChange(e.target.value)}
  //               sx={{ width: '50ch' }}
  //               size="small"
  //             />
  //           }
  //         />
  //       </CardContent>
  //       {/* Components in `form.AppForm` have access to the form context */}
  //       <CardActions>
  //         <form.AppForm>
  //           <form.SubmitButton />
  //         </form.AppForm>
  //       </CardActions>
  //     </Card>
  //   </form>
  //   //{/* </CentredBox> */}
  // )
}





// export  function SignUpForm() {
//   const formOpts = formOptions({
//     defaultValues: DEFAULT_USER,
//   })

//   const form = useForm({
//     ...formOpts,
//     onSubmit: async ({ value }) => {
//       // Do something with form data
//       console.log(value)
//     },
//   })

//   return (
//     <Box style={{ background: "var(--gray-a2)", borderRadius: "var(--radius-3)" }}>
//       <Container size="1">
//           <Box py="9" />
//           Hello WOrld!

//         <form.Field
//           name="firstName"
//           children={(field) => (
//             <>
//               <input
//                 value={field.state.value}
//                 onBlur={field.handleBlur}
//                 onChange={(e) => field.handleChange(e.target.value)}
//               />
//               <FieldInfo field={field} />
//             </>
//           )}
//         />
//       </Container>
//     </Box>

//   )
// }
