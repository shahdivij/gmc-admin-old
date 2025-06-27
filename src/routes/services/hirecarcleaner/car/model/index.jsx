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
import { imageToBase64 } from './../../../../../utility/commonFunctions'
import {
    GET,
    POST,
    DELETE,
    PUT
} from './../../../../../api/fetch'
import URL from './../../../../../api/urls'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosInformationCircleOutline } from "react-icons/io"
import Multiselect from 'multiselect-react-dropdown'


const Model = () => {

    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [categoryData, setCategoryData] = useState([])
    const [brandData, setBrandData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [imageData, setImageData] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null)
    const imageInputRef = useRef(null)
    const [formErrors, setFormErrors] = useState({})


    const fetchData = async () => {
        
        const models = await GET(URL.CAR.MODEL)
        setData(models.data)
        
        const brands = await GET(URL.CAR.BRAND)
        setBrandData(brands.data)
        
        const categories = await GET(URL.CAR.CATEGORY)
        setCategoryData(categories.data)
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        setFormErrors({...formErrors})
        
        
        if(name == "model_picture"){
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
        const {data, error} = await DELETE(`${URL.CAR.MODEL}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const handleFormSubmit = async () => {
        if(formData.brand && formData.name && formData.model_picture && formData.category){
            if(showModal == 'add'){
                const {data, error} = await POST(URL.CAR.MODEL, formData)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
        
                if(error)
                    alert(error)
            }

            if(showModal == 'update'){
                const {data, error} = await PUT(URL.CAR.MODEL + "/" + selectedItemId, formData)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
        
                if(error)
                    alert(error)
            }    
        }else{ 
            console.log(formData)
            if(!formData.name){
                setFormErrors(pre => ({...pre, name: "Please enter model name."}))
            }
            if(!formData.brand || formData.brand == "null"){
                setFormErrors(pre => ({...pre, brand: "Please select a brand."}))
            }
            if(!formData.model_picture){
                setFormErrors(pre => ({...pre, model_picture: "Please select model picture."}))
            }
            if(!formData.category || formData.category == "null"){
                setFormErrors(pre => ({...pre, category: "Please select a category."}))
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
                        <h3 className='pageTitle'>Car Model</h3>
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
                                <th>Brand</th>
                                <th>Category</th>
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
                                            <td>{item.brand?.name || ''}</td>
                                            <td>{item.category.name}</td>
                                            <td><a onClick={() => setImageData({name: item.model_picture.name, image_data: item.model_picture.image_data})}>{item.model_picture.name}</a></td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit onClick={() => {setFormData({
                                                    name: item.name,
                                                    brand: item.brand?._id,
                                                    category: item.category?._id,
                                                    model_picture: {
                                                        name: item.model_picture.name, image_data: item.model_picture.image_data
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
                <Modal.Title>Add A New Car Model</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["name"] && 'text-danger'}>Model Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["brand"] && 'text-danger'}>Brand</Form.Label>
                                    <Form.Select  className={ formErrors["brand"] && 'border-danger'} name='brand'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Brand</option>
                                        {
                                            brandData.map(brand => {
                                                return(
                                                    <option key={brand._id} value={brand._id} >{ brand.name }</option>
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
                                    <Form.Label  className={ formErrors["category"] && 'text-danger'}>Category</Form.Label>
                                    <Form.Select  className={ formErrors["category"] && 'border-danger'} name='category'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Category</option>
                                        {
                                            categoryData.map(category => {
                                                return(
                                                    <option key={category._id} value={category._id} >{ category.name }</option>
                                                )
                                            })
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
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label  className={ formErrors["model_picture"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control  className={ formErrors["model_picture"] && 'border-danger'} ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" name='model_picture' type='file' onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                        { formErrors["model_picture"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.model_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, model_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                            <Col>
                                
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
                <Modal.Title>Update Car Model</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["name"] && 'text-danger'}>Model Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name' value={formData.name} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["brand"] && 'text-danger'}>Brand</Form.Label>
                                    <Form.Select  className={ formErrors["brand"] && 'border-danger'} name='brand'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Brand</option>
                                        {
                                            brandData.map(brand => {
                                                return(
                                                    <option key={brand._id} selected={formData.brand == brand._id} value={brand._id} >{ brand.name }</option>
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
                                    <Form.Label  className={ formErrors["category"] && 'text-danger'}>Category</Form.Label>
                                    <Form.Select  className={ formErrors["category"] && 'border-danger'} name='category'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Category</option>
                                        {
                                            categoryData.map(category => {
                                                return(
                                                    <option key={category._id} selected={formData.category == category._id} value={category._id} >{ category.name }</option>
                                                )
                                            })
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
                                <Form.Group className="mb-3" controlId="formFile">
                                    <Form.Label  className={ formErrors["model_picture"] && 'text-danger'}>Picture</Form.Label><span><IoIosInformationCircleOutline size={'1.1rem'} style={{ marginLeft: '0.6rem', cursor: 'pointer' }} onClick={() => alert("Allowed Images: PNG, JPEG and JPG. Max Image Size: 5MB")} /></span>
                                    <Form.Control  className={ formErrors["model_picture"] && 'border-danger'} name='model_picture' ref={imageInputRef} accept="image/png, image/jpeg, image/jpg" type='file' onChange={handleOnChange} />
                                    <Form.Text className="text-danger">
                                        { formErrors["model_picture"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: 'center',
                                paddingTop: '0.9rem'
                            }}>
                                { formData && formData.model_picture && <IoCloseCircleOutline onClick={() => {imageInputRef.current.value = ""; setFormData({...formData, model_picture: ""})}} size={25} style={{ marginRight: '0rem', cursor: "pointer" }}/>}
                            </Col>
                            <Col></Col>
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
                <Modal.Title>Delete Car Model</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Car Model ?</p>
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

        </>
    )
}

export default Model