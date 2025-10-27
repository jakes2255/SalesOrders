using my.products as db from '../db/schema';


/**
 * Serves administrators managing everything
 */
service AdminService @(path: '/admin') {
    // UI annotations here-only for Books entity
    @UI: {
        headerInfo: {
        typeName: 'Book',
        typeNamePlural: 'Books',
        title: { value: title },
        description: { value: author }
        },
        lineItem: [
        { value: ID, label: 'Book ID' },
        { value: title, label: 'Title' },
        { value: author, label: 'Author' },
        { value: price, label: 'Price' },
        { value: stock, label: 'In Stock' }
        ],
        identification: [
        { value: title },
        { value: author },
        { value: description }
        ]
    }
    entity Books   as projection on db.Products;
    //UI Annotation for Employees entity
    @UI: {
        headerInfo : {
            typeName: 'Employee',
            typeNamePlural: 'Employees',
            title: {value, name}
        },
        lineItem: [
            {value: title, label: 'name'}
        ]
    }
    entity Employees as projection on db.Employees;
    // No UI annotations here, so default metadata applies
    entity Customers as projection on db.Customers;
    entity Friends as projection on db.Friends;

}