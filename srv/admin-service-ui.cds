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
      criticality: stockQuantity < 50 ? #Negative : (stockQuantity < 100 ? #Warning : #Positive)
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
      target: @UI.fieldGroup#GeneralInfo
    },
    {
      id: 'StockDetailsFacet',
      label: {i18n: 'facetStockDetails'},
      type: #FieldGroupReference,
      target: @UI.fieldGroup#StockInfo
    },
    {
      id: 'AnalyticsFacet',
      label: {i18n: 'facetAnalytics'},
      type: #ChartReference,
      target: @UI.chart
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

  // Selection Fields for filter bar in ListReport
  UI.selectionFields: [
    name,
    category,
    price,
    stockQuantity
  ],

  // Search Configuration
  Search.defaultSearchElement: true,
  Search.fuzziness: 0.8,

  // Sorting (newest books first)
  Common.SortOrder: [
    {by: createdAt, direction: #Descending}
  ]
) {
  // Field-level annotations
  name @(
    Common.Label: {i18n: 'fieldTitle'},
    Common.QuickInfo: {i18n: 'infoTitle'},
    UI.HyperLink: null,
    Measures.ISOCurrency: currency_code
  );

  category @(
    Common.Label: {i18n: 'fieldCategory'},
    Common.ValueList: {
      Label: {i18n: 'valueListCategories'},
      CollectionPath: 'Categories',
      Parameters: [
        {$Type: 'Common.ValueListParameterInOut', LocalDataProperty: category, ValueListProperty: 'code'},
        {$Type: 'Common.ValueListParameterDisplayOnly', ValueListProperty: 'description'}
      ]
    }
  );

  price @(
    Common.Label: {i18n: 'fieldPrice'},
    Measures.ISOCurrency: currency_code,
    Common.SemanticObject: 'Product'
  );

  stockQuantity @(
    Common.Label: {i18n: 'fieldStock'},
    Common.Text: displayTitle
  );

  description @(
    Common.Label: {i18n: 'fieldDescription'},
    UI.MultiLineText: true
  );

  createdAt @(
    Common.Label: {i18n: 'fieldCreatedAt'},
    UI.HiddenFilter: true
  );

  modifiedAt @(
    Common.Label: {i18n: 'fieldModifiedAt'},
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
    Common.Label: {i18n: 'fieldName'}
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
