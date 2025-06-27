import { useEffect, useRef, useState } from 'react'
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
import { imageToBase64, dataURItoBlob } from './../../../../../utility/commonFunctions'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosInformationCircleOutline } from "react-icons/io"
import URL from './../../../../../api/urls'
import { 
    GET, 
    POST,
    DELETE,
    PUT
} from './../../../../../api/fetch'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const Brand = () => {

    const [showModal, setShowModal] = useState(null)
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [imageData, setImageData] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null)
    const imageInputRef = useRef(null)
    const [formErrors, setFormErrors] = useState({})


    const fetchData = async () => {
        const { data, error } = await GET(URL.CAR.BRAND)
        setData(data)
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        setFormErrors({...formErrors})
        
        
        if(name == "logo"){
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
                [name]: value,
            })
        }

        
    }

    const deleteData = async () => {
        const {data, error} = await DELETE(`${URL.CAR.BRAND}/${deleteId}`)
        if(data){
            toast.success('Car brand deleted successfully.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
            })
            setDeleteId(null)
            fetchData()
        }

        if(error){
            toast.error(error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "colored",
            })
        }
            
    }

    const handleFormSubmit = async () => {
        if(formData.name && formData.logo){
            
            if(showModal == 'add'){
                const { data, error } = await POST(URL.CAR.BRAND, formData)
                
    
                if(data){
                    toast.success('New car brand added successfully.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                    })
                    fetchData()
                    setShowModal(false)
                }
    
                if(error){
                    toast.error(error, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                    })
                }
                    // alert(error)
            }

            if(showModal == 'update'){
                const { data, error } = await PUT(URL.CAR.BRAND + "/" + selectedItemId, formData)
               
    
                if(data){
                    toast.success('Car brand updated successfully.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                    })
                    fetchData()
                    setShowModal(false)
                }
    
                if(error){
                    toast.error(error, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "colored",
                    })
                }
            }
            
        }else{ 
            // alert("All fields are required.")
            if(!formData.name){
                setFormErrors(pre => ({...pre, name: "Please enter brand name."}))
            }
            if(!formData.logo){
                setFormErrors(pre => ({...pre, logo: "Please select brand picture."}))
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
                        <h3 className='pageTitle'>Car Brand</h3>
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
                                <th>Name</th>
                                <th>Picture</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td>{item.name}</td>
                                            <td><a onClick={() => setImageData({name: item.logo.name, image_data: item.logo.image_data})}>{item.logo.name}</a></td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit onClick={() => {setFormData({
                                                    name: item.name,
                                                    logo: {
                                                        name: item.logo.name, image_data: item.logo.image_data
                                                    }
                                                }); setSelectedItemId(item._id);setShowModal('update')}} size={25} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
        

            <Modal size="lg" centered show={showModal == 'add'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Car Brand</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Brand Name</Form.Label>
                                    <Form.Control className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["name"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label className={ formErrors["logo"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control className={ formErrors["logo"] && 'border-danger'} name='logo' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                        { formErrors["logo"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.logo && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, logo: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(null)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal size="lg" centered show={showModal == 'update'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Car Brand</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Brand Name</Form.Label>
                                    <Form.Control className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name' value={formData.name} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label className={ formErrors["logo"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control  className={ formErrors["logo"] && 'border-danger'} name='logo' type='file' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                        { formErrors["logo"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.logo && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, logo: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(null)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>


            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Car Brand</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Car Brand ?</p>
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

            <Modal size='md' centered show={imageData != null} onHide={() => setImageData(null)}>
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
        
                        
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="colored"
            />
        </>
    )
}

export default Brand