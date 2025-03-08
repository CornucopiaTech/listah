import { registerOTel } from '@vercel/otel';
// import { type Instrumentation } from 'next';



export function register(): void {
    registerOTel(process.env.NEXT_PUBLIC_WEBAPP_NAME)
}

export async function onRequestError(
    error: { digest: string } & Error,
    request: {
        path: string // resource path, e.g. /blog?name=foo
        method: string // request method. e.g. GET, POST, etc
        headers: { [key: string]: string }
    },
    context: {
        routerKind: 'Pages Router' | 'App Router' // the router type
        routePath: string // the route file path, e.g. /app/blog/[dynamic]
        routeType: 'render' | 'route' | 'action' | 'middleware' // the context in which the error occurred
        renderSource:
            | 'react-server-components'
            | 'react-server-components-payload'
            | 'server-rendering'
        revalidateReason: 'on-demand' | 'stale' | undefined // undefined is a normal request without revalidation
        renderType: 'dynamic' | 'dynamic-resume' // 'dynamic-resume' for PPR
    }
): Promise<void>
{
    await fetch('https://.../report-error', {
        method: 'POST',
        body: JSON.stringify({
            message: err.message,
            request,
            context,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
// export const onRequestError: Instrumentation.onRequestError = async (
//     err: { digest: string } & Error,
//     request: {
//         path: string // resource path, e.g. /blog?name=foo
//         method: string // request method. e.g. GET, POST, etc
//         headers: { [key: string]: string }
//     },
//     context: {
//         routerKind: 'Pages Router' | 'App Router' // the router type
//         routePath: string // the route file path, e.g. /app/blog/[dynamic]
//         routeType: 'render' | 'route' | 'action' | 'middleware' // the context in which the error occurred
//         renderSource:
//             | 'react-server-components'
//             | 'react-server-components-payload'
//             | 'server-rendering'
//         revalidateReason: 'on-demand' | 'stale' | undefined // undefined is a normal request without revalidation
//         renderType: 'dynamic' | 'dynamic-resume' // 'dynamic-resume' for PPR
//     }
// ): Promise<void> => {
//     await fetch('https://.../report-error', {
//         method: 'POST',
//         body: JSON.stringify({
//             message: err.message,
//             request,
//             context,
//         }),
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
// }
