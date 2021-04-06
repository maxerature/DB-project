import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
    loadMainPage: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const {userType} = req.body;

            let userTypeNum = 0;
            let userTypeString = ``;
            if(userType == "customer") {
                userTypeNum = 0;
                userTypeString = `Customers`
            } else if (userType == "employee" ) {
                userTypeNum = 1;
                userTypeString = `Employees`
            } else if (userType == "supplier") {
                userTypeNum = 2;
                userTypeString = `Suppliers`
            } else {
                userTypeNum = -1;
            }

            let divString = ``;
            if(userTypeNum == 0) {
                divString = `
                <div class="bigNav">
                    <div class="bigNavButton" onclick="window.location='productsListing.html'">
                        Buy our products!
                    </div>
                    <div class="bigNavButton" onclick="window.location='viewAddresses.html'">
                        Change your address
                    </div>
                    <div class="bigNavButton" onclick="window.location='purchaseHistory.html'">
                        View order history
                    </div>
                    <button type="button" id="logout" class="logoutButton" onclick="logout()"><h3>Log Out</h3></button>
                </div>`
            } else if(userTypeNum == 1) {
                divString = `
                <div class="bigNav">
                    <div class="bigNavButton" onclick="window.location='viewAddresses.html'">
                        Change your address
                    </div>
                    <div class="bigNavButton" onclick="window.location='viewUsers.html'">
                        View users
                    </div>
                    <button type="button" id="logout" class="logoutButton" onclick="logout()"><h3>Log Out</h3></button>
                </div>`
            } else if(userTypeNum == 2) {
                divString = `
                <div class="bigNav">
                    <div class="bigNavButton" onclick="window.location='viewAddresses.html'">
                        Change your address
                    </div>
                    <div class="bigNavButton" onclick="window.location='supplierProductsView.html'">
                        View your products
                    </div>
                    <div class="bigNavButton" onclick="window.location='createProduct.html'">
                        Add a product
                    </div>
                    <button type="button" id="logout" class="logoutButton" onclick="logout()"><h3>Log Out</h3></button>
                </div>`
            } else {
                divString = `
                <div class="bigNav">
                    <div class="bigNavButton" onclick="window.location='login.html'">
                        <h3>Login</h3>
                    </div>
                    <div class="bigNavButton" onclick="window.location='register.html'">
                        <h3>Register</h3>
                    </div>
                </div>`
                
            }

            res.json({success: divString})

            
        } catch (error) {
            res.json({error: "Error.  Cannot create product!"});
        }
    }
}