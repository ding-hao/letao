var leTao=null;
$(function(){
    //创建实例化对象
    leTao = new LeTao();
    leTao.login();
})
//创建一个构造函数
function LeTao(){

}
//点出原型,添加方法
LeTao.prototype = {
    login:function(){
        //点击确认按钮
        $(".mui-btn-primary").on("click",function(){
            
            //如果没输入就提示
            if(!$("input[type=text").val()){
               //弹出框
               mui.toast('请输入用户名',{ duration:'long', type:'div' }) 
                
            }
            if(!$("input[type=password]").val()){
                //弹出框
            mui.toast('请输入密码',{ duration:'long', type:'div' }) 
            }
            //获取 用户名
            var username = $("input[type=text").val();
            //获取 密码
            var password = $("input[type=password]").val();
            $.ajax({
                url:"/user/login",
                type:"post",
                data:{
                    username:username,
                    password:password,
                },
                success:function(data){
                    console.log(data);
                    if(data.error){
                        //弹出框
            mui.toast(data.message,{ duration:'long', type:'div' }) 
                        
                    }else{
                        window.location.href = "user.html";
                    }
                    
                }
            })
            
        })
        

       
        
        
    },

}