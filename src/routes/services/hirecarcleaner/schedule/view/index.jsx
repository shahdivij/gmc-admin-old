import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GET, POST } from "../../../../../api/fetch"
import URL from "../../../../../api/urls"
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Form,
} from 'react-bootstrap'
import {
    useNavigate
} from 'react-router-dom'
import { MdArrowBackIos } from "react-icons/md"
import { DateTime } from "luxon"
import { MdDeleteOutline, MdEdit } from "react-icons/md";



const ScheduleView = () => {
    
    const params = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [events, setEvents] = useState([])
    const [scheduleDates, setScheduleDates] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)
    const [editData, setEditData] = useState(null)

    const colors = {
        "WORKING_DAY": 'green', 
        "NON_WORKING_DAY": 'orange', 
        "LOCAL_HOLIDAY": 'blue', 
        "NATIONAL_HOLIDAY": 'blue', 
        "OFF_DAY": 'blue'
    }

    const statusTextColors = {
        "INCOMPLETE": 'text-danger',
        "COMPLETE": 'text-success',
        "DISPUTED": 'text-warning',
    }

    const fetchData = async () => {
        const {data, error} = await GET(URL.SCHEDULE.ROOT + "/" + params.id)
        if(data) setData(data)
        
        console.log(data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if(data.length > 0 && data[0].dates){
            setScheduleDates(data[0].dates)
        }
    }, [data])

    const handleFormSubmit = async () => {
        console.log(editData)
        const dataToSend = {
            schedule: params.id,
            date: editData.date,
            status: editData.status
        }

        const {data, error} = await POST(URL.SCHEDULE.STATUS, dataToSend)
        if(data){
            setShowEditModal(false)
            setEditData(null)
        }
        if(error){
            alert(error)
        }
    }

    const handleOnChange = async (e) => {
        const target = e.target
        const name = target.name
        const value = target.value

        editData[name] = value

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
                    <h4 className="mb-3 pageTitle">Schedule Information</h4>
                    <Col>
                        <Row>
                            <Col lg={4}>Schedule ID</Col>
                            <Col>{ data[0] && data[0].schedule_id }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Subscription ID</Col>
                            <Col>{ data[0] && data[0].subscription.subscription_id }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Customer</Col>
                            <Col>{ data[0] && data[0].subscription.customer.name  }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Car ID</Col>
                            <Col>{ data[0] && data[0].subscription.car.car_id }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>cluster</Col>
                            <Col>{ data[0] && data[0].subscription.cluster.value }</Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Col lg={4}>Schedule Start Date</Col>
                            <Col>{ data[0] && data[0].start_date }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Schedule End Date</Col>
                            <Col>{ data[0] && data[0].end_date }</Col>
                        </Row>
                        <Row>
                            <Col lg={4}>Working Days</Col>
                            <Col>{ data[0] && data[0].dates.filter(date => date.day_type == "WORKING_DAY").length }</Col>
                        </Row>
                    </Col>
                </Row>
                <hr></hr>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Day Type</th>
                                <th>Cleaning Type</th>
                                <th>Cleaning Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                scheduleDates.length > 0 && scheduleDates.map((item, index) => {
                                    return(
                                        <tr key={index}>
                                            <td style={{ textAlign: 'center' }}>{DateTime.fromISO(item.date).toISODate()}</td>
                                            <td>{DateTime.fromISO(item.date).weekdayLong}</td>
                                            <td>{item.day_type}</td>
                                            <td>{item.cleaning_type || "-"}</td>
                                            <td className={statusTextColors[item.status]} >{item.status || '-'}</td>
                                            <td>
                                                {item.day_type == "WORKING_DAY" && <MdEdit
                                                    size={25}
                                                    style={{ marginInline: 10, cursor: 'pointer' }}
                                                    onClick={() => {setShowEditModal(true); setEditData(item)}}
                                                />}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>


            <Modal
                size="lg"
                centered
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
            >
                <Modal.Header closeButton>
                <Modal.Title>Update Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form autoComplete='off' aria-autocomplete='none'>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    placeholder="Enter name"
                                    value={editData && DateTime.fromISO(editData.date).toISODate()}
                                    name="name"
                                    onChange={handleOnChange}
                                />
                                <Form.Text className="text-muted">
                                    {/* No special characters or spaces are allowed except undersocre. */}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Day</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    placeholder="Enter name"
                                    value={editData && DateTime.fromISO(editData.date).weekdayLong}
                                    name="name"
                                    onChange={handleOnChange}
                                />
                                <Form.Text className="text-muted">
                                    {/* No special characters or spaces are allowed except undersocre. */}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Day Type</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    placeholder="Enter name"
                                    value={editData && editData.day_type}
                                    name="name"
                                    onChange={handleOnChange}
                                />
                                <Form.Text className="text-muted">
                                    {/* No special characters or spaces are allowed except undersocre. */}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Cleaning Type</Form.Label>
                                <Form.Control
                                    readOnly
                                    type="text"
                                    placeholder="Enter name"
                                    value={editData && editData.cleaning_type}
                                    name="name"
                                    onChange={handleOnChange}
                                />
                                <Form.Text className="text-muted">
                                    {/* No special characters or spaces are allowed except undersocre. */}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label>Cleaning Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    onChange={handleOnChange}
                                >
                                    <option selected={editData && editData.status == "INCOMPLETE"} value={"INCOMPLETE"}>INCOMPLETE</option>
                                    <option selected={editData && editData.status == "COMPLETE"} value={"COMPLETE"}>COMPLETE</option>
                                    <option selected={editData && editData.status == "INPROGRESS"} value={"INPROGRESS"}>INPROGRESS</option>
                                    <option selected={editData && editData.status == "DISPUTED"} value={"DISPUTED"}>DISPUTED</option>
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    {/* No special characters or spaces are allowed except undersocre. */}
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col></Col>
                    </Row>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ScheduleView