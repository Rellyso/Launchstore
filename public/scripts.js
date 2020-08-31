const inputPrice = document.querySelector('input[name="price"]')

inputPrice.addEventListener("keydown", (e) => {
    setTimeout(() => {
        let { value } = e.target

        value = value.replace(/\D/g, "")

        value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)

        e.target.value = value
    }, 1)
})

const Mask = {
    apply(input, func) {
        input.value = Mask[func](input.value) // == Mask.func(value)
    },
    format(value) {
        setTimeout(() => {
            value = value.replace(/\D/g, "")
    
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value / 100)
        }, 1)
    }
}

const photosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        photosUpload.input = event.target
        if (photosUpload.hasLimit(event)) return

        Array.from(fileList).forEach( file => {

            photosUpload.files.push(file)
            
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = reader.result

                const div = photosUpload.getContainer(image)                
                photosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        photosUpload.input.files = photosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = photosUpload
        const {files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos.`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite de fotos")
            event.preventDefault()
            return true
        }        

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        photosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        
        div.onclick = photosUpload.removePhoto
        
        div.appendChild(image)
        div.appendChild(photosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')

        button.classList.add('material-icons')
        button.innerHTML = "close"

        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(photosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        photosUpload.files.splice(index, 1)
        photosUpload.input.files = photosUpload.getAllFiles()

        photoDiv.remove();
    }
}