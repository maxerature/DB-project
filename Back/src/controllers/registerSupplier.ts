import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
  registersupplier: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // await AuthSchema.validateAsync(req.body);
      const { username,
        password,
        emailAddress,
        addr1,
        addr2,
        city,
        state,
        zipcode,
        phoneNumber,
        supplierName } = req.body;



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

      let query = `\
SELECT COUNT(*)\n\
FROM suppliers\n\
WHERE\n\
    username = \"${username}\"`

    con.connect(function(err) {
        if(err) throw err;
        con.query(query, function (err, result) {
            if(err) throw err;
            if(result[0][`COUNT(*)`] !=0) {
                console.log(result[0][`COUNT\(*\)`]);
                res.json({failed: "Error: Username already exists."});
            } else {
                console.log("sucess");
                let query = `\
                INSERT INTO suppliers (\n\
                    emailAddress,\n\
                    phoneNumber,\n\
                    supplierName,\n\
                    username,\n\
                    password\n\
                )\n\
                VALUES (\n\
                    \"${emailAddress}\",
                    ${phoneNumber},
                    \"${supplierName}\",
                    \"${username}\",
                    MD5(\"${password}\")
                )`;
                
                
                con.connect(function(err) {
                    if(err) throw err;
                    con.query(query, function(err, result) {
                        if(err) throw err;
                        if(!result) {
                            res.json({error: "Error: Registration failed."});
                        } else {
                            console.log(result);

                            let userId = result.insertId;
                            console.log("User ID: " + userId);
                            console.log("Address1: " + addr1 + "\nAddress2: " + addr2 + "\nCity: " + city + "\nState: " + state + "\nZipcode: " + zipcode);

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
                            VALUES (\n\
                                2,\n\
                                ${userId},\n\
                                "${addr1}",\n\
                                "${addr2}",\n\
                                "${city}",\n\
                                "${state}",\n\
                                "USA",\n\
                                ${zipcode},\n\
                                true\n\
                            )`

                            con.connect(function(err) {
                                if(err) throw err;
                                con.query(query, function(err, result) {
                                    if(err) throw err;
                                    res.json({success: "Successful registration."})
                                })
                            })
                        }
                    })
                })
            }
        })
    })
    } catch (error) {
      if (error.isJoi === true)
        return next(new createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },
};
