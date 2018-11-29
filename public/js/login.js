const md5 = require("md5.js");

document.getElementById("register").onclick = function () {
    document.getElementById("loginPanel").style.display = "none";
    document.getElementById("registerPanel").style.display = "block";
};
document.getElementById("back2login").onclick = function () {
    document.getElementById("loginPanel").style.display = "block";
    document.getElementById("registerPanel").style.display = "none";
};

document.getElementById("signupBtn").onclick = function () {
    let name = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let pswConfirm = document.getElementById("pswConfirm").value;
    if (password != pswConfirm) {
        alert("密码输入前后不一致，请重新输入！");
    } else {
        let data = new FormData();
        data.append("username", name);
        data.append("password", password);
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    document.getElementById("password").value = "";
                    document.getElementById("pswConfirm").value = "";
                    document.getElementById("back2login").click();
                    window.alert(request.responseText);
                }
            }
        };
        request.open("post", "http://localhost:3000/signup");
        request.send(data);
    }
}

