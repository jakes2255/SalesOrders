using { ProductService as ps } from './product-service';

annotate ps.Categories with @readonly;

annotate ps.ProductOrders with @insertonly;

annotate ps.Products with @(requires: 'authenticated-user'); // Only logged-in users

annotate ps.Suppliers with @(restrict: [
  { grant: 'READ', to: 'authenticated-user' },
  { grant: 'WRITE', to: 'admin' }
]);

annotate ps.ProductsWithSuppliers with @readonly;

annotate ps.SuppliersWithProductCount with @(requires: 'reporting');
