import { useEffect, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { GET, POST, DELETE, PUT } from "../../../../../api/fetch"
import URL from "../../../../../api/urls"
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Form,
    Spinner
} from 'react-bootstrap'
import {
    useNavigate
} from 'react-router-dom'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosInformationCircleOutline } from "react-icons/io"
import { MdArrowBackIos, MdDeleteOutline, MdEdit } from "react-icons/md"
import { isValidCarRegistrationNumber, imageToBase64 } from '../../../../../utility/commonFunctions'
import { getCountries, getStates, getCities, getPincodeData } from "../../../../../api/map_data"
import { Typography } from "@mui/material"
import URL_STRINGS from "../../../../../utility/URL_STRINGS"



const CustomerView = () => {
    
    const params = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [appliedCoupon, setAppliedCoupon] = useState(false)
    const [appliedCouponCode, setAppliedCouponCode] = useState(null)
    const [data, setData] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [carBranData, setCarBrandData] = useState([])
    const [transmissionData, setTransmissionData] = useState([])
    const [registrationData, setRegistrationData] = useState([])
    const [fuelData, setFuelData] = useState([])
    const [formData, setFormData] = useState({})
    const [addCarModal, showAddCarModal] = useState(false)
    const [selectedBrandData, setSelectedBrandData] = useState([])
    const [selectedModelData, setSelectedModelData] = useState([])
    const [imageData, setImageData] = useState(null)
    const [editCarData, setEditCarData] = useState(null)
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
    const [clusterData, setClusterData] = useState([])
    const [subscribeFormData, setSubscribeFormData] = useState([])
    const [selectedCluster, setSelectedCluster] = useState([])
    const [subscribeFormStep, setSubscribeFormStep] = useState(1)
    const [packageData, setPackageData] = useState([])
    const [rolesData, setRolesData] = useState([])
    const [selectedPackage, setSelectedPackage] = useState([])
    const [selectedCar, setSelectedCar] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalAdjustedAmount, setTotalAdjustedAmount] = useState(0)
    const [totalAmountBeforeLess, setTotalAmountBeforeLess] = useState(0)
    const [showAddressModal, setShowAddressModal] = useState(null)
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [showRaiseRequestModal, setShowRaiseRequestModal] = useState(null)
    const [changeRequestComment, setChangeRequestComment] = useState(null)
    const [homeAddress, setHomeAddress] = useState(null)
    const [showServiceNotStartModal, setShowServiceNotStartModal] = useState(null)
    const [city, setCity] = useState(null)
    const [state, setState] = useState(null)
    const imageInputRef = useRef(null)
    const [formErrors, setFormErrors] = useState({})
    const [deleteType, setDeleteType] = useState(null)
    const [dataToken, setDataToken] = useState(null)
    const [priceData, setPriceData] = useState(null)


    const fetchData = async () => {
        
        const {data, error} = await GET(URL.CUSTOMER.CUSTOMER + "/" + params.id)
        if(data){
            setData(data)
            console.log(data)
            const homeAdd = data.addresses.filter(address => address.address_type == "HOME")
            console.log(homeAdd)
            if(homeAdd.length > 0){
                setHomeAddress(homeAdd[0])
            }
        }
        
        const { data: brandData, error: brandError } = await GET(URL.CAR.CAR)
        if(brandData)
            setCarBrandData(brandData)
        
        const { data: transData, error: transError } = await GET(URL.CAR.TRANSMISSION_TYPE)
        if(transData)
            setTransmissionData(transData)
        
        const { data: regisData, error: regisError } = await GET(URL.CAR.REGISTRATION_TYPE)
        if(regisData)
            setRegistrationData(regisData)

        const { data: fuelData, error: fuelError } = await GET(URL.CAR.FUEL_TYPE)
        if(fuelData)
            setFuelData(fuelData)

        const { data: cluster, error: clusterError } = await GET(URL.CLUSTER.REGISTERED)
        if(cluster)
            setClusterData(cluster)
        console.log(cluster)

        const { data: packages, error: packageError } = await GET(URL.PACKAGE)
        if(packages)
            setPackageData(packages)

        const { data: roles, error: rolesError } = await GET(URL.CLUSTER.ROLE)
        if(roles)
            setRolesData(roles)

        const countriesData = await getCountries()
        if(countriesData.length)
            setCountries(countriesData)

        const statesData = await getStates("India")
        if(statesData)
            setStates(statesData)       
    }

    useEffect(() => {
        setTotalAmount(0)
        fetchData()
        setFormErrors({})
    }, [])

    useEffect(() => {
        if(showSubscriptionModal == false) {
            setSelectedPackage([])
            setSelectedCluster([])
            setSubscribeFormData([])
            setSubscribeFormStep(1)
            setTotalAdjustedAmount(null)
            setTotalAmountBeforeLess(null)
        }
    }, [showSubscriptionModal])
    
    useEffect(() => {
        if(selectedPackage.length > 0 && selectedCar.length > 0){
            // selectedPackage[0].prices.forEach(priceData => {
            //     if(priceData.category == selectedCar[0].model.category._id){
            //         setTotalAmount(pre => (pre + priceData.actual_price))
            //     }
            // })

            // const total_tax_value = selectedPackage[0].taxes.reduce((total, currentTaxData) => {
            //     return total + currentTaxData.value
            // }, 0)
            // setTotalAmount(pre => (pre + ((total_tax_value / 100) * pre)))
        }
    }, [selectedPackage, selectedCar])

    const deleteData = async () => {
        if(deleteType == 'address'){
            const action = confirm("Click ok to delete this address.")
            console.log(action)
            if(action){
                console.log("first")
                const {data, error} = await DELETE(`${URL.CUSTOMER.CUSTOMER + "/" + params.id + "/address"}/${deleteId}`)
                console.log(data)
                if(data){
                    setDeleteId(null)
                    fetchData()
                    setDeleteType(null)
                    setFormErrors({})
                    setFormData({})
                }
        
                if(error)
                    alert(error)
            } else {
                console.log("second")
                setDeleteId(null)
                fetchData()
                setDeleteType(null)
                setFormErrors({})
                setFormData({})
            }
        }

        if(deleteType == 'car'){
            const action = confirm("Click ok to delete this car.")
            if(action){
                const {data, error} = await DELETE(`${URL.CUSTOMER.CUSTOMER + "/" + params.id + "/car"}/${deleteId}`)
                if(data){
                    setDeleteId(null)
                    fetchData()
                    setDeleteType(null)
                    setFormErrors({})
                    setFormData({})
                }
        
                if(error)
                    alert(error)
            } else {
                setDeleteId(null)
                fetchData()
                setDeleteType(null)
                setFormErrors({})
                setFormData({})
            }
        }
        
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name
        delete formErrors[name]
        setFormErrors({...formErrors})

        if(editCarData){
            
            console.log("update car form")
            if(name == "brand"){
                if(editCarData.subscription == null){
                    const data = carBranData.filter(brand => brand._id == value)
                    setSelectedBrandData(data)    
                    setEditCarData({
                        ...editCarData,
                        [name]: value,
                        model: data[0].models[0]._id
                    })
                }
            } else if (name === 'uploaded_model_picture'){
                if(target.files[0].size > 1048576 * 5){
                    alert("Image size is too big. Max Image size is 5MB")
                    imageInputRef.current.value = ""
                } else {
                    try {
                        const array = value.split("\\")
                        const imageName = array[array.length - 1]
                        value = await imageToBase64(target.files[0])
                        
                        setEditCarData({
                            ...editCarData,
                            [name]: {
                                image_data: value.toString(),
                                name: imageName.toString()
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
            }else if(name == 'model'){
                if(editCarData.subscription == null){
                    const data = selectedBrandData[0].models.filter(model => model._id == value)
                    setSelectedModelData(data)
               
                    setEditCarData({
                        ...editCarData,
                        [name]: value,
                        category: data[0].category
                    })
                }
            }else if (name == 'registration_number') {
                setEditCarData({
                    ...editCarData,
                    [name]: value.toUpperCase()
                })
            } else {
                setEditCarData({
                    ...editCarData,
                    [name]: value
                })

            }

        } else if(showSubscriptionModal) {
            if(name == 'cluster'){
                const cluster = clusterData.filter(cluster => cluster._id == value)
                console.log(cluster)
                if(cluster[0].approved){
                    setSelectedCluster(cluster)
                    setSubscribeFormData({
                        ...subscribeFormData,
                        [name]: value
                    })

                } else {
                    // alert("This service is not yet started for this apartment.")
                    setSelectedCluster(cluster)
                    setShowSubscriptionModal(null)
                    setShowServiceNotStartModal(true)
                }
            } else {
                setSubscribeFormData({
                    ...subscribeFormData,
                    [name]: value
                })

                console.log(subscribeFormData)

                if(name == 'time_slot'){
                    //
                }

                if(name == 'package'){
                    const package_ = packageData.filter(package_ => package_._id == value)
                    setSelectedPackage(package_)
                    getPackageCost(package_)
                }
            }
        } else if (addCarModal) {
            
            if(name === "brand"){
                const data = carBranData.filter(brand => brand._id == value)
                console.log(data)
                setSelectedBrandData(data)
            }
    
            if(name === 'uploaded_model_picture'){
                if(target.files[0].size > 1048576 * 5){
                    alert("Image size is too big. Max Image size is 5MB")
                    imageInputRef.current.value = ""
                } else {
                    try {
                        const array = value.split("\\")
                        const imageName = array[array.length - 1]
                        value = await imageToBase64(target.files[0])
                        
                        setFormData({
                            ...formData,
                            [name]: {
                                image_data: value.toString(),
                                name: imageName.toString()
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
            }else if(name == 'model'){
                const data = selectedBrandData[0].models.filter(model => model._id == value)
                console.log(data)
                console.log(value)
                setSelectedModelData(data)
                console.log(selectedModelData)
                setFormData({
                    ...formData,
                    [name]: value,
                    category: data[0].category
                })
            }else if (name == 'registration_number') {
                setFormData({
                    ...formData,
                    [name]: value.toUpperCase()
                })
            }else{
                setFormData({
                    ...formData,
                    [name]: value
                })
            }
        } else if (showAddressModal) {
            if(name === 'zip_code'){
                if(value.toString().length == 6){
                    const zipData = await getPincodeData(value)
                    if(zipData && zipData.length > 0){
                        console.log(zipData)
                        const city_ = zipData[0].District
                        const state_ = zipData[0].State
                        setCity(city_)
                        setState(state_)
                        formData.city = city_
                        formData.state = state_
                        console.log(city, state)
                        const citiesData = await getCities(state_, "India")
                        if(citiesData)
                            setCities(citiesData)
                    }
                } else {
                    setCity(null)
                    setState(null)
                    formData.city = null
                    formData.state = null
                    setCities([])
                }
            }
            
            if(name === 'state'){
                const citiesData = await getCities(value, formData.country || "India")
                if(citiesData)
                    setCities(citiesData)
            }

            if(name == "cluster"){
                if(value == "null"){
                    setFormData({})
                } else {
                    const selectedCluster = clusterData.filter(cluster => cluster._id == value)
                    console.log(selectedCluster[0].name)
                    setFormData({
                        ...formData,
                        [name]: value,
                        area: selectedCluster[0].address.area,
                        line_1: selectedCluster[0].address.line_1,
                        line_2: selectedCluster[0].address.line_2,
                        city: selectedCluster[0].address.city,
                        state: selectedCluster[0].address.state,
                        zip_code: selectedCluster[0].address.zip_code,
                        country: selectedCluster[0].address.country || "INDIA",
                        cluster_name: selectedCluster[0].name,
                        cluster_id: selectedCluster[0].cluster_id,
                        cluster_db_id: selectedCluster[0]._id,
                    })
                }
            } else {
                setFormData({
                    ...formData,
                    [name]: value
                })
            }

        } else if (showServiceNotStartModal) {
            setFormData({
                ...formData,
                cluster_id: selectedCluster[0].cluster_id,
                cluster_db_id: selectedCluster[0]._id,
                cluster_name: selectedCluster[0].name,
                requester_name: data.name,
                mobile_number: data.mobile_number,
                residence_type: selectedCluster[0].residence_type._id,
                address: selectedCluster[0].address,
                [name]: value
            })
        }
    }

    const handleSubmitForm = async () => {

        if(editCarData){ 
            if((editCarData.model._id || editCarData.model) && (editCarData.registration_type._id || editCarData.registration_type) && editCarData.registration_number && (editCarData.transmission_type._id || editCarData.transmission_type) && (editCarData.fuel_type._id || editCarData.fuel_type) && editCarData.uploaded_model_picture){
                const dataToSend = {
                    model: editCarData.model._id || editCarData.model,
                    registration_type: editCarData.registration_type._id || editCarData.registration_type,
                    registration_number: editCarData.registration_number,
                    transmission_type: editCarData.transmission_type._id || editCarData.transmission_type,
                    fuel_type: editCarData.fuel_type._id || editCarData.fuel_type,
                }
    
                try {
                    const {data, error} = await PUT(URL.CUSTOMER.CUSTOMER + "/" + params.id + "/car/" + editCarData._id, dataToSend)
                    if(data){
                        setEditCarData(null)
                        fetchData()
                    }
        
                    if(error)
                        alert(error)
                } catch (error) {
                    alert(error)
                }
            } else {
                if(!editCarData.model._id || !editCarData.model){
                    setFormErrors(pre => ({...pre, model: "Please select car model."}))
                }
                if(!editCarData.registration_type._id || !editCarData.registration_type){
                    setFormErrors(pre => ({...pre, registration_type: "Please select car registration type."}))
                }
                if(!editCarData.registration_number){
                    setFormErrors(pre => ({...pre, registration_number: "Please enter car registration number."}))
                }
                if(!editCarData.transmission_type._id || !editCarData.transmission_type){
                    setFormErrors(pre => ({...pre, transmission_type: "Please select car transmission type."}))
                }
            }     

        } else if (showSubscriptionModal) {
           
            console.log(subscribeFormStep)
            console.log(subscribeFormData)
            console.log(homeAddress)
            
            if(subscribeFormStep == 1){
                if(homeAddress == null){

                    if(subscribeFormData.house_flat_number && subscribeFormData.cluster && subscribeFormData.parking_lot_number){
                        console.log(subscribeFormData)
                        const selectedCluster_ = clusterData.filter(cluster => cluster._id == subscribeFormData.cluster)
                        setSelectedCluster(selectedCluster_[0])
                        
                        if(selectedCluster[0].approved){
                            const dataToSend = {
                                locked: true,
                                address_type: "HOME",
                                line_1: selectedCluster[0].address.line_1,
                                line_2: selectedCluster[0].address.line_2,
                                area: selectedCluster[0].address.area,
                                city: selectedCluster[0].address.city,
                                state: selectedCluster[0].address.state,
                                zip_code: selectedCluster[0].address.zip_code,
                                country: selectedCluster[0].address.country,
                                cluster_id: selectedCluster[0].cluster_id,
                                cluster_db_id: selectedCluster[0]._id,
                                cluster_name: selectedCluster[0].name,
                            }

                            subscribeFormData.cluster = selectedCluster[0]._id
                            
                            const { data, error } = await POST(URL.CUSTOMER.ADDRESS.replace("id", params.id), dataToSend)
                            if(data){
                                setSubscribeFormStep(pre => (
                                    pre + 1
                                ))
                            }
        
                            if(error){
                                alert(error)
                            }
                        } else {
                            // alert("This service is not yet started for this apartment.")
                        }
                        
    
                    } else {
                        if(!subscribeFormData.house_flat_number){
                            setFormErrors(pre => ({...pre, house_flat_number: "Please enter House/Flat number."}))
                        }
                        if(!subscribeFormData.cluster){
                            setFormErrors(pre => ({...pre, cluster: "Please select cluster."}))
                        }
                        if(!subscribeFormData.parking_lot_number){
                            setFormErrors(pre => ({...pre, parking_lot_number: "Please enter car parking number."}))
                        }
                    }
                } else if(homeAddress) {
                    
                    console.log(homeAddress)
                    let selectedCluster_ = clusterData.filter(cluster => cluster._id == homeAddress.cluster_db_id)
                    if(!homeAddress.locked){
                        // move current home address to others
                        const dataToSend = {
                            ...homeAddress,
                            address_type: "OTHER",
                            other_name: ""
                        }
                        delete dataToSend._v
                        const { data, error } = await PUT(URL.CUSTOMER.ADDRESS.replace("id", params.id) + "/" + homeAddress._id, {...dataToSend})    
                        selectedCluster_ = clusterData.filter(cluster => cluster._id == subscribeFormData.cluster)
                        setSelectedCluster(selectedCluster_[0])
                        console.log(selectedCluster_)
                        if(selectedCluster[0].approved){
                            const dataToSend = {
                                locked: true,
                                address_type: "HOME",
                                line_1: selectedCluster[0].address.line_1,
                                line_2: selectedCluster[0].address.line_2,
                                area: selectedCluster[0].address.area,
                                city: selectedCluster[0].address.city,
                                state: selectedCluster[0].address.state,
                                zip_code: selectedCluster[0].address.zip_code,
                                country: selectedCluster[0].address.country,
                                cluster_id: selectedCluster[0].cluster_id,
                                cluster_db_id: selectedCluster[0]._id,
                                cluster_name: selectedCluster[0].name,
                            }

                            subscribeFormData.cluster = selectedCluster[0]._id
                            
                            const { data, error } = await POST(URL.CUSTOMER.ADDRESS.replace("id", params.id), dataToSend)
                            
                        } else {
                            // alert("This service is not yet started for this apartment.")
                        }
                    }

                    console.log(selectedCluster_)
                    setSelectedCluster(selectedCluster_[0])
                    setSubscribeFormData(pre => {
                        return {
                            ...pre,
                            cluster: homeAddress.cluster_db_id || selectedCluster_[0]._id
                        }
                    })
                    console.log(selectedCar)
                    if(selectedCar){
                       setSubscribeFormData(pre => {
                            return {
                                ...pre,
                                house_flat_number: selectedCar[0].house_flat_no || subscribeFormData.house_flat_number,
                                parking_lot_number: selectedCar[0].parking_lot_number || subscribeFormData.parking_lot_number,
                                cluster: homeAddress.cluster_db_id || selectedCluster_[0]._id,
                            }
                        })
                    }

                    console.log("first")
                    console.log(subscribeFormData)
                    if(subscribeFormData.parking_lot_number && subscribeFormData.cluster && subscribeFormData.house_flat_number){
                        console.log("first")
                        setSubscribeFormStep(pre => (
                            pre + 1
                        ))
                    } else {
                        console.log("first")
                        if(!subscribeFormData.house_flat_number){
                            setFormErrors(pre => ({...pre, house_flat_number: "Please enter House/Flat number."}))
                        }
                        if(!subscribeFormData.cluster){
                            setFormErrors(pre => ({...pre, cluster: "Please select cluster."}))
                        }
                        if(!subscribeFormData.parking_lot_number){
                            setFormErrors(pre => ({...pre, parking_lot_number: "Please enter car parking number."}))
                        }
                    }
                }
            } 

            if(subscribeFormStep == 2){
                console.log(subscribeFormData)
                if(subscribeFormData.house_flat_number && subscribeFormData.cluster && subscribeFormData.parking_lot_number && subscribeFormData.package){

                    const dataToSend = {
                        ...subscribeFormData,
                        customer: params.id,
                        car: selectedCar[0]._id,
                    }

                    console.log(dataToken)
                    
                    const {data: orderData, error: orderError} = await POST(URL.PAYMENT.ORDER, {data_token: dataToken})
                    console.log(orderData)
                    console.log(orderError)

                    if(orderData && orderData.length){
                        setLoading(true)
                        setShowSubscriptionModal(false)
                        showRazorpayModal(orderData[0])
                    }
    
                    // const subscribed = await POST(URL.SUBSCRIPTION, dataToSend)
                    // if(subscribed){
                    //     setShowSubscriptionModal(false)
                    //     setSubscribeFormData([])
                    //     setSubscribeFormStep(1)
                    //     fetchData()
                    // }
                } else {
                    console.log("first")
                    if(!subscribeFormData.house_flat_number){
                        setFormErrors(pre => ({...pre, house_flat_number: "Please enter House/Flat number."}))
                    }
                    if(!subscribeFormData.cluster){
                        setFormErrors(pre => ({...pre, cluster: "Please select cluster."}))
                    }
                    if(!subscribeFormData.parking_lot_number){
                        setFormErrors(pre => ({...pre, parking_lot_number: "Please enter car parking number."}))
                    }
                    if(!subscribeFormData.package){
                        setFormErrors(pre => ({...pre, package: "Please select package."}))
                    }
                }
            } 
        } else if (showAddressModal) {
            if(formData.cluster_name && formData.address_type && formData.address_type != "null" && formData.line_1 && formData.area && formData.city && formData.state && formData.zip_code){
                if(formData.address_type == "OTHER" && !formData.other_name){
                    if (formData.address_type == "OTHER" && !formData.other_name){
                        setFormErrors(pre => ({...pre, other_name: "Please enter address name."}))
                    }
                } else {
                    const dataToSend = {
                        ...formData,
                        country: formData.country || "India"
                    }
                    if(formData.address_type != "OTHER"){
                        delete formData.other_name
                    }
                    
                    if(showAddressModal == 'add'){
                        
                        const { data, error } = await POST(URL.CUSTOMER.ADDRESS.replace("id", params.id), dataToSend)
                        if(data){
                            fetchData()
                            closeAddressModal()
                        }
        
                        if(error){
                            alert(error)
                        }
                    }
    
                    if(showAddressModal == 'update'){
                        const { data, error } = await PUT(URL.CUSTOMER.ADDRESS.replace("id", params.id) + "/" + formData._id, dataToSend)
                        if(data){
                            fetchData()
                            closeAddressModal()
                        }
        
                        if(error){
                            alert(error)
                        }
                    }
                }

            } else {
                console.log("first")
                console.log(formData)
                if(!formData.cluster_name){
                    setFormErrors(pre => ({...pre, cluster: "Please select cluster."}))
                } 
                if(!formData.address_type || formData.address_type == "null"){
                    setFormErrors(pre => ({...pre, address_type: "Please select address type."}))
                } 
                // if(!formData.line_1){
                //     setFormErrors(pre => ({...pre, line_1: "Please enter address."}))
                // }
                // if(!formData.area){
                //     setFormErrors(pre => ({...pre, area: "Please enter area name."}))
                // }
                // if(!formData.city){
                //     setFormErrors(pre => ({...pre, city: "Please select city."}))
                // }
                // if(!formData.state){
                //     setFormErrors(pre => ({...pre, state: "Please select state."}))
                // }
                // if(!formData.zip_code){
                //     setFormErrors(pre => ({...pre, zip_code: "Please enter zip code."}))
                // }
            }
        } else if (showServiceNotStartModal) {
            if(formData.cluster_id && formData.cluster_db_id && formData.cluster_name && formData.requester_name && formData.requestor_role && formData.requestor_role != "null" && formData.mobile_number && formData.residence_type && formData.address){
                console.log(formData)
                try {
                    const {data, error} = await POST(URL.CLUSTER.REQUEST, formData)
                    if(data){
                        setShowServiceNotStartModal(null)
                        setFormData({})
                        setFormErrors({})
                        fetchData()
                    }
        
                    if(error)
                        alert(error)
                } catch (error) {
                    alert(error)
                }
                
            } else {
                if(!formData.requestor_role || formData.requestor_role == "null"){
                    setFormErrors(pre => ({...pre, requestor_role: "Please select requestor role."}))
                }
            }
        } else {
            if (formData.brand && formData.model && formData.registration_type && formData.registration_number && formData.fuel_type && formData.transmission_type && formData.category){
                const dataToSend = {
                    model: formData.model,
                    registration_type: formData.registration_type,
                    registration_number: formData.registration_number,
                    transmission_type: formData.transmission_type,
                    fuel_type: formData.fuel_type,
                    uploaded_model_picture: formData.uploaded_model_picture || null
                }
    
                try {
                    const {data, error} = await POST(URL.CUSTOMER.CUSTOMER + "/" + params.id + "/car", dataToSend)
                    if(data){
                        showAddCarModal(false)
                        fetchData()
                    }
        
                    if(error)
                        alert(error)
                } catch (error) {
                    alert(error)
                }
            }else{
                if(!formData.category){
                    setFormErrors(pre => ({...pre, category: "Please select car category."}))
                }
                if(!formData.brand){
                    setFormErrors(pre => ({...pre, brand: "Please select car brand."}))
                }
                if(!formData.model){
                    setFormErrors(pre => ({...pre, model: "Please select car model."}))
                }
                if(!formData.registration_typel){
                    setFormErrors(pre => ({...pre, registration_type: "Please select car registration type."}))
                }
                if(!formData.registration_number){
                    setFormErrors(pre => ({...pre, registration_number: "Please enter car registration number."}))
                }
                if(!formData.transmission_type){
                    setFormErrors(pre => ({...pre, transmission_type: "Please select car transmission type."}))
                }
                if(!formData.fuel_type){
                    setFormErrors(pre => ({...pre, fuel_type: "Please select car transmission type."}))
                }
            }
        } 
    }

    useEffect(() => {
        console.log(selectedCar)
    }, [showSubscriptionModal])

    useEffect(() => {
        if(editCarData?.model?._id){
            const data = selectedBrandData[0].models.filter(model => model._id == editCarData.model._id)
            setSelectedModelData(data)
        }

        // if(formData?.brand){
        //     const data = 
        //     console.log(selectedBrandData)
        // }

    }, [selectedBrandData])

    const closeAddressModal = () => {
        setFormData({})
        setShowAddressModal(null)
    } 

    useEffect(() => {
        console.log(selectedCluster)
    }, [selectedCluster])

    useEffect(() => {
        console.log(showAddressModal)
        if(showAddressModal == 'update'){
            console.log(formData)
        }
    }, [showAddressModal])

    const raiseRequest = async () => {
        console.log(showRaiseRequestModal)
        if(showRaiseRequestModal && showRaiseRequestModal._id){
            const dataToSend = {
                customer: params.id,
                address_to_change: showRaiseRequestModal._id,
                comment: changeRequestComment
            }

            console.log(URL.CUSTOMER.CHANGE_ADDRESS_REQUEST)
            const { data, error } = await POST(URL.CUSTOMER.CHANGE_ADDRESS_REQUEST, dataToSend)
            if(data){
                fetchData()
                setShowRaiseRequestModal(null)
                setChangeRequestComment(null)
            }

            if(error){
                alert(error)
            }

        } else {
            alert("Something went wrong.")
        }
    }

    useEffect(() => {
        setFormErrors({})
        fetchData()
    }, [showAddCarModal, showAddressModal, showRaiseRequestModal, showServiceNotStartModal, showSubscriptionModal])

    const showRazorpayModal = (data) => {
        var options = {
            "key": import.meta.env.VITE_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            "amount": data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            "currency": data.currency,
            "name": "GoMotorCar",
            "description": "Test Transaction",
            // "image": "https://example.com/your_logo",
            "order_id": data.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (response){
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
                console.log(response)
                const { data: verifyData, error: verifyError } = await POST(URL.PAYMENT.VERIFY, {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    data_token: data.data_token
                })
                console.log(verifyData)
                console.log(verifyError)
                if(verifyData){
                    const dataToSend = {
                        ...subscribeFormData,
                        customer: params.id,
                        car: selectedCar[0]._id,
                        data_token: verifyData[0].data_token,
                    }
                    console.log(dataToSend)
                    const subscribed = await POST(URL.SUBSCRIPTION, dataToSend)
                    console.log(subscribed)
                    if(subscribed.data){
                        fetchData()
                        setShowSubscriptionModal(false)
                        setDataToken(null)
                        setFormErrors({})
                        setTotalAdjustedAmount(0)
                        setTotalAmount(0)
                        setTotalAmountBeforeLess(0)
                    }  
                    if(subscribed.error){
                        alert(subscribed.error)
                    }
                }

                setLoading(false)
            },
            // "callback_url": URL.PAYMENT.VERIFY,
            // "redirect": true,
            "prefill": {
                "name": data.customer.name,
                "email": data.customer.email,
                "contact": data.customer.mobile_number
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        const rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
                setLoading(false)
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
        })
        rzp1.open()
            // e.preventDefault()
    }

    const getSubscriptionData = (car, type) => {
        return car.subscription.filter(sub => sub.active_status == type)[0] || null
    }

    const handleDiscountCoupon = async (e) => {
        e.preventDefault()
        // check if coupon code is valid
        const { data, error } = await GET(URL.DISCOUNT.ROOT + "/" + appliedCouponCode)
        if(data){
            await getPackageCost()
        }
        if(error){
            alert(error)
        }
    }

    const removeDiscountCoupon = async () => {
        // setAppliedCouponCode(null)
        setAppliedCoupon(false)
        const {data: pacakgeCostData, error: packageCostError} = await POST(URL.CUSTOMER.PACKAGE_COST, { 
            customer: params.id,
            package: selectedPackage[0]._id,
            car: selectedCar[0]._id,
            discount_coupon_code: null,
        })
    
        console.log(pacakgeCostData)
    
        if(pacakgeCostData){
            if(pacakgeCostData.applicable_for_discount_coupon && pacakgeCostData.applied_discount_coupon_code){
                setAppliedCoupon(true)
            }
            setTotalAmount(pacakgeCostData.total_amount_to_pay)
            setTotalAdjustedAmount(pacakgeCostData.total_adjustable_amount)
            setTotalAmountBeforeLess(pacakgeCostData.total_amount)
            // setSelectedPackage(package_)
            setDataToken(pacakgeCostData.data_token)
            setPriceData(pacakgeCostData)
        }
        if(packageCostError) alert(packageCostError)
    }

    const getPackageCost = async (package_ = selectedPackage) => {
        
        const {data: pacakgeCostData, error: packageCostError} = await POST(URL.CUSTOMER.PACKAGE_COST, { 
            customer: params.id,
            package: package_[0]._id,
            car: selectedCar[0]._id,
            discount_coupon_code: appliedCouponCode || null,
        })

        console.log(pacakgeCostData)

        if(pacakgeCostData){
            if(pacakgeCostData.applicable_for_discount_coupon && pacakgeCostData.applied_discount_coupon_code){
                setAppliedCoupon(true)
            }
            setTotalAmount(pacakgeCostData.total_amount_to_pay)
            setTotalAdjustedAmount(pacakgeCostData.total_adjustable_amount)
            setTotalAmountBeforeLess(pacakgeCostData.total_amount)
            setSelectedPackage(package_)
            setDataToken(pacakgeCostData.data_token)
            setPriceData(pacakgeCostData)
        }
        if(packageCostError) alert(packageCostError)
    }



    return(
        data && data._id && <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        
                        <h3 className='pageTitle'> <MdArrowBackIos size={28} onClick={() => navigate(-1)} style={{ cursor: "pointer" }}/> { data && data?.name }</h3>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <h4 className="mb-3 pageTitle">Customer Information</h4>
                    {   data && 
                        <>
                            <Col>
                                <Row>
                                    <Col lg={5}>Customer ID</Col>
                                    <Col>{ data && data?.customer_id }</Col>
                                </Row>
                                <Row>
                                    <Col lg={5}>Customer Name</Col>
                                    <Col>{ data && data?.name }</Col>
                                </Row>
                                <Row>
                                    <Col lg={5}>Customer Mobile Number</Col>
                                    <Col>{ data && data?.mobile_number }</Col>
                                </Row>
                                <Row>
                                    <Col lg={5}>Customer Email</Col>
                                    <Col>{ data && data?.email || "-" }</Col>
                                </Row>
                            </Col>
                            <Col>
                                {/* for future rows and cols */}
                            </Col>
                        </>
                    }  
                </Row>
                <hr></hr>

                <Row className="mt-2">
                <Row>
                        <Col lg={9}>
                            <h4 className="mb-3 pageTitle">Customer Addresses</h4>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            <Button onClick={() => {setShowAddressModal("add"); setSubscribeFormData([])}}>Add Address</Button>    
                        </Col>
                    </Row>
                    <Col>
                        <Table className="m-2" bordered striped hover>
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Cluster</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                data && data.addresses.map((address, index) => {
                                    return (
                                        <>
                                           <tr key={index}>
                                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                <td>{address.other_name || address.address_type}</td>
                                                <td>{address.address_type}</td>
                                                <td>{address.cluster_name || "-"}</td>
                                                <td>{address.line_1 + ", " + (address.line_2 ? address.line_2 + ", " + address.area : address.area) + ", " + address.city + ", " + address.zip_code + ", " + address.state + "," + address.country}</td>
                                                <td>
                                                    <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => {setDeleteId(address._id), setDeleteType('address')}} size={25} />
                                                    <MdEdit size={25} style={{ marginInline: 10, cursor: 'pointer' }} onClick={async () => {
                                                        if(address.address_type == "HOME" && address.locked) {
                                                            setShowRaiseRequestModal(address)
                                                            setChangeRequestComment(null)
                                                        } else {
                                                            setFormData({
                                                                ...address,
                                                            })
                                                            setShowAddressModal('update')
                                                            const states = await getStates(address.country || "India")
                                                            setStates(states)
                                                            const cities = await getCities(address.state, address.country || "India")
                                                            setCities(cities)
                                                        }
                                                    }} />
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <hr></hr>

                <Row className='mt-2'>
                    <Row>
                        <Col lg={9}>
                            <h4 className="mb-3 pageTitle">Customer Car Information</h4>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            <Button onClick={() => {showAddCarModal(true); setSubscribeFormData([])}}>Add Car</Button>    
                        </Col>
                    </Row>
                    <Col>
                        <Table className="m-2" bordered striped hover>
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th>#</th>
                                    <th>Car ID</th>
                                    <th>Registration Number</th>
                                    <th>Brand</th>
                                    <th>Subscription</th>
                                    <th>Upcoming Subscription</th>
                                    <th>QR Code ID</th>
                                    <th>Model</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                data && data.cars.map((car, index) => {
                                    return (
                                        <>
                                           <tr key={index}>
                                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                <td><Link to={URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CAR_VIEW.replace(":customerID", params.id).replace(":carID", car._id)}>{car.car_id}</Link></td>
                                                <td style={{ textAlign: 'center' }}>{car.registration_number}</td>
                                                <td>{car.model.brand.name}</td>
                                                <td>{(getSubscriptionData(car, "Active") && getSubscriptionData(car, "Active").subscription_id) || <a style={{ cursor: 'pointer' }} className="text-primary" onClick={() => {
                                                    const selectedCarData = data.cars && data.cars.filter(car_ => car_._id == car._id)
                                                    setSelectedCar(selectedCarData)
                                                    setShowSubscriptionModal(true)
                                                    setSubscribeFormData({
                                                        ...subscribeFormData,
                                                        house_flat_number: selectedCarData[0].house_flat_no,
                                                        parking_lot_number: selectedCarData[0].parking_lot_number
                                                    })
                                                }}>Subscribe Now</a>}</td>
                                                <td style={{ textAlign: 'center' }}>{(getSubscriptionData(car, "Upcoming") && getSubscriptionData(car, "Upcoming").subscription_id) || getSubscriptionData(car, "Active") && getSubscriptionData(car, "Active").subscription_id &&  <a style={{ cursor: 'pointer' }} className="text-primary" onClick={() => {
                                                    const selectedCarData = data.cars && data.cars.filter(car_ => car_._id == car._id)
                                                    setSelectedCar(selectedCarData)
                                                    setShowSubscriptionModal(true)
                                                    setSubscribeFormData({
                                                        ...subscribeFormData,
                                                        house_flat_number: selectedCarData[0].house_flat_no,
                                                        parking_lot_number: selectedCarData[0].parking_lot_number
                                                    })
                                                }}>Renew</a> || "-"}</td>
                                                <td>{car.qr_code ? car.qr_code.qr_code_id : "-"}</td>
                                                <td><a style={{ cursor: 'pointer' }} className="text-primary" onClick={() => setImageData({name: car.uploaded_model_picture ? car.uploaded_model_picture.name : car.model.model_picture.name, image_data: car.uploaded_model_picture ? car.uploaded_model_picture.image_data : car.model.model_picture.image_data})}>{car.model.name}</a></td>
                                                <td>
                                                    <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => (setDeleteId(car._id), setDeleteType('address'))} size={25} />
                                                    <MdEdit size={25} style={{ marginInline: 10, cursor: 'pointer' }} onClick={() => {
                                                        setEditCarData(car); 
                                                        if(car.subscription == null){
                                                            const data = carBranData.filter(brand => brand._id == car.model.brand._id)
                                                            setSelectedBrandData(data)
                                                        }
                                                    }} />
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <hr></hr>

            </Container>

            {/* Add Car Modal */}
            <Modal size="lg" centered show={addCarModal} onHide={() => showAddCarModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Add New Car</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["brand"] && 'text-danger'}>Car Brand</Form.Label>
                                    <Form.Select  className={ formErrors["brand"] && 'border-danger'} name='brand'  onChange={handleOnChange}>
                                        <option value={null} >Select Car Brand</option>
                                        {
                                            carBranData.map(brand => {
                                                return(
                                                    <option key={brand._id} value={brand._id} >{brand.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["brand"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["model"] && 'text-danger'}>Car Model</Form.Label>
                                    <Form.Select className={ formErrors["model"] && 'border-danger'} name='model'  onChange={handleOnChange}>
                                        <option value={null} >Select Car Model</option>
                                        {
                                            selectedBrandData && selectedBrandData.map(brand => {
                                                return brand.models.map(model => 
                                                    <option key={model._id} value={model._id} >{model.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["model"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["category"] && 'text-danger'}>Car Category</Form.Label>
                                    <Form.Select className={ formErrors["category"] && 'border-danger'} name='category' disabled  onChange={handleOnChange}>
                                        {/* <option value={null} >Select Category</option> */}
                                        
                                        {
                                           selectedModelData.length && <option key={selectedModelData[0].category._id} value={selectedModelData[0].category._id} >{selectedModelData[0].category.name}</option>
                                        }
                                                
                                        
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["category"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["transmission_type"] && 'text-danger'}>Car Transmission Type</Form.Label>
                                    <Form.Select className={ formErrors["transmission_type"] && 'border-danger'} name='transmission_type'  onChange={handleOnChange}>
                                        <option value={null} >Select Transmission Type</option>
                                        {
                                            transmissionData.map(data => {
                                                return(
                                                    <option key={data._id} value={data._id} >{data.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["transmission_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["fuel_type"] && 'text-danger'}>Car Fuel Type</Form.Label>
                                    <Form.Select className={ formErrors["fuel_type"] && 'border-danger'} name='fuel_type'  onChange={handleOnChange}>
                                        <option value={null} >Select Fuel Type</option>
                                        {
                                            fuelData.map(data => {
                                                return(
                                                    <option key={data._id} value={data._id} >{data.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["fuel_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["registration_type"] && 'text-danger'}>Car Registration Type</Form.Label>
                                    <Form.Select className={ formErrors["registration_type"] && 'border-danger'} name='registration_type'  onChange={handleOnChange}>
                                        <option value={null} >Select Registration Type</option>
                                        {
                                            registrationData.map(data => {
                                                return(
                                                    <option key={data._id} value={data._id} >{data.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["registration_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["registration_number"] && 'text-danger'}>Car Registration Number</Form.Label>
                                    <Form.Control className={ formErrors["registration_number"] && 'border-danger'} type="text" value={formData.registration_number} placeholder="Enter car registration number" name='registration_number'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["registration_number"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label>Car Model Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control name='uploaded_model_picture'  ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                </Form.Group>   
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.uploaded_model_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, uploaded_model_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                        </Row>
                     </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => showAddCarModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmitForm}>
                    Add Car
                </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Edit Car Modal */}
            {editCarData && <Modal size="lg" centered show={editCarData} onHide={() => setEditCarData(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Car</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["brand"] && 'text-danger'}>Car Brand</Form.Label>
                                    <Form.Select  className={ formErrors["brand"] && 'border-danger'} disabled={editCarData.subscription != null} name='brand'  onChange={handleOnChange}>
                                        <option value={editCarData.model?.brand?._id || selectedBrandData[0]._id} key={editCarData.model?.brand?._id || selectedBrandData[0]._id} >{editCarData.model?.brand?.name || selectedBrandData[0].name}</option>
                                        {
                                            carBranData.map(brand => {
                                                if(editCarData.model?.brand){
                                                    if(brand._id != editCarData.model?.brand._id){
                                                        return(
                                                                <option key={brand._id} value={brand._id} >{brand.name}</option>
                                                            )
                                                        }    
                                                }else{
                                                    return(
                                                        selectedBrandData[0]._id != brand._id && <option key={brand._id} value={brand._id} >{brand.name}</option>
                                                    )
                                                }
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["brand"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["model"] && 'text-danger'}>Car Model</Form.Label>
                                    <Form.Select className={ formErrors["model"] && 'border-danger'} disabled={editCarData.subscription != null} name='model'  onChange={handleOnChange}>
                                        { editCarData.model?._id && <option value={editCarData.model?._id} key={editCarData.model?._id} >{editCarData.model?.name}</option>}
                                        {
                                            selectedBrandData && selectedBrandData.map(brand => {
                                                return brand.models.map(model => {
                                                    if(editCarData?.model?._id){
                                                        return model._id != editCarData?.model?._id && <option key={model._id} value={model._id} >{model.name}</option>
                                                    }else{
                                                        return <option key={model._id} value={model._id} >{model.name}</option>
                                                    }
                                                })
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["model"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["category"] && 'text-danger'}>Car Category</Form.Label>
                                    <Form.Select className={ formErrors["category"] && 'border-danger'} name='category' disabled  onChange={handleOnChange}>
                                        {/* <option value={null} >Select Category</option> */}
                                        
                                        {
                                           selectedModelData.length && <option key={selectedModelData[0].category._id} value={selectedModelData[0].category._id} >{selectedModelData[0].category.name}</option>
                                        }
                                                
                                        
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["category"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["transmission_type"] && 'text-danger'}>Car Transmission Type</Form.Label>
                                    <Form.Select className={ formErrors["transmission_type"] && 'border-danger'} name='transmission_type'  onChange={handleOnChange}>
                                        <option value={editCarData.transmission_type._id} key={editCarData.transmission_type._id} >{editCarData.transmission_type.name}</option>
                                        {
                                            transmissionData.map(data => {
                                                return(
                                                    editCarData.transmission_type._id != data._id && <option key={data._id} value={data._id} >{data.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["transmission_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["fuel_type"] && 'text-danger'}>Car Fuel Type</Form.Label>
                                    <Form.Select className={ formErrors["fuel_type"] && 'border-danger'} name='fuel_type'  onChange={handleOnChange}>
                                        <option value={editCarData.fuel_type._id} key={editCarData.fuel_type._id} >{editCarData.fuel_type.name}</option>
                                        {
                                            fuelData.map(data => {
                                                return(
                                                   editCarData.fuel_type._id != data._id && <option key={data._id} value={data._id} >{data.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["fuel_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["registration_type"] && 'text-danger'}>Car Registration Type</Form.Label>
                                    <Form.Select className={ formErrors["registration_type"] && 'border-danger'} name='registration_type'  onChange={handleOnChange}>
                                        <option value={editCarData.registration_type._id} key={editCarData.registration_type._id} >{editCarData.registration_type.name}</option>
                                        {
                                            registrationData.map(data => {
                                                return(
                                                   editCarData.registration_type._id != data._id && <option key={data._id} value={data._id} >{data.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["registration_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["registration_number"] && 'text-danger'}>Car Registration Number</Form.Label>
                                    <Form.Control className={ formErrors["registration_number"] && 'border-danger'} type="text" value={editCarData.registration_number} placeholder="Enter car registration number" name='registration_number'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                       { formErrors["registration_number"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label>Car Model Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control name='uploaded_model_picture' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                </Form.Group>   
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { editCarData && editCarData.uploaded_model_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setEditCarData({...editCarData, uploaded_model_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                        </Row>
                     </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setEditCarData(null)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmitForm}>
                    Update Car
                </Button>
                </Modal.Footer>
            </Modal>}
            

            {/* Subscription Modal */}
            {showSubscriptionModal && <Modal size="lg" centered show={showSubscriptionModal} onHide={() => setShowSubscriptionModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Subscribe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        {
                            subscribeFormStep == 1 && (homeAddress ? homeAddress.locked == false : true) && <>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicText">
                                            <Form.Label>Car Cluster</Form.Label>
                                            <Form.Select name='cluster'  onChange={handleOnChange}>
                                                <option>Select your address</option>
                                                { 
                                                    clusterData.map((cluster, index) => {
                                                        return(
                                                            <>
                                                                <option key={index} value={cluster._id} >{cluster.name}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>

                                    { subscribeFormData && subscribeFormData.cluster && 
                                        <>
                                            <Col>
                                                <Form.Group className="mb-3" controlId="formBasicText">
                                                    <Form.Label>House/Flat Number</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter car registration number" name='house_flat_number'  onChange={handleOnChange}/>
                                                    {/* <Form.Text className="text-muted">
                                                    Enter without spaces. E.g. AA00BB1122
                                                    </Form.Text> */}
                                                </Form.Group>
                                            </Col>
                                            
                                            <Col>
                                                <Form.Group className="mb-3" controlId="formBasicText">
                                                    <Form.Label>Car Parking Lot Number</Form.Label>
                                                    <Form.Control type="text" placeholder="Enter car registration number" name='parking_lot_number'  onChange={handleOnChange}/>
                                                    {/* <Form.Text className="text-muted">
                                                    Enter without spaces. E.g. AA00BB1122
                                                    </Form.Text> */}
                                                </Form.Group>
                                            </Col>
                                        </>
                                    }
                                </Row>
                                <Row className="mt-2">
                                    {
                                        subscribeFormData && subscribeFormData.cluster && selectedCluster && selectedCluster.length && 
                                        <>
                                            <h5>Cluster Address</h5>
                                            <Row>
                                                <Col lg={4}>
                                                    <p>
                                                        {
                                                        selectedCluster[0].address.line_1 + ", " +
                                                        (selectedCluster[0].address.line_2 && ", ") +
                                                        selectedCluster[0].address.area + ", " +
                                                        selectedCluster[0].address.city + ", " +
                                                        selectedCluster[0].address.zip_code + ", " +
                                                        selectedCluster[0].address.state + ", " + 
                                                        selectedCluster[0].address.country 
                                                        }
                                                    </p>
                                                </Col>
                                            </Row>
                                        </>
                                    }
                                </Row>
                            </>
                        }
                        
                        {
                            subscribeFormStep == 1 && homeAddress && homeAddress.locked && <>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicText">
                                            <Form.Label>House/Flat Number</Form.Label>
                                            <Form.Control value={selectedCar[0].house_flat_no} type="text" placeholder="Enter car house/flat number" name='house_flat_number'  onChange={handleOnChange}/>
                                            {/* <Form.Text className="text-muted">
                                            Enter without spaces. E.g. AA00BB1122
                                            </Form.Text> */}
                                        </Form.Group>
                                    </Col>
                                    
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicText">
                                            <Form.Label>Car Parking Lot Number</Form.Label>
                                            <Form.Control value={selectedCar[0].parking_lot_number} type="text" placeholder="Enter car registration number" name='parking_lot_number'  onChange={handleOnChange}/>
                                            {/* <Form.Text className="text-muted">
                                            Enter without spaces. E.g. AA00BB1122
                                            </Form.Text> */}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    {
                                        homeAddress && 
                                        <>
                                            <h5>Address</h5>
                                            <Row>
                                                <Col lg={4}>
                                                    <p>
                                                        {
                                                            homeAddress.line_1 + ", " +
                                                            (homeAddress.line_2 && ", ") +
                                                            homeAddress.area + ", " +
                                                            homeAddress.city + ", " +
                                                            homeAddress.zip_code + ", " +
                                                            homeAddress.state + ", " + 
                                                            homeAddress.country 
                                                        }
                                                    </p>
                                                </Col>
                                            </Row>
                                        </>
                                    }
                                </Row>
                            </>
                        }
                        
                        {
                            subscribeFormStep == 2 && <>
                                <Row>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicText">
                                            <Form.Label>Time Slot</Form.Label>
                                            <Form.Select name='time_slot'  onChange={handleOnChange}>
                                                <option>Select time slot</option>
                                                { 
                                                    selectedCluster && selectedCluster.time_slot && selectedCluster.time_slot.map((slot, index) => {
                                                        return(
                                                            <>
                                                                <option key={index} value={slot._id} >{`${slot.start_time.hour}:${slot.start_time.minute == 0 ? '00' : slot.start_time.minute} ${slot.start_time.ampm} - ${slot.end_time.hour}:${slot.end_time.minute == 0 ? '00' : slot.end_time.minute} ${slot.end_time.ampm}`}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="mb-3" controlId="formBasicText">
                                            <Form.Label>Package</Form.Label>
                                            <Form.Select name='package' onChange={handleOnChange}>
                                                <option>Select package</option>
                                                { 
                                                    
                                                    selectedCluster.qr_code_series != null && packageData.map((package_, index) => {
                                                        return(
                                                            package_.visible && 
                                                            <>
                                                                <option key={index} value={package_._id} >{package_.name}</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <Col md={7} lg={7}>
                                                <Form.Group>
                                                    <Form.Label>Discount Coupon</Form.Label>
                                                    <Form.Control type="text" onChange={(e) => setAppliedCouponCode(e.target.value)} placeholder="Coupon code" />
                                                    <Form.Text></Form.Text>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>.</Form.Label>
                                                    <Form.Control as={Button} variant='outline' onClick={handleDiscountCoupon} className="text-primary border-primary" placeholder="Coupon code" >Apply</Form.Control>
                                                    {/* <Button>Apply</Button> */}
                                                    {/* <Form.Text></Form.Text> */}
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                
                                <Row className="mt-3">
                                    {
                                        selectedPackage.length > 0 && 
                                        <>
                                            <h6>Package Details</h6>
                                            <Row>
                                                <Col>Package Name</Col>
                                                <Col>{selectedPackage[0].name}</Col>
                                            </Row>
                                            <Row>
                                                <Col>Number of Days</Col>
                                                <Col>{selectedPackage[0].number_of_days}</Col>
                                            </Row>
                                            <Row>
                                                <Col>Number of Exterior Cleanings</Col>
                                                <Col>{selectedPackage[0].exterior_cleaning}</Col>
                                            </Row>
                                            <Row>
                                                <Col>Number of Interior Cleanings</Col>
                                                <Col>{selectedPackage[0].interior_cleaning}</Col>
                                            </Row>
                                            <Row>
                                                <Col>First Car Price</Col>
                                                <Col>{priceData && priceData.first_car_price}</Col>
                                            </Row>
                                            <Row>
                                                <Col>Second Onward Car Discount</Col>
                                                <Col>{priceData && priceData.second_car_onward_discount}</Col>
                                            </Row>
                                            <Row>
                                                <Col>Net Price</Col>
                                                <Col>{priceData && priceData.net_price}</Col>
                                            </Row>
                                            <Row>
                                                <Col>Cleaning Balance Adjustment</Col>
                                                <Col>{priceData && priceData.cleaning_balance_adjustment}</Col>
                                            </Row>
                                            <Row>
                                                <Col>Discount</Col>
                                                <Col>
                                                    <Row>
                                                        <Col>{priceData && priceData.coupon_discount}</Col>
                                                        <Col style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                                            { appliedCoupon &&
                                                                <span style={{ cursor: 'pointer', marginLeft: '1rem' }} onClick={removeDiscountCoupon} className="text-danger">Remove</span>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </Col>                                        
                                            </Row>
                                            <Row>
                                                <Col>Net Payable</Col>
                                                <Col>{priceData && priceData.net_payable}</Col>
                                            </Row>
                                            {
                                                priceData && priceData.taxes.map((taxData) => {
                                                    // setTotalAmount(pre => (pre + ((taxData.tax_value / 100) * 100)))
                                                    return(
                                                        <>
                                                            <Row>
                                                                <Col>{taxData.name}</Col>
                                                                <Col>{taxData.value + "%"}</Col>
                                                            </Row>
                                                        </>
                                                    )
                                                })
                                            }
                                            {
                                                priceData && priceData.taxes && priceData.taxes.length > 0 &&
                                                <Row>
                                                    <Col>Total Tax Amount</Col>
                                                    <Col>{priceData && priceData.total_tax_amount}</Col>
                                                </Row>
                                            }
                                            <Row>
                                                <Col>Total Payable</Col>
                                                <Col>{priceData && priceData.total_payable}</Col>
                                            </Row>
                                        </>
                                    }
                                </Row> 
                            </>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSubscriptionModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmitForm}>
                    { subscribeFormStep == 1 && "Confirm Address" }
                    { subscribeFormStep == 2 && "Pay " + (priceData && priceData.total_payable || '') }
                </Button>
                </Modal.Footer>
            </Modal>}

            {/* Add Address */}
            <Modal size="lg" centered show={showAddressModal == 'add'} onHide={closeAddressModal}>
                <Modal.Header closeButton>
                <Modal.Title>Add New Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["cluster"] && 'text-danger'}>Cluster</Form.Label>
                                    <Form.Select className={ formErrors["cluster"] && 'border-danger'} name='cluster'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Cluster</option>
                                        {
                                            clusterData && clusterData.map((cluster, index) => {
                                                return <option key={index} value={cluster._id}>{cluster.name}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["cluster"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["address_type"] && 'text-danger'}>Address Type</Form.Label>
                                    <Form.Select className={ formErrors["address_type"] && 'border-danger'} name='address_type'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Address Type</option>
                                        <option value={"HOME"} >Home</option>
                                        <option value={"OFFICE"} >Office</option>
                                        <option value={"OTHER"} >Other</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["address_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                            {
                                showAddressModal == "add" && formData && formData.address_type == "OTHER" &&     
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                        <Form.Label className={ formErrors["other_name"] && 'text-danger'}>Address Name</Form.Label>
                                        <Form.Control className={ formErrors["other_name"] && 'border-danger'} type="text" placeholder="Address Name" name='other_name'  onChange={handleOnChange}/>
                                        <Form.Text className="text-danger">
                                        { formErrors["other_name"] }
                                    </Form.Text>
                                    </Form.Group>
                            }
                            </Col>
                        </Row>
                        
                        { formData.cluster_name && <><Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["line_1"] && 'text-danger'}>Address Line 1</Form.Label>
                                    <Form.Control readOnly disabled value={formData.line_1} className={ formErrors["line_1"] && 'border-danger'} type="text" placeholder="Enter Line 1" name='line_1'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["line_1"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control readOnly disabled value={formData.line_2} type="text" placeholder="Enter Line 2 (Optional)" name='line_2'  onChange={handleOnChange}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["area"] && 'text-danger'}>Area</Form.Label>
                                    <Form.Control readOnly disabled value={formData.area} className={ formErrors["area"] && 'border-danger'} type="text" placeholder="Enter Area name" name='area'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["area"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["zip_code"] && 'text-danger'}>Zip Code</Form.Label>
                                    <Form.Control readOnly disabled value={formData.zip_code} className={ formErrors["zip_code"] && 'border-danger'} type="text" placeholder="Enter Zip Code" name='zip_code'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["zip_code"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["city"] && 'text-danger'}>City</Form.Label>
                                    <Form.Select readOnly disabled className={ formErrors["city"] && 'border-danger'} name='city'  onChange={handleOnChange}>
                                        { formData.city != null ? <option value={formData.city} selected={true} >{formData.city}</option> : <option value={null} >Select City</option>}
                                        {
                                            cities && cities.length && cities.map(city => {
                                                return(
                                                    <option value={city} key={city}>{city}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["city"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["state"] && 'text-danger'}>State</Form.Label>
                                    <Form.Select readOnly disabled className={ formErrors["state"] && 'border-danger'} name='state'  onChange={handleOnChange}>
                                        {formData.state ? <option value={formData.state} >{formData.state}</option> : <option value={null} >Select State</option>}
                                        {
                                            states && states.states && states.states.map(state_ => {
                                                return(
                                                    <option value={state_.name} selected={state_.name == state} key={state_.name}>{state_.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["state"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select readOnly disabled name='country'  onChange={handleOnChange}>
                                        <option value={null} >Select Country</option>
                                        {
                                            countries.map(country => {
                                                return(
                                                    <option selected={country.name == "India"} key={country.name} value={country.name} >{country.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                
                            </Col>
                            <Col>
                                
                            </Col>
                        </Row></>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeAddressModal}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmitForm}>
                    Add Address
                </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Update Address */}
            <Modal size="lg" centered show={showAddressModal == 'update'} onHide={closeAddressModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["cluster"] && 'text-danger'}>Cluster</Form.Label>
                                    <Form.Select className={ formErrors["cluster"] && 'border-danger'} name='cluster'  onChange={handleOnChange}>
                                        {formData.cluster_db_id ? <option selected value={formData.cluster_db_id} >{formData.cluster_name}</option> : <option value={"null"} >Select Cluster</option>}
                                        {
                                            clusterData && clusterData.map((cluster, index) => {
                                                return <option key={index} value={cluster._id}>{cluster.name}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["cluster"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["address_type"] && 'text-danger'}>Address Type</Form.Label>
                                    <Form.Select className={ formErrors["address_type"] && 'border-danger'} name='address_type'  onChange={handleOnChange}>
                                        <option value={null} >Select Address Type</option>
                                        <option selected={formData.address_type == "HOME"} value={"HOME"} >Home</option>
                                        <option selected={formData.address_type == "OFFICE"} value={"OFFICE"} >Office</option>
                                        <option selected={formData.address_type == "OTHER"} value={"OTHER"} >Other</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors['address_type'] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                {
                                    showAddressModal == "update" && formData && formData.address_type == "OTHER" &&
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                        <Form.Label className={ formErrors["other_name"] && 'text-danger'}>Address Name</Form.Label>
                                        <Form.Control className={ formErrors["other_name"] && 'border-danger'} type="text" placeholder="Address Name" name='other_name' value={formData.other_name} onChange={handleOnChange}/>
                                        <Form.Text className="text-danger">
                                            { formErrors['other_name'] }
                                        </Form.Text>
                                    </Form.Group>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["line_1"] && 'text-danger'}>Address Line 1</Form.Label>
                                    <Form.Control disabled className={ formErrors["line_1"] && 'border-danger'} type="text" placeholder="Enter Line 1" name='line_1' value={formData.line_1} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors['line_1'] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Line 2 (Optional)" name='line_2' value={formData.line_2 || ''} onChange={handleOnChange}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["area"] && 'text-danger'}>Area</Form.Label>
                                    <Form.Control disabled className={ formErrors["area"] && 'border-danger'} type="text" placeholder="Enter Area name" name='area' value={formData.area} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors['area'] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["zip_code"] && 'text-danger'}>Zip Code</Form.Label>
                                    <Form.Control disabled className={ formErrors["zip_code"] && 'border-danger'} type="text" placeholder="Enter Zip Code" name='zip_code' value={formData.zip_code} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors['zip_code'] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["city"] && 'text-danger'}>City</Form.Label>
                                    <Form.Select disabled className={ formErrors["city"] && 'border-danger'} name='city'  onChange={handleOnChange}>
                                        { formData.city ? <option value={formData.city} selected >{formData.city}</option> :  <option value={null} >Select City</option>}
                                        {
                                            cities && cities.length && cities.map(city => {
                                                return(
                                                    <option selected={formData.city == city} value={city} key={city}>{city}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors['city'] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["state"] && 'text-danger'}>State</Form.Label>
                                    <Form.Select disabled className={ formErrors["state"] && 'border-danger'} name='state'  onChange={handleOnChange}>
                                        <option value={null} >Select State</option>
                                        {
                                            states && states.states && states.states.map(state => {
                                                return(
                                                    <option selected={formData.state == state.name} value={state.name} key={state.name}>{state.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors['state'] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select disabled name='country'  onChange={handleOnChange}>
                                        <option value={null} >Select Country</option>
                                        {
                                            countries.map(country => {
                                                return(
                                                    <option key={country.name} selected={country.name == formData.country || country.name == "India"} value={country.name} >{country.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                
                            </Col>
                            <Col>
                                
                            </Col>
                        </Row>
                     </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeAddressModal}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmitForm}>
                    Update Address
                </Button>
                </Modal.Footer>
            </Modal>
            
            {showRaiseRequestModal && <Modal size="lg" centered show={showRaiseRequestModal != null} onHide={() => setShowRaiseRequestModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Raise Address Change Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Type</Form.Label>
                                    <Form.Select disabled name='address_type'>
                                        <option >{showRaiseRequestModal.address_type}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                {
                                    showRaiseRequestModal && showRaiseRequestModal.address_type == "OTHER" &&
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                        <Form.Label>Address Name</Form.Label>
                                        <Form.Control disabled type="text" placeholder="Address Name" name='other_name' value={showRaiseRequestModal.other_name} />
                                    </Form.Group>
                                }
                            </Col>
                            <Col>
                                
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 1</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Line 1" name='line_1' value={showRaiseRequestModal.line_1}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Line 2 (Optional)" name='line_2' value={showRaiseRequestModal.line_2 || ''}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Area</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Area name" name='area' value={showRaiseRequestModal.area}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Zip Code</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Zip Code" name='zip_code' value={showRaiseRequestModal.zip_code}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>City</Form.Label>
                                    <Form.Select disabled name='city'>
                                        <option>{showRaiseRequestModal.city}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>State</Form.Label>
                                    <Form.Select name='state' disabled>
                                        <option >{showRaiseRequestModal.state}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select name='country' disabled>
                                        <option>{showRaiseRequestModal.country}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                
                            </Col>
                            <Col>
                                
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control name='comment' onChange={(event) => setChangeRequestComment(event.target.value)} as="textarea" rows={3} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowRaiseRequestModal(null)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={raiseRequest}>
                    Raise Request
                </Button>
                </Modal.Footer>
            </Modal>}
            
            {/* Request to start service */}
            {showServiceNotStartModal && <Modal size="lg" centered show={showServiceNotStartModal != null} onHide={() => {setShowServiceNotStartModal(null); setSelectedCluster(null); setSubscribeFormStep(1)} }>
                <Modal.Header closeButton>
                <Modal.Title>Request to start service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Typography variant="h6" className="mb-2">Requestor details</Typography>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Requestor Name</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Username" name='username' value={data.name}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Mobile Number</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Mobile Number" name='mobile_number' value={data.mobile_number}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["requestor_role"] && 'text-danger'}>Requestor Role</Form.Label>
                                    <Form.Select className={ formErrors["requestor_role"] && 'border-danger'} name='requestor_role' onChange={handleOnChange}>
                                        <option value={"null"}>Select Role</option>
                                        { rolesData && rolesData.map((role, index) => {
                                            return(
                                                <option key={index} value={role._id}>{role.name}</option>
                                            )
                                        }) }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["requestor_role"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <hr />
                        <Typography variant="h6" className="mb-2">Cluster details</Typography>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Cluster Name</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Line 1" name='cluster' value={selectedCluster[0].name}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 1</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Line 1" name='line_1' value={selectedCluster[0].address.line_1}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Line 2 (Optional)" name='line_2' value={selectedCluster[0].address.line_2 || ''}/>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Area</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Area name" name='area' value={selectedCluster[0].address.area}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Zip Code</Form.Label>
                                    <Form.Control disabled type="text" placeholder="Enter Zip Code" name='zip_code' value={selectedCluster[0].address.zip_code}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>City</Form.Label>
                                    <Form.Select disabled name='city'>
                                        <option>{selectedCluster[0].address.city}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>State</Form.Label>
                                    <Form.Select name='state' disabled>
                                        <option >{selectedCluster[0].address.state}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Select name='country' disabled>
                                        <option>{selectedCluster[0].address.country}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control onChange={handleOnChange} name='comment' as="textarea" rows={3} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowServiceNotStartModal(null); setSelectedCluster(null); setSubscribeFormStep(1)}}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleSubmitForm}>
                    Raise Request
                </Button>
                </Modal.Footer>
            </Modal>}

            {/* Image Viewer */}
            <Modal size="md" centered show={imageData != null} onHide={() => setImageData(null)}>
                <Modal.Header closeButton>
                {/* <Modal.Title>{imageData && imageData.name}</Modal.Title> */}
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    { imageData && <img src={imageData.image_data} width={'200rem'} height={"auto"} alt={imageData.name} /> }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" type='submit' onClick={() => setImageData(null)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>


            {/* Delete Car */}
            <Modal centered show={deleteType == 'car' && deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Car</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Car ?</p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setDeleteId(null)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={deleteData}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>


            {/* Delete Address */}
            <Modal centered show={deleteType == 'address' && deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Address ?</p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setDeleteId(null)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={deleteData}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Loader */}
            <Modal size='md' centered show={loading} onHide={() => console.log("nothing")}>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                    <h3>Processing subscription...</h3>
                    <Spinner animation="border" className='m-5 text-primary' role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    {/* <p>This might take some time</p> */}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CustomerView