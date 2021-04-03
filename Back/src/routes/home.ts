import express from 'express'
import Config from '../config/enviormentVariables'
import Settings from '../settings.json'
import LoginController from '../controllers/login'
import RegisterController from '../controllers/register'
import MProfileController from '../controllers/manageProfile'
import FuelQuoteController from '../controllers/fuelQuote'
import FuelRequestController from '../controllers/fuelQuoteRequest'
import FuelSubmitController from '../controllers/submitQuote'
import HistoryController from '../controllers/history'


export const HomeRoutes = express.Router()

HomeRoutes.get('/', async (req, res, next) => {
	res.send({
		name: Settings.ProjectName,
		version: Settings.ProjectVersion,
		port: Config.server.PORT
	})
})

HomeRoutes.post('/login', LoginController.login)


// Add routes using above syntax
