import positionListTpl from '../views/position.list.html'
import positionSaveTpl from '../views/position.save.html'
import positionUpdateTpl from '../views/position.update.html'
import positionModel from '../models/position'

const _genToken = () => {
  return new Date().getTime() + Math.random()
}

const _bindListEvents = ({
  router,
  req,
  pageSize
}) => {
  // 给添加按钮绑定
  $('#addbtn').on('click', () => {
    router.go('/position_save')
  })

  // 给删除按钮绑定事件
  $('.pos-remove').on('click', function () {
    let that = this
    $(".remove_alert").css('display','block')
    $(".position_bg").css('display','block')
    $("#yes").on('click',function(){
      _removePosition({
        that,
        router,
        req,
        pageSize
      })
    })
    $("#no").on('click',function(){
      $(".remove_alert").css('display','none')
      $(".position_bg").css('display','none')
    })
    
  })

  // 给修改按钮绑定事件
  $('.pos-update').on('click', function () {
    let id = $(this).attr('posid')
    router.go('/position_update', {
      id
    })
  })

  $('.nav-tabs>li').on('click', function () {
    let keywords = $(this).text()
    if(keywords=='全部'){
      keywords=''
    }
    let query = {
      ...req.query,
      pageNo: 1,
      keywords,
      _: _genToken()
    }
    router.go(`/position?${$.param(query)}`)

  })

  // 给搜索按钮绑定事件
  $('#possearch').on('click', function () {
    let keywords = $('#keywords').val()
    let query = {
      ...req.query,
      pageNo: 1,
      keywords,
      _: _genToken()
    }
    router.go(`/position?${$.param(query)}`)
  })

  
}

const _removePosition = async ({
  that,
  router,
  req,
  pageSize
}) => {
  let id = $(that).attr('posid')
  let result = await positionModel.remove(id)
  if (result.ret) {
    let {keywords = '', pageNo} = req.query || {pageNo: 1}
    let total = (await positionModel.listall({keywords})).data.total
    let pageCount = Math.ceil(total / ~~pageSize)
    if (pageNo > pageCount && pageNo != 1) {
      pageNo = pageNo - 1
    }
    router.go(`/position?_=${id}&pageNo=${pageNo}&keywords=${keywords || ''}`)
  } else {
    alert('删除失败:(')
  }
}

const _bindSaveEvents = (router) => {
  // 给返回按钮绑定事件
  $('#posback').on('click', () => {
    router.back()
  })

  // 给提交按钮绑定事件
  $('#possubmit').on('click', async () => {
    let result = await positionModel.save()

    if (result.ret) {
      $('#possave').get(0).reset()
    } else {
      alert(result.data.msg)
    }
  })
}

const _bindUpdateEvents = (router) => {
  // 给返回按钮绑定事件
  $('#posback').on('click', () => {
    router.back()
  })

  // 给提交按钮绑定事件
  $('#possubmit').on('click',  () => {

    $(".update_alert").css('display','block')
    $(".position_bg").css('display','block')
    $("#yes").on('click', async function (){
      let result = await positionModel.update()
    if (result.ret) {
      router.back()
    } else {
      alert(result.data.msg)
    }
    })
    $("#no").on('click',function(){
      $(".update_alert").css('display','none')
      $(".position_bg").css('display','none')
    })


    
  })
}

const list = async ({
  router,
  res,
  req
}) => {
  let {
    pageNo = 1, pageSize = 5, keywords = ''
  } = req.query || {}

  let {
    total,
    list
  } = (await positionModel.list({
    pageNo,
    pageSize,
    keywords
  })).data

  let pageCount = Math.ceil(total / ~~pageSize)
  let html = template.render(positionListTpl, {
    list, // 列表数据源
    pageArray: new Array(pageCount), // 构造分页页码数组
    pageNo: ~~pageNo, // 当前页
    pageCount: ~~pageCount, // 总页数
    pageSize: ~~pageSize, // 每页条数
    keywords //关键字
  })
  // console.log(keywords)

  res.render(html)

  // 添加，修改，删除 按钮的事件绑定
  _bindListEvents({
    router,
    req,
    pageSize
  })
}

const save = ({
  router,
  req,
  res,
  next
}) => {

  // let html = template.render(positionSaveTpl, {
  //   data: req.keywors
  // })

  // res.render(html)
  res.render(positionSaveTpl)

  _bindSaveEvents(router)
}

// 渲染修改页面
const update = async ({
  router,
  req,
  res,
  next
}) => {
  let id = req.body.id

  let html = template.render(positionUpdateTpl, {
    data: (await positionModel.listone(id)).data
  })

  res.render(html)

  _bindUpdateEvents(router)
}

export default {
  list,
  save,
  update,
  
}