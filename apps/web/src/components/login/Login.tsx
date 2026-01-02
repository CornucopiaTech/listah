// src/components/auth/login-form.tsx
import { useNavigate } from "@tanstack/react-router"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "@tanstack/react-form"
// import { loginUser } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const navigate = useNavigate()

  const mutation = useMutation({
    // mutationFn: loginUser,
    onSuccess: () => navigate({ to: "/" }),
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value)
    },
  })

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {(mutation.error as Error).message}
          </AlertDescription>
        </Alert>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label>Email</Label>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value.includes("@") ? "Enter a valid email" : undefined,
          }}
        >
          {field => (
            <Input
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="you@example.com"
            />
          )}
        </form.Field>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label>Password</Label>
        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              value.length < 6 ? "Password too short" : undefined,
          }}
        >
          {field => (
            <Input
              type="password"
              value={field.state.value}
              onChange={e => field.handleChange(e.target.value)}
              placeholder="••••••••"
            />
          )}
        </form.Field>
      </div>

      {/* Submit */}
      <Button className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
