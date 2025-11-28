using my.products as db from '../db/schema';


/**
 * Serves administrators managing everything
 */
service AdminService @(path: '/admin') {
    // UI annotations here-only for Books entity
    @UI: {
        //header section
        headerInfo: {
        typeName: 'Book',
        typeNamePlural: 'Books',
        title: { value: name },
        description: { value: category }
        },
        //List Report
        lineItem: [
        { value: ID, label: 'Book ID' },
        { value: name, label: 'Title' },
        { value: category, label: 'Category' },
        { value: price, label: 'Price' },
        { value: stockQuantity, label: 'In Stock' }
        ],
        //Chart annotation
        chart: {
            title: 'Stock by Category',
            description: 'Compare stock levels of books by category',
            chartType: #Bar,                  // Other options: #Line, #Donut, #Column, #Pie
            measures: [ stockQuantity ],      // Quantitative values
            dimensions: [ category ]          // Categorical grouping
        },
        //Object page identification
        identification: [
        { value: name },
        { value: category },
        { value: description }
        ],
        //Object page structure
        facets                 : [
            {
                label          : 'General Information',
                targetQualifier: 'GeneralInfo',
                type           : #FieldGroupReference
            },
            {
                label          : 'Stock Details',
                targetQualifier: 'StockInfo',
                type           : #FieldGroupReference
            }
        ],

        fieldGroup #GeneralInfo: {data: [
            {
                value: name,
                label: 'Title'
            },
            {
                value: category,
                label: 'Category'
            },
            {
                value: price,
                label: 'Price'
            },
            {
                value: description,
                label: 'Description'
            }
        ]},

        fieldGroup #StockInfo  : {data: [
            {
                value: stockQuantity,
                label: 'In Stock'
            },
            {
                value: price,
                label: 'Price (again for reference)'
            }
        ]}
    }
    entity Books   as projection on db.Products where category = 'Books';
    //UI Annotation for Employees entity
    @UI: {
        headerInfo : {
            typeName: 'Employee',
            typeNamePlural: 'Employees',
            title: {value: name}
        },
        lineItem: [
            {value: name, label: 'Name'}
        ]
    }
    entity Employees as projection on db.Employees;
    // No UI annotations here, so default metadata applies
    entity Customers as projection on db.Customers;
    entity Friends as projection on db.Friends;

    //custom action
    action promoteEmployee(ID: UUID) returns String;

}