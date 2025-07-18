# SAP CAP Products and Suppliers Service

This is an SAP Cloud Application Programming (CAP) project that provides an OData service for managing products and their suppliers.

## Project Structure

```
├── db/
│   ├── schema.cds              # Data model definitions
│   └── data/                   # Sample data files
│       ├── my.products-Products.csv
│       ├── my.products-Suppliers.csv
│       └── my.products-Categories.csv
├── srv/
│   ├── product-service.cds     # Service definitions
│   └── product-service.js      # Service implementation
└── package.json                # Project configuration
```

## Data Model

### Entities

- **Products**: Main product entity with pricing, stock, and supplier information
- **Suppliers**: Supplier information with contact details
- **Categories**: Product categories for organization
- **ProductOrders**: Order management with stock validation

### Key Features

- Products are linked to suppliers through associations
- Automatic stock management when orders are created
- Business logic for validation and inventory calculations
- Custom views for enhanced data access

## Services

### ProductService

The main OData service exposes the following entities:

- `Products` - Full CRUD operations with draft support
- `Suppliers` - Full CRUD operations with draft support  
- `Categories` - Read-only access
- `ProductOrders` - Insert-only for order creation

### Custom Views

- `ProductsWithSuppliers` - Products with supplier details
- `SuppliersWithProductCount` - Suppliers with product counts

### Custom Actions

- `getLowStockProducts` - Find products below stock threshold
- `getSupplierStats` - Get statistics for a specific supplier

## Sample Data

The project includes sample data for:
- 5 suppliers from different countries
- 10 products across various categories
- 5 product categories

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Deploy the database and load sample data:
   ```bash
   cds deploy
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the service at: http://localhost:4004

## API Endpoints

- **Service Document**: `/odata/v4/product/`
- **Products**: `/odata/v4/product/Products`
- **Suppliers**: `/odata/v4/product/Suppliers`
- **Categories**: `/odata/v4/product/Categories`
- **Product Orders**: `/odata/v4/product/ProductOrders`

### Example Queries

- Get all products: `GET /odata/v4/product/Products`
- Get products with suppliers: `GET /odata/v4/product/ProductsWithSuppliers`
- Get supplier statistics: `POST /odata/v4/product/getSupplierStats`
- Get low stock products: `POST /odata/v4/product/getLowStockProducts`

## Business Logic

The service includes several business rules:
- Supplier validation when creating products
- Stock availability checks for orders
- Automatic stock reduction after order creation
- Inventory value calculations

## Technology Stack

- SAP Cloud Application Programming Model (CAP)
- Node.js runtime
- SQLite database (development)
- OData v4 protocol
