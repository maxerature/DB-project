import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
    supplierProductsViewLoad: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup mysql
            const {username} = req.body;

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
                    <th>Name</th>\n\
                    <th>MSRP</th>\n\
                    <th>List Price</th>\n\
                    <th>Amount in Stock</th>\n\
                    <th>Reorder</th>\n\
                    <th>Ships From</th>\n\
                </tr>`;

            //Setup query to get products
            let query = `
            SELECT \n\
                products.productID,\n\
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
                count\n\
            FROM (Products, Addresses, Suppliers)\n\
            WHERE\n\
                addresses.addressID = products.addressID\n\
                AND suppliers.username = \"${username}\"`

            //Get products
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function(err, result) {
                    if (err) throw err;
                    for(let object of result) {
                        let addr = `${object.addressLine1}<br>${object.addressLine2}<br>${object.city}, ${object.state}, ${object.nation}, ${object.zipcode}`;

                        //Get object supplier name
                        console.log(result)

                        divString += `
                        <tr>\n
                            <th>${object.name}</th>\n\
                            <th>\$${object.MSRP}</th>\n\
                            <th>\$${object.listPrice}</th>\n\
                            <th>${object.count}</th>
                            <th><form>\n\
                                    <input class="input-field" type="number" id="orderNum${object.productID}" placeholder="Amount to order" required/><br>\n\
                                    <button type="button" onclick="reorder(${object.productID})">Reorder</button>
                                </form></th>\n\
                            <th>${addr}</th>\n\
                        </tr>\n`;
                    }
                    divString += `</table>`;
                    console.log(divString);
                    res.json({Success: divString});
                });
            });

        } catch (error) {
            res.json({Error: "Error. Could not load products."})
        }
    }
}