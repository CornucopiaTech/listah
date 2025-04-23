import { registerOTel } from '@vercel/otel';



export function register(): void {
    registerOTel(process.env.NEXT_PUBLIC_WEBAPP_NAME)
}
