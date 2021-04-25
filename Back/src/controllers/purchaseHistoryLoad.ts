import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

function getWords(con, query) {
    return new Promise((resolve) => {
        let str = ``;
        con.connect(function (err) {
            if(err) throw err;
            con.query(query, function (err, result) {
                if(err) throw err;

                if(result.length == 0) {
                    str += `none`;
                }
                
                for(let product of result) {
                    str += `\
                    <tr>\n\
                        <th>${product.name}</th>\n\
                        <th>${product.count}</th>\n\
                        <th>${product.MSRP}</th>\n\
                    </tr>\n`
                }
                resolve(str);
            })
        })
        
    })
}

export default {
    purchaseHistoryLoad: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
     ) => {
        try {
            //Setup
            const { username } = req.body;

            let datePos;

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

            let divString = ``;
            let hiddenText : string[] = [];    //Array holding all the hidden text lines

            //Set query to get all purchases from user.
            let query = `\
            SELECT 
                orders.orderID,
                orders.purchaseDate,
                addresses.addressLine1,
                addresses.addressLine2,
                addresses.city,
                addresses.state,
                addresses.zipcode,
                transactions.paidWCheck,
                transactions.paidWCredit,
                transactions.paidWDebit,
                transactions.bankNumber,
                transactions.cardNumber,
                transactions.total
            FROM (orders, addresses, transactions)
            INNER JOIN customers
            ON orders.customerID = customers.customerID
            WHERE 
            	customers.username = \"${username}\"
                AND addresses.addressID = orders.addressID
                AND transactions.transactionID = orders.transactionID
            ORDER BY orders.orderID DESC;`

            
            //Run query
            con.connect(async function (err) {
                if(err) throw err;
                con.query(query, async function (err, result) {
                    if(err) throw err;
                    let orders = result;
                    console.log(orders);
                    //setup return function buttons.
                    


                    


                    //Get items in each order.
                    
                    for(let i=0; i<orders.length; i++) {
                        let object = orders[i];
                        //Get only date from timestamp
                        let strr = "";
                        strr = String(object.purchaseDate);
                        datePos = strr.indexOf("00:00:00");
                        object.purchaseDate = strr.slice(0, datePos);

                        divString += `\
                        <div id="toggle${i}"><button type="button" id="button${i}" onclick="setContents(${i})">View Order From ${object.purchaseDate}</button></div>`

                        //Set base text per each order
                        let hiddenString = `\
                        <div id="toggleOff${i}"><button type="button" id="buttonOff${i}" onclick="remContents(${i}, \`${object.purchaseDate}\`)">Close  Order</button></p>\n\
                        <b>Purchase Date: </b><p class="inline">${object.purchaseDate}</p><br>\n\
                        <b>Delivered to: </b>\n\
                        <p>${object.addressLine1}</p>\n\
                        <p>${object.addressLine2}</p>\n\
                        <p>${object.city}, ${object.state}, ${object.zipcode}</p>\n\
                        <b>Purchase Total: </b><p class="inline">\$${object.total}</p><br>\n\
                        `
                        if(object.paidWCredit == 1) {
                            hiddenString += `
                            <b>Paid by credit (Card Number: ${object.cardNumber})</b>`
                        } else if(object.paidWDebit == 1) {
                            hiddenString += `
                            <b>Paid by debit (Bank Number: ${object.bankNumber})</b>`
                        }

                        hiddenString += `\
                        <table class="blueTable">\n\
                            <tr>\n\
                                <th>Product</th>\n\
                                <th>Amount Ordered</th>\n\
                                <th>MSRP (each)</th>\n\
                            </tr>\n`


                        query = `\
                        SELECT\n\
                        	products.MSRP,\n\
                            products.name,\n\
                            cartobjects.count\n\
                        FROM cartobjects\n\
                        INNER JOIN (products, orders)\n\
                        ON products.productID = cartobjects.productID\n\
                        WHERE\n\
                        	cartobjects.orderID = orders.orderID\n\
                            AND orders.orderID = ${object.orderID};`

                         let str = await getWords(con, query)
                            if(str == "none") {
                                hiddenString = `All products were deleted.  Contact customer support for more info.`;
                            } else {
                        //.then((str) => {
                            
                            hiddenString += str;
                            hiddenString += `</table></div>`;
                            }
                            hiddenText.push(hiddenString);
                            // console.log(hiddenString);
                        //});
                                        
                    }
                    res.json({mainLoad: divString, hidden: hiddenText});
                })
            })
            
        } catch (error) {
            res.json({Error: "Error. Could not load purchase history."})
        }
    }
}