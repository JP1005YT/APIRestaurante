"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class dataManager {
    // Garante que o arquivo do banco fique ao lado deste módulo (alinha com backup)
    dbPath = path_1.default.resolve(__dirname, 'bd.db');
    sqlconn = new better_sqlite3_1.default(path_1.default.resolve(__dirname, 'bd.db'));
    jsonconn = fs_1.default.readFileSync(path_1.default.resolve(__dirname, 'semiStaticData.json'), 'utf-8');
    Json() {
        return JSON.parse(this.jsonconn);
    }
    Sqlite() {
        return this.sqlconn;
    }
    SyncData() {
        console.log("Syncing data");
        // Criar tabelas se não existirem
        this.createTables();
        const data = this.Json();
        const tables = data.restaurant.tables;
        // Sincronizar dados das mesas
        this.syncTables(tables);
        // Sincronizar produtos se existirem no JSON
        if (data.restaurant.products) {
            this.syncProducts(data.restaurant.products);
        }
    }
    createTables() {
        // Tabela de mesas
        this.sqlconn.exec(`
            CREATE TABLE IF NOT EXISTS tables (
                id TEXT PRIMARY KEY,
                number INTEGER NOT NULL,
                capacity INTEGER NOT NULL,
                status TEXT DEFAULT 'available'
            )
        `);
        // Tabela de produtos
        this.sqlconn.exec(`
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                image TEXT
            )
        `);
        // Tabela de pedidos
        this.sqlconn.exec(`
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                table_id TEXT NOT NULL,
                total REAL NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (table_id) REFERENCES tables(id)
            )
        `);
        // Tabela de produtos do pedido
        this.sqlconn.exec(`
            CREATE TABLE IF NOT EXISTS order_products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id),
                FOREIGN KEY (product_id) REFERENCES products(id)
            )
        `);
        // Tabela de usuários (alinhada ao UserInterface)
        this.sqlconn.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                cpf TEXT NOT NULL,
                rg TEXT NOT NULL,
                contact TEXT NOT NULL,
                adress TEXT NOT NULL,
                isVerified INTEGER NOT NULL DEFAULT 0
            )
        `);
        console.log("Tables created successfully");
    }
    syncTables(tables) {
        const stmt = this.sqlconn.prepare(`
            INSERT OR REPLACE INTO tables (id, number, capacity, status) 
            VALUES (?, ?, ?, ?)
        `);
        tables.forEach((table) => {
            stmt.run(table.id, table.number, table.capacity, table.status || 'available');
        });
        console.log(`Synced ${tables.length} tables`);
    }
    syncProducts(products) {
        const stmt = this.sqlconn.prepare(`
            INSERT OR REPLACE INTO products (id, name, description, price, category, image) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        products.forEach((product) => {
            stmt.run(product.id, product.name, product.description, product.price, product.category, product.image || '');
        });
        console.log(`Synced ${products.length} products`);
    }
}
exports.dataManager = dataManager;
