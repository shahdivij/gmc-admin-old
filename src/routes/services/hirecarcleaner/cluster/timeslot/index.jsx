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
import { ToastContainer, toast } from "react-toastify"

const TimeHours = [1,2,3,4,5,6,7,8,9,10,11,12]
const TimeMinuts = ['00', 10,20,30,40,50]

const TimeSlot = () => {

    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null)
    const [formErrors, setFormErrors] = useState({})

    const fetchData = async () => {
        
        console.log(URL.CLUSTER.TIME_SLOT)
        const {data, error} = await GET(URL.CLUSTER.TIME_SLOT)
        console.log(data, error)
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
        const {data, error} = await DELETE(`${URL.CLUSTER.TIME_SLOT}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const setTimeSlotFormData = async () => {
        if(!formData.start_time_hour){
            setFormData(pre => ({ ...pre, start_time_hour: '1' }))
        }
        if(!formData.start_time_minute){
            setFormData(pre => ({ ...pre, start_time_minute: '00' }))
        }
        if(!formData.end_time_hour){
            setFormData(pre => ({ ...pre, end_time_hour: '1' }))
        }
        if(!formData.end_time_minute){
            setFormData(pre => ({ ...pre, end_time_minute: '00' }))
        }
        if(!formData.start_time_am_pm){
            setFormData(pre => ({ ...pre, start_time_am_pm: 'AM' }))
        }
        if(!formData.end_time_am_pm){
            setFormData(pre => ({ ...pre, end_time_am_pm: 'AM' }))
        }
    }

    const handleFormSubmit = async () => {
        if(showModal == 'add' || showModal == 'edit'){
            await setTimeSlotFormData()
            console.log(formData)

            if(formData.start_time_hour && formData.start_time_minute && formData.start_time_am_pm && formData.end_time_hour && formData.end_time_minute && formData.end_time_am_pm) {
                // values are validated now
                
                const dataToSend = {
                    start_time: {
                        hour: formData.start_time_hour,
                        minute: formData.start_time_minute,
                        ampm: formData.start_time_am_pm 
                    },
                    end_time: {
                        hour: formData.end_time_hour,
                        minute: formData.end_time_minute,
                        ampm: formData.end_time_am_pm 
                    },
                    visible: true
                }
                
                if(showModal == 'edit'){
                    
                    console.log(formData)
                    console.log(`${URL.CLUSTER.TIME_SLOT}/${formData.id}`)
                    console.log(dataToSend)
                    const {data, error} = await PUT(`${URL.CLUSTER.TIME_SLOT}/${formData.id}`, dataToSend)
                    
                    console.log(data, error)
    
                    if(data){
                        fetchData()
                        setFormData({})
                        setFormErrors({})
                        setShowModal(null)
                        toast.success('Time slot updated successfully.', {
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

                if(showModal == 'add'){

                    console.log(dataToSend)
                    const {data, error} = await POST(`${URL.CLUSTER.TIME_SLOT}`, dataToSend)
                    
                    console.log(data, error)
    
                    if(data){
                        fetchData()
                        setFormData({})
                        setFormErrors({})
                        setShowModal(null)
                        toast.success('Time slot added successfully.', {
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

            } else {
                if(!formData.start_time_hour){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            start_time_hour: 'Start time hour is required.'
                        }
                    })
                } 
                if(!formData.start_time_minute){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            start_time_minute: 'Start time minute is required.'
                        }
                    })
                } 
    
                if(!formData.end_time_hour){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            end_time_hour: 'End time hour is required.'
                        }
                    })
                } 
                if(!formData.end_time_minute){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            end_time_minute: 'End time minute is required.'
                        }
                    })
                } 
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
                        <h3 className='pageTitle'>Time Slot</h3>
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
                                <th>Start time</th>
                                <th>End time</th>
                                <th>Duration</th>
                                <th>Visible</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.map((slot, index) => {
                                    console.log(slot)
                                    return <>
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{`${slot.start_time.hour}:${slot.start_time.minute == 0 ? '00' : slot.start_time.minute} ${slot.start_time.ampm}`}</td>
                                            <td className="text-center">{`${slot.end_time.hour}:${slot.end_time.minute == 0 ? '00' : slot.end_time.minute} ${slot.start_time.ampm}`}</td>
                                            <td className="text-center">{'-'}</td>
                                            <td className="text-center">{slot.visible ? 'Yes' : 'No'}</td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(slot._id)} size={25} />
                                                <MdEdit size={25} onClick={ async () => {
                                                    setShowModal('edit')
                                                    setFormData({})
                                                    setFormData({
                                                        start_time_hour: slot.start_time.hour,
                                                        start_time_minute: slot.start_time.minute == 0 ? '00' : slot.start_time.minute,
                                                        start_time_am_pm: slot.start_time.ampm,
                                                        end_time_hour: slot.end_time.hour,
                                                        end_time_minute: slot.end_time.minute == 0 ? '00' : slot.end_time.minute,
                                                        end_time_am_pm: slot.end_time.ampm,
                                                        id: slot._id
                                                    })
                                                }} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    </>
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
        

            {/* Add Time Slot Modal */}
            <Modal size='md' fullscreen={false} centered show={showModal == 'add'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Time Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <h6>Set Start Time</h6>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["start_time_hour"] && 'text-danger'}>Hour</Form.Label>
                                    <Form.Select className={ formErrors["start_time_hour"] && 'border-danger'}  name='start_time_hour'  onChange={handleOnChange}>
                                        {
                                            TimeHours && TimeHours.map((time, index) => {
                                                return <option selected={index == 0} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["start_time_hour"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["start_time_minute"] && 'text-danger'}>Minute</Form.Label>
                                    <Form.Select className={ formErrors["start_time_minute"] && 'border-danger'}  name='start_time_minute'  onChange={handleOnChange}>
                                        {
                                            TimeMinuts && TimeMinuts.map((time, index) => {
                                                return <option selected={index == 0} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["start_time_minute"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["start_time_am_pm"] && 'text-danger'}>AM/PM</Form.Label>
                                    <Form.Select className={ formErrors["start_time_am_pm"] && 'border-danger'}  name='start_time_am_pm'  onChange={handleOnChange}>
                                        <option value={'AM'} selected>AM</option>
                                        <option value={'PM'} >PM</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["start_time_am_pm"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <h6>Set End Time</h6>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["end_time_hour"] && 'text-danger'}>Hour</Form.Label>
                                    <Form.Select className={ formErrors["end_time_hour"] && 'border-danger'}  name='end_time_hour'  onChange={handleOnChange}>
                                        {
                                            TimeHours && TimeHours.map((time, index) => {
                                                return <option selected={index == 0} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["end_time_hour"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["end_time_minute"] && 'text-danger'}>Minute</Form.Label>
                                    <Form.Select className={ formErrors["end_time_minute"] && 'border-danger'}  name='end_time_minute'  onChange={handleOnChange}>
                                        {
                                            TimeMinuts && TimeMinuts.map((time, index) => {
                                                return <option selected={index == 0} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["end_time_minute"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["end_time_am_pm"] && 'text-danger'}>AM/PM</Form.Label>
                                    <Form.Select className={ formErrors["end_time_am_pm"] && 'border-danger'}  name='end_time_am_pm'  onChange={handleOnChange}>
                                        <option value={'AM'} selected>AM</option>
                                        <option value={'PM'} >PM</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["end_time_am_pm"] }
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


            {/* Edit Time Slot Modal */}
            <Modal size='md' fullscreen={false} centered show={showModal == 'edit'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Time Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <h6>Set Start Time</h6>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["start_time_hour"] && 'text-danger'}>Hour</Form.Label>
                                    <Form.Select className={ formErrors["start_time_hour"] && 'border-danger'}  name='start_time_hour'  onChange={handleOnChange}>
                                        {
                                            TimeHours && TimeHours.map((time, index) => {
                                                return <option selected={formData.start_time_hour == time} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["start_time_hour"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["start_time_minute"] && 'text-danger'}>Minute</Form.Label>
                                    <Form.Select className={ formErrors["start_time_minute"] && 'border-danger'}  name='start_time_minute'  onChange={handleOnChange}>
                                        {
                                            TimeMinuts && TimeMinuts.map((time, index) => {
                                                return <option selected={formData.start_time_minute == time} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["start_time_minute"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["start_time_am_pm"] && 'text-danger'}>AM/PM</Form.Label>
                                    <Form.Select className={ formErrors["start_time_am_pm"] && 'border-danger'}  name='start_time_am_pm'  onChange={handleOnChange}>
                                        <option value={'AM'} selected={formData.start_time_am_pm == 'AM'}>AM</option>
                                        <option value={'PM'} selected={formData.start_time_am_pm == 'PM'}>PM</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["start_time_am_pm"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <h6>Set End Time</h6>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["end_time_hour"] && 'text-danger'}>Hour</Form.Label>
                                    <Form.Select className={ formErrors["end_time_hour"] && 'border-danger'}  name='end_time_hour'  onChange={handleOnChange}>
                                        {
                                            TimeHours && TimeHours.map((time, index) => {
                                                return <option selected={formData.end_time_hour == time} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["end_time_hour"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["end_time_minute"] && 'text-danger'}>Minute</Form.Label>
                                    <Form.Select className={ formErrors["end_time_minute"] && 'border-danger'}  name='end_time_minute'  onChange={handleOnChange}>
                                        {
                                            TimeMinuts && TimeMinuts.map((time, index) => {
                                                return <option selected={formData.end_time_minute == time} key={index} value={time}>{time}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["end_time_minute"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["end_time_am_pm"] && 'text-danger'}>AM/PM</Form.Label>
                                    <Form.Select className={ formErrors["end_time_am_pm"] && 'border-danger'}  name='end_time_am_pm'  onChange={handleOnChange}>
                                        <option value={'am'} selected={formData.end_time_am_pm == 'AM'}>AM</option>
                                        <option value={'pm'} selected={formData.end_time_am_pm == 'PM'}>PM</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["end_time_am_pm"] }
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

            {/* Delete Time Slot Modal */}
            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Time Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this time slot ?</p>
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

export default TimeSlot