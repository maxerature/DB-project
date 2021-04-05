import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
    supplierProductsViewReorder: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Setup mysql
            const {id, count} = req.body;

            var mysql = require('mysql2');
            var con = await mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "password",
                port: 3306,
                database: "databaseproject"
            });

            //Setup query to update counts
            let query = `\
            UPDATE Products\n\
            SET count=count+${count}\n\
            WHERE\n\
                productID = ${id}`

            con.connect(function (err) {
                if(err) throw err;
                con.query(query, function (err, result) {
                    if(err) throw err;

                    res.json({Success: "success"});
                })
            })

        } catch (error) {
            res.json({Error: "Error. Could not load products."})
        }
    }
}