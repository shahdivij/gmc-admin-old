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
import {
    GET,
    POST,
    DELETE,
    PUT
} from './../../../../../api/fetch'
import URL from './../../../../../api/urls'
import { imageToBase64, dataURItoBlob } from './../../../../../utility/commonFunctions'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosInformationCircleOutline } from "react-icons/io"

const Fuel = () => {

    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [formErrors, setFormErrors] = useState({})
    const [imageData, setImageData] = useState(null)
    const imageInputRef = useRef(null)

    const fetchData = async () => {
        setSelectedItemId(null)
        const {data, error} = await GET(URL.CAR.FUEL_TYPE)
        if(data)
            setData(data)
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        setFormErrors({...formErrors})
        
        if(name == "image"){
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
        const {data, error} = await DELETE(`${URL.CAR.FUEL_TYPE}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const handleFormSubmit = async () => {
        if(formData.name && formData.image && formData.image.name && formData.image.image_data){
            if(showModal == 'add'){
                const {data, error} = await POST(URL.CAR.FUEL_TYPE, formData)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
    
                if(error)
                    alert(error)
            }

            if(showModal == 'update'){
                console.log(URL.CAR.FUEL_TYPE + "/" + selectedItemId)
                console.log(formData)
                const {data, error} = await PUT(URL.CAR.FUEL_TYPE + "/" + selectedItemId, formData)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
    
                if(error)
                    alert(error)
            }
        }else{ 
            if(!formData.name){
                setFormErrors(pre => ({...pre, name: "Please enter fuel type name."}))
            }
            if(!formData.image){
                setFormErrors(pre => ({...pre, image: "Please upload fuel image."}))
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
                        <h3 className='pageTitle'>Car Fuel Type</h3>
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
                                <th>Image</th>
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
                                            <td><a style={{ cursor: 'pointer' }} onClick={() => item.image && setImageData({name: item.image.name, image_data: item.image.image_data})}>{item.image?.name || '-'}</a></td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit size={25}  onClick={() =>{ setFormData({
                                                    name: item.name,
                                                    image: {
                                                        name: item.image?.name,
                                                        image_data: item.image?.image_data
                                                    }
                                                }); setSelectedItemId(item._id); setShowModal('update')}} style={{ marginInline: 10, cursor: 'pointer' }} />
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
                <Modal.Title>Add A New Car Fuel Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Fuel Type Name</Form.Label>
                                    <Form.Control className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label className={ formErrors["image"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control className={ formErrors["image"] && 'border-danger'} name='image' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                        { formErrors["image"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.image && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, image: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
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
                <Modal.Title>Update Car Fuel Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Fuel Type Name</Form.Label>
                                    <Form.Control className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name' value={formData.name} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label className={ formErrors["image"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control className={ formErrors["image"] && 'border-danger'} name='image' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                        { formErrors["image"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.image && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, image: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
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
                <Modal.Title>Delete Fuel Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Fuel Type ?</p>
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
        
        </>
    )
}

export default Fuel