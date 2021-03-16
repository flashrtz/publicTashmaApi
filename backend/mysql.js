import mysql from 'mysql';

  // const mysqlConnection  = mysql.createConnection({
  //   host            : 'localhost',
  //   user            : 'admin',
  //   password        : 'admin',
  //   database        : 'tashmapossystem',
  //   insecureAuth : true
  // });

   const mysqlConnection  = mysql.createConnection({
    host            : '45.77.42.114',
    user            : 'admin',
    password        : 'admin',
    database        : 'tashmapossystem',
    insecureAuth : true
  });
export default mysqlConnection;