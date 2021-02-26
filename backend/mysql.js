import mysql from 'mysql';

// const mysqlConnection  = mysql.createConnection({
//     host            : 'localhost',
//     user            : 'root',
//     password        : 'Abcd@1234',
//     database        : 'tashmapossystemdb',
//     insecureAuth : true
//   });
  const mysqlConnection  = mysql.createConnection({
    host            : 'localhost',
    user            : 'admin',
    password        : 'admin',
    database        : 'tashma',
    insecureAuth : true
  });
export default mysqlConnection;