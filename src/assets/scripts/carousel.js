import EmblaCarousel from 'embla-carousel'

export const imageCarousel = {
  start: () => {
    const wrap = document.querySelector('.carousel')
    const viewPort = wrap.querySelector('.carousel__viewport')
    const prevBtn = wrap.querySelector('.carousel__button--prev')
    const nextBtn = wrap.querySelector('.carousel__button--next')
    const carousel = EmblaCarousel(viewPort, { loop: true })
    const autoplayer = autoplay(carousel, 4000)
    const disablePrevAndNextBtns = disablePrevNextBtns(
      prevBtn,
      nextBtn,
      carousel
    )

    listenForPrevBtnClick(prevBtn, carousel, autoplayer)
    listenForNextBtnClick(nextBtn, carousel, autoplayer)

    carousel.on('select', disablePrevAndNextBtns)
    carousel.on('init', disablePrevAndNextBtns)

    carousel.on('pointerDown', autoplayer.stop)
    carousel.on('init', autoplayer.play)
    return 'ok'
  },
}

const autoplay = (carousel, interval) => {
  let timer = 0

  const play = () => {
    stop()
    requestAnimationFrame(() => (timer = window.setTimeout(next, interval)))
  }

  const stop = () => {
    window.clearTimeout(timer)
    timer = 0
  }

  const next = () => {
    if (carousel.canScrollNext()) {
      carousel.scrollNext()
    } else {
      carousel.scrollTo(0)
    }
    play()
  }

  return { play, stop }
}

const listenForPrevBtnClick = (btn, carousel, autoplayer) => {
  const scrollPrev = () => {
    autoplayer.stop()
    carousel.scrollPrev()
  }
  btn.addEventListener('click', scrollPrev, false)
}

const listenForNextBtnClick = (btn, carousel, autoplayer) => {
  const scrollNext = () => {
    autoplayer.stop()
    carousel.scrollNext()
  }
  btn.addEventListener('click', scrollNext, false)
}

const disablePrevNextBtns = (prevBtn, nextBtn, carousel) => {
  return () => {
    if (carousel.canScrollPrev()) prevBtn.removeAttribute('disabled')
    else prevBtn.setAttribute('disabled', 'disabled')

    if (carousel.canScrollNext()) nextBtn.removeAttribute('disabled')
    else nextBtn.setAttribute('disabled', 'disabled')
  }
}
