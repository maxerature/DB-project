import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";
import { count } from "node:console";

export default {
    viewAddressesSet: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup
            const {username, userType, num} = req.body;

            var mysql = require('mysql2');
            var con = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "password",
                port: 3306,
                database: "databaseproject"
            });

            //Set usertype number
            let userTypeNum = 0;
            let userTypeString = ``;
            if(userType == "customer") {
                userTypeNum = 0;
                userTypeString = `Customers`
            } else if (userType == "employee" ) {
                userTypeNum = 1;
                userTypeString = `Employees`
            } else {
                userTypeNum = 2;
                userTypeString = `Suppliers`
            }

            //Set Query to unset all addresses
            let query = `\
            UPDATE (
                Addresses,
                ${userTypeString}\n\
                )\n\
            SET active = false\n\
            WHERE
                userType = ${userTypeNum}\n\
                AND ${userTypeString}.${userType}ID = Addresses.userID\n\
                AND ${userTypeString}.username = \"${username}\";`

            //Run query
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function(err, result) {
                    if(err) throw err;

                    //Set desired address as active.
                    query = `\
                    UPDATE Addresses \n\
                    SET addresses.active = true\n\
                    WHERE\n\
                        addressID = ${num}`


                    //Run query
                    con.connect(function(err) {
                        if(err) throw err;
                        con.query(query, function(err, result) {
                            if(err) throw err;
        
                            res.json({success: "Successfully updated active address"})
                            
                        })
                    })
                })
            })


        } catch(error) {
            res.json({error: "Error.  Could not get addresses."})
        }
    }
}