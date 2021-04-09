namespace productos;

entity Products {
    key ID : Integer;
    ProductName : String(50);
    QuantityPerUnit : String(80);
    UnitPrice : Decimal;
    UnitsInStock : Integer;
    UnitsOnOrder : Integer;
    ReorderLevel : Integer;
    Discontinued : Boolean;
    order_detail : Association to many Order_Details on order_detail.product = $self;
}

entity Orders {
    key ID : Integer;
    id_adicional : String(150);
    OrderDate : DateTime;
    RequiredDate : DateTime;
    ShippedDate : DateTime;
    ShipVia : Integer;
    Freight : Decimal;
    ShipName : String(150);
    ShipAddress : String(150);
    ShipCity : String(100);
    ShipPostalCode : String(32);
    ShipRegion : String(50);
    ShipCountry : String(80);
    order_detail : Association to many Order_Details on order_detail.order = $self;
} 

entity Order_Details {
    key order : Association to Orders;
    key product : Association to Products;
    UnitPrice : Decimal;
    Quantity : Integer;
    Discount : Decimal;
}