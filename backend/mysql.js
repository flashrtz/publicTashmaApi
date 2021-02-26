import mysql from 'mysql';

// const mysqlConnection  = mysql.createConnection({
//     host            : 'localhost',
//     user            : 'root',
//     password        : 'Abcd@1234',
//     database        : 'tashmapossystemdb',
//     insecureAuth : true
//   });
  const mysqlConnection  = mysql.createConnection({
    host            : 'bwjrexb8cb4ttqjsopm5-mysql.services.clever-cloud.com',
    user            : 'ukulqau5jdbrgpi1',
    password        : '9uUO1KoeFiDBy6JTfOYC',
    database        : 'bwjrexb8cb4ttqjsopm5',
    insecureAuth : true
  });
export default mysqlConnection;