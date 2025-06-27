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
    DELETE
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import { Link } from 'react-router-dom'
import URL_STRINGS from '../../../../../utility/URL_STRINGS'


const Series = () => {

    const [showModal, setShowModal] = useState(null)
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [formErrors, setFormErrors] = useState({})


    const fetchData = async () => {
        
        const {data, error} = await GET(URL.QRCODE_SERIES.SERIES)
        
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
        const {data, error} = await DELETE(`${URL.QRCODE_SERIES.SERIES}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const handleFormSubmit = async () => {
        if(showModal == 'add'){
            if(formData.name && formData.range && formData.range.includes("-") && formData.range.split("-")[0] > 0 && formData.range.split("-")[1] > 1 && formData.range.split("-")[0] < formData.range.split("-")[1]){
                
                const dataToSend = {
                    name: formData.name,
                    range: formData.range
                }
                
                const {data, error} = await POST(URL.QRCODE_SERIES.SERIES, dataToSend)
                if(data){
                    setShowModal(false)
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }else{ 
                if(!formData.name){
                    setFormErrors(pre => ({...pre, name: "Please enter QR code series name."}))
                }
                if(!formData.range){
                    setFormErrors(pre => ({...pre, range: "Please enter QR code series range."}))
                }
                if(formData.range && (!formData.range.includes("-") || (formData.range.includes("-") && formData.range.split("-")[0] <= 0 || formData.range.split("-")[1] <= 1 || formData.range.split("-")[0] >= formData.range.split("-")[1]))){
                    setFormErrors(pre => ({...pre, range: "Please enter valid QR code series range."}))
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
        if(!showModal){
            setFormData({})
            setFormErrors({})
        }
        setFormErrors({})
    }, [showModal])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={9}>
                        <h3 className='pageTitle'>QR Code Series</h3>
                    </Col>
                    <Col lg={3} style={{ textAlign: "right" }}>
                        <Row className='justify-content-lg-end'>
                            <Col lg="auto">
                                <Button onClick={() => setShowModal('add')}>Add</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Series ID</th>
                                <th>Name</th>
                                <th>QR Code Range</th>
                                <th>Generated Range</th>
                                <th>Cluster</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td><Link to={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.VIEW + "/" + item._id}>{item.series_id}</Link></td>
                                            <td><Link to={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.VIEW + "/" + item._id}>{item.name}</Link></td>
                                            <td style={{ textAlign: 'center' }}>{item.range}</td>
                                            <td style={{ textAlign: 'center' }}>{item.generated_range || '-'}</td>
                                            <td>{item.cluster && item.cluster.value || 'Not assigned yet'}</td>
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
        
            {/* Add New QR Code Series Modal */}
            <Modal size="lg" centered show={showModal == 'add'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New QR Code Series</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["name"] && 'text-danger'}>Series Name</Form.Label>
                                    <Form.Control  className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                       { formErrors["name"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["range"] && 'text-danger'}>QR Code Range</Form.Label>
                                    <Form.Control className={ formErrors["range"] && 'border-danger'} type="text" placeholder="QR Code Range" name='range'  onChange={handleOnChange}/>
                                    { !formErrors["range"] && <Form.Text className="text-muted">
                                        Use - as separator. Example: 1-100
                                    </Form.Text>}
                                    <Form.Text className="text-danger">
                                       { formErrors["range"] }
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
        
            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete QR Code Series</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this QR Code Series ?</p>
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

export default Series