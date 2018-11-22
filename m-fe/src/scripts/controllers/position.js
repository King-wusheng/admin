import positionTpl from '../views/position.html'
import positionListTpl from '../views/position-list.html'
import positionModel from '../models/position'

var datasource = []
var pageNo = 2

const render = async () => {
  $('main').html(positionTpl)
  let list = datasource = (await positionModel.list()).data.list
  await renderList(list)
  scroll()
}

const scroll = () => {
  let posScroll = new BScroll('main', {
    probeType: 2,
    startY: -40
  })

  let head = $('.head img'),
      foot = $('.foot img')

  posScroll.on('scroll', function () {
    let y = this.y,
        maxY = this.maxScrollY - y
    
    if ( y >= 0) {
      head.addClass('up')
    }

    if (maxY >= 0) {
      foot.addClass('down')
    }
  })

  posScroll.on('scrollEnd', async function () {
    let y = this.y,
        maxY = this.maxScrollY - y

    if (y >= -40 && y < 0) {
      this.scrollTo(0, -40)
    } else if (y >= 0) {
      head.attr('src', 'http://localhost:6677/images/ajax-loader.gif')

      let result = await positionModel.refresh()
      let list = datasource = [
        ...result.content.data.page.result,
        ...datasource
      ]
      renderList(list)

      this.refresh()
      head.attr('src', 'http://localhost:6677/images/arrow.png')
          .removeClass('up')
      this.scrollTo(0, -40)
    }

    if (maxY >= -40 && maxY < 0) {
      this.scrollTo(0, this.maxScrollY + 40)
    } else if (maxY >= 0) {
      foot.attr('src', 'http://localhost:6677/images/ajax-loader.gif')

      let result = await positionModel.loadmore(++pageNo)
      let list = datasource = [
        ...datasource,
        ...result.content.data.page.result
      ]
      renderList(list)

      this.refresh()
      foot.attr('src', 'http://localhost:6677/images/arrow.png')
          .removeClass('down')
      this.scrollTo(0, this.maxScrollY + 40)
      
    }
  })
}

const renderList = async (list) => {
  let template = Handlebars.compile(positionListTpl)
  let html = template({ list })
  $('#poslist').html(html)
}

export default {
  render
}