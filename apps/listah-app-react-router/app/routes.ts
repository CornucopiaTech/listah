import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

// export default [index("routes/home.tsx")] satisfies RouteConfig;



export default [
    // index("./home.tsx"),
    index("./routes/home.tsx"),
    route("items", "./routes/items.tsx"),

    // layout("./auth/layout.tsx", [
    //     route("login", "./auth/login.tsx"),
    //     route("register", "./auth/register.tsx"),
    // ]),

    // ...prefix("concerts", [
    //     index("./concerts/home.tsx"),
    //     route(":city", "./concerts/city.tsx"),
    //     route("trending", "./concerts/trending.tsx"),
    // ]),
] satisfies RouteConfig;

