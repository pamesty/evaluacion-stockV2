const cds = require('@sap/cds');
const { Products, Order_Details, Orders } = cds.entities;



module.exports = cds.service.impl(async (srv) => {

    // Control de Stock
    srv.after('CREATE', Order_Details, async (data, req) => {

        const { Quantity, product_ID } = req.data;

        try {
            let stock = await cds.run(SELECT('unitsInStock', 'unitsOnOrder').one.from(Products).where({ ID: product_ID }));

            if ((stock.UnitsOnOrder + Quantity) > stock.UnitsInStock) {
                req.reject(405, `No se puede vender el producto ya que supera su stock disponible`);
            }

            await cds.run(UPDATE(Products).with({ unitsOnOrder: { '+=': Quantity } }).where({ ID: product_ID }));
            console.log(`Valor ingresado con éxito`);
        } catch (error) {
            console.log(error);
            return `Explotus`;
        }

    });

    // Práctica de Delete
    srv.on('borrarProducto', async (req) => {
        const { product_ID } = req.data;

        try {
            let arregloOrderID = [],
                arregloEliminarOrden = [];

            await cds.foreach(SELECT.from(Order_Details).where({ product_ID: product_ID }), each => {
                // Guardo los order_ID en un arreglo
                arregloOrderID.push({
                    order_ID: each.order_ID
                });
            });

            // Recorro todos los order_ID y consulto cuantas veces se repite este ID en la entidad Orders, de existir sólo 1 coincidencia se guarda en un arreglo nuevo
            for (let i = 0; i < arregloOrderID.length; i++) {
                let ordenesRepetidas = await cds.run(SELECT.from(Order_Details).where({ order_ID: arregloOrderID[i].order_ID }));

                if (ordenesRepetidas.length === 1) { // order_ID : 11023

                    ordenesRepetidas.forEach(element => {
                        arregloEliminarOrden.push({
                            order_ID: element.order_ID
                        })
                    });
                }
            }

            // Se eliminan los Order_Details donde exista el producto
            await cds.run(DELETE.from(Order_Details).where({ product_ID: product_ID }));

            for (let i = 0; i < arregloEliminarOrden.length; i++) {
                // Se eliminan las Orders donde tenga 1 sólo detalle y sea el producto a eliminar
                await cds.run(DELETE.from(Orders).where({ ID: arregloEliminarOrden[i].order_ID }));
                console.log(`Orden número ${arregloEliminarOrden[i].order_ID} eliminada`);
            }

            // Se elemina el Products deseado
            await cds.run(DELETE.from(Products).where({ ID: product_ID }));

        } catch (error) {
            console.log(error);
            return `Explotus`;
        }
    });

}); // 177