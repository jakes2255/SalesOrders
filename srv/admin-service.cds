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
        title: { value: title },
        description: { value: author }
        },
        //List Report
        lineItem: [
        { value: ID, label: 'Book ID' },
        { value: title, label: 'Title' },
        { value: author, label: 'Author' },
        { value: price, label: 'Price' },
        { value: stock, label: 'In Stock' }
        ],
        //Chart annotation
        chart: {
            title: 'Stock by Author',
            description: 'Compare stock levels of books by author',
            chartType: #Bar,                  // Other options: #Line, #Donut, #Column, #Pie
            measures: [ stock ],              // Quantitative values
            dimensions: [ author ]            // Categorical grouping
        },
        //Object page identifcation
        identification: [
        { value: title },
        { value: author },
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
                value: title,
                label: 'Title'
            },
            {
                value: author,
                label: 'Author'
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
                value: stock,
                label: 'In Stock'
            },
            {
                value: price,
                label: 'Price (again for reference)'
            }
        ]}
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