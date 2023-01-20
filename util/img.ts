
// only works in the browser
export const resizeImg = async (src: string, MAX_WIDTH: number = 300, MAX_HEIGHT: number = 300, type: string = 'image/png'): Promise<string> => {
  return await new Promise((resolve) => {
    const img = document.createElement('img')
    img.onload = function (event) {
      let width = img.width
      let height = img.height

      // Change the resizing logic
      if (width > height) {
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width)
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = width * (MAX_HEIGHT / height)
          height = MAX_HEIGHT
        }
      }
      // Dynamically create a canvas element
      const canvas = document.createElement('canvas')
      // var canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      // Actual resizing
      if (ctx != null) ctx.drawImage(img, 0, 0, width, height)
      // Show resized image in preview element
      const dataurl = canvas.toDataURL(type)
      setTimeout(() => img.remove(), 300)
      setTimeout(() => canvas.remove(), 300)
      resolve(dataurl)
    }
    img.src = src
  })
}
