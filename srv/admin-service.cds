using my.products as db from '../db/schema';


/**
 * Serves administrators managing everything
 */
service AdminService @(path: '/admin') {

    entity Books   as projection on db.Products;
    entity Authors as projection on db.Suppliers;
    entity Employees as projection on db.Employees;
    entity Customers as projection on db.Customers;
    entity Friends as projection on db.Friends;

}