import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";
import { count } from "node:console";

export default {
    viewAddressesGet: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup
            const {username, userType} = req.body;

            var mysql = require('mysql2');
            const foreignHost = "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com";
            const localHost = "localhost";
            const hostUsed = foreignHost;
            var con = await mysql.createConnection({
                host: hostUsed,
                user: "root",
                password: "databaseproject",
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

            //Set Query
            let query = `\
            SELECT \n\
                addressID,\n\
                addressLine1,\n\
                addressLine2,\n\
                city,\n\
                state,\n\
                zipcode,\n\
                active\n\
            FROM (addresses, ${userTypeString})\n\
            WHERE\n\
                userType = ${userTypeNum}\n\
                AND ${userTypeString}.${userType}ID = addresses.userID\n\
                AND ${userTypeString}.username = \"${username}\";`;

            //Run query
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function(err, result) {
                    if(err) throw err;
                    let divString = `\
                    <table class="blueTable">\n\
                        <tr>\n\
                            <th>Address</th>\n\
                            <th>Active?</th>\n\
                            <th>Set Active</th>\n\
                        </tr>\n`

                    for(let i=0; i<result.length; i++) {
                        let address = result[i];
                        let active = ``;
                        if(address.active == 1) {
                            active = `Yes`
                        } else {
                            active = `No`
                        }
                        divString += `\
                        <tr>\n\
                            <th><p>${address.addressLine1},</p>\n\
                                <p>${address.addressLine2},</p>\n\
                                <p>${address.city}, ${address.state}, ${address.zipcode}</p>\n\
                            </th>\n\
                            <th>${active}</th>\n\
                            <th><button type="button" id="setActive${i}" onclick="setActive(${address.addressID})">Set Active</button></th>\n\
                        </tr>\n`
                    }
                    divString += `</table>`
                    res.json({success: divString});
                })
            })


        } catch(error) {
            res.json({error: "Error.  Could not get addresses."})
        }
    }
}