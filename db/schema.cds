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

entity Books : managed, cuid {
  title   : String(111);
  author  : Association to Authors;
  stock   : Integer;
  price   : Decimal(9,2);
  currency: Currency;

  category: Association to Categories;
}

entity Authors {
  key ID   : Integer;
  name     : String;
  dateOfBirth : Date;
  placeOfBirth: String;
  modifiedAt : Timestamp;
  books    : Association to many Books on books.author = $self;
}
entity Orders : cuid {
    customer      : String(111);
    orderDate     : DateTime;
    status        : String(30);
    Items         : Composition of many OrderItems on Items.order = $self;
}

entity OrderItems : cuid {
    product       : String(111);
    quantity      : Integer;
    price         : Decimal(9,2);
    order         : Association to Orders;
}

annotate Books with {
    modifiedAt @odata.etag
}

annotate Authors with {
    modifiedAt @odata.etag
}