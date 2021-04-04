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
            const {unique, counts, tType, tnum, username} = req.body;
            console.log(unique);
            console.log(counts);

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
                    paidWDebit\n\
                )\n\
                VALUES (\n\
                    false,\n\
                    true,\n\
                    false,\n\
                    false\n\
                )`
            } else if(tType == "card") {
                query = `\
                INSERT INTO Transactions (\n\ 
                    transactionComplete,\n\
                    paidWCheck,\n\
                    paidWCredit,\n\
                    paidWDebit,\n\
                    cardNumber\n\
                )\n\
                VALUES (\n\
                    false,\n\
                    false,\n\
                    true,\n\
                    false,\n\
                    ${tnum}\n\
                )`
            } else {
                query = `\
                INSERT INTO Transactions (\n\ 
                    transactionComplete,\n\
                    paidWCheck,\n\
                    paidWCredit,\n\
                    paidWDebit,\n\
                    bankNumber\n\
                )\n\
                VALUES (\n\
                    false,\n\
                    false,\n\
                    false,\n\
                    true,\n\
                    ${tnum}\n\
                )`
            }

            console.log(query);
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function (err, result) {
                    if(err) throw err;
                    console.log(result);
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
                            console.log(result);
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

                                    console.log(query);

                                    con.connect(function (err) {
                                        if(err) throw err;
                                        con.query(query, function (err, result) {
                                            console.log(result);
                                            let orderID = result.insertId;
                                            
                                            //Add items to order and decrease product counts
                                            let count=0;
                                            for(let object of unique) {
                                                let query = `\
                                                INSERT INTO Cartobjects (\n\
                                                    orderID,\n\
                                                    productID\n\
                                                )\n\
                                                VALUES (\n\
                                                    ${orderID},\n\
                                                    ${object}\n\
                                                )`
                                                con.connect(function (err) {
                                                    if(err) throw err;
                                                    con.query(query, function(err, result) {
                                                        if(err) throw err;
                                                        let query = `\
                                                        UPDATE Products\n\
                                                        SET count=count-${counts[count]}\n\
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
                                            res.json({success: "Successfully placed order."})
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

        } catch(error) {
            res.json({Error: "Error.  Could not checkout."})
        }
    }
}