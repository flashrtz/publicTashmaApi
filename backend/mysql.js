import mysql from 'mysql';
const {DB_HOST,DB_DATABASE,DB_USER,DB_PASS} = process.env

// const mysqlConnection  = mysql.createConnection({
//     host            : 'localhost',
//     user            : 'root',
//     password        : 'Abcd@1234',
//     database        : 'tashmapossystemdb',
//     insecureAuth : true
//   });
  // const mysqlConnection  = mysql.createConnection({
  //   host            : 'localhost',
  //   user            : 'admin',
  //   password        : 'admin',
  //   database        : 'tashmapossystem',
  //   insecureAuth : true
  // });
   const mysqlConnection  = mysql.createConnection({
    host            : DB_HOST,
    user            : DB_USER,
    password        : DB_PASS,
    database        : DB_DATABASE,
    insecureAuth : true
  });
export default mysqlConnection;