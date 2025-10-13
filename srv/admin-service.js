// admin-service.js
const cds = require('@sap/cds');
const { message } = require('@sap/cds/lib/log/cds-error');
const { UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const SELECT = require('@sap/cds/lib/ql/SELECT');

class AdminService extends cds.ApplicationService {
  async init() {
    // Destructure from this.entities
    const { Books, Authors, Employees } = this.entities;

    // Example: Handle a READ request for Books
    this.on('READ', Books, async (req) => {
      const { query } = req; // Destructure the query from request
      console.log('Reading books with query:', query);
      return await SELECT.from(Books);
    });
    //Handle Read request on Employees
    this.on('READ', Employees, async(req) =>{
      const { query } = req; //Destructure the query from request
      console.log('Reading Employees with Query:', query);
      return await SELECT.from(Employees);
    });
    //Handle Read request on Customers(will replace Authors by Customers later)
    this.on('READ', Authors, async(req) => {
      const {data} = req; //Destructing in action
      console.log(`Readig authors: ${data.name}`);
      return await SELECT.from(Employees);
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
    })

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

    // Always call super.init() last
    await super.init();
  }
}

module.exports = { AdminService };

