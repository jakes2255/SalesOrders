using AdminService from './admin-service';

annotate AdminService.Books with @(
  UI.headerInfo: {
    typeName:        { i18n: 'bookTypeName' },
    typeNamePlural: { i18n: 'bookTypeNamePlural' },
    title:          { value: name },
    description:    { value: category }
  },

  /* -----------------------------
     List Report (Table)
     ----------------------------- */
  UI.lineItem: [
    { value: ID,            importance: #High },
    { value: name,          importance: #High },
    { value: category,      importance: #Medium },
    { value: price,         importance: #Medium },
    { value: stockQuantity, importance: #Medium, criticality: #Positive }
  ],

  /* -----------------------------
     Filter Bar
     ----------------------------- */
  UI.selectionFields: [
    name,
    category,
    price,
    stockQuantity
  ],

  /* -----------------------------
     Object Page Facets
     ----------------------------- */
  UI.facets: [
    {
      id:     'General',
      label:  { i18n: 'facetGeneralInfo' },
      type:   #FieldGroupReference,
      target: '#GeneralInfo'
    },
    {
      id:     'Stock',
      label:  { i18n: 'facetStockDetails' },
      type:   #FieldGroupReference,
      target: '#StockInfo'
    },
    {
      id:     'Analytics',
      label:  { i18n: 'facetAnalytics' },
      type:   #ChartReference,
      target: 'StockByCategory'
    }
  ],

  /* -----------------------------
     Field Groups
     ----------------------------- */
  UI.fieldGroup #GeneralInfo: {
    data: [
      { value: name },
      { value: category },
      { value: price },
      { value: description }
    ]
  },

  UI.fieldGroup #StockInfo: {
    data: [
      { value: stockQuantity },
      { value: inStock },
      { value: createdAt },
      { value: modifiedAt }
    ]
  },

  /* -----------------------------
     Chart (Optional / Light Analytics)
     ----------------------------- */
  UI.chart #StockByCategory: {
    title:       { i18n: 'chartStockByCategory' },
    chartType:   #Bar,
    measures:    [ stockQuantity ],
    dimensions:  [ category ]
  }
) {

  /* -----------------------------
     Field-Level Semantics
     ----------------------------- */

  ID @Common.Label: { i18n: 'fieldBookID' };

  name @(
    Common.Label:     { i18n: 'fieldTitle' },
    Common.QuickInfo:{ i18n: 'fieldTitleInfo' }
  );

  category @(
    Common.Label: { i18n: 'fieldCategory' }
  );

  price @(
    Common.Label                 : 'Price',
    Semantics.amount.currencyCode: currency
  );

  stockQuantity @(
    Common.Label: { i18n: 'fieldStock' }
  );

  description @(
    Common.Label: { i18n: 'fieldDescription' },
    UI.MultiLineText: true
  );

  createdAt @(
    Common.Label: 'Created On',
    Common.IsCalendarDate: true,
    UI.HiddenFilter: true
  );

  modifiedAt @(
    Common.Label: 'Last Modified',
    Common.IsCalendarDate: true,
    UI.HiddenFilter: true
  );
};
