import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

export class dataManager{
    // Garante que o arquivo do banco fique ao lado deste módulo (alinha com backup)
    private dbPath = path.resolve(__dirname, 'bd.db');
    public sqlconn = new Database(path.resolve(__dirname, 'bd.db'));
    public jsonconn = fs.readFileSync(path.resolve(__dirname, 'semiStaticData.json'), 'utf-8');

    public Json(){
        return JSON.parse(this.jsonconn);
    }

    public Sqlite(){
        return this.sqlconn;
    }

    public SyncData(){
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

    private createTables(){
        // Tabela de mesas
        this.sqlconn.exec(`
            CREATE TABLE IF NOT EXISTS tables (
                id TEXT PRIMARY KEY,
                number INTEGER NOT NULL,
                capacity INTEGER NOT NULL,
                status TEXT DEFAULT 'available'
            )
        `);
        // Migração: garantir colunas ausentes em 'tables'
        try{
            const cols = this.sqlconn.prepare("PRAGMA table_info('tables')").all() as Array<{name: string}>;
            const colNames = new Set(cols.map(c => c.name));
            if(!colNames.has('number')){
                this.sqlconn.exec("ALTER TABLE tables ADD COLUMN number INTEGER");
            }
            if(!colNames.has('capacity')){
                this.sqlconn.exec("ALTER TABLE tables ADD COLUMN capacity INTEGER");
            }
            if(!colNames.has('status')){
                this.sqlconn.exec("ALTER TABLE tables ADD COLUMN status TEXT DEFAULT 'available'");
            }
        }catch{}

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
        // Migração: garantir colunas ausentes em 'users'
        try{
            const ucols = this.sqlconn.prepare("PRAGMA table_info('users')").all() as Array<{name: string}>;
            const ucolNames = new Set(ucols.map(c => c.name));
            if(!ucolNames.has('cpf')){
                this.sqlconn.exec("ALTER TABLE users ADD COLUMN cpf TEXT");
            }
            if(!ucolNames.has('rg')){
                this.sqlconn.exec("ALTER TABLE users ADD COLUMN rg TEXT");
            }
            if(!ucolNames.has('contact')){
                this.sqlconn.exec("ALTER TABLE users ADD COLUMN contact TEXT");
            }
            if(!ucolNames.has('adress')){
                this.sqlconn.exec("ALTER TABLE users ADD COLUMN adress TEXT");
            }
            if(!ucolNames.has('isVerified')){
                this.sqlconn.exec("ALTER TABLE users ADD COLUMN isVerified INTEGER DEFAULT 0");
            }
        }catch{}

        console.log("Tables created successfully");
    }

    private syncTables(tables: any[]){
        const stmt = this.sqlconn.prepare(`
            INSERT OR REPLACE INTO tables (id, number, capacity, status) 
            VALUES (?, ?, ?, ?)
        `);

        tables.forEach((table: any) => {
            stmt.run(table.id, table.number, table.capacity, table.status || 'available');
        });

        console.log(`Synced ${tables.length} tables`);
    }

    private syncProducts(products: any[]){
        const stmt = this.sqlconn.prepare(`
            INSERT OR REPLACE INTO products (id, name, description, price, category, image) 
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        products.forEach((product: any) => {
            stmt.run(
                product.id, 
                product.name, 
                product.description, 
                product.price, 
                product.category, 
                product.image || ''
            );
        });

        console.log(`Synced ${products.length} products`);
    }
}