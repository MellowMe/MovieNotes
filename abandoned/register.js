let http = require("http");
let mysql = require("mysql");

let connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mymysql",
    port: "3306",
    database: "movieNotes"
});

connection.connect();

http.createServer(function (request, response) {
    let whatis = request.url.substring(request.url.indexOf("?") + 1);
    let postData = "";
    let username;
    let password;

    request.on("data", (chunk) => {
        postData += chunk;
    });

    request.on("end", () => {
        postData = decodeURIComponent(postData);
        let filed = postData.split("&");
        username = filed[0].substring(filed[0].indexOf("=") + 1);
        password = filed[1].substring(filed[1].indexOf("=") + 1);
        if (whatis === "login") {
            let querySQL = `select * from users where username = '${username}' and password = '${password}'`;
            connection.query(querySQL, (err, result) => {
                if (err) {
                    response.writeHead(500, { "Content-Type": "text/plain;charset=utf-8" });
                    response.write("登录失败!服务器错误");
                    response.end();
                }
                else if (result.length===0) {
                    console.log("not exsit");
                    response.writeHead(400, { "Content-Type": "text/plain;charset=utf-8" });
                    response.write("登录失败!此用户不存在");
                    response.end();
                } else {
                    console.log(result);
                    response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
                    response.write("登录成功，但网站仍在搭建中......");
                    response.end();
                }
            });
        } else if (whatis === "register") {
            let insertSQL = `insert into users(username,password) values('${username}','${password}')`;
            console.log(insertSQL);
            connection.query(insertSQL, (err, result) => {
                if (err) {
                    console.log("wrong data");
                    response.writeHead(400, { "Content-Type": "text/plain;charset=utf-8" });
                    response.write("注册失败!用户名已存在");
                    response.end();
                } else {
                    console.log(result);
                    response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
                    response.write("注册成功!");
                    response.end();
                }
            });
        } else {
            console.log("bad url");
            response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
            response.write("网址错误");
            response.end();
        }

    });



}).listen(8080);