# Fiori Books & Catalog Management Application

## Overview
Enterprise-grade SAP Fiori application for managing books catalog with role-based access control, full-text search, and comprehensive audit trail support. Built with SAP CAP (Node.js) backend and UI5 Fiori Elements frontend.

## Architecture & Best Practices

### 1. **Separation of Concerns**
- **`srv/admin-service.cds`** – Business logic, data models, authorization rules, and action definitions
- **`srv/admin-service-ui.cds`** – UI-specific annotations for Fiori Elements ListReport and ObjectPage
- **`app/project1/webapp/`** – Frontend Fiori Elements app with responsive design

This separation ensures:
- UI changes don't impact backend logic
- Reusability across different client types (desktop, mobile, APIs)
- Easier maintenance and testing

### 2. **Localization & Internationalization (i18n)**
All UI labels, tooltips, and messages are externalized in `app/project1/webapp/i18n/i18n.properties`:
- `{i18n: 'bookTypeName'}` references translate at runtime
- Support for multi-language deployment (add `i18n_fr.properties`, `i18n_de.properties`, etc.)
- ABAP naming convention (`XTIT`, `XFLD`, `XDES`, `XMSG`) for professional i18n management

### 3. **Fiori Elements Best Practices**
The UI follows SAP Fiori guidelines:
- **ListReport** – Tabular view with filtering, sorting, search
- **ObjectPage** – Faceted detail view with grouped information
- **Chart** – Analytics visualization (Bar chart of stock by category)
- **Semantic Colors** – Stock levels color-coded (Red < 50, Yellow 50-100, Green > 100)
- **Responsive Design** – Works on desktop, tablet, and phone

### 4. **Role-Based Access Control (RBAC)**
Authorization rules defined in `admin-service.cds`:
```cds
@restrict: [
  { grant: 'READ', to: 'admin_user' },
  { grant: 'CREATE,UPDATE,DELETE', to: 'hr_admin' }
]
```
Supported roles:
- `admin_user` – Read-only access to employee data
- `hr_admin` – Full CRUD + employee promotion actions
- `sales_user` – Read access to customers
- `sales_admin` – Write access to customer data

### 5. **Data Validation & Audit Trail**
- Automatic `createdAt`, `createdBy`, `modifiedAt`, `modifiedBy` tracking
- Stock quantity visualized with criticality levels
- Field-level validation via CDS annotations

### 6. **Search & Discovery**
- Full-text search enabled on `Books.name` and `Books.description`
- Fuzzy matching (80% similarity) for typo tolerance
- Selection fields allow refined filtering by category, price, stock

### 7. **Documentation**
- JSDoc-style comments in CDS files for API contracts
- `@namespace`, `@description`, `@param`, `@returns`, `@throws` tags
- Enterprise-grade documentation for handoff and maintenance

---

## Project Structure

```
my-bookshop/
├── srv/
│   ├── admin-service.cds           # Business logic & authorization
│   ├── admin-service-ui.cds        # Fiori UI annotations
│   ├── admin-service.js            # Custom handlers & search logic
│   ├── product-service.cds         # Product catalog service
│   └── product-service.js
├── db/
│   ├── schema.cds                  # Data models (Products, Employees, etc.)
│   └── data/                       # CSV seed files
│       ├── my.products-Products.csv
│       ├── my.products-Categories.csv
│       └── my.products-Suppliers.csv
├── app/
│   └── project1/
│       ├── ui5.yaml                # UI5 dev server config with proxy
│       ├── package.json
│       └── webapp/
│           ├── manifest.json       # Fiori app manifest & OData configuration
│           ├── Component.js        # Fiori Elements AppComponent
│           ├── index.html
│           ├── i18n/
│           │   └── i18n.properties # Localization strings
│           ├── annotations/
│           │   └── Annotations.xml # Local OData annotations
│           └── test/               # OPA5 integration tests
├── gen/                            # Build artifacts (auto-generated)
├── package.json                    # Root dependencies
└── README.md
```

---

## Running Locally

### Prerequisites
- Node.js (v18+)
- npm v9+
- CAP CLI: `npm install -g @sap/cds-dk`

### Setup & Install Dependencies

```bash
cd my-bookshop
npm install
cd app/project1 && npm install && cd ../..
```

### Start CAP Backend

```bash
cds watch
```
Output: CAP server listening on `http://localhost:4004`
- AdminService OData: `http://localhost:4004/admin/$metadata`
- Books catalog: `http://localhost:4004/admin/Books`

### Start UI5 Frontend (in new terminal)

```bash
cd app/project1
npx @ui5/cli serve --config ui5.yaml --open /index.html
```
UI5 dev server running on `http://localhost:8080`
- The proxy automatically routes `/admin` calls to `http://localhost:4004/admin`

### Verify Setup

```powershell
# Test OData metadata
Invoke-RestMethod -Uri 'http://localhost:4004/admin/$metadata' -Method Get

# Fetch sample Books
Invoke-RestMethod -Uri 'http://localhost:4004/admin/Books?$top=5' -Method Get | ConvertTo-Json
```

---

## Key Features Implemented

### 📚 Books Catalog
- **ListReport**: Filterable, sortable table of books with search
- **ObjectPage**: Detailed view with General Info and Stock Details facets
- **Analytics**: Bar chart showing stock levels by category
- **Full-Text Search**: Search across book titles and descriptions

