export const getCountries = async () => {
    const request = await fetch('https://countriesnow.space/api/v0.1/countries/capital', {method: "GET"})
    const response = await request.json()
    return  response.data
}

export const getStates = async country => {
     const request = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({country: country})
    })
    const response = await request.json()
    return response.data
}

export const getCities = async (state, country) => {
    const request = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: "POST", 
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"country": country, "state": state})
    })
    const response = await request.json()
    return  response.data
}

export const getPincodeData = async (code) => {
    try {
        console.log(`https://api.postalpincode.in/pincode/${code}`)
        const request = await fetch(`https://api.postalpincode.in/pincode/${code}`)
        const response = await request.json()
        console.log(response)
        if(response[0].Status == "Success"){
            return response[0].PostOffice
        }
        return []
    } catch (error) {
        return error
    }
}

