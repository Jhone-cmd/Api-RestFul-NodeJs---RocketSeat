import { app } from "./app";
import { env } from "./env/schema";

app.listen({ port: env.PORT }).then(() => {
    console.log("HTTP Server Running 🚀");
});

