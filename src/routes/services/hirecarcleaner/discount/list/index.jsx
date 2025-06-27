import { useEffect, useState } from 'react'
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Form
} from 'react-bootstrap'
import {
    DELETE,
    GET,
    POST,
    PUT
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import { MdDeleteOutline, MdEdit } from "react-icons/md"

const DiscountList = () => {

    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [formData, setFormData] = useState({})
    const [formErrors, setFormErrors] = useState({})
    const [discountAmountType, setDiscountAmountType] = useState('by_amount')

    const fetchData = async () => {

        const {data, error} = await GET(URL.DISCOUNT.ROOT)
        if(data) setData(data)
            
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteData = async () => {
        const {data, error} = await DELETE(URL.DISCOUNT.ROOT + "/" + deleteId)
        if(data){
            fetchData()
            setDeleteId(null)
        }

        if(error){
            alert(error)
        }
    }

    const handleOnChange = async () => {
        const target = event.target
        let value = target.value
        const name = target.name 
        delete formErrors[name]
        
        if(name == "discount_amount_type"){
            const id = target.id
            setDiscountAmountType(id)
            if(id == "by_amount"){
                setFormData({
                    ...formData,
                    discount_percent: 0,
                    discount_upto_amount: 0,
                })
                delete formErrors["discount_percent"]
                delete formErrors["discount_upto_amount"]
            }
            if(id == "by_percent"){
                setFormData({
                    ...formData,
                    discount_amount: 0,
                })
                delete formErrors["discount_amount"]
            }
        } else {
            setFormData(pre => {
                return {
                    ...pre,
                    [name]: value
                }
            })
        }

        if(!formData.service || formData.service == ''){
            setFormData(pre => {
                return {
                    ...pre,
                    service: 'Hire Car Cleaner'
                }
            })
        }
    }

    const handleFormSubmit = async () => {
        if(discountAmountType == 'by_amount'){
            if(!formData.discount_amount){
                setFormErrors(pre => {
                    return {
                        ...pre,
                        discount_amount: 'Discount amount is required.'
                    }
                })
            } else if(isNaN(formData.discount_amount)) {
                setFormErrors(pre => {
                    return {
                        ...pre,
                        discount_amount: 'Discount amount should be numeric only.'
                    }
                })
            }
        } 

        if(discountAmountType == "by_percent"){
            if(!formData.discount_percent){
                setFormErrors(pre => {
                    return {
                        ...pre,
                        discount_percent: 'Discount percent is required.'
                    }
                })
            } else if (isNaN(formData.discount_percent)){
                setFormErrors(pre => {
                    return {
                        ...pre,
                        discount_percent: 'Discount percent should be numeric only.'
                    }
                })
            }

            if(!formData.discount_upto_amount){
                setFormErrors(pre => {
                    return {
                        ...pre,
                        discount_upto_amount: 'Discount upto amount is required.'
                    }
                })
            } else if (isNaN(formData.discount_upto_amount)){
                setFormErrors(pre => {
                    return {
                        ...pre,
                        discount_upto_amount: 'Discount upto amount should be numeric only.'
                    }
                })
            }
        }

        if(!formData.name){
            setFormErrors(pre => {
                return {
                    ...pre,
                    name: 'Name is required.'
                }
            })
        } 

        if(!formData.discount_code){
            setFormErrors(pre => {
                return {
                    ...pre,
                    discount_code: 'Discount code is required.'
                }
            })
        }
        
        if(Object.keys(formErrors).length <= 0){
            let dataToSend = {...formData}
            if(!formData.discount_percent || !formData.discount_upto_amount){
                dataToSend = {
                    ...dataToSend,
                    discount_percent: 0,
                    discount_upto_amount: 0
                }
            }
            
            if(showModal == 'add'){
                const {data, error} = await POST(URL.DISCOUNT.ROOT, {...dataToSend})
                if(data){
                    setShowModal(null)
                    setFormErrors({})
                    setFormData({})
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }

            if(showModal == 'edit'){
                const id = dataToSend._id
                delete dataToSend._id
                delete dataToSend.__v
                const {data, error} = await PUT(URL.DISCOUNT.ROOT + "/" + id, {...dataToSend})
                if(data){
                    setShowModal(null)
                    setFormErrors({})
                    setFormData({})
                    fetchData()
                }
    
                if(error){
                    alert(error)
                }
            }
        }

    }

    useEffect(() => {
        if(!showModal){
            setFormData({})
            setFormErrors({})
            setDiscountAmountType("by_amount")
        }
    }, [showModal])

    return (
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        <h3 className='pageTitle'>Discount List</h3>
                    </Col>
                    <Col lg={2} style={{ textAlign: 'right' }}>
                        <Button onClick={() => setShowModal('add')}>Add Discount</Button>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>ID</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Service</th>
                                <th>Off Percent</th>
                                <th>Max Off Amount</th>
                                <th>Off Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length > 0 && data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td>{item.discount_id}</td>
                                            <td>{item.discount_code}</td>
                                            <td>{item.name}</td>
                                            <td>{item.service}</td>
                                            <td style={{ textAlign: 'center' }}>{item.discount_percent}</td>
                                            <td style={{ textAlign: 'center' }}>{item.discount_upto_amount}</td>
                                            <td style={{ textAlign: 'center' }}>{item.discount_amount}</td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit onClick={() => {
                                                    setShowModal('edit')
                                                    setFormData({
                                                        ...item
                                                    })
                                                    if(item.discount_amount != 0){
                                                        setDiscountAmountType("by_amount")
                                                    } else if(item.discount_percent != 0){
                                                        setDiscountAmountType("by_percent")
                                                    }
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

            {/* Add Discount Modal */}
            <Modal size="lg" centered show={showModal == 'add'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Discount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Discount Name</Form.Label>
                                    <Form.Control className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["name"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_code"] && 'text-danger'}>Discount Code</Form.Label>
                                    <Form.Control className={ formErrors["discount_code"] && 'border-danger'} type="text" placeholder="Enter code" name='discount_code'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_code"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["service"] && 'text-danger'}>Service</Form.Label>
                                    <Form.Select  className={ formErrors["service"] && 'border-danger'} name='service'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Service</option>
                                        {
                                            ["Hire Car Cleaner"].map(service => {
                                                return(
                                                    <option selected key={service} value={service} >{ service }</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["service"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Check
                                    inline
                                    label="Discount by fixed amount"
                                    name="discount_amount_type"
                                    type="radio"
                                    id='by_amount'
                                    checked={discountAmountType == "by_amount"}
                                    onChange={handleOnChange}
                                />
                                <Form.Check
                                    inline
                                    label="Discount by percentage"
                                    name="discount_amount_type"
                                    type="radio"
                                    id='by_percent'
                                    checked={discountAmountType == "by_percent"}
                                    onChange={handleOnChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            {discountAmountType ==  "by_amount" && <><Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_amount"] && 'text-danger'}>Discount Amount</Form.Label>
                                    <Form.Control className={ formErrors["discount_amount"] && 'border-danger'} type="text" placeholder="Enter amount" name='discount_amount'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_amount"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                            <Col></Col>
                            </>}
                            {discountAmountType == "by_percent" && <><Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_percent"] && 'text-danger'}>Discount %</Form.Label>
                                    <Form.Control className={ formErrors["discount_percent"] && 'border-danger'} type="text" placeholder="Enter discount %" name='discount_percent'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_percent"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_upto_amount"] && 'text-danger'}>Discount Upto Amount</Form.Label>
                                    <Form.Control className={ formErrors["discount_upto_amount"] && 'border-danger'} type="text" placeholder="Enter upto amount" name='discount_upto_amount'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_upto_amount"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                            </>}
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
            
            {/* Update Discount Modal */}
            <Modal size="lg" centered show={showModal == 'edit'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Discount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["name"] && 'text-danger'}>Discount Name</Form.Label>
                                    <Form.Control value={formData.name} className={ formErrors["name"] && 'border-danger'} type="text" placeholder="Enter name" name='name'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["name"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_code"] && 'text-danger'}>Discount Code</Form.Label>
                                    <Form.Control value={formData.discount_code} className={ formErrors["discount_code"] && 'border-danger'} type="text" placeholder="Enter code" name='discount_code'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_code"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["service"] && 'text-danger'}>Service</Form.Label>
                                    <Form.Select  className={ formErrors["service"] && 'border-danger'} name='service'  onChange={handleOnChange}>
                                        <option value={"null"} >Select Service</option>
                                        {
                                            ["Hire Car Cleaner"].map(service => {
                                                return(
                                                    <option selected={formData.service == service} key={service} value={service} >{ service }</option>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["service"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Check
                                    inline
                                    label="Discount by fixed amount"
                                    name="discount_amount_type"
                                    type="radio"
                                    id='by_amount'
                                    checked={discountAmountType == "by_amount"}
                                    onChange={handleOnChange}
                                />
                                <Form.Check
                                    inline
                                    label="Discount by percentage"
                                    name="discount_amount_type"
                                    type="radio"
                                    id='by_percent'
                                    checked={discountAmountType == "by_percent"}
                                    onChange={handleOnChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-3'>
                            {discountAmountType ==  "by_amount" && <><Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_amount"] && 'text-danger'}>Discount Amount</Form.Label>
                                    <Form.Control value={formData.discount_amount} className={ formErrors["discount_amount"] && 'border-danger'} type="text" placeholder="Enter amount" name='discount_amount'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_amount"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                            <Col></Col>
                            </>}
                            {discountAmountType == "by_percent" && <><Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_percent"] && 'text-danger'}>Discount %</Form.Label>
                                    <Form.Control value={formData.discount_percent} className={ formErrors["discount_percent"] && 'border-danger'} type="text" placeholder="Enter discount %" name='discount_percent'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_percent"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["discount_upto_amount"] && 'text-danger'}>Discount Upto Amount</Form.Label>
                                    <Form.Control value={formData.discount_upto_amount} className={ formErrors["discount_upto_amount"] && 'border-danger'} type="text" placeholder="Enter upto amount" name='discount_upto_amount'  onChange={handleOnChange}/>
                                    <Form.Text className='text-danger'>{ formErrors["discount_upto_amount"] }</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col></Col>
                            </>}
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

            {/* Delete Discount Modal */}
            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Discount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this discount ?</p>
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

export default DiscountList