using { productos as my} from '../db/schema';

service api {

    entity Products as projection on my.Products;

    entity Orders as projection on my.Orders;

    @cds.redirection.target : true
    entity Order_Details as projection on my.Order_Details;

    entity Datos_Producto as select from my.Order_Details {
        *,
        product.ProductName as Nombre_Producto,
        product.QuantityPerUnit as Cantidad_Por_Unidad,
        product.UnitPrice as Precio_Unitario_Producto,
        product.UnitsInStock as Unidades_En_Stock,
        product.UnitsOnOrder as Unidades_En_Orden,
        order.ShipCountry as Country,
        order.OrderDate as Fecha_de_Orden,
        order.ShipAddress as Direccion_de_Envio,
        order.ShipCity as Ciudad_de_envio,
        order.ShipPostalCode as Codigo_Postal
    };

    action borrarProducto (product_ID : Products : ID) returns String;
}