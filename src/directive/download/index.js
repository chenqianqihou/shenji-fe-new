import Vue from 'vue'
// 下载文件, value为方法,方法返回promise
Vue.directive('download', {
  bind(el, binding) {
    el.addEventListener('click', () => {
      const myPromise = binding.value
      if (typeof myPromise !== 'function' || el.disabled) {
        return false
      }
      el.disabled = true
      el.classList.add('is-disabled')
      myPromise(this).then(response => {
        setTimeout(() => {
          el.disabled = false
          el.classList.remove('is-disabled')
        }, 300)
        const { data, headers } = response
        const disposition = headers ? headers['content-disposition'] : ''
        const match = disposition.match(/filename=(.*)/i)
        if (!match) {
          console.error("filename doesn't exist")
          return false
        }
        let filename = decodeURIComponent(match[1].replace(/"/g, ''))
        if (el.getAttribute('filename')) {
          filename = el.getAttribute('filename')
        }
        const reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onload = (e) => {
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(data, filename)
          } else {
            const oLink = document.createElement('a')
            oLink.download = filename
            oLink.href = e.target.result
            document.body.appendChild(oLink)
            oLink.click()
            document.body.removeChild(oLink)
          }
        }
      })
    }, false)
  }
})
