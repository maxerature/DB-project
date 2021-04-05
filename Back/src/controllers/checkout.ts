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

            //Connect to sql
            var mysql = require('mysql2');

            var con = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "password",
                port: 3306,
                database: "databaseproject"
            });

            //Create Transaction
            //Setup numbers

            //Set query
            let query = ``;
            if(tType == "check") {
                query = `\
                INSERT INTO Transactions(\n\ 
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
                INSERT INTO Transactions (\n\ 
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
                INSERT INTO Transactions (\n\ 
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
                    SELECT CustomerID\n\
                    FROM Customers\n\
                    WHERE\n\
                        username = \"${username}\";`

                    con.connect(function(err) {
                        if(err) throw err;
                        con.query(query, function (err, result) {
                            let userID = result[0].CustomerID;

                            //Get user address
                            let query = `\
                            SELECT AddressID\n\
                            FROM Addresses\n\
                            WHERE\n\
                                userID = ${userID};`

                            con.connect(function (err) {
                                if(err) throw err;
                                con.query(query, function (err, result) {
                                    let addressID = result[0].AddressID;

                                    let query = `\
                                    INSERT INTO Orders (\n\
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
                                                INSERT INTO Cartobjects (\n\
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
                                                        UPDATE Products\n\
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




                    // let query = `\
                    // INSERT INTO Orders\n\
                    //     purchaseDate,
                    //     customerID`
                })
            })
            res.json({success: "Successfully placed order."})
        } catch(error) {
            res.json({Error: "Error.  Could not checkout."})
        }
    }
}