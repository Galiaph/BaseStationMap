import mysql from "mysql2";
  
// create the connection to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'mobile',
  password: 'test',
  database: 'mobile'
});
 
export default db;