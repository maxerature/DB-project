import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";
import { count } from "node:console";

export default {
    checkout: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const {unique, counts, tType, tnum, username, total} = req.body;

            let first = true;
            console.log("Total:" + total);

            //Connect to sql
            var mysql = require('mysql2');

            var con = await mysql.createConnection({
                host: "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com",
                user: "root",
                password: "databaseproject",
                port: 3306,
                database: "databases_project"
            });

            //Create Transaction
            //Setup numbers

            //Set query
            let query = ``;
            if(tType == "check") {
                query = `\
                INSERT INTO transactions(\n\ 
                    transactionComplete,\n\
                    paidWCheck,\n\
                    paidWCredit,\n\
                    paidWDebit,\n\
                    total\n\
                )\n\
                VALUES (\n\
                    false,\n\
                    true,\n\
                    false,\n\
                    false,\n\
                    ${total}\n\
                )`
            } else if(tType == "card") {
                query = `\
                INSERT INTO transactions (\n\ 
                    transactionComplete,\n\
                    paidWCheck,\n\
                    paidWCredit,\n\
                    paidWDebit,\n\
                    cardNumber,\n\
                    total\n\
                )\n\
                VALUES (\n\
                    false,\n\
                    false,\n\
                    true,\n\
                    false,\n\
                    ${tnum},\n\
                    ${total}\n\
                )`
            } else {
                query = `\
                INSERT INTO transactions (\n\ 
                    transactionComplete,\n\
                    paidWCheck,\n\
                    paidWCredit,\n\
                    paidWDebit,\n\
                    bankNumber,\n\
                    total\n\
                )\n\
                VALUES (\n\
                    false,\n\
                    false,\n\
                    false,\n\
                    true,\n\
                    ${tnum},\n\
                    ${total}\n\
                )`
            }

            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function (err, result) {
                    if(err) throw err;
                    let transID = result.insertId;

                    //Get user ID
                    let query = `\
                    SELECT customerID\n\
                    FROM customers\n\
                    WHERE\n\
                        username = \"${username}\";`

                    con.connect(function(err) {
                        if(err) throw err;
                        con.query(query, function (err, result) {
                            console.log(result);
                            let userID = result[0].customerID;
                            console.log("UserID: " + userID)

                            //Get user address
                            let query = `\
                            SELECT addressID\n\
                            FROM addresses\n\
                            WHERE\n\
                                userID = ${userID}\n\
                                AND active = true;`

                            con.connect(function (err) {
                                if(err) throw err;
                                con.query(query, function (err, result) {
                                    console.log(result);
                                    let addressID = result[0].addressID;
                                    console.log("AddressID: " + addressID)

                                    let query = `\
                                    INSERT INTO orders (\n\
                                        purchaseDate,\n\
                                        customerID,\n\
                                        addressID,\n\
                                        transactionID\n\
                                    )\n\
                                    VALUES (\n\
                                        CURDATE(),\n\
                                        ${userID},\n\
                                        ${addressID},\n\
                                        ${transID}\n\
                                    )`


                                    con.connect(function (err) {
                                        if(err) throw err;
                                        con.query(query, function (err, result) {
                                            let orderID = result.insertId;
                                            
                                            //Add items to order and decrease product counts
                                            for(let i=0; i< unique.length; i++) {
                                                let object=unique[i];
                                                let query = `\
                                                INSERT INTO cartobjects (\n\
                                                    orderID,\n\
                                                    productID,\n\
                                                    count\n\
                                                )\n\
                                                VALUES (\n\
                                                    ${orderID},\n\
                                                    ${object},\n\
                                                    ${counts[i]}\n\
                                                )`
                                                console.log(counts[i]);
                                                console.log(counts);
                                                console.log(counts[0]);
                                                console.log(counts[1]);
                                                con.connect(function (err) {
                                                    if(err) throw err;
                                                    con.query(query, function(err, result) {
                                                        if(err) throw err;
                                                        let query = `\
                                                        UPDATE products\n\
                                                        SET count=count-${counts[i]}\n\
                                                        WHERE\n\
                                                            productID = ${object}`

                                                        con.connect(function (err) {
                                                            if(err) throw err;
                                                            con.query(query, function (err, result) {
                                                                console.log("kill me.");
                                                            })
                                                        })
                                                    })
                                                })
                                            }
                                        })
                                    })

                                })
                            })
                        })
                    })
                })
            })
            res.json({success: "Successfully placed order."})
        } catch(error) {
            res.json({Error: "Error.  Could not checkout."})
        }
    }
}