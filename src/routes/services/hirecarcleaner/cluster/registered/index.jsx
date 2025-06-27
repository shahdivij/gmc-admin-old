import { useEffect, useState, useRef } from 'react'
import {
    Container,
    Row,
    Col,
    Button,
    Table,
    Modal,
    Form
} from 'react-bootstrap'
import { MdDeleteOutline, MdEdit } from "react-icons/md"
import { imageToBase64 } from '../../../../../utility/commonFunctions'
import {
    GET,
    POST,
    DELETE,
    PUT
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import {
    getCountries,
    getStates,
    getCities,
    getPincodeData
} from '../../../../../api/map_data'
import { Link } from 'react-router-dom'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosInformationCircleOutline } from "react-icons/io"
import URL_STRINGS from '../../../../../utility/URL_STRINGS'
import Multiselect from 'multiselect-react-dropdown'


const Registered = () => {

    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [qrCodeSeriesData, setQrCodeSeriesData] = useState([])
    const [packageData, setPackageData] = useState([])
    const [residenceData, setResidenceData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [city, setCity] = useState(null)
    const [state, setState] = useState(null)
    const imageInputRef = useRef(null)
    const [formErrors, setFormErrors] = useState({})
    const [selectedPackages, setSelectedPackages] = useState([])


    const fetchData = async () => {
        
        const {data, error} = await GET(URL.CLUSTER.REGISTERED)
        
        if(data)
            setData(data)

        const residenceTypes = await GET(URL.CLUSTER.RESIDENCE)
        if(residenceTypes.data)
            setResidenceData(residenceTypes.data)

        const countriesData = await getCountries()
        if(countriesData.length)
            setCountries(countriesData)

        const statesData = await getStates("India")
        if(statesData)
            setStates(statesData)

        const qrcodeseriesdata = await GET(URL.QRCODE_SERIES.SERIES)
        console.log(qrcodeseriesdata)
        if(qrcodeseriesdata.data)
            setQrCodeSeriesData(qrcodeseriesdata.data)
        
        const packagedata_ = await GET(URL.PACKAGE)
        console.log(packagedata_)
        if(packagedata_.data)
            setPackageData(packagedata_.data)

    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        setFormErrors({...formErrors})

        if(name === 'state'){
            const citiesData = await getCities(value, formData.country)
            if(citiesData)
                setCities(citiesData)
        }

        if(name === 'zip_code'){
            if(value.toString().length == 6){
                const zipData = await getPincodeData(value)
                if(zipData && zipData.length > 0){
                    console.log(zipData)
                    const city_ = zipData[0].District
                    const state_ = zipData[0].State
                    setCity(city_)
                    setState(state_)
                    formData.country = "India"
                    formData.city = city_
                    formData.state = state_
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

        if(name == "cluster_picture"){
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
        } else if (name == 'latitude') {
            setFormData({
                ...formData,
                geo_location: {
                    ...formData.geo_location,
                    [name]: value
                }
            })
        } else if (name == 'longitude') {
            setFormData({
                ...formData,
                geo_location: {
                    ...formData.geo_location,
                    [name]: value
                }
            })
        } else if (name == "approved") {
            const value = target.checked
            setFormData({
                ...formData,
                [name]: value
            })    
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    const deleteData = async () => {
        const {data, error} = await DELETE(`${URL.CLUSTER.REGISTERED}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const handleFormSubmit = async () => {
        console.log(formData)
        if(showModal == 'qrseries'){
            if(formData.cluster && formData.qr_code_series){
                const dataToSend = {
                    cluster: formData.cluster,
                    qr_code_series : formData.qr_code_series
                }

                const {data, error} = await POST(URL.QRCODE_SERIES.ASSIGN, dataToSend)
                if(data){
                    setFormData({})
                    setShowModal(false)
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }

            } else {
                if(!formData.cluster){
                    setFormErrors(pre => ({...pre, cluster: "Please select a cluster."}))
                }
                if(!formData.qr_code_series){
                    setFormErrors(pre => ({...pre, qr_code_series: "Please select a QR code series."}))
                }
            }
        } else if(showModal == 'edit') {
            console.log(formData)
            if(formData.name && formData.line_1 && formData.area && formData.city && formData.zip_code && formData.zip_code.toString().length == 6 && formData.cluster_id && formData.residence_type && formData.residence_type != "null" && formData.cluster_picture && (formData.longitude || formData.geo_location?.longitude) && (formData.latitude || formData.geo_location?.latitude)){
                const dataToSend = {
                    name: formData.name,
                    address: {
                        line_1: formData.line_1,
                        line_2: formData.line_2,
                        area: formData.area,
                        city: formData.city,
                        state: formData.state,
                        country: "India",
                        zip_code: formData.zip_code,
                    },
                    qr_code_series: formData.qr_code_series != null && formData.qr_code_series._id || formData.qr_code_series || null,
                    cluster_id: formData.cluster_id,
                    residence_type: formData.residence_type._id || formData.residence_type,
                    cluster_picture: {
                        name: formData.cluster_picture.name,
                        image_data: formData.cluster_picture.image_data
                    },
                    geo_location: {
                        longitude: formData.geo_location.longitude,
                        latitude: formData.geo_location.latitude
                    },
                    off_days: [...formData.off_days, formData.off_day],
                    approved: formData.approved || false,
                    packages: formData.packages || []
                }
    
                const {data, error} = await PUT(URL.CLUSTER.REGISTERED + "/" + formData._id, dataToSend)
                if(data){
                    setFormData({})
                    setShowModal(false)
                    fetchData()
                } 
    
                if(error){
                    alert(error)
                    console.log(error)
                }
            } else {
                if(!formData.name){
                    setFormErrors(pre => ({...pre, name: "Please enter cluster name."}))
                }
                if(!formData.area){
                    setFormErrors(pre => ({...pre, area: "Please enter area name."}))
                }
                if(!formData.line_1){
                    setFormErrors(pre => ({...pre, line_1: "Please enter address."}))
                }
                if(!formData.zip_code){
                    setFormErrors(pre => ({...pre, zip_code: "Please enter zip code."}))
                }
                if(!formData.city){
                    setFormErrors(pre => ({...pre, city: "Please select a city."}))
                }
                if(!formData.state){
                    setFormErrors(pre => ({...pre, state: "Please select a state."}))
                }
                if(!formData.residence_type || formData.residence_type == "null"){
                    setFormErrors(pre => ({...pre, residence_type: "Please select residence type."}))
                }
                if(!formData.cluster_picture){
                    setFormErrors(pre => ({...pre, cluster_picture: "Please upload cluster picture."}))
                }
                if(!formData.geo_location){
                    setFormErrors(pre => ({...pre, longitude: "Please enter longitude."}))
                } else if (!formData.geo_location.longitude){
                    setFormErrors(pre => ({...pre, longitude: "Please enter longitude."}))
                }
                if(!formData.geo_location){
                    setFormErrors(pre => ({...pre, latitude: "Please enter latitude."}))
                } else if (!formData.geo_location.latitude){
                    setFormErrors(pre => ({...pre, latitude: "Please enter latitude."}))
                }
            }

        } else if (showModal == 'package') {
            if(formData.cluster && formData.package){
                const dataToSend = {
                    cluster: formData.cluster,
                    package: formData.package
                }
    
                const selectedPackage = packageData.filter(pkd => pkd._id == formData.package)
                const selectedCluster = data.filter(cl => cl._id == formData.cluster)
                const possibleOffDays = selectedCluster[0].off_days.length > 0 ? Math.floor(selectedPackage[0].number_of_days / (selectedCluster[0].off_days.length * 7)) + 2 : 2
                if((selectedPackage[0].number_of_days - possibleOffDays) < (selectedPackage[0].interior_cleaning + selectedPackage[0].exterior_cleaning)){
                    alert("This package can not be assigned to this cluster.")
                } else {
                    console.log(dataToSend)
    
                    const {data, error} = await POST(URL.CLUSTER.PACKAGE, dataToSend)
                    if(data){
                        setFormData({})
                        setShowModal(false)
                        fetchData()
                    } 
    
                    if(error){
                        alert(error)
                        console.log(error)
                    }
                }
            } else {
                if(!formData.cluster){
                    setFormErrors(pre => ({...pre, cluster: "Please select a cluster."}))
                }
                if(!formData.package){
                    setFormErrors(pre => ({...pre, package: "Please select a package."}))
                }
            }
        } else {

            if(formData.name && formData.residence_type && formData.cluster_picture && formData.line_1 && formData.city && formData.state && formData.zip_code && formData.zip_code.toString().length == 6 && formData.area && (formData.latitude || formData.geo_location.latitude) && (formData.longitude || formData.geo_location.longitude)){ 
                const dataToSend = {
                    name: formData.name,
                    residence_type: formData.residence_type,
                    cluster_picture: formData.cluster_picture,
                    address: {
                        line_1: formData.line_1,
                        line_2: formData.line_2 || '',
                        area: formData.area,
                        zip_code: formData.zip_code,
                        city: formData.city,
                        state: formData.state,
                        country: "India"
                    },
                    geo_location: formData.geo_location,
                    qr_code_series: formData.qr_code_series || null,
                    off_days: [formData.off_day || "NONE"],
                    approved: formData.approved || false,
                    packages: formData.packages || []
                }
                
                const {data, error} = await POST(URL.CLUSTER.REGISTERED, dataToSend)
                if(data){
                    setFormData({})
                    setShowModal(false)
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }else{ 
                if(!formData.name){
                    setFormErrors(pre => ({...pre, name: "Please enter cluster name."}))
                }
                if(!formData.area){
                    setFormErrors(pre => ({...pre, area: "Please enter area name."}))
                }
                if(!formData.line_1){
                    setFormErrors(pre => ({...pre, line_1: "Please enter address."}))
                }
                if(!formData.zip_code){
                    setFormErrors(pre => ({...pre, zip_code: "Please enter zip code."}))
                }
                if(!formData.city){
                    setFormErrors(pre => ({...pre, city: "Please select a city."}))
                }
                if(!formData.state){
                    setFormErrors(pre => ({...pre, state: "Please select a state."}))
                }
                if(!formData.residence_type){
                    setFormErrors(pre => ({...pre, residence_type: "Please select residence type."}))
                }
                if(!formData.cluster_picture){
                    setFormErrors(pre => ({...pre, cluster_picture: "Please upload cluster picture."}))
                }
                if(!formData.longitude){
                    setFormErrors(pre => ({...pre, longitude: "Please enter longitude."}))
                } else if (formData.geo_location && !formData.geo_location.longitude){
                    setFormErrors(pre => ({...pre, longitude: "Please enter longitude."}))
                }
                if(!formData.latitude){
                    setFormErrors(pre => ({...pre, latitude: "Please enter latitude."}))
                } else if (formData.geo_location && !formData.geo_location.latitude){
                    setFormErrors(pre => ({...pre, latitude: "Please enter latitude."}))
                }
                if(formData.zip_code && formData.zip_code.toString().length != 6){
                    setFormErrors(pre => ({...pre, zip_code: "Please enter valid zip code."}))
                }
            }
        }
    }

    useEffect(() => {
        fetchData()
        setFormErrors({})
        setFormData({})
    }, [])

    useEffect(() => {
        const setData = async () => {
            if(formData){
                if(formData.country){
                    const sd = await getStates(formData.country)
                    setStates(sd)
                }
                if(formData.state && formData.country){
                    const sd = await getCities(formData.state, formData.country)
                    if(sd && sd.length > 0)
                        setCities([...sd])
                }
            }
        }

        setData()
    }, [formData])

    useEffect(() => {
        if(!showModal){
            setFormData({})
            setSelectedPackages([])
            setFormErrors({})
        }
        setFormErrors({})
    }, [showModal])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col md={6}>
                        <h3 className='pageTitle'>Registered Cluster</h3>
                    </Col>
                    <Col md={6} style={{ textAlign: "right" }}>
                        <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Col lg={'auto'}>
                                {/* <Button onClick={() => setShowModal('package')}>Assign Package</Button> */}
                            </Col>
                            <Col lg={'auto'}>
                                {/* <Button onClick={() => setShowModal('qrseries')}>Assign QR Series</Button> */}
                            </Col>
                            <Col lg={'auto'}>
                                <Button onClick={() => setShowModal('cluster')}>Add Cluster</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover responsive={"lg"}>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Cluster ID</th>
                                <th>Name</th>
                                {/* <th>Residence Type</th> */}
                                <th >Supervisor</th>
                                <th>Address</th>
                                {/* <th>Geo Location (Lat., Long.)</th> */}
                                <th>QR Series</th>
                                <th>Off Day</th>
                                <th>Approved</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length && data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td><Link to={ URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.VIEW + "/" + item._id}>{item.cluster_id}</Link></td>
                                            <td><Link to={ URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.VIEW + "/" + item._id}>{item.name}</Link></td>
                                            {/* <td>{item.residence_type?.name || "none"}</td> */}
                                            <td>{item.supervisor || "Not assigned yet"}</td>
                                            <td>{item.address.line_1 + item.address.line_2 + ", " + item.address.area + ", " + item.address.city}</td>
                                            {/* <td style={{ textAlign: 'center' }}>{`(${item.geo_location.latitude}, ${item.geo_location.longitude})`}</td> */}
                                            <td>{(item.qr_code_series && item.qr_code_series.name) || 'Not assigned yet'}</td>
                                            <td>{item.off_days && item.off_days.length && item.off_days[0] || "-"}</td>
                                            <td>{item.approved ? 'Yes' : 'No'}</td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit size={25} onClick={ async () => {
                                                    setShowModal('edit')
                                                    setFormData({})
                                                    const d = {
                                                        ...item,
                                                        ...item.address
                                                    }
                                                    
                                                    delete d.address
                                                    setFormData({...d, _id: item._id})
                                                    if(item.packages){
                                                        setSelectedPackages([...item.packages])
                                                    } 
                                                }} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
        

            {/* Add new cluster */}
            <Modal size='lg' fullscreen={false} centered show={showModal == 'cluster'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Cluster</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Cluster Name</Form.Label>
                                    <Form.Control className={ formErrors["name"] && 'border-danger'}  type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["residence_type"] && 'text-danger'}>Residence Type</Form.Label>
                                    <Form.Select className={ formErrors["residence_type"] && 'border-danger'}  name='residence_type'  onChange={handleOnChange}>
                                        <option value={null} >Select Residence Type</option>
                                        {
                                            residenceData.map(residenceType => {
                                                return(
                                                    <option key={residenceType._id} value={residenceType._id}>{residenceType.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["residence_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Cluster Off Day</Form.Label>
                                    <Form.Select name='off_day'  onChange={handleOnChange}>
                                        {
                                            ["NONE", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map(day => {
                                                return(
                                                    <option key={day} value={day} >{day}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["line_1"] && 'text-danger'}>Address Line 1</Form.Label>
                                    <Form.Control  className={ formErrors["line_1"] && 'border-danger'} type="text" placeholder="Enter Line 1" name='line_1'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["line_1"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Line 2 (Optional)" name='line_2'  onChange={handleOnChange}/>
                                    
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["area"] && 'text-danger'}>Area</Form.Label>
                                    <Form.Control  className={ formErrors["area"] && 'border-danger'} type="text" placeholder="Enter Area name" name='area'  onChange={handleOnChange}/>
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
                                    <Form.Control className={ formErrors["zip_code"] && 'border-danger'}  type="text" placeholder="Enter Zip Code" name='zip_code'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["zip_code"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["city"] && 'text-danger'}>City</Form.Label>
                                    <Form.Select className={ formErrors["city"] && 'border-danger'}  name='city'  onChange={handleOnChange}>
                                        { city != null ? <option selected={true} value={city} >{city}</option> : <option value={null} >Select City</option>}
                                        {
                                            cities.map(city_ => {
                                                if(city_.startsWith("Bi"))
                                                    console.log(city_, city)
                                                return(
                                                    <option selected={city_ == city} value={city_} key={city_}>{city_}</option>
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
                                    <Form.Select  className={ formErrors["state"] && 'border-danger'} name='state'  onChange={handleOnChange}>
                                        <option value={null} >Select State</option>
                                        {
                                            states && states.states && states.states.map(state_ => {
                                                
                                                return(
                                                    <option selected={state_.name == state} value={state_.name} key={state_.name}>{state_.name}</option>
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
                                    <Form.Select disabled name='country'  onChange={handleOnChange}>
                                        <option value={null} >Select Country</option>
                                        {
                                            countries.map(country => {
                                                return(
                                                    <option key={country.name} selected={country.name == "India"} value={country.name} >{country.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["latitude"] && 'text-danger'}>Geo Location Latitude</Form.Label>
                                    <Form.Control  className={ formErrors["latitude"] && 'border-danger'} type="text" placeholder="Goe Location Latitude" name='latitude'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["latitude"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["longitude"] && 'text-danger'}>Geo Location Longitude</Form.Label>
                                    <Form.Control  className={ formErrors["longitude"] && 'border-danger'} type="text" placeholder="Geo Location Longitude" name='longitude'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["longitude"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label>QR Code Series</Form.Label>
                                    <Form.Select name='qr_code_series' onChange={handleOnChange}>
                                        <option value={null} >Select QR Code Series</option>
                                        {
                                            qrCodeSeriesData.map((series, index) => {
                                                return(
                                                    !series.cluster && <option key={index} value={series._id} >{series.name}</option> 
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label className={ formErrors["cluster_picture"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control  className={ formErrors["cluster_picture"] && 'border-danger'} ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" name='cluster_picture' type='file' onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                        { formErrors["cluster_picture"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.cluster_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, cluster_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                        </Row>
                        <Row>
                            <Form.Group>
                                <Form.Label>Select Packages</Form.Label>
                                <Multiselect 
                                    placeholder='Select Packages'
                                    options={packageData}
                                    displayValue="name"
                                    onSelect={(selectedList, selectedItem) => {
                                        setSelectedPackages([...selectedPackages, selectedItem])
                                        setFormData(pre => {
                                            return {
                                                ...pre,
                                                packages: pre.packages ? [...pre.packages, selectedItem._id] : [selectedItem._id]
                                            }
                                        })
                                    }}
                                    selectedValues={packageData.filter(item => formData.packages ? formData.packages.includes(item._id) ? true : false : false)}
                                    onRemove={(selectedList, removedItem) => {
                                        setSelectedPackages(selectedPackages.filter(item => item.name != removedItem.name))
                                        setFormData(pre => {
                                            return {
                                                ...pre,
                                                packages: pre.packages ? [...pre.packages.filter(item => item != removedItem._id)] : []
                                            }
                                        })
                                    }}
                                />
                            </Form.Group>
                        </Row>
                        <Row className='mt-3'>
                            <Col>
                            <Form.Check
                                name="approved"
                                type="switch"
                                id="custom-switch"
                                label="Approved"
                                defaultChecked={false}
                                onClick={handleOnChange}
                            />
                            </Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Update Cluster */}
            <Modal size="lg" centered show={showModal == 'edit'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Cluster</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Cluster Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name' value={formData && formData.name} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                       { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["residence_type"] && 'text-danger'}>Residence Type</Form.Label>
                                    <Form.Select  className={ formErrors["residence_type"] && 'border-danger'} name='residence_type'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Residence Type</option>
                                        {
                                            residenceData.map(residenceType => {
                                                return(
                                                    <option selected={formData && formData.residence_type && formData.residence_type._id == residenceType._id} key={residenceType._id} value={residenceType._id}>{residenceType.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["residence_type"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Cluster Off Day</Form.Label>
                                    <Form.Select name='off_day'  onChange={handleOnChange}>
                                        {
                                            ["NONE", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"].map(day => {
                                                return(
                                                    <option key={day} selected={formData && formData.off_days && formData.off_days.length && formData.off_days[0] == day || false} value={day} >{day}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["line_1"] && 'text-danger'}>Address Line 1</Form.Label>
                                    <Form.Control className={ formErrors["line_1"] && 'border-danger'}  type="text" placeholder="Enter Line 1" name='line_1' value={formData && formData.line_1} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                       { formErrors["line_1"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Line 2 (Optional)" name='line_2' value={formData && formData.line_2 || ''} onChange={handleOnChange}/>
                                    
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["area"] && 'text-danger'}>Area</Form.Label>
                                    <Form.Control className={ formErrors["area"] && 'border-danger'}  type="text" placeholder="Enter Area name" name='area' value={formData && formData.area} onChange={handleOnChange}/>
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
                                    <Form.Control className={ formErrors["zip_code"] && 'border-danger'}  type="text" placeholder="Enter Zip Code" name='zip_code' value={formData && formData.zip_code} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                       { formErrors["zip_code"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["city"] && 'text-danger'}>City</Form.Label>
                                    <Form.Select  className={ formErrors["city"] && 'border-danger'} name='city'  onChange={handleOnChange}>
                                        { formData.city != null ? <option selected={true} value={formData.city} >{formData.city}</option> : <option value={null} >Select City</option>}
                                        {
                                            cities.map(city => {
                                                return(
                                                    <option selected={formData && formData.city == city} value={city} key={city}>{city}</option>
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
                                    <Form.Select  className={ formErrors["state"] && 'border-danger'} name='state'  onChange={handleOnChange}>
                                        <option value={null} >Select State</option>
                                        {
                                            states && states.states && states.states.map(state => {
                                                return(
                                                    <option selected={formData && formData.state == state.name} value={state.name} key={state.name}>{state.name}</option>
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
                                    <Form.Select disabled name='country'  onChange={handleOnChange}>
                                        <option value={null} >Select Country</option>
                                        {
                                            countries.map(country => {
                                                return(
                                                    <option key={country.name} selected={formData && formData.country == country.name} value={country.name} >{country.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["latitude"] && 'text-danger'}>Geo Location Latitude</Form.Label>
                                    <Form.Control  className={ formErrors["latitude"] && 'border-danger'} type="text" placeholder="Goe Location Latitude" name='latitude' value={formData && formData.geo_location && formData.geo_location.latitude} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                       { formErrors["latitude"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["longitude"] && 'text-danger'}>Geo Location Longitude</Form.Label>
                                    <Form.Control  className={ formErrors["longitude"] && 'border-danger'} type="text" placeholder="Geo Location Longitude" name='longitude' value={formData && formData.geo_location && formData.geo_location.longitude} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                       { formErrors["longitude"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label>QR Code Series</Form.Label>
                                    <Form.Select name='qr_code_series' onChange={handleOnChange}>
                                        <option value={null} >Select QR Code Series</option>
                                        {
                                            qrCodeSeriesData.map((series, index) => {
                                                return(
                                                    formData && formData.qr_code_series && series._id == formData.qr_code_series._id ? 
                                                    <option key={index} selected={formData && formData.qr_code_series && formData.qr_code_series._id == series._id} value={series._id} >{series.name}</option>
                                                    : !series.cluster && <option key={index} selected={formData && formData.qr_code_series && formData.qr_code_series._id == series._id} value={series._id} >{series.name}</option> 
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label className={ formErrors["cluster_picture"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control  className={ formErrors["cluster_picture"] && 'border-danger'} ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" name='cluster_picture' type='file' onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                       { formErrors["cluster_picture"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.cluster_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, cluster_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                        </Row>
                        <Row>
                            <Form.Group>
                                <Form.Label>Select Packages</Form.Label>
                                <Multiselect 
                                    placeholder='Select Packages'
                                    options={packageData}
                                    displayValue="name"
                                    onSelect={(selectedList, selectedItem) => {
                                        setSelectedPackages([...selectedPackages, selectedItem])
                                        setFormData(pre => {
                                            return {
                                                ...pre,
                                                packages: pre.packages ? [...pre.packages, selectedItem._id] : [selectedItem._id]
                                            }
                                        })
                                    }}
                                    selectedValues={packageData.filter(item => formData.packages ? formData.packages.includes(item._id) ? true : false : false)}
                                    onRemove={(selectedList, removedItem) => {
                                        setSelectedPackages(selectedPackages.filter(item => item.name != removedItem.name))
                                        setFormData(pre => {
                                            return {
                                                ...pre,
                                                packages: pre.packages ? [...pre.packages.filter(item => item != removedItem._id)] : []
                                            }
                                        })
                                    }}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                            <Form.Check
                                name="approved"
                                type="switch"
                                id="custom-switch"
                                label="Approved"
                                value={formData.approved}
                                checked={formData.approved}
                                onClick={handleOnChange}
                            />
                            </Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Assign QR Code Series */}
            <Modal size="lg" centered show={showModal == 'qrseries'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Assign QR Code Series to Cluster</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["cluster"] && 'text-danger'}>Cluster Name</Form.Label>
                                    <Form.Select className={ formErrors["cluster"] && 'border-danger'} name='cluster' onChange={handleOnChange}>
                                    <option>Select Cluster</option>
                                    {
                                        data && data.length && data.map((cluster, index) => {
                                            return(
                                               !cluster.qr_code_series && <option key={index} value={cluster._id} >{cluster.name}</option>
                                            )
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
                                    <Form.Label  className={ formErrors["qr_code_series"] && 'text-danger'}>QR Code Series</Form.Label>
                                    <Form.Select  className={ formErrors["qr_code_series"] && 'border-danger'} name='qr_code_series' onChange={handleOnChange}>
                                    <option>Select QR Code Series</option>
                                    {
                                        qrCodeSeriesData && qrCodeSeriesData.length && qrCodeSeriesData.map((series, index) => {
                                            return(
                                                !series.cluster && <option key={index} value={series._id} >{series.name}</option>
                                            )
                                        })
                                    }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["qr_code_series"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                    Assign
                </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Assign Package to cluster */}
            <Modal size="lg" centered show={showModal == 'package'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Assign Package to Cluster</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["cluster"] && 'text-danger'}>Cluster Name</Form.Label>
                                    <Form.Select  className={ formErrors["cluster"] && 'border-danger'} name='cluster' onChange={handleOnChange}>
                                    <option>Select Cluster</option>
                                    {
                                        data && data.length && data.map((cluster, index) => {
                                            return(
                                               !cluster.qr_code_series && <option key={index} value={cluster._id} >{cluster.name}</option>
                                            )
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
                                    <Form.Label className={ formErrors["package"] && 'text-danger'}>Package</Form.Label>
                                    <Form.Select className={ formErrors["package"] && 'border-danger'} name='package' onChange={handleOnChange}>
                                    <option>Select QR Code Series</option>
                                    {
                                        packageData && packageData.length && packageData.map((package_, index) => {
                                            return(
                                                <option key={index} value={package_._id} >{package_.name}</option>
                                            )
                                        })
                                    }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                       { formErrors["package"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                    Assign
                </Button>
                </Modal.Footer>
            </Modal>
        
            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Cluster</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Cluster ?</p>
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

        </>
    )
}

export default Registered