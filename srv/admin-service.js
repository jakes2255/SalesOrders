// admin-service.js
const cds = require('@sap/cds');

class AdminService extends cds.ApplicationService {
  async init() {
    // Destructure from this.entities
    const { Books, Authors } = this.entities;

    // Example: Handle a READ request for Books
    this.on('READ', Books, async (req) => {
      const { query } = req; // Destructure the query from request
      console.log('Reading books with query:', query);
      return await SELECT.from(Books);
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

    // Always call super.init() last
    await super.init();
  }
}

module.exports = { AdminService };

