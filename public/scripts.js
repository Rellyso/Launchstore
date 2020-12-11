const Mask = {
    apply(input, func) {
        setTimeout(() => {
            input.value = Mask[func](input.value) // == Mask.func(value)
        }, 1)
    },
    formatBRL(value) {
            value = value.replace(/\D/g, "")

            value = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value / 100)

            return value
    },
    cpfCnpj(value) {
        value = value.replace(/\D/g, "")

        // check if is cpf or cnpj

        if (value.length > 14) value = value.slice(0, -1)

        if (value.length > 11) {
            //cnpj -> 11222333000111

            // 11.222.333/0001-11
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d)/, "$1-$2")


        } else {
            //cpf -> 11122233344

            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value;
    },
    cep(value) {
        value = value.replace(/\D/g, "")

        if (value.length > 8) 
            value = value.slice(0, -1)

        value = value.replace(/(\d{5})(\d)/, "$1-$2")
        
        
        return value
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

        Array.from(fileList).forEach(file => {

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
        const { files: fileList } = input

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
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name=removed_files]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const imageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    preview: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        imageGallery.preview.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        imageGallery.highlight.src = target.src
        lightBox.image.src = target.src

    }
}

const lightBox = {
    target: document.querySelector('.highlight .lightbox-target'),
    image: document.querySelector('.highlight .lightbox-target img'),
    closeButton: document.querySelector('.lightbox-close'),
    open() {
        lightBox.target.style.top = 0
        lightBox.target.style.opacity = 1
        lightBox.closeButton.style.top = 0
    },
    close() {
        setTimeout(() => {
            lightBox.target.style.top = "-100%"
        }, 401)
        lightBox.target.style.opacity = 0
        lightBox.closeButton.style.top = "-80px"
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value) // == validate.func(value)

        input.value = results.value

        if (results.error) {
            Validate.displayError(input, results.error)
        }

        // focar no campo, manter foco no input 
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error

        input.parentNode.appendChild(div)

        input.focus()
    },
    clearErrors(input) {
        const divError = input.parentNode.querySelector('.error')

        if (divError)
            divError.remove('error')
    },
    isEmail(value) {
        let error = null

        // ^ -> iniciar com
        // () -> grupo, conjunto
        // [] -> agrupamento de caracteres
        // ? -> deixar expressão (ou agrupamento de expressões) facultativa
        // + -> repetir expressão 1 ou + vezes
        // * -> pode ter nenhum ou muitos (de 0 pra cima)
        // {2,3} -> pode ter 2 ou 3 caracteres
        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        // match() -> string tem que coincidir com uma expressão regular
        if (!value.match(mailFormat) && value.length > 0)
            error = "Email inválido"

        return {
            error,
            value
        }
    },
    isCpfCnpj(value) {
        let error = null

        const cleanValues = value.replace(/\D/g, "")

        if (cleanValues.length > 11 && cleanValues.length !== 14) {
            error = "CNPJ incorreto"
        } else if (cleanValues.length < 12 && cleanValues.length !== 11 && cleanValues.length !== 0) {
            error = "CPF incorreto"
        }

        return {
            error,
            value
        }
    },
    isCep(value) {
        let error = null
    
        const cleanValues = value.replace(/\D/g, "")

        if (cleanValues.length !== 8 && cleanValues.length !== 0) 
            error = "CEP inválido"
        
        
        return {
            error,
            value
        }
    },
    allFields(e) {
        const items = document.querySelectorAll('.item input, .item select, .item textarea')

        for (let item of items) {
            if (item.value == '') {
                const message = document.createElement('div')
                message.classList.add('messages')
                message.classList.add('error')
                message.innerHTML = 'Todos os campos são obrigatórios.'
                document.querySelector('body').appendChild(message)
                
                e.preventDefault()
                break
            }
        }
    }
}