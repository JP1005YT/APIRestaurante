import { FastifyTypedInstance } from "../types";
import ProductSchemas from "../model/product/ProductSchemas";
import ProductControllerClass from "../model/product/ProductController";

export async function productsRoutes(app: FastifyTypedInstance){
    
    const ProductController = new ProductControllerClass();

    app.get("/products", ProductSchemas.getAll(), (req, res) => { 
        ProductController.getAllProducts(req, res) 
    });
    
    app.get("/products/:id", ProductSchemas.getById(), (req, res) => { 
        ProductController.getProductById(req, res) 
    });
    
    app.post("/products", ProductSchemas.create(), (req, res) => { 
        ProductController.createProduct(req, res) 
    });
    
    app.put("/products/:id", ProductSchemas.update(), (req, res) => { 
        ProductController.updateProduct(req, res) 
    });
    
    app.delete("/products/:id", ProductSchemas.delete(), (req, res) => { 
        ProductController.deleteProduct(req, res) 
    });
    
    app.get("/products/category/:category", ProductSchemas.getByCategory(), (req, res) => { 
        ProductController.getProductsByCategory(req, res) 
    });
}

