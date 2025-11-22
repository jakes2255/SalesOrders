// admin-service.js
const cds = require('@sap/cds');
const { message } = require('@sap/cds/lib/log/cds-error');
const { UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const SELECT = require('@sap/cds/lib/ql/SELECT');

class AdminService extends cds.ApplicationService {
  async init() {
    // Destructure from this.entities
    const { Books, Authors, Employees, Friends,Customers } = this.entities;

    // Example: Handle a READ request for Books
    this.on('READ', Books, async (req) => {
      const { query } = req; // Destructure the query from request
      console.log('Reading books with query:', query);
      return await SELECT.from(Books);
    });
    //Add 'after' Hadler for to Enrich 'Books' with calculated fields
    this.after('READ', Books, each => {
      each.displayTitle = `${each.title} (${each.units} left)`;
    });
    //Handle Read request on Employees
    this.on('READ', Employees, async(req) =>{
      const { query } = req; //Destructure the query from request
      console.log('Reading Employees with Query:', query);
      return await SELECT.from(Employees);
    });
    //Handle Read request on Customers
    this.on('READ', Customers, async(req) => {
      const {data} = req; //Destructing in action
      console.log(`Readig Customer: ${data.name}`);
      return await SELECT.from(Customers);
    });

    //Handle Read request on Friends
    this.on('READ', Friends, async(req)=>{
      const {data} = req; //Destructiong, now data obj.
      console.log(`Reading Friends details: ${data.name}`);
      return await SELECT.from(Friends);
    });

    // Example: Add custom logic for creating Authors
    this.before('CREATE', Authors, (req) => {
      const { data } = req; // Destructure incoming data
      console.log(`Creating Author: ${data.name}`);
      data.createdAt = new Date().toISOString();
    });

    //Example: Handle a delete request for Books
    this.on('DELETE', Books, async(req) => {
      const {ID} = req.params; // extract the id from the request parameters via object destructuring;
      console.log(`Deleting Book with id: ${ID}`);
      //custom logic to handle the deletion
      const result = await DELETE.from(Books).where({ID});

      if(result == 0){
        throw new Error('Book not found ');
      }

      console.log(`Book with id: ${ID} deleted successfully`);
      //return a deletion successful mesage
      return `Book with id: ${ID} delted successfully`;
    });

    //Ad custom logic before Updating Book etity
    this.before('UPDATE', Books, (req) =>{
      const b = req.data;      
      // Disallow changing the primary key (ID)
        if ('ID' in b) {
          return req.error(400, 'Changing the ID of a book is not allowed.');
        }
        // Optionally disallow changing ISBN (business rule)
        if ('isbn' in b) {
          return req.error(400, 'Changing the ISBN of a book is not allowed.');
        }
    });

    //Example Update operation
    this.on('UPDATE', Books, async(req) =>{
      const {ID} = req.params;
      const {data} = req;
      console.log(`Updating Book with ID: ${ID}`, data)
      //Perform the update operation
      const result = await UPDATE(Books).set(data).where({ID});
      if(result == 0){
        throw new Error(`Book with ID: ${ID} not found`);
      }
      console.log(`Book with ID: ${ID} updated successfully`);
      return {message: `Book wit ID: ${ID} updated successfully`};
    });

    //Custom action implementation: prmote employee
    this.on('promoteEmployee', async(req) =>{
      const {ID} = req.data;
      //update employee's role to next in Org.
      await UPDATE(Employees.set({role: 'Senior'}).where({ID}));
      return `Employee ${ID} is promoted Successfully!`;
    })

    // Always call super.init() last
    await super.init();
  }
}

module.exports = { AdminService };

