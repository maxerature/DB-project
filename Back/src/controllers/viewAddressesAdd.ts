import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";
import { count } from "node:console";

export default {
    viewAddressesAdd: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup
            const {username, userType, addr1, addr2, city, state, zipcode} = req.body;

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

            //Set usertype number
            let userTypeNum = 0;
            let userTypeString = ``;
            if(userType == "customer") {
                userTypeNum = 0;
                userTypeString = `customers`
            } else if (userType == "employee" ) {
                userTypeNum = 1;
                userTypeString = `employees`
            } else {
                userTypeNum = 2;
                userTypeString = `suppliers`
            }

            //Set Query to get userID
            let query = `\
            SELECT ${userType}ID\n\
            FROM ${userTypeString}\n\
            WHERE\n\
                username = \"${username}\"`

            //Run Query
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function(err, result) {
                    if(err) throw err;
                    console.log(result)
                    let idGetString = `${userType}ID`
                    let id = result[0][idGetString];
                    console.log(id);
                    //Set Query to add addresses
                    let query = `\
                    INSERT INTO addresses (\n\
                        userType,\n\
                        userID,\n\
                        addressLine1,\n\
                        addressLine2,\n\
                        city,\n\
                        state,\n\
                        nation,\n\
                        zipcode,\n\
                        active\n\
                    )\n\
                    VALUES(\n\
                        ${userTypeNum},\n\
                        ${id},\n\
                        \"${addr1}\",\n\
                        \"${addr2}\",\n\
                        \"${city}\",\n\
                        \"${state}\",\n\
                        "USA",\n\
                        \"${zipcode}\",\n\
                        false\n\
                    )`
                    console.log(query);
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