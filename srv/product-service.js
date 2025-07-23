const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { Products, Suppliers, ProductOrders } = this.entities;

    // Before creating a product, validate supplier exists
    this.before('CREATE', Products, async (req) => {
        const { supplier_ID, stockQuantity, price } = req.data;
        
        if (supplier_ID) {
            const supplier = await SELECT.one.from(Suppliers).where({ ID: supplier_ID });
            if (!supplier) {
                req.error(400, `Supplier with ID ${supplier_ID} does not exist`);
            }
        } else {
            req.warn('Product is being created without a supplier. Consider assigning a supplier for better inventory management.');
        }

        // Warn about low initial stock
        if (stockQuantity && stockQuantity < 10) {
            req.warn('Product is being created with very low initial stock quantity. Consider increasing stock levels.');
        }

        // Warn about missing price
        if (!price || price <= 0) {
            req.warn('Product is being created without a valid price. This may affect inventory calculations.');
        }
    });

    // After reading products, calculate total inventory value
    this.after('READ', Products, (products) => {
        if (Array.isArray(products)) {
            products.forEach(product => {
                if (product.price && product.stockQuantity) {
                    product.inventoryValue = product.price * product.stockQuantity;
                }
            });
        } else if (products && products.price && products.stockQuantity) {
            products.inventoryValue = products.price * products.stockQuantity;
        }
    });

    // Before creating an order, validate product availability
    this.before('CREATE', ProductOrders, async (req) => {
        const { product_ID, quantity } = req.data;
        if (product_ID && quantity) {
            const product = await SELECT.one.from(Products).where({ ID: product_ID });
            if (!product) {
                req.error(400, `Product with ID ${product_ID} does not exist`);
            }
            if (!product.inStock) {
                req.error(400, `Product ${product.name} is out of stock`);
            }
            if (product.stockQuantity < quantity) {
                req.error(400, `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${quantity}`);
            }

            // Warn about large orders
            if (quantity > 100) {
                req.warn('Large order quantity detected. Please verify this is intentional and sufficient stock will remain.');
            }

            // Warn if order will result in low stock
            const remainingStock = product.stockQuantity - quantity;
            if (remainingStock > 0 && remainingStock < 20) {
                req.warn(`This order will result in low stock levels. Remaining stock after order: ${remainingStock}. Consider restocking soon.`);
            }
        }
    });

    // After creating an order, update product stock
    this.after('CREATE', ProductOrders, async (order, req) => {
        if (order.product_ID && order.quantity) {
            await UPDATE(Products)
                .set({ stockQuantity: { '-=': order.quantity } })
                .where({ ID: order.product_ID });
        }
    });

    // Custom action to get low stock products
    this.on('getLowStockProducts', async (req) => {
        const threshold = req.data.threshold || 50;
        const products = await SELECT.from(Products)
            .where({ stockQuantity: { '<': threshold }, inStock: true })
            .orderBy('stockQuantity');

        // Warn about critically low stock items
        const criticalItems = products.filter(p => p.stockQuantity < 10);
        if (criticalItems.length > 0) {
            req.warn(`Found ${criticalItems.length} products with critically low stock (less than 10 units). Immediate restocking recommended.`);
        }

        // Warn if no low stock products found but threshold is very low
        if (products.length === 0 && threshold < 20) {
            req.warn('No low stock products found, but threshold is very low. Consider using a higher threshold for better inventory planning.');
        }

        return products;
    });

    // Custom action to get supplier statistics
    this.on('getSupplierStats', async (req) => {
        const supplierId = req.data.supplierId;
        const supplier = await SELECT.one.from(Suppliers).where({ ID: supplierId });
        
        if (!supplier) {
            req.error(404, `Supplier with ID ${supplierId} not found`);
        }

        const products = await SELECT.from(Products).where({ supplier_ID: supplierId });
        const totalProducts = products.length;
        const totalInventoryValue = products.reduce((sum, product) => 
            sum + (product.price * product.stockQuantity || 0), 0);
        const inStockProducts = products.filter(p => p.inStock).length;

        return {
            supplier: supplier.name,
            totalProducts,
            inStockProducts,
            outOfStockProducts: totalProducts - inStockProducts,
            totalInventoryValue
        };
    });
});
