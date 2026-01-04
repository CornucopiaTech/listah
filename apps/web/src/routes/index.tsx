import { createFileRoute, redirect } from '@tanstack/react-router';




export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: '/items',
      replace: true, // This option makes it a "permanent" history change
    })
  },
})
