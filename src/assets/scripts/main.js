import 'focus-visible'
import 'alpinejs'
import { ImageCarousel } from './image-carousel.js'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    ImageCarousel.load()
    navigator.serviceWorker.register('/sw.js')
  })
}
