import { createFileRoute } from '@tanstack/react-router';


import { SignUpForm } from '@/components/login/SignUp';


export const Route = createFileRoute('/sign-up/')({
  component: SignUpForm,
})

