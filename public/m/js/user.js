var leTao;
$(function(){
    //创建实例
    leTao = new LeTao();
    leTao.getData();
    leTao.loginOut();

})
//创建构造函数
function LeTao(){

}

//点出原型
LeTao.prototype = {

    // 获取到用户数据
    getData:function(){
        $.ajax({
            url:"/user/queryUserMessage",
            success:function(data){
                console.log(data);
                var html = template("userInfoTemp",data);
                
                $("#main .usericon").html(html);
            }
        })
        
    },
    //点击退出登录
    loginOut:function(){
        $("#main .btn").on("click",function(){
            $.ajax({
                url:"/user/logout",
                success:function(data){
                    window.location.href="login.html";
                    
                }
            })
            
        })
    }
}
