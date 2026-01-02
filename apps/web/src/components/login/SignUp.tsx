
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
import { CentredBox, SpaceBetweenBox, RowGridBox, ColumnGridBox } from "@/components/basics/Box";


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
    // validators: {
    //   // Pass a schema or function to validate
    //   onChange: z.object({
    //     username: z.string(),
    //     age: z.number().min(13),
    //   }),
    // },
    onSubmit: ({ value }) => {
      // Do something with form data
      const newValue: IUser = { ...value, role: ['user'] }
      console.info('Submit value', value)
      console.info('Post value', newValue)
      alert(JSON.stringify(value, null, 2))
      alert(JSON.stringify(newValue, null, 2))
    },
  })

  return (
    <form
      onSubmit={(e: MouseEvent<HTMLButtonElement>) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
      <RowGridBox numChildren={7} sx={{ gap: 1, }}>
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
              //sx={{ width: '98%' , p: 1}}
              size="small"
              variant="standard"
              //margin="dense"
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
              //sx={{ width: '98%' , p: 1}}
              size="small"
              variant="standard"
              //margin="dense"

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
              //sx={{ width: '98%' , p: 1}}
              size="small"
              variant="standard"
              //margin="dense"
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
              //sx={{ width: '98%' , p: 1}}
              size="small"
              variant="standard"
              //margin="dense"
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
              //sx={{ width: '98%' , p: 1}}
              size="small"
              variant="standard"
              //margin="dense"
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
              //sx={{ width: '98%' , p: 1}}
              size="small"
              variant="standard"
              //margin="dense"
              type="password"
            />
          }
        />
      </RowGridBox>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <SpaceBetweenBox>
              <Button
                type="submit"
                variant="contained"
                disabled={!canSubmit}
                sx={{ my: 2,}}
                onClick={form.handleSubmit}
              >
                {isSubmitting ? '...' : 'Submit'}
              </Button>

              <Button
                type="reset"
                variant="contained"
                sx={{ my: 2, }}
                onClick={(e) => {
                  // Avoid unexpected resets of form elements (especially <select> elements)
                  e.preventDefault()
                  form.reset()
                }}
              >
                Reset
              </Button>
            </SpaceBetweenBox>
          )}
        />
    </form>
  )
}
