import { useEffect, useState } from 'react'
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


const Requester_Role = () => {

    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [formErrors, setFormErrors] = useState({})

    const fetchData = async () => {
        
        const {data, error} = await GET(URL.CLUSTER.ROLE)
        if(data)
            setData(data)
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        setFormErrors({...formErrors})
        
        setFormData({
            ...formData,
            [name]: value
        })
        
    }

    const deleteData = async () => {
        const {data, error} = await DELETE(`${URL.CLUSTER.ROLE}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const handleFormSubmit = async () => {
        if(formData.name){
            if(showModal == 'add'){
                const {data, error} = await POST(URL.CLUSTER.ROLE, formData)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }
            if(showModal == 'update'){
                const {data, error} = await PUT(URL.CLUSTER.ROLE + "/" + selectedItemId, formData)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }
        }else{ 
            if(!formData.name){
                setFormErrors(pre => ({...pre, name: "Please enter requestor role name."}))
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
                        <h3 className='pageTitle'>Requester Role</h3>
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
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit onClick={() => { setFormData({
                                                    name: item.name,
                                                }); setSelectedItemId(item._id); setShowModal('update')}} size={25} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
        

            <Modal size="md" centered show={showModal == 'add'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Requester Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["name"] && 'text-danger'}>Requester Role Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
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

            <Modal size="md" centered show={showModal == 'update'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Requester Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["name"] && 'text-danger'}>Requester Role Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name' value={formData.name} onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
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
                <Modal.Title>Delete Requester Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this Requester Role ?</p>
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

export default Requester_Role