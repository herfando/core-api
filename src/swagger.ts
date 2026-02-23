// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Core API",
            version: "1.0.0",
            description: "Dokumentasi API Backend Project",
            contact: {
                name: "Herfando",
                url: "https://wa.me/6281234567890"
            }
        },
        servers: [
            {
                url: "/" // relative URL, otomatis base deployment Railway
            }
        ]
    },
    apis: ["./src/routers/*.ts"], // path file route
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    console.log(`Swagger docs running at /api-docs`);
};