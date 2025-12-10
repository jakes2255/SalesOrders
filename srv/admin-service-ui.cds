/**
 * @file admin-service-ui.cds
 * @description UI annotations and metadata for AdminService.
 *              Follows SAP Fiori best practices with i18n-enabled labels and accessibility features.
 *              Separates UI concerns from business logic (see admin-service.cds).
 */

using AdminService from './admin-service';

/**
 * Books Entity - Fiori Elements ListReport & ObjectPage Configuration
 * Provides a professional catalog view with filtering, sorting, and charting capabilities.
 */
annotate AdminService.Books with @(
  UI.headerInfo: {
    typeName: {i18n: 'bookTypeName'},
    typeNamePlural: {i18n: 'bookTypeNamePlural'},
    title: {value: name},
    description: {value: category},
    imageUrl: null
  },
  
  // ListReport Configuration - displays tabular view of books
  UI.lineItem: [
    {
      value: ID,
      label: {i18n: 'fieldBookID'},
      importance: #High,
      criticality: #Neutral
    },
    {
      value: name,
      label: {i18n: 'fieldTitle'},
      importance: #High
    },
    {
      value: category,
      label: {i18n: 'fieldCategory'},
      importance: #Medium
    },
    {
      value: price,
      label: {i18n: 'fieldPrice'},
      importance: #Medium
    },
    {
      value: stockQuantity,
      label: {i18n: 'fieldStock'},
      importance: #Medium,
      criticality: #Positive
    }
  ],

  // Object Page Identification (header display)
  UI.identification: [
    {value: name, importance: #High},
    {value: category, importance: #High},
    {value: description, importance: #Medium}
  ],

  // Object Page Structure (faceted view)
  UI.facets: [
    {
      id: 'GeneralInfoFacet',
      label: {i18n: 'facetGeneralInfo'},
      type: #FieldGroupReference,
      target: '#GeneralInfo'
    },
    {
      id: 'StockDetailsFacet',
      label: {i18n: 'facetStockDetails'},
      type: #FieldGroupReference,
      target: '#StockInfo'
    },
    {
      id: 'AnalyticsFacet',
      label: {i18n: 'facetAnalytics'},
      type: #ChartReference,
      target: 'Analytics'
    }
  ],

  // Field Groups for Object Page
  UI.fieldGroup #GeneralInfo: {
    label: {i18n: 'facetGeneralInfo'},
    data: [
      {value: name, label: {i18n: 'fieldTitle'}},
      {value: category, label: {i18n: 'fieldCategory'}},
      {value: price, label: {i18n: 'fieldPrice'}},
      {value: description, label: {i18n: 'fieldDescription'}}
    ]
  },

  UI.fieldGroup #StockInfo: {
    label: {i18n: 'facetStockDetails'},
    data: [
      {value: stockQuantity, label: {i18n: 'fieldStock'}},
      {value: inStock, label: {i18n: 'fieldInStock'}},
      {value: createdAt, label: {i18n: 'fieldCreatedAt'}},
      {value: modifiedAt, label: {i18n: 'fieldModifiedAt'}}
    ]
  },

  // Analytics Chart (bar chart by category)
  UI.chart: {
    title: {i18n: 'chartStockByCategory'},
    description: {i18n: 'chartStockByCategoryDesc'},
    chartType: #Bar,
    measures: [stockQuantity],
    dimensions: [category]
  },

  // Sorting (newest books first)
  UI.selectionFields: [
    name,
    category,
    price,
    stockQuantity
  ]
) {
  // Field-level annotations
  name @(
    Common.Label: 'Title',
    Common.QuickInfo: 'The title or name of the book',
    UI.HyperLink: null
  );

  category @(
    Common.Label: 'Category'
  );

  price @(
    Common.Label: 'Price (USD)'
  );

  stockQuantity @(
    Common.Label: 'In Stock'
  );

  description @(
    Common.Label: 'Description',
    UI.MultiLineText: true
  );

  createdAt @(
    Common.Label: 'Created On',
    UI.HiddenFilter: true
  );

  modifiedAt @(
    Common.Label: 'Last Modified',
    UI.HiddenFilter: true
  );
};

/**
 * Employees Entity - Basic ListReport Configuration
 * Minimal annotation set suitable for employee directory use case.
 */
annotate AdminService.Employees with @(
  UI.headerInfo: {
    typeName: {i18n: 'employeeTypeName'},
    typeNamePlural: {i18n: 'employeeTypeNamePlural'},
    title: {value: name}
  },

  UI.lineItem: [
    {value: name, label: {i18n: 'fieldName'}, importance: #High}
  ],

  UI.identification: [
    {value: name, importance: #High}
  ]
) {
  name @(
    Common.Label: 'Name'
  );
};

/**
 * Customers Entity - Default metadata applies (no explicit UI annotations).
 * Can be extended later if specific Fiori features are required.
 */

/**
 * Friends Entity - Default metadata applies (no explicit UI annotations).
 * Read-only access, basic display via standard OData conventions.
 */
