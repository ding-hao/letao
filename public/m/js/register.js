var leTao;
$(function(){
    //创建实例
    leTao = new LeTao();
    //调用获取验证码方法
    leTao.getVcode();
    //调用注册方法
    leTao.getRegister();
})
//构造函数
function LeTao(){

}
//点出原型,方法
LeTao.prototype = {
    getVcode:function(){
        //点击获取验证码
        $(".mui-input-group .Vcode").on("click",function(){
            $.ajax({
                url:"/user/vCode",
                success:function(data){
                    console.log(data);

                    
                }
            })
            
        })

        
        
    },


    getRegister:function(){
        //点击注册
        $(".mui-input-group .last .mui-btn").on("click",function(){

            
            //获取到用户信息
            var username = $(".username").val();
            var mobile = $(".mobile").val();
            var password = $(".password").val();
            var password2 = $(".password2").val();
            var vCode = $(".vCode").val();
            //判断非空
            if(!username){
                //弹出提示框
                mui.toast('请输入用户名',{ duration:'long', type:'div' }) 
                return;
            }
            if(!mobile){
                //弹出提示框
                mui.toast('请输入手机号',{ duration:'long', type:'div' }) 
                return;
            }
            if(!password){
                //弹出提示框
                mui.toast('请输入密码',{ duration:'long', type:'div' }) 
                return;
            }
            if(!password2){
                //弹出提示框
                mui.toast('请输入确认密码',{ duration:'long', type:'div' }) 
                return;
            }
            if(!vCode){
                //弹出提示框
                mui.toast('请输入验证码',{ duration:'long', type:'div' }) 
                return;
            }
            //判断两次密码是否一致
            if(password != password2){
                //弹出提示框
                mui.toast('两次密码不一致',{ duration:'long', type:'div'})
                return;
            }
            
            $.ajax({
                url:"/user/register",
                type:"post",
                data:{
                    username:username,
                    mobile:mobile,
                    password:password,
                    vCode:vCode
                },
                success:function(data){
                    console.log(data);
                    if(data.success){
                        window.location.href="login.html";
                    }
                    
                }
            })
            
            
            
        })
    }
}