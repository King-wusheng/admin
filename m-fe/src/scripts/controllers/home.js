import homeTpl from '../views/home.html'

const render = () => {
  document.querySelector('#root').innerHTML = homeTpl
  changeTab()
}

const changeTab = () => {
  let pages = ['/index.html', '/search.html', '/profile.html']
  let index = pages.indexOf(location.pathname === '/' ? '/index.html' : location.pathname)
  $('nav li').eq(index).addClass('active').siblings().removeClass('active')
  $('nav li').on('tap', function () {
    location.href = pages[$(this).index()]
  })
}

export default {
  render
}