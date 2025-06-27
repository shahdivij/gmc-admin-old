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
import { imageToBase64, isValidEmail, isValidMobileNumber } from '../../../../../utility/commonFunctions'
import {
    DELETE,
    GET,
    POST,
    PUT,
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import URL_STRING from "./../../../../../utility/URL_STRINGS"
import { Link } from 'react-router-dom'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosInformationCircleOutline } from "react-icons/io"


const CustomerList = () => {

    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({})
    const [selectedCustomerID, setSelectedCustomerID] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [imageData, setImageData] = useState(null)
    const imageInputRef = useRef(null)
    const [formErrors, setFormErrors] = useState({})

    const fetchData = async () => {

        const customers = await GET(URL.CUSTOMER.CUSTOMER)
        if(customers.data.length){
            setData(customers.data)
        }
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        setFormErrors({...formErrors})
        
        if(name == "profile_picture"){
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
            setFormData({
                ...formData,
                [name]: value
            })
        }

        
    }

    const deleteData = async () => {
        const action = confirm("Click ok to delete this customer.")
        if(action){
            const {data, error} = await DELETE(`${URL.CUSTOMER.CUSTOMER}/${deleteId}`)
            if(data){
                setDeleteId(null)
                setFormData({})
                setFormErrors({})
                fetchData()
                }
                
                if(error)
                    alert(error)
                
        } else {
            setDeleteId(null)
            setFormData({})
            setFormErrors({})
            fetchData()

        }
    }

    const handleFormSubmit = async () => {
        
        if(formData.name && formData.name != '' && formData.mobile_number && formData.mobile_number != '' && isValidMobileNumber(formData.mobile_number) && (formData.email ? isValidEmail(formData.email) : true)){
           
            const dataToSend = {
                name: formData.name,
                mobile_number: formData.mobile_number,
                profile_picture: formData.profile_picture || null,
                email: formData.email || null
            }
            
            if(showModal == 'add'){
                const {data, error} = await POST(URL.CUSTOMER.CUSTOMER, dataToSend)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }
            if(showModal == 'edit'){
                const {data, error} = await PUT(URL.CUSTOMER.CUSTOMER + "/" + selectedCustomerID, dataToSend)
                if(data){
                    setShowModal(false)
                    setFormData({})
                    setFormErrors({})
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }
        }else{ 
            if(!formData.name){
                setFormErrors(pre => ({...pre, name: "Please enter customer name."}))
            }
            if(!formData.mobile_number){
                setFormErrors(pre => ({...pre, mobile_number: "Please enter mobile number."}))
            } else if(!isValidMobileNumber(formData.mobile_number)){
                setFormErrors(pre => ({...pre, mobile_number: "Please enter valid mobile number."}))
            }
            if(formData.email && !isValidEmail(formData.email)){
                setFormErrors(pre => ({...pre, email: "Please enter valid email."}))
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if(showModal == null){
            setFormErrors({})
            setFormData({})
        }
        setFormErrors({})
    }, [showModal])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={11}>
                        <h3 className='pageTitle'>Customer</h3>
                    </Col>
                    <Col lg={1}>
                        <Button onClick={() => setShowModal('add')}>Add</Button>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Customer ID</th>
                                <th>Name</th>
                                <th>Mobile Number</th>
                                <th>Email</th>
                                <th>Profile Picture</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return(
                                        item.archive == false && <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td><Link to={URL_STRING.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_VIEW + "/" + item._id}>{item.customer_id}</Link></td>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: 'center' }}>{item.mobile_number}</td>
                                            <td>{item.email || "-" }</td>
                                            <td><a onClick={() => setImageData({name: item.profile_picture.name, image_data: item.profile_picture.image_data})}>{item.profile_picture ? item.profile_picture.name : "-"}</a></td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit onClick={() => {
                                                    setShowModal('edit')
                                                    setFormData({
                                                        name: item.name,
                                                        mobile_number: item.mobile_number,
                                                        email: item.email,
                                                        profile_picture: item.profile_picture ? {
                                                            name: item.profile_picture.name,
                                                            image_data: item.profile_picture.image_data
                                                        } : null
                                                    })
                                                    setSelectedCustomerID(item._id)
                                                }} size={25} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
        
            {/* Add New Customer */}
            <Modal size="lg" centered show={showModal == 'add'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["name"] && 'text-danger'}>Customer Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["mobile_number"] && 'text-danger'}>Mobile Number</Form.Label>
                                    <Form.Control  className={ formErrors["mobile_number"] && 'border-danger'} type="text" placeholder="Enter number" name='mobile_number'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["mobile_number"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["email"] && 'text-danger'}>Email</Form.Label>
                                    <Form.Control  className={ formErrors["email"] && 'border-danger'} type="text" placeholder="Enter email" name='email' onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["email"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label>Profile Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control name='profile_picture' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.profile_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, profile_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
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
            
            {/* Update Customer */}
            <Modal size="lg" centered show={showModal == 'edit'} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["name"] && 'text-danger'}>Customer Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} value={formData && formData.name} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["mobile_number"] && 'text-danger'}>Mobile Number</Form.Label>
                                    <Form.Control disabled  className={ formErrors["mobile_number"] && 'border-danger'} value={formData && formData.mobile_number} type="text" placeholder="Enter number" name='mobile_number'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["mobile_number"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["email"] && 'text-danger'}>Email</Form.Label>
                                    <Form.Control  className={ formErrors["email"] && 'border-danger'} value={formData && formData.email} type="text" placeholder="Enter email" name='email' onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["email"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label>Profile Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control name='profile_picture' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.profile_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, profile_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
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
        
            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Customer ?</p>
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

            <Modal size="lg" centered show={imageData != null} onHide={() => setImageData(null)}>
                <Modal.Header closeButton>
                {/* <Modal.Title>{imageData && imageData.name}</Modal.Title> */}
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    { imageData && <img src={imageData.image_data} width={'100%'} height={'100%'} alt={imageData.name} /> }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" type='submit' onClick={() => setImageData(null)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default CustomerList