import { createFileRoute, redirect } from '@tanstack/react-router';




export const Route = createFileRoute('/')({
  component: () => <div> Hello World. I am home</div>
  // beforeLoad: () => {
  //   throw redirect({
  //     to: '/items',
  //     replace: true, // This option makes it a "permanent" history change
  //   })
  // },
})
