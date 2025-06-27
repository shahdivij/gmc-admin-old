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
    DELETE
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


const Requests = () => {

    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [residenceData, setResidenceData] = useState([])
    const [roleData, setRoleData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [city, setCity] = useState(null)
    const [state, setState] = useState(null)
    const imageInputRef = useRef(null)
    const [formErrors, setFormErrors] = useState({})

    const fetchData = async () => {
        
        const {data, error} = await GET(URL.CLUSTER.REQUEST)
        
        if(data)
            setData(data)

        const roleTypes = await GET(URL.CLUSTER.ROLE)
        if(roleTypes.data)
            setRoleData(roleTypes.data)
        
        const residenceTypes = await GET(URL.CLUSTER.RESIDENCE)
        if(residenceTypes.data)
            setResidenceData(residenceTypes.data)

        const countriesData = await getCountries()
        if(countriesData.length)
            setCountries(countriesData)

        const statesData = await getStates("India")
            if(statesData)
                setStates(statesData)

    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        setFormErrors({...formErrors})

        if(formData.country == null || formData.country == undefined || formData.country == ""){
            setFormData({...formData, country: "India"})
        }

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
                    setFormData({...formData, city: city_, state: state_, zip_code: value})
                    const citiesData = await getCities(state_, "India")
                    if(citiesData)
                        setCities(citiesData)
                }
            } else {
                setCity(null)
                setState(null)
                setFormData({...formData, city: null, state: null, zip_code: null})
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
        }else{
            if(name != "zip_code"){
                setFormData({
                    ...formData,
                    [name]: value
                })
            }
        }

        
    }

    const deleteData = async () => {
        const {data, error} = await DELETE(`${URL.CLUSTER.REQUEST}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const handleFormSubmit = async () => {
        console.log(formData)
        if(formData.username && formData.mobile_number && formData.residence_type && formData.residence_type != "null" && formData.cluster_picture && formData.line_1 && formData.city && formData.state && formData.zip_code && formData.zip_code.toString().length == 6 && formData.area && formData.role && formData.role != "null"){
            
            const dataToSend = {
                requester_name: formData.username,
                mobile_number: formData.mobile_number,
                residence_type: formData.residence_type,
                cluster_picture: formData.cluster_picture,
                comment: formData.comment,
                requestor_role: formData.role,
                address: {
                    line_1: formData.line_1,
                    line_2: formData.line_2 || '',
                    area: formData.area,
                    zip_code: formData.zip_code,
                    city: formData.city,
                    state: formData.state,
                    country: "India"
                }
            }
            
            const {data, error} = await POST(URL.CLUSTER.REQUEST, dataToSend)
            if(data){
                setShowModal(false)
                fetchData()
            }

            if(error){
                alert(error)
            }
        }else{ 
            if(!formData.username){
                setFormErrors(pre => ({...pre, username: "Please enter username."}))
            }
            if(!formData.mobile_number){
                setFormErrors(pre => ({...pre, mobile_number: "Please enter mobile number."}))
            }
            if(!formData.residence_type || formData.residence_type == "null"){
                setFormErrors(pre => ({...pre, residence_type: "Please select residence type."}))
            }
            if(!formData.cluster_picture){
                setFormErrors(pre => ({...pre, cluster_picture: "Please upload cluster picture."}))
            }
            if(!formData.line_1){
                setFormErrors(pre => ({...pre, line_1: "Please enter address."}))
            }
            if(!formData.city){
                setFormErrors(pre => ({...pre, city: "Please select city."}))
            }
            if(!formData.state){
                setFormErrors(pre => ({...pre, state: "Please select state."}))
            }
            if(!formData.zip_code){
                setFormErrors(pre => ({...pre, zip_code: "Please enter zip code."}))
            }
            if(!formData.area){
                setFormErrors(pre => ({...pre, area: "Please enter area name."}))
            }
            if(!formData.role || formData.role == "null"){
                setFormErrors(pre => ({...pre, role: "Please select requestor role."}))
            }
            if(formData.zip_code && formData.zip_code.toString().length != 6){
                setFormErrors(pre => ({...pre, zip_code: "Please enter valid zip code."}))
            }
        }
    
    }

    useEffect(() => {
        fetchData()
        setFormErrors({})
    }, [])

    useEffect(() => {
        setFormErrors({})
    }, [showModal])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={11}>
                        <h3 className='pageTitle'>Cluster Requests</h3>
                    </Col>
                    <Col lg={1} style={{ textAlign: "right" }}>
                        <Button onClick={() => setShowModal(true)}>Add</Button>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Request ID</th>
                                <th>User Name</th>
                                <th>User Mobile No</th>
                                <th>User Role</th>
                                <th>Cluster ID</th>
                                <th>Cluster Name</th>
                                <th>Residence Type</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td><Link to={"/cluster/request/view/" + item._id}>{item.request_id}</Link></td>
                                            <td>{item.requester_name}</td>
                                            <td style={{ textAlign: 'center' }}>{item.mobile_number}</td>
                                            <td>{item.requester_role.name}</td>
                                            <td>{item.cluster_id}</td>
                                            <td>{item.cluster_name}</td>
                                            <td>{item.residence_type?.name || "none"}</td>
                                            <td>{item.address.line_1 + item.address.line_2 + ", " + item.address.area + ", " + item.address.city}</td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit size={25} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
        

            <Modal size="lg" centered show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Cluster Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["username"] && 'text-danger'}>User Name</Form.Label>
                                    <Form.Control  className={ formErrors["username"] && 'border-danger'} type="text" placeholder="Enter name" name='username'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["username"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["mobile_number"] && 'text-danger'}>User Mobile Number</Form.Label>
                                    <Form.Control  className={ formErrors["mobile_number"] && 'border-danger'} type="text" placeholder="Enter mobile number" name='mobile_number'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["mobile_number"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["residence_type"] && 'text-danger'}>Residence Type</Form.Label>
                                    <Form.Select  className={ formErrors["residence_type"] && 'border-danger'} name='residence_type'  onChange={handleOnChange}>
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
                                    <Form.Label  className={ formErrors["role"] && 'text-danger'}>User Role</Form.Label>
                                    <Form.Select  className={ formErrors["role"] && 'border-danger'} name='role'  onChange={handleOnChange}>
                                        <option value={null} >Select User Role</option>
                                        {
                                            roleData.map(roleType => {
                                                return(
                                                    <option key={roleType._id} value={roleType._id}>{roleType.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["role"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["line_1"] && 'text-danger'}>Address Line 1</Form.Label>
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
                                    <Form.Label  className={ formErrors["area"] && 'text-danger'}>Area</Form.Label>
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
                                    <Form.Label  className={ formErrors["zip_code"] && 'text-danger'}>Zip Code</Form.Label>
                                    <Form.Control  className={ formErrors["zip_code"] && 'border-danger'} type="text" placeholder="Enter Zip Code" name='zip_code'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["zip_code"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["city"] && 'text-danger'}>City</Form.Label>
                                    <Form.Select  className={ formErrors["city"] && 'border-danger'} name='city'  onChange={handleOnChange}>
                                        { formData.city != null ? <option value={formData.city} selected={true} >{formData.city}</option> : <option value={null} >Select City</option>}
                                        {
                                            cities.map(city => {
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
                                    <Form.Label  className={ formErrors["state"] && 'text-danger'}>State</Form.Label>
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
                                                    <option selected={country.name == "India"} key={country.name} value={country.name} >{country.name}</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label  className={ formErrors["cluster_picture"] && 'text-danger'}>Cluster Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
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
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control name='comment' onChange={handleOnChange} as="textarea" rows={3} />
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
                    Add
                </Button>
                </Modal.Footer>
            </Modal>
        
            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Cluster Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Cluster Request ?</p>
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

export default Requests