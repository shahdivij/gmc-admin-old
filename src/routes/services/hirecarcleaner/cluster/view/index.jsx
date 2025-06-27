import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DELETE, GET, POST, PUT } from "../../../../../api/fetch"
import URL from "../../../../../api/urls"
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
    useNavigate
} from 'react-router-dom'
import { MdArrowBackIos, MdDeleteOutline, MdEdit } from "react-icons/md"
import { ToastContainer, toast } from "react-toastify"

const View = () => {
    
    const params = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [showModal, setShowModal] = useState(null)
    const [formErrors, setFormErrors] = useState({})
    const [formData, setFormData] = useState({})
    const [categoryData, setCategoryData] = useState([])
    const [addedCategories, setAddedCategories] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [deleteObject, setDeleteObject] = useState(null)
    const [timeSlots, setTimeSlots] = useState([])

    const fetchData = async () => {
        const {data, error} = await GET(URL.CLUSTER.REGISTERED + "/" + params.id)
        if(data){
            setData(data)
            if(data[0].cleaner_rate_list){
                const added = []
                data[0].cleaner_rate_list.forEach(item => {if(item.car_category && item.car_category._id) added.push(item.car_category._id)})
                setAddedCategories(added)
            }
        }

        const {data: categories, error: categoryError} = await GET(URL.CAR.CATEGORY)
        if(categories){
            setCategoryData(categories)
        }

        const {data: timeSlot, error: timeSlotError} = await GET(URL.CLUSTER.TIME_SLOT)
        if(timeSlot){
            setTimeSlots(timeSlot)
        }
    
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {

        if(!showModal){
            setFormErrors({})
            setFormData({})
        }
    }, [showModal])

    const setSelectedTimeSlotInit = () => {
        if(data && data[0] && data[0].time_slot){
            const ids = data[0].time_slot.map(timeslot => timeslot._id)
            setFormData({selected: [...ids]})
        }
    }

    // useEffect(() => {
    //     if(showModal == 'manage_slot'){
    //         if(data && data[0] && data[0].time_slot){
    //             data[0].time_slot.forEach((timeslot, index) => {
    //                 console.log(timeslot._id)
    //                 if(formData.selected && !formData.selected.includes(timeslot._id)){
    //                     console.log(index)
    //                     console.log(timeslot._id)
    //                     console.log([...formData.selected, timeslot._id])
    //                     setFormData(pre => ({
    //                         selected: [...pre.selected, timeslot._id]
    //                     }))
    //                 } else {
    //                     console.log(index)
    //                     console.log(timeslot._id)
    //                     if(formData.selected){
    //                         console.log(index)
    //                         if(!formData.selected.includes(timeslot._id)){
    //                             setFormData(pre => ({
    //                                 selected: [...pre.selected, timeslot._id]
    //                             }))
    //                         }
    //                     } else {
    //                         console.log(index)
    //                         setFormData({
    //                             selected: [timeslot._id]
    //                         })
    //                     }
    //                 }
    //             })
    //         }

    //         console.log(formData)
    //     }
    // }, [data, showModal])

    const handleFormSubmit = async () => {
        if(showModal == 'add_rate'){
            if(formData.car_category && formData.int_cleaning_rate && formData.ext_cleaning_rate && !isNaN(parseInt(formData.int_cleaning_rate)) && !isNaN(parseInt(formData.ext_cleaning_rate))) {
                // values are validated now
                const {data, error} = await POST(URL.CLUSTER.CLEANER_RATE_LIST.replace('cluster_id', params.id), formData)
                
                if(data){
                    fetchData()
                    setFormData({})
                    setFormErrors({})
                    setShowModal(null)
                    toast.success('Cleaning rate added successfully.', {
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

            } else {
                if(!formData.car_category){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            car_category: 'Car Category is required.'
                        }
                    })
                }
                if(!formData.int_cleaning_rate){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            int_cleaning_rate: 'Interior cleaning rate is required.'
                        }
                    })
                } else if (isNaN(parseInt(formData.int_cleaning_rate))) {
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            int_cleaning_rate: 'Invalid amount.'
                        }
                    })
                }
                if(!formData.ext_cleaning_rate){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            ext_cleaning_rate: 'Exterior cleaning rate is required.'
                        }
                    })
                } else if (isNaN(parseInt(formData.ext_cleaning_rate))) {
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            ext_cleaning_rate: 'Invalid amount.'
                        }
                    })
                }
            }
        }
        
        if(showModal == 'edit_rate'){
            console.log(formData)
            if(formData.car_category && formData.int_cleaning_rate && formData.ext_cleaning_rate && !isNaN(parseInt(formData.int_cleaning_rate)) && !isNaN(parseInt(formData.ext_cleaning_rate))) {
                // values are validated now
                
                const dataToSend = {
                    car_category: formData.car_category._id,
                    int_cleaning_rate: formData.int_cleaning_rate,
                    ext_cleaning_rate: formData.ext_cleaning_rate
                }
                
                const {data, error} = await PUT(`${URL.CLUSTER.CLEANER_RATE_LIST.replace('cluster_id', params.id)}/${formData._id}`, dataToSend)
                
                console.log(data, error)

                if(data){
                    fetchData()
                    setFormData({})
                    setFormErrors({})
                    setShowModal(null)
                    toast.success('Cleaning rate updated successfully.', {
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

            } else {
                if(!formData.int_cleaning_rate){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            int_cleaning_rate: 'Interior cleaning rate is required.'
                        }
                    })
                } else if (isNaN(parseInt(formData.int_cleaning_rate))) {
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            int_cleaning_rate: 'Invalid amount.'
                        }
                    })
                }
                if(!formData.ext_cleaning_rate){
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            ext_cleaning_rate: 'Exterior cleaning rate is required.'
                        }
                    })
                } else if (isNaN(parseInt(formData.ext_cleaning_rate))) {
                    setFormErrors(pre => {
                        return {
                            ...pre,
                            ext_cleaning_rate: 'Invalid amount.'
                        }
                    })
                }
            }
        }

        if(showModal == 'manage_slot'){
            
            const {data, error} = await POST(`${URL.CLUSTER.CLUSTER_TIME_SLOT.replace('cluster_id', params.id)}`, formData.selected || [])
            
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
    }

    const handleOnChange = (event) => {
        const target = event.target
        let value = target.value
        const name = target.name 

        console.log(value)
        console.log(name)
        console.log(target.id)
        console.log(target.checked)

        delete formErrors[name]
        setFormErrors({...formErrors})

        if(showModal == 'manage_slot'){
            if(target.checked){
                if(formData.selected){
                    setFormData(pre => ({
                        selected: [...pre.selected, name]
                    }))
                } else {
                    setFormData({selected: [name]})
                }
            }
            if(!target.checked){
                if(formData.selected){
                    console.log(formData.selected.filter(item => item != name))
                    setFormData(pre => ({
                        selected: [...pre.selected.filter(item => item != name)]
                    }))
                }
            }
        } else {
            setFormData(pre => {
                return (
                    {
                        ...pre,
                        [name]: value
                    }
                )
            })
        }

        console.log(formData)

    } 

    const deleteData = async () => {
        if(deleteObject == 'rate_list'){
            const {data, error} = await DELETE(`${URL.CLUSTER.CLEANER_RATE_LIST.replace('cluster_id', params.id)}/${deleteId}`)
            if(data){
                setDeleteId(null)
                fetchData()
                setDeleteObject(null)
            }
    
            if(error)
                alert(error)
        }
    }

    const isTimeSlotSelected = (id) => {
        console.log(formData && formData.selected && formData.selected.includes(id))
        if(formData && formData.selected && formData.selected.includes(id)) return true
        return false
    }   

    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        
                        <h3 className='pageTitle'> <MdArrowBackIos size={28} onClick={() => navigate(-1)} style={{ cursor: "pointer" }}/> { data && data.length && data[0].value }</h3>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <h4 className="mb-3 pageTitle">Cluster Information</h4>
                    <Col>
                        <Row>
                            <Col lg={4}>Cluster ID</Col>
                            <Col>{ data[0] && data[0].cluster_id }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Cluster Name</Col>
                            <Col>{ data[0] && data[0].value }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Cluster Address</Col>
                            <Col>{ data[0] && (data[0].address.line_1 + ", " + (data[0].address.line_2 ? data[0].address.line_2 + ", " + data[0].address.area : data[0].address.area) + ", " +data[0].address.city + ", " + data[0].address.state +", " + data[0].address.country + ", " + data[0].address.zip_code)  }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Cluster Residence Type</Col>
                            <Col>{ data[0] && data[0].residence_type.value }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Cluster QR Code Series</Col>
                            <Col>{ data[0] && data[0].qr_code_series || "Not assigned yet" }</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col lg={4}>Cluster Supervisor</Col>
                            <Col>{ data[0] && data[0].supervisor || "Not assigned yet" }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Cluster Geo Location (Lat., Long.)</Col>
                            <Col>{ data[0] && (`(${data[0].geo_location.latitude}, ${data[0].geo_location.longitude})`) }</Col>
                        </Row>
                    </Col>
                </Row>
                <hr></hr>

                <Row className='mt-2'>
                    <h4 className="mb-3 pageTitle">Assigned Packages</h4>
                    <Table className="m-2" bordered striped hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Package ID</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            data && data[0] && data[0].packages && data[0].packages.map((package_, index) => {
                                return <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{ index + 1 }</td>
                                    <td style={{ textAlign: 'center' }}>{ package_.package_id }</td>
                                    <td>{ package_.name }</td>
                                </tr>
                            })
                        }
                        </tbody>
                    </Table>
                </Row>
                <hr></hr>
                
                <Row className='mt-2'>
                    <Row>
                        <Col md={6}>
                            <h4 className="mb-3 pageTitle">Cleaner Rate List</h4>
                        </Col>
                        <Col md={6} style={{ textAlign: "right" }}>
                            <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Col lg={"auto"}>
                                    <Button onClick={() => setShowModal('add_rate')}>Add Rate</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Table className="m-2" bordered striped hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Car Category</th>
                                <th>Interior Cleaning Rate</th>
                                <th>Exterior Cleaning Rate</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data[0] && data[0].cleaner_rate_list && data[0].cleaner_rate_list.map((rate_list, index) => {
                                    console.log(rate_list)
                                    return <>
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{rate_list.car_category && rate_list.car_category.name}</td>
                                            <td className="text-center">{rate_list.int_cleaning_rate}</td>
                                            <td className="text-center">{rate_list.ext_cleaning_rate}</td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => {setDeleteObject('rate_list');setDeleteId(rate_list._id)}} size={25} />
                                                <MdEdit size={25} onClick={ async () => {
                                                    setShowModal('edit_rate')
                                                    setFormData({})
                                                    setFormData(rate_list)
                                                }} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    </>
                                })
                            }
                        </tbody>
                    </Table>
                </Row>
                <hr></hr>
                
                <Row className='mt-2'>
                    <Row>
                        <Col md={6}>
                            <h4 className="mb-3 pageTitle">Time Slots</h4>
                        </Col>
                        <Col md={6} style={{ textAlign: "right" }}>
                            <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Col lg={"auto"}>
                                    <Button onClick={() => {setShowModal('manage_slot'); setSelectedTimeSlotInit()}}>Manage Slots</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Table className="m-2" bordered striped hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data[0] && data[0].time_slot && data[0].time_slot.map((slot, index) => {
                                    console.log(slot)
                                    return <>
                                        <tr key={index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{`${slot.start_time.hour}:${slot.start_time.minute == 0 ? '00' : slot.start_time.minute} ${slot.start_time.ampm}`}</td>
                                            <td className="text-center">{`${slot.end_time.hour}:${slot.end_time.minute == 0 ? '00' : slot.end_time.minute} ${slot.start_time.ampm}`}</td>
                                            <td className="text-center">{''}</td>
                                        </tr>
                                    </>
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>

            {/* Add Rate List Modal */}
            <Modal size='lg' fullscreen={false} centered show={showModal == 'add_rate'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Add A New Rate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["car_category"] && 'text-danger'}>Car Category</Form.Label>
                                    <Form.Select className={ formErrors["car_category"] && 'border-danger'}  name='car_category'  onChange={handleOnChange}>
                                        <option value={null} >Select Category</option>
                                        {
                                            categoryData && categoryData.map((category, index) => {
                                                const exists = addedCategories && addedCategories.includes(category._id)
                                                console.log(exists)
                                                return exists || <option key={index} value={category._id}>{category.name}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["car_category"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["int_cleaning_rate"] && 'text-danger'}>Interior cleaning rate</Form.Label>
                                    <Form.Control  className={ formErrors["int_cleaning_rate"] && 'border-danger'} name="int_cleaning_rate" type="text" placeholder="Enter amount" onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["int_cleaning_rate"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["ext_cleaning_rate"] && 'text-danger'}>Exterior cleaning rate</Form.Label>
                                    <Form.Control  className={ formErrors["ext_cleaning_rate"] && 'border-danger'} name="ext_cleaning_rate" type="text" placeholder="Enter amount" onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["ext_cleaning_rate"] }
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

            {/* Edit Rate List Modal */}
            <Modal size='lg' fullscreen={false} centered show={showModal == 'edit_rate'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Rate</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["car_category"] && 'text-danger'}>Car Category</Form.Label>
                                    <Form.Select disabled className={ formErrors["car_category"] && 'border-danger'}  name='car_category'  onChange={handleOnChange}>
                                        <option>{formData && formData.car_category && formData.car_category.name}</option>
                                    </Form.Select>
                                    <Form.Text className="text-danger">
                                        { formErrors["car_category"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["int_cleaning_rate"] && 'text-danger'}>Interior cleaning rate</Form.Label>
                                    <Form.Control  className={ formErrors["int_cleaning_rate"] && 'border-danger'} value={formData && formData.int_cleaning_rate} name="int_cleaning_rate" type="text" placeholder="Enter amount" onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["int_cleaning_rate"] }
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label className={ formErrors["ext_cleaning_rate"] && 'text-danger'}>Exterior cleaning rate</Form.Label>
                                    <Form.Control  className={ formErrors["ext_cleaning_rate"] && 'border-danger'} value={formData && formData.ext_cleaning_rate} name="ext_cleaning_rate" type="text" placeholder="Enter amount" onChange={handleOnChange}/>
                                    <Form.Text className="text-danger">
                                        { formErrors["ext_cleaning_rate"] }
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

            {/* Manage Time Slot Modal */}
            <Modal size='sm' fullscreen={false} centered show={showModal == 'manage_slot'} onHide={() => setShowModal(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Manage Time Slot</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete='off' aria-autocomplete='none'>
                            {timeSlots && timeSlots.map((timeSlot, index) => {
                                return (
                                    <Form.Check 
                                        key={index}
                                        type="checkbox"
                                        checked={isTimeSlotSelected(timeSlot._id)}
                                        label={`${timeSlot.start_time.hour}:${timeSlot.start_time.minute} ${timeSlot.start_time.ampm} - ${timeSlot.end_time.hour}:${timeSlot.end_time.minute} ${timeSlot.end_time.ampm}`}
                                        id={index}
                                        onChange={handleOnChange}
                                        name={timeSlot._id}
                                    />
                                )
                            })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(null)}>
                    Cancel
                </Button>
                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                    Save
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

            {/* Delete Rate List Modal */}
            <Modal centered show={deleteId != null && deleteObject == 'rate_list'} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Rate List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this rate list ?</p>
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
            
            {/* Delete Time Slot Modal */}
            <Modal centered show={deleteId != null && deleteObject == 'time_slot'} onHide={() => setDeleteId(null)}>
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

        </>
    )
}

export default View