const htmlTpl = require('../views/home.html')
const html1Tpl = require('../views/home1.html')
const html2Tpl = require('../views/home2.html')
import userModel from '../models/user'

const render=async({router,req,res,next})=>{
    let result = await userModel.isSignin()
    
    let isSignin = result.ret
    if (isSignin==false) {
        
       let html = template.render(htmlTpl,{
          show:true
       })
      $('.root').html(html1Tpl)
    }else{
        $('.root').html(html2Tpl)
    }
    
    $("#home_Signin").on('click',function(){
        $("#userform").css("display","block")
    })
    
    $("#home_position").on("click",()=>{
        router.go("/position")
    })

    $('#home_Signin').on('click',()=>{
        $('#home_user>ul').css("display","block")
        $('.bg').css("display","block")
    })

    $('#home_user>ul>li .pull-left').on('click',()=>{
        $('#home_user>ul').css("display","none")
        $('.bg').css("display","none")
    })
    _bindUserInfoEvents()
}

let signupClicked = true
const _bindUserInfoEvents = () => {
    $('#sign1').on('click', async function () {
        let url = '/api/user/signin'
        let data = $('#userform1').serialize()
        console.log(data)
        let result = await userModel.sign({
          url,
          data
        })
  
        // 用户登录或注册成功处理
        if (signupClicked) {
          alert('登录成功')
          location.reload()
        } else {
          if (result.ret) {
            isSignin = true
            console.log(result.data)
          } else {
            alert(result.data.msg)
          }
          location.reload()
        }
      })
}
export default {
    render
  }
