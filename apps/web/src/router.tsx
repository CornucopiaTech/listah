// import {
//   createRouter,
//   createRootRoute,
//   createRoute,
// } from "@tanstack/react-router"
// // import { AppLayout } from "./layout/app-layout"
// // import { HomeRoute } from "./routes"
// // import { ListsRoute } from "./routes/lists"
// // import { ProfileRoute } from "./routes/profile"

// const rootRoute = createRootRoute({
//   component: AppLayout,
// })

// // const indexRoute = createRoute({
// //   getParentRoute: () => rootRoute,
// //   path: "/",
// //   component: HomeRoute,
// // })

// // const listsRoute = createRoute({
// //   getParentRoute: () => rootRoute,
// //   path: "/lists",
// //   component: ListsRoute,
// // })

// // const profileRoute = createRoute({
// //   getParentRoute: () => rootRoute,
// //   path: "/profile",
// //   component: ProfileRoute,
// // })

// const routeTree = rootRoute.addChildren([
//   indexRoute,
//   listsRoute,
//   profileRoute,
// ])

// export const router = createRouter({ routeTree })

// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router
//   }
// }
