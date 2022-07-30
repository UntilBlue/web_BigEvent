$(function() {
    // 点击“去注册账号”的链接
    $("#link_reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });

    // 点击“去登录”的链接
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });

    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 自定义校验规则
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // 校验注册账号时,两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致！";
            }
        },
    });
});

const form_reg = document.getElementById("form_reg");
const form_login = document.getElementById("form_login");

function resolveData(data) {
    var arr = [];
    for (var k in data) {
        arr.push(k + "=" + data[k]);
    }
    return arr.join("&");
}

form_reg.addEventListener("submit", function(e) {
    e.preventDefault();
    var data = {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),
    };
    // 拼接查询字符串
    var qs = resolveData(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://www.liulongbin.top:3007/api/reguser");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(qs);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var res = JSON.parse(xhr.responseText);
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg("注册成功，请登录！");
            // 模拟人的点击行为
            $("#link_login").click();
        }
    };
});

form_login.addEventListener("submit", function(e) {
    e.preventDefault();
    $.ajax({
        url: "/api/login",
        method: "POST",
        // 快速获取表单中的数据
        data: $(this).serialize(),
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg("登录失败！");
            }
            layer.msg("登录成功！");
            // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem("token", res.token);
            // 跳转到后台主页
            location.href = "/index.html";
        },
    });
});