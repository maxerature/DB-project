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
            const foreignHost = "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com";
            const localHost = "localhost";
            const hostUsed = localHost;
            var con = await mysql.createConnection({
                host: hostUsed,
                user: "root",
                password: "password",
                port: 3306,
                database: "databases_project"
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
            let query = `
            SELECT * \n\
            FROM products`

            //Get products
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function(err, result) {
                    if (err) throw err;

                    if(!result || result == '') {
                        res.json({Error: "Error."});
                    } else {
                        let productInfo = result;

                        //Get product shipping locations
                        let query = `
                        SELECT 
                            userID,\n\
                            addressLine1,\n\
                            addressLine2,\n\
                            city,\n\
                            state,\n\
                            nation,\n\
                            zipcode\n\
                        \n\
                        FROM addresses\n\
                        WHERE\n\
                            addresses.userType = 2`
                        
                        con.connect(function(err) {
                            if(err) throw err;
                            con.query(query, function(err, result) {
                                let addresses = result;
                                console.log("addresses: ");
                                console.log(addresses);


                                //Get supplier names
                                let query = `
                                SELECT \n\
                                    supplierID,\n\
                                    supplierName\n\
                                FROM suppliers`
                                con.connect(function(err) {
                                    if(err) throw err;
                                    con.query(query, function(err, result) {
                                        console.log("Suppliers: ");
                                        console.log(result);

                                        let count = 0;
                                        for(let object of productInfo) {
                                            //Get object address
                                            let addrUnparsed = addresses.find(o =>o.userID === object.supplierID);
                                            let addr = `${addrUnparsed.addressLine1}<br>${addrUnparsed.addressLine2}<br>${addrUnparsed.city}, ${addrUnparsed.state}, ${addrUnparsed.nation}, ${addrUnparsed.zipcode}`;

                                            //Get object supplier name
                                            let supNameObj = result.find(o => o.supplierID === object.supplierID);

                                            divString += `
                                            <tr>\n
                                                <th>(<div id="count${count}" class="inline">0</div>)<br><button id="add" onClick="add(${object.productID}, ${count})">Add to Cart</button>
                                                <br>
                                                <button id="remove" onClick="remove(${object.productID}, ${count})">Remove from Cart</button></th>
                                                <th>${object.name}</th>\n\
                                                <th>\$${object.MSRP}</th>\n\
                                                <th>\$${object.listPrice}</th>\n\
                                                <th>${object.count}</th>\n\
                                                <th>${supNameObj.supplierName}</th>\n\
                                                <th>${addr}</th>\n\
                                            </tr>\n`;
                                            count++;
                                        }
                                        divString += `</table>`;
                                        res.json({Success: divString});
                                    })
                                })

                            })
                        })
                        
                    }
                });
            });

        } catch (error) {
            res.json({Error: "Error. Could not load products."})
        }
    }
}