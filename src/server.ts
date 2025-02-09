import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { validatorCompiler , serializerCompiler , type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";

// Database Module

import { dataManager } from "./modules/dataManager/main";
const db = new dataManager();
db.SyncData();

// Routes

import { usersRoutes } from "./routes/users";
import { adminRoutes } from "./routes/admin";
import { tablesRoutes } from "./routes/tables";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Restaurant API",
            version: "1.0"
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
})

app.register(usersRoutes)
app.register(tablesRoutes)
app.register(adminRoutes)

app.listen({port : 3333}).then(() => {
    console.log("Server is running on port 3333","http://localhost:3333/docs");
})