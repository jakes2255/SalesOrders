// admin-service.js
const cds = require('@sap/cds');
const { SELECT, UPDATE, DELETE } = cds.ql;

class AdminService extends cds.ApplicationService {
  async init() {
    // Destructure from this.entities
    const { Books, Employees, Friends, Customers } = this.entities;

    // Example: Handle a READ request for Books (filtered to category = 'Books')
    // This handler supports search functionality by filtering on name or description
    this.on('READ', Books, async (req) => {
      const { query } = req;
      
      // Extract search term from query.search array
      let searchTerm = null;
      if (query.search && query.search.length > 0) {
        // search is an array, extract first search element
        searchTerm = query.search[0]?.val || query.search[0];
      }
      
      console.log('Reading books (category=Books) with query:', query);
      console.log('Search term extracted:', searchTerm);
      
      let q = SELECT.from(Books);
      
      // If search term provided, add filter for name or description containing the search term
      if (searchTerm && searchTerm.trim()) {
        const term = `%${searchTerm.trim()}%`;
        q = q.where(book => 
          book.name.like(term)
          .or(book.description.like(term))
        );
        console.log(`Filtering books with search term: "${searchTerm.trim()}"`);
      }
      
      return await cds.run(q);
    });
    //Add 'after' Hadler for to Enrich 'Books' with calculated fields
    this.after('READ', Books, each => {
      // Build a simple display title from product fields
      //each.displayTitle = `${each.name || each.title} (${each.stockQuantity ?? 0} left)`;
      //Re-factoring with Nullish Coalescing Operator (??)
      const qty = each.stockQuantity ?? 0;
      each.displayTitle = `${each.name ?? each.title} (${qty} left)`;
    });
    //Handle Read request on Employees
    /*this.on('READ', Employees, async(req) =>{
      const { query } = req; //Destructure the query from request
      console.log('Reading Employees with Query:', query);
      return await cds.run(SELECT.from(Employees));
    });*/
    //Better Handling of 'READ' for Employees using ultra-clean JS style
    this.on('READ', Employees, async (req) => {
      const { SELECT } = req.query ?? {};

      // Optional: lightweight debug logging (avoid console.log in productive systems)
      req.info?.('READ Employees request received');

      // Respect incoming query (filters, $select, $top, etc.)
      return cds.run({
        SELECT: {
          ...SELECT,
          from: { ref: ['Employees'] }
        }
      });
    });
    //Handle Read request on Customers
    this.on('READ', Customers, async(req) => {
      const { query } = req;
      console.log('Reading Customers with query:', query);
      return await cds.run(SELECT.from(Customers));
    });
    //Handle Update operation on Customer
    this.on('UPDATE', Customers, async(req) => {
      const { ID } = req.params;
      const { name, place } = req.data || {};
      //validate mandatory field
      if (!name) {
        return req.reject(400, 'Name is mandatory for update!');
      }
      console.log(`Updating Customer with ID: ${ID}`, name)
      //Perform the update operation
      const result = await cds.run(UPDATE(Customers).set({ name, place }).where({ ID }));
      if(!result || result == 0){
        return req.reject(404, `Customer with ID: ${ID} not found`);
      }
      console.log(`Customer with ID: ${ID} updated successfully`);
      return {message: `Customer with ID: ${ID} updated successfully`};
    });
    //Handle Read request on Friends
    /*this.on('READ', Friends, async(req)=>{
      const { query } = req;
      console.log('Reading Friends with query:', query);
      return await cds.run(SELECT.from(Friends));
    });*/
    //ultra-clean JS style
    /*
    In CAP, we usually delegate READ operations to req.query so that filters, paging, 
    and authorizations are handled consistently by the framework
    */
    this.on('READ', Friends, ({ query }) => cds.run(query));

    // (removed) create-handler for Authors — Authors is not exposed in this service

    //Example: Handle a delete request for Books
    this.on('DELETE', Books, async(req) => {
      const { ID } = req.params; // extract the id from the request parameters via object destructuring
      console.log(`Deleting Book with id: ${ID}`);
      //custom logic to handle the deletion
      const result = await cds.run(DELETE.from(Books).where({ ID }));

      if(!result || result == 0){
        return req.reject(404, 'Book not found');
      }

      console.log(`Book with id: ${ID} deleted successfully`);
      //return a deletion successful message
      return { message: `Book with id: ${ID} deleted successfully` };
    });

    //Ad custom logic before Updating Book etity
    this.before('UPDATE', Books, (req) =>{
      const b = req.data || {};
      // Disallow changing the primary key (ID)
        if ('ID' in b) {
          return req.reject(400, 'Changing the ID of a book is not allowed.');
        }
        // Optionally disallow changing ISBN (business rule)
        if ('isbn' in b) {
          return req.reject(400, 'Changing the ISBN of a book is not allowed.');
        }
    });

    //Example Update operation
    this.on('UPDATE', Books, async(req) =>{
      const { ID } = req.params;
      const data = req.data;
      console.log(`Updating Book with ID: ${ID}`, data)
      //Perform the update operation
      const result = await cds.run(UPDATE(Books).set(data).where({ ID }));
      if(!result || result == 0){
        return req.reject(404, `Book with ID: ${ID} not found`);
      }
      console.log(`Book with ID: ${ID} updated successfully`);
      return {message: `Book with ID: ${ID} updated successfully`};
    });

    //Custom action implementation: archive book
    this.on('archiveBook', async(req) => {
      const { ID, reason } = req.data || {};
      
      // Validate required parameters
      if (!ID) return req.reject(400, 'Book ID is required');
      if (!reason) return req.reject(400, 'Archival reason is required');
      
      // Check if book exists
      const book = await cds.run(SELECT.one.from(Books).where({ ID }));
      if (!book) {
        return req.reject(404, `Book with ID: ${ID} not found`);
      }
      
      // Check if already archived
      if (book.status === 'archived') {
        return req.reject(400, `Book with ID: ${ID} is already archived`);
      }
      
      const archivedAt = new Date().toISOString();
      const archivedBy = req.user.id || 'system';
      
      // Update book with archive status
      await cds.run(UPDATE(Books).set({
        status: 'archived',
        archivedAt: archivedAt,
        archivedBy: archivedBy,
        archivedReason: reason
      }).where({ ID }));
      
      console.log(`Book with ID: ${ID} archived successfully. Reason: ${reason}`);
      
      return {
        ID: book.ID,
        title: book.name || book.title,
        status: 'archived',
        archivedAt: archivedAt,
        archivedBy: archivedBy
      };
    });

    //Custom action implementation: prmote employee
    this.on('promoteEmployee', async(req) =>{
      const { ID } = req.data || {};
      if(!ID) return req.reject(400, 'Employee ID is required');
      //update employee's role to next in Org.
      await cds.run(UPDATE(Employees).set({ role: 'Senior' }).where({ ID }));
      return { message: `Employee ${ID} is promoted successfully` };
    })

    // Action: getEmployeeMessage (bound to Employees)
    // Returns a simple readiness message; accepts optional Employee ID in action payload
    this.on('getEmployeeMessage', Employees, async (req) => {
      const { ID } = req.data || {};
      if (ID) {
        return { message: `Employee ${ID} is ready for CAP` };
      }
      return { message: 'Employees service is ready for CAP' };
    });

    // Always call super.init() last
    await super.init();
  }
}

module.exports = { AdminService };

