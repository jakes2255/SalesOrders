// admin-service.js
// Custom logic for the Admin Service in CAP

const cds = require('@sap/cds');
const { TARGET_VALUE } = require('../config/constants'); // if you keep constants in a separate file

module.exports = cds.service.impl(function () {
  
  // Example: before reading data from an entity
  this.before('READ', 'Books', (req) => {
    console.log(`Reading books data for user: ${req.user.id}`);
  });

  // Example: after reading data
  this.after('READ', 'Books', (data) => {
    if (!Array.isArray(data)) data = [data];
    data.forEach(book => {
      if (book.stock < TARGET_VALUE) {
        book.lowStock = true;
      }
    });
  });

  // Example: custom handler for a bound/unbound action
  this.on('boostStock', async (req) => {
    const { ID, amount } = req.data;
    const tx = cds.transaction(req);
    const affectedRows = await tx.run(
      UPDATE('Books')
        .set({ stock: { '+=': amount } })
        .where({ ID })
    );

    if (affectedRows === 0) {
      req.error(404, `Book with ID ${ID} not found`);
    }
    return { message: `Stock boosted by ${amount}` };
  });
});
