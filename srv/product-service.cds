using my.products as ps from '../db/schema';

service ProductService {
  entity Products @odata.draft.enabled @cds.redirection.target as projection on ps.Products;
  entity Suppliers @odata.draft.enabled @cds.redirection.target as projection on ps.Suppliers;
  entity Categories @readonly as projection on ps.Categories;
  entity ProductOrders @insertonly as projection on ps.ProductOrders;
  
  // Custom views
  view ProductsWithSuppliers as select from ps.Products {
    ID,
    name,
    description,
    price,
    currency,
    category,
    inStock,
    stockQuantity,
    supplier.name as supplierName,
    supplier.email as supplierEmail,
    supplier.country as supplierCountry
  };
  
  view SuppliersWithProductCount as select from ps.Suppliers {
    ID,
    name,
    email,
    phone,
    city,
    country,
    count(products.ID) as productCount : Integer
  } group by ID, name, email, phone, city, country;
}