### 👥 Employee Management
- **Basic ListReport**: Employee directory
- **RBAC**: Only HR admins can modify employee records
- **Promotion Action**: Custom CDS action to promote employees

### 📊 Search & Filtering
- Default sort by created date (newest first)
- Fuzzy text matching (typo tolerance)
- Filterable by category, price, stock level
- Quick-info tooltips on hover

### 🔐 Security
- Role-based access control (admin, HR, sales roles)
- Audit trail (who created/modified, when)
- CSRF token validation for state-changing operations

---

## Configuration Details

### OData Data Source (`manifest.json`)
```json
"dataSources": {
  "mainService": {
    "uri": "/admin/",
    "type": "OData",
    "settings": {
      "annotations": ["annotations/Annotations.xml"],
      "odataVersion": "4.0"
    }
  }
}
```

### UI5 Dev Server Proxy (`ui5.yaml`)
```yaml
backend:
  - path: /admin
    url: http://localhost:4004
    csrf: true
```
This ensures requests to `/admin` are forwarded to your CAP service.

### Routing (Fiori Elements)
- **Route 1**: `:?query:` → `sap.fe.templates.ListReport` (Books list)
- **Route 2**: `Books({key}):?query:` → `sap.fe.templates.ObjectPage` (Book details)

---

## Localization (i18n)

All UI labels use i18n keys for multi-language support:

**English (default)**: `app/project1/webapp/i18n/i18n.properties`
```properties
bookTypeName=Book
fieldTitle=Title
chartStockByCategory=Stock by Category
```

**To add German support**, create `i18n_de.properties`:
```properties
bookTypeName=Buch
fieldTitle=Titel
chartStockByCategory=Bestand nach Kategorie
```

Update `manifest.json` to include the new locale in `sap.app.i18n` if deploying multi-language.

---

## Development Tips

### Adding a New Entity to AdminService
1. Define entity in `db/schema.cds` (e.g., `entity Suppliers`)
2. Add projection in `srv/admin-service.cds` with authorization
3. Create annotations in `srv/admin-service-ui.cds` for Fiori display
4. Add i18n labels to `app/project1/webapp/i18n/i18n.properties`
5. Restart `cds watch` to regenerate OData metadata

### Customizing Search
Search is implemented server-side in `srv/admin-service.js`:
```javascript
on('READ', 'Books', async req => {
  const { query } = req;
  if (query.search?.length) {
    const searchTerm = query.search[0]?.val || query.search[0];
    const q = SELECT.from('Books').where(
      book => book.name.like(`%${searchTerm}%`)
        .or(book.description.like(`%${searchTerm}%`))
    );
    return cds.run(q);
  }
  return cds.run(query);
});
```

### Enabling Mock Server (Offline)
For development without backend connectivity, add `sap.ushell.services.AppConfiguration` to manifest.json to enable offline OData mock server.

---

## Testing

### Manual Testing Checklist
- [ ] List Books with search term "Gatsby"
- [ ] Sort by price (ascending/descending)
- [ ] Filter by category "Books"
- [ ] Open a book detail (ObjectPage)
- [ ] View stock analytics chart
- [ ] Check i18n labels render correctly

### OPA5 Integration Tests
Located in `app/project1/webapp/test/integration/`:
```bash
npm test
```

---

## Git Workflow & Deployment

### Commit Structure
```bash
git add srv/ app/ db/
git commit -m "feat: Implement enterprise Fiori practices for Books service

- Separate service business logic from UI annotations
- Add i18n support for multi-language
- Implement role-based access control (RBAC)
- Add comprehensive JSDoc comments
- Configure Fiori Elements ListReport & ObjectPage"
```

### Deployment (SAP BTP)
```bash
npm run build
cf push
```
(Requires Cloud Foundry CLI and BTP subscription)

---

## Troubleshooting

### Issue: Annotations not loading in Fiori preview
**Solution**: Ensure `app/project1/webapp/annotations/Annotations.xml` exists and is referenced in `manifest.json` under `dataSources.mainService.settings.annotations`.

### Issue: Search not filtering books
**Solution**: Verify `srv/admin-service.js` has the search handler implemented. Check browser DevTools Network tab to see if `/admin/Books?$search=...` returns filtered results.

### Issue: i18n keys showing raw text (e.g., `{i18n>bookTypeName}`)
**Solution**: Ensure `app/project1/webapp/i18n/i18n.properties` has the key defined. Restart `ui5 serve`.

### Issue: CORS errors when calling backend
**Solution**: Verify `app/project1/ui5.yaml` has the correct backend proxy configuration with `/admin` path mapped to `http://localhost:4004`.

---

## References

- [SAP Fiori Design System](https://experience.sap.com/fiori-design-web/)
- [SAP CAP Documentation](https://cap.cloud.sap/docs/)
- [SAPUI5 Fiori Elements](https://sapui5.hana.ondemand.com/#/topic/7b0e2dc33a904e0dbddac0bca49ebeae)
- [CDS Annotations & i18n](https://cap.cloud.sap/docs/guides/i18n)

---

## Support & Maintenance

For issues, enhancements, or documentation updates:
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with descriptive messages
4. Push to repository: `git push origin feature/your-feature`
5. Create a pull request for code review

---

**Last Updated**: 2025-12-06  
**Version**: 1.0.0  
**Maintainer**: Enterprise Architecture Team
