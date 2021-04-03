import * as dotenv from 'dotenv'
dotenv.config()

const SERVER_PORT = process.env.PORT || 5000
const MYSQL_DB_NAME = process.env.MYSQL_DB_NAME || ''
const MYSQL_DB_USERNAME = process.env.MYSQL_DB_USERNAME || ''
const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD || ''
const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST || ''

export default {
	server: {
		PORT: SERVER_PORT
	},
	DataBase: {
		MYSQL_DB_NAME: MYSQL_DB_NAME,
		MYSQL_DB_USERNAME: MYSQL_DB_USERNAME,
		MYSQL_DB_PASSWORD: MYSQL_DB_PASSWORD,
		MYSQL_DB_HOST: MYSQL_DB_HOST
	}
}
