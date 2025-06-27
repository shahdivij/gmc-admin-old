const imageToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
})

const dataURItoBlob = dataURI => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

const isValidCarRegistrationNumber = (registrationNumber) => {
    // const pattern = RegExp('[a-zA-A]{1,1}[a-zA-A]{1,1}[0-9]{1,1}[0-9]{1,1}[a-zA-A]{1,1}[a-zA-A]{1,1}[0-9]{1,1}[0-9]{1,1}[0-9]{1,1}[0-9]{1,1}')
    const pattern = /\b[a-zA-Z]{2}\d{2}[a-zA-Z]{2}\d{4}\b/g
    return pattern.test(registrationNumber)
}


const setPagination = (data, recordsPerPage=10) => {
    let pages = data.length / recordsPerPage
    const remainder = data.length % recordsPerPage
    if(remainder > 0) 
        pages += 1

    const paginatedData = []

    let page = 1
    for(let i = 0; i < data.length;){
        
        const dataObject = {
            page: page,
            data: [...data.slice(i, i + recordsPerPage)]
        }

        paginatedData.push(dataObject)

        i += recordsPerPage
        page += 1
    }

    return [{
        pages: pages,
        data: paginatedData
    }]
}


const isValidEmail = (email) => {
    return String(email)
    .toLowerCase()
    .match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const isValidMobileNumber = (mobile_number) => {
    return /^\d{10}$/.test(mobile_number)
}

export {
    imageToBase64,
    dataURItoBlob,
    isValidCarRegistrationNumber,
    setPagination,
    isValidEmail,
    isValidMobileNumber
}