namespace my.products;
using { Currency, managed, cuid } from '@sap/cds/common';

entity Suppliers {
  key ID : Integer;
  name   : String(100) not null;
  email  : String(100);
  phone  : String(20);
  address: String(200);
  city   : String(50);
  country: String(50);
  products : Association to many Products on products.supplier = $self;
}

entity Products : managed {
  key ID : Integer;
  name        : String(100) not null;
  description : String(500);
  price       : Decimal(10,2);
  currency    : Currency;
  category    : String(50);
  inStock     : Boolean default true;
  stockQuantity : Integer default 0;
  supplier    : Association to Suppliers;
}

entity Categories {
  key ID : Integer;
  name   : String(50) not null;
  description : String(200);
}

entity ProductOrders : managed {
  key ID : UUID;
  product : Association to Products;
  quantity : Integer;
  orderDate : Date;
  totalAmount : Decimal(10,2);
  currency : Currency;
  status : String(20) default 'pending';
}
