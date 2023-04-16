import mysql from 'mysql2';
import Valence from '../structures/Client';

export default async (client: Valence) => {
	return mysql.createConnection({
		database: "ShaHaN",
		host: 'localhost',
		user: client.config.dbUser,
		password: client.config.dbPassword
	})
}