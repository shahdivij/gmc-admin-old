export const GET = async (url, header = {}) => {
    const returnObject = {
        data: null,
        error: null
    }
    
    const options = {
        method: "GET",
        headers: {
            ...header
        }
    }
    try {
        const request = await fetch(url, options)
        const response = await request.json()
        
        if(response.success)
            returnObject.data = response.data
        else    
            returnObject.error = response.msg
        
    } catch (error) {
        returnObject.data = null
        returnObject.error = error
    } 

    return returnObject 
}

export const DELETE = async (url, header = {}) => {
    const returnObject = {
        data: null,
        error: null
    }
    
    const options = {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            ...header
        }
    }
    try {
        const request = await fetch(url, options)
        const response = await request.json()
        if(response.success)
            returnObject.data = response.data
        else    
            returnObject.error = response.msg
        
    } catch (error) {
        returnObject.data = null
        returnObject.error = error
    } 

    return returnObject 
}

export const POST = async (url, data, header = {}) => {
    const returnObject = {
        data: null,
        error: null
    }
    
    const options = {
        method: "POST",
        headers: {
            ...header,
            "content-type": "application/json"
        },
        redirect: 'follow',
        body: JSON.stringify(data)
    }
    try {
        const request = await fetch(url, options)
        const response = await request.json()
        console.log(response)
        if(response.success)
            returnObject.data = response.data
        else    
            returnObject.error = response.msg
        
    } catch (error) {
        console.log(error)
        returnObject.data = null
        returnObject.error = error
    } 

    return returnObject 
}

export const PUT = async (url, data, header = {}) => {
    const returnObject = {
        data: null,
        error: null
    }
    
    const options = {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            ...header
        },
        redirect: 'follow',
        body: JSON.stringify(data)
    }
    try {
        const request = await fetch(url, options)
        const response = await request.json()
        if(response.success)
            returnObject.data = response.data
        else    
            returnObject.error = response.msg

    } catch (error) {
        returnObject.data = null
        returnObject.error = error
    } 

    return returnObject 
}

