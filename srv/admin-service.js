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

    // Always call super.init() last
    await super.init();
  }
}

module.exports = { AdminService };

