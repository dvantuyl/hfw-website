import 'focus-visible'
import 'alpinejs'
import { imageCarousel } from './carousel.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    imageCarousel.start()
    navigator.serviceWorker.register('/sw.js')
  })
}
