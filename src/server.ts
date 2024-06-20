import { app } from "./app";
import { env } from "./env/schema";

app.listen({ 
    port: env.PORT, 
    host: ("RENDER" in process.env) ? '0.0.0.0' : 'localhost', }).then(() => {
    console.log("HTTP Server Running 🚀");
});

