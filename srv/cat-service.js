  module.exports = (srv) => {

  const {Publications} = cds.entities ('my.bookshop')

  // Reduce stock of ordered books
  srv.before ('CREATE', 'Orders', async (req) => {
    const order = req.data
    if (!order.amount || order.amount <= 0)  return req.error (400, 'Order at least 1 book')
    const bookshopTransaction  = cds.transaction(req)
    const affectedBooks = await bookshopTransaction .run (
      UPDATE (Publications)
        .set   ({ stock: {'-=': order.amount}})
        .where ({ stock: {'>=': order.amount},/*and*/ ID: order.book_ID})
    )
    if (affectedBooks === 0)  req.error (409, "Sold out, sorry")
  })

  // Add some items for popular Publications
  srv.after ('READ', 'Publications', each => {
    if (each.stock > 111)  each.title += ' -- 11% discount!'
  })

  // Reduce pricey books
  srv.after ('READ', 'Publications', each => {
    if (each.amo > 1000)  each.stock -= each.stock
  })


}
