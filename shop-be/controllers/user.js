const bcrypt = require('bcrypt')

const userModel = require('../models/user')

const signup = async (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')

  let {username,password} = req.body

  let isSigned = !!(await userModel.findone({
    username
  }))

  if (isSigned) {
    res.render('user', {
      ret: true,
      data: JSON.stringify({
        msg: '用户名已经存在！'
      })
    })
  } else {
    let result = await userModel.signup({
      username,
      password
    })
    if (!!result) {
      res.render('user', {
        ret: true,
        data: JSON.stringify({
          msg: '注册成功~'
        })
      })
    }
  }
}

// 登录
const signin = async (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')

  let {password, username} = req.body
  // 1、密码比对
  let result = await userModel.findone({
    username
  })

  if (!!result) {
    // let isPasswordCorrect = await _comparePwd(password, result.password)
    // 2、用户名和密码合并判断
    if (password === result.password && username === result.username) {
      // sesstion 处理
      req.session.username = result.username

      res.render('user', {
        ret: true,
        data: JSON.stringify({
          username: result.username
        })
      })
    } else {
      res.render('user', {
        ret: false,
        data: JSON.stringify({
          msg: '用户名或密码错误~'
        })
      })
    }
  } else {
    res.render('user', {
      ret: false,
      data: JSON.stringify({
        msg: '用户名或密码错误~'
      })
    })
  }
}

const isSignin = (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')

  let username = req.session.username
  if (!!username) {
    res.render('user', {
      ret: true,
      data: JSON.stringify({
        username
      })
    })
  } else {
    res.render('user', {
      ret: false,
      data: JSON.stringify({
        msg: '没有权限!'
      })
    })
  }
}

// 用户登出
const signout = (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')

  req.session.username = null
  
  res.render('user', {
    ret: true,
    data: JSON.stringify({
      msg: '退出成功~'
    })
  })
}



module.exports = {
  signup,
  signin,
  isSignin,
  signout
}