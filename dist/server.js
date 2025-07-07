"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const cors_1 = require("@fastify/cors");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const swagger_1 = require("@fastify/swagger");
const swagger_ui_1 = require("@fastify/swagger-ui");
// Database Module
const main_1 = require("./modules/dataManager/main");
const db = new main_1.dataManager();
db.SyncData();
// Routes
const users_1 = require("./routes/users");
const admin_1 = require("./routes/admin");
const tables_1 = require("./routes/tables");
const products_1 = require("./routes/products");
const orders_1 = require("./routes/orders");
const app = (0, fastify_1.fastify)().withTypeProvider();
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.register(cors_1.fastifyCors, { origin: "*" });
app.register(swagger_1.fastifySwagger, {
    openapi: {
        info: {
            title: "Restaurant API",
            version: "1.0"
        }
    },
    transform: fastify_type_provider_zod_1.jsonSchemaTransform
});
app.register(swagger_ui_1.fastifySwaggerUi, {
    routePrefix: "/docs",
});
app.register(users_1.usersRoutes);
app.register(tables_1.tablesRoutes);
app.register(products_1.productsRoutes);
app.register(orders_1.ordersRoutes);
app.register(admin_1.adminRoutes);
app.listen({ port: 3333 }).then(() => {
    console.log("Server is running on port 3333", "http://localhost:3333/docs");
});
