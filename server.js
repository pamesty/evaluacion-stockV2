const cds = require('@sap/cds');
const axios = require('axios');

module.exports = cds.server;


let datosProducts = [];
let arregloProducts = [];
let responseDataProductos = "Products?$skiptoken=0";

cds.on('served', () => {

    // Northwind - Products
    const cargarProductos = async () => {

        do {

            await axios.get(`https://services.odata.org/Experimental/Northwind/Northwind.svc/${responseDataProductos}`)
                .then(async function (response) {
                    responseDataProductos = response.data['@odata.nextLink']
                    datosProducts = response.data.value;

                    datosProducts.forEach(element => {
                        arregloProducts.push({
                            ID: element.ProductID,
                            ProductName: element.ProductName,
                            QuantityPerUnit: element.QuantityPerUnit,
                            UnitPrice: element.UnitPrice,
                            UnitsInStock: element.UnitsInStock,
                            UnitsOnOrder: element.UnitsOnOrder,
                            ReorderLevel: element.ReorderLevel,
                            Discontinued: element.Discontinued
                        });
                    });
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    console.log("Fyah (Products)");
                });

        } while (responseDataProductos !== undefined);


        // Si el arreglo de productos importados tiene información cargarlos a mi entidad (Products)
        if (arregloProducts !== []) {
            try {
                // INSERT en la entidad del proyecto (Products)
                await cds.run(INSERT.into('Products').entries(arregloProducts));
                console.log("Los productos fueron importados con éxito");
            } catch (error) {
                console.log(error);
                console.log("No se pudo cargar el arreglo de productos");
            }

        } // fin del if del insert de Products


        cargarOrden();

    } // fin funcion cargarProductos()




    // Northwind - Orders
    let arregloOrders = [];
    let datosOrders = [];
    let responseDataOrdenes = "Orders?$skiptoken=0";
    skip = 0;


    const cargarOrden = async () => {

        do {

            await axios.get(`https://services.odata.org/Experimental/Northwind/Northwind.svc/${responseDataOrdenes}`)
                .then(async function (response) {
                    datosOrders = response.data.value;
                    responseDataOrdenes = response.data['@odata.nextLink'];

                    datosOrders.forEach(element => {
                        arregloOrders.push({
                            ID: element.OrderID,
                            OrderDate: element.OrderDate,
                            id_adicional: `${element.RequiredDate} - ${element.ShipRegion}`,
                            RequiredDate: element.RequiredDate,
                            ShippedDate: element.ShippedDate,
                            ShipVia: element.ShipVia,
                            Freight: element.Freight,
                            ShipName: element.ShipName,
                            ShipAddress: element.ShipAddress,
                            ShipRegion: element.ShipRegion,
                            ShipCity: element.ShipCity,
                            ShipPostalCode: element.ShipPostalCode,
                            ShipCountry: element.ShipCountry
                        });
                    });
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    console.log("Fyah (Orders)");
                });

        } while (responseDataOrdenes !== undefined);


        // Si el arreglo de ordenes importadas tiene información cargarlos a mi entidad (Orders)
        if (arregloOrders !== []) {
            try {
                // INSERT en la entidad del proyecto (Products)
                await cds.run(INSERT.into('Orders').entries(arregloOrders));
                console.log("Las Ordenes fueron importadas con éxito");
            } catch (error) {
                console.log(error);
                console.log("No se pudo cargar el arreglo de ordenes");
            }
        } // fin del if del insert de Products

        cargarDetalle();

    } // fin de la función cargarOrden()




    // Northwind - Orders
    let arregloDetails = [];
    let datosDetails = [];
    let responseDataDetails = "Order_Details?$orderby=OrderID";
    skip = 0;


    const cargarDetalle = async () => {

        do {
            await axios.get(`https://services.odata.org/Experimental/Northwind/Northwind.svc/${responseDataDetails}`)
                .then(async function (response) {
                    responseDataDetails = response.data['@odata.nextLink']
                    datosDetails = response.data.value;

                    for (let i = 0; i < datosDetails.length; i++) {
                        arregloDetails.push({
                            Order_ID: datosDetails[i].OrderID,
                            Product_ID: datosDetails[i].ProductID,
                            UnitPrice: datosDetails[i].UnitPrice,
                            Quantity: datosDetails[i].Quantity,
                            Discount: datosDetails[i].Discount
                        });
                    };
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    console.log("Fyah (Orders_Details)");
                });

        } while (responseDataDetails !== undefined);


        // Si el arreglo de detalles importadas tiene información cargarlos a mi entidad (Order_Details)
        if (arregloDetails !== []) {
            try {
                // INSERT en la entidad del proyecto (Products)
                await cds.run(INSERT.into('Order_Details').entries(arregloDetails));
                console.log("Los detalles de las ordenes fueron importados con éxito");
            } catch (error) {
                console.log(error);
                console.log("No se pudo cargar el arreglo de ordenes");
            }
        } // fin del if del insert Order_Details

    } // fin de la función de cargarDetalle

    cargarProductos();

});