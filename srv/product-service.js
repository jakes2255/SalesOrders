const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const { Products, Suppliers, ProductOrders } = this.entities;

    // Before creating a product, validate supplier exists
    this.before('CREATE', Products, async (req) => {
        const { supplier_ID, stockQuantity, price } = req.data;

        if (supplier_ID) {
            const supplier = await SELECT.one.from(Suppliers).where({ ID: supplier_ID });
            if (!supplier) {
                req.error(400, req._('supplier.not_found_error', supplier_ID));
            }
        } else {
            req.warn(req._('product.creation.no_supplier_warn'));
        }

        if (stockQuantity && stockQuantity < 10) {
            req.warn(req._('product.creation.low_stock_warn'));
        }

        if (!price || price <= 0) {
            req.warn(req._('product.creation.no_price_warn'));
        }
    });

    // After reading products, calculate total inventory value
    this.after('READ', Products, (products) => {
        if (Array.isArray(products)) {
            products.forEach(({ price, stockQuantity }, i) => {
                if (price && stockQuantity) {
                    products[i].inventoryValue = price * stockQuantity;
                }
            });
        } else if (products) {
            const { price, stockQuantity } = products;
            if (price && stockQuantity) {
                products.inventoryValue = price * stockQuantity;
            }
        }
    });

    // Before creating an order, validate product availability
    this.before('CREATE', ProductOrders, async (req) => {
        const { product_ID, quantity } = req.data;
        if (product_ID && quantity) {
            const product = await SELECT.one.from(Products).where({ ID: product_ID });

            if (!product) {
                req.error(400, req._('product.not_found_error', product_ID));
            }

            const { inStock, stockQuantity, name } = product;

            if (!inStock) {
                req.error(400, req._('product.out_of_stock_error', name));
            }
            if (stockQuantity < quantity) {
                req.error(400, req._('product.insufficient_stock_error', stockQuantity, quantity));
            }

            if (quantity > 100) {
                req.warn(req._('order.large_quantity_warn'));
            }

            const remainingStock = stockQuantity - quantity;
            if (remainingStock > 0 && remainingStock < 20) {
                req.warn(req._('order.low_stock_after_order_warn', remainingStock));
            }
        }
    });

    // After creating an order, update product stock
    this.after('CREATE', ProductOrders, async ({ product_ID, quantity }) => {
        if (product_ID && quantity) {
            await UPDATE(Products)
                .set({ stockQuantity: { '-=': quantity } })
                .where({ ID: product_ID });
        }
    });

    // Custom action to get low stock products
    this.on('getLowStockProducts', async (req) => {
        const { threshold = 50 } = req.data;

        const products = await SELECT.from(Products)
            .where({ stockQuantity: { '<': threshold }, inStock: true })
            .orderBy('stockQuantity');

        const criticalItems = products.filter(({ stockQuantity }) => stockQuantity < 10);
        if (criticalItems.length > 0) {
            req.warn(req._('product.critical_low_stock_warn', criticalItems.length));
        }

        if (products.length === 0 && threshold < 20) {
            req.warn(req._('product.no_low_stock_but_low_threshold_warn'));
        }

        return products;
    });

    // Custom action to get supplier statistics
    this.on('getSupplierStats', async (req) => {
        const { supplierId } = req.data;
        const supplier = await SELECT.one.from(Suppliers).where({ ID: supplierId });

        if (!supplier) {
            req.error(404, req._('supplier.id_not_found_error', supplierId));
        }

        const products = await SELECT.from(Products).where({ supplier_ID: supplierId });
        const totalProducts = products.length;
        const totalInventoryValue = products.reduce(
            (sum, { price, stockQuantity }) => sum + (price * stockQuantity || 0), 
            0
        );
        const inStockProducts = products.filter(({ inStock }) => inStock).length;

        return {
            supplier: supplier.name,
            totalProducts,
            inStockProducts,
            outOfStockProducts: totalProducts - inStockProducts,
            totalInventoryValue
        };
    });
});
