using my.products as db from '../db/schema';

/**
 * @namespace AdminService
 * @description Enterprise administration service for managing books, employees, customers, and related operations.
 *              Provides CRUD operations with role-based access control and audit trail support.
 * @path /admin
 */
service AdminService @(path: '/admin') {
  /**
   * @description Books catalog accessible to administrators.
   *              Provides filtered view of products with category = 'Books'.
   *              Supports full-text search across name and description fields.
   *              All operations are logged for audit compliance.
   * @searchable
   */
  entity Books as projection on db.Products
    where category = 'Books';

  /**
   * @description Employee directory for administrative management.
   *              Restricted to HR and admin roles only.
   */
  @restrict: [
    { grant: 'READ', to: 'admin_user' },
    { grant: 'CREATE,UPDATE,DELETE', to: 'hr_admin' }
  ]
  entity Employees as projection on db.Employees;

  /**
   * @description Customer master data.
   *              Accessible to sales and admin roles.
   */
  @restrict: [
    { grant: 'READ', to: 'sales_user' },
    { grant: 'WRITE', to: 'sales_admin' }
  ]
  entity Customers as projection on db.Customers;

  /**
   * @description Friends/associates network (optional).
   *              Read-only access for all authenticated users.
   */
  entity Friends as projection on db.Friends;

  /**
   * @description Archives a book and updates its status.
   *              Marks the book as out of print and logs the archival timestamp.
   *              Restricted to admin users only.
   * @param {UUID} ID - Book UUID
   * @param {String} reason - Reason for archival (e.g., 'Out of Print', 'Discontinued')
   * @returns {Object} Archival confirmation with updated book details
   * @throws {Error} If book not found or already archived
   */
  @restrict: [{ grant: 'EXECUTE', to: 'admin_user' }]
  action archiveBook(ID: UUID, reason: String) returns {
    ID: UUID;
    title: String;
    status: String;
    archivedAt: Timestamp;
    archivedBy: String;
  };

  /**
   * @description Promotes an employee to a higher role.
   *              Restricted to HR administrators only.
   * @param {UUID} ID - Employee UUID
   * @returns {String} Promotion status message
   * @throws {Error} If employee not found or already at max level
   */
  @restrict: [{ grant: 'EXECUTE', to: 'hr_admin' }]
  action promoteEmployee(ID: UUID) returns String;
}