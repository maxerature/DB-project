import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
    supplierProductsViewDelete: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup mysql
            const {id} = req.body;

            var mysql = require('mysql2');
            var con = await mysql.createConnection({
                host: "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com",
                user: "root",
                password: "databaseproject",
                port: 3306,
                database: "databases_project"
            });

            //Setup query to update counts
            let query = `\
            DELETE FROM products\n\
            WHERE\n\
                productID = ${id}`

            console.log(query);

            con.connect(function (err) {
                if(err) throw err;
                con.query(query, function (err, result) {
                    if(err) throw err;

                    res.json({Success: "success"});
                })
            })

        } catch (error) {
            res.json({Error: "Error. Could not delete product."})
        }
    }
}