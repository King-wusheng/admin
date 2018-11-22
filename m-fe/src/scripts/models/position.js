const list = () => {
  return $.ajax({
    url: '/api/position/fe/list',
    success: (result) => {
      return result
    }
  })
}

const refresh = () => {
  return $.ajax({
    url: '/api/position/refresh',
    success: (result) => {
      return result
    }
  })
}

const loadmore = (pageNo) => {
  return $.ajax({
    url: '/lagou/listmore.json?pageNo='+ pageNo +'&pageSize=5',
    success: (result) => {
      return result
    }
  })
}

export default {
  list,
  refresh,
  loadmore
}