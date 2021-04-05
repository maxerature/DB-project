import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
    productsListing: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup mysql
            var mysql = require('mysql2');
            var con = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "password",
                port: 3306,
                database: "databaseproject"
            });

            //Setup string to parse into div
            let divString = `
            <table style="width:100%">\n\
                <tr>\n\
                    <th></th>\n\
                    <th>Name</th>\n\
                    <th>MSRP</th>\n\
                    <th>List Price</th>\n\
                    <th>Amount in Stock</th>\n\
                    <th>Supplier Name</th>\n\
                    <th>Ships From</th>\n\
                </tr>`;

            //Setup query to get products
            let query = `\
            SELECT\n\
				suppliers.supplierID,\n\
				suppliers.supplierName,\n\
                addressLine1,\n\
                addressLine2,\n\
                city,\n\
                state,\n\
                nation,\n\
                zipcode,\n\
                name,\n\
                supplierCode,\n\
                MSRP,\n\
                listPrice,\n\
                count,\n\
                productID
            FROM (Products, Addresses, Suppliers)\n\
            WHERE\n\
                addresses.addressID = products.addressID\n\
                AND products.supplierID = suppliers.supplierID;`

            //Get products
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function(err, result) {
                    if (err) throw err;
                    console.log(result);

                    for(let count = 0; count < result.length; count++) {
                        let object = result[count]
                        //Get object address
                        let addr = `${object.addressLine1}<br>${object.addressLine2}<br>${object.city}, ${object.state}, ${object.nation}, ${object.zipcode}`;
                        console.log(addr);

                        divString += `
                        <tr>\n
                            <th>(<div id="count${count}" class="inline">0</div>)<br><button id="add" onClick="add(${object.productID}, ${count})">Add to Cart</button>
                            <br>
                            <button id="remove" onClick="remove(${object.productID}, ${count})">Remove from Cart</button></th>
                            <th>${object.name}</th>\n\
                            <th>\$${object.MSRP}</th>\n\
                            <th>\$${object.listPrice}</th>\n\
                            <th>${object.count}</th>\n\
                            <th>${object.supplierName}</th>\n\
                            <th>${addr}</th>\n\
                        </tr>\n`;
                    }
                    divString += `</table>`;
                    res.json({Success: divString});
                });
            });

        } catch (error) {
            res.json({Error: "Error. Could not load products."})
        }
    }
}