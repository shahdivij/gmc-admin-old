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
import { GET, POST } from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import { getCities, getStates } from '../../../../../api/map_data'
import { LuMinusCircle, LuPlusCircle } from "react-icons/lu";
import { DateTime } from 'luxon'

const LocalHoliday = () => {
    
    const [showModal, setShowModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [formData, setFormData] = useState({})
    const [data, setData] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [holidaysInputCount, setHolidaysInputCount] = useState([])
    const [formErrors, setFormErrors] = useState({})

    const fetchData = async () => {
        const { data, error } = await GET(URL.HOLIDAY.LOCAL)
        if(data) setData(data)
        
        console.log(data)
        console.log(error)

        const statesData = await getStates("INDIA")
        console.log(statesData)
        setStates(statesData.states)
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if(showModal == false){
            setFormData({})
            setHolidaysInputCount([])
        }
    }, [showModal])

    const handleOnChange = async () => {
        const target = event.target;
        let value = target.value;
        const name = target.name;
        delete formErrors[name]
        setFormErrors({...formErrors})

        if(name == 'state'){
            const citiesData = await getCities(value, "INDIA")
            setCities(citiesData)
            console.log(citiesData)
        }

        if(name.includes("name_") || name.includes("date_")){
            const index = name.split("_")[1]
            const earlierData = formData.holidays && formData.holidays[index]
            if(earlierData){
                if(name.includes("name_")){
                    setFormData({
                        ...formData,
                        holidays: {
                            ...formData.holidays,
                            [index]: {
                                ...formData.holidays[index],
                                name: value
                            }
                        }
                    })
                } else if(name.includes("date_")) {
                    setFormData({
                        ...formData,
                        holidays: {
                            ...formData.holidays,
                            [index]: {
                                ...formData.holidays[index],
                                date: value
                            }
                        }
                    })
                }
            } else {
                if(name.includes("name_")){
                    setFormData({
                        ...formData,
                        holidays: {
                            ...formData.holidays || {},
                            [index]: {
                                name: value
                            }
                        }
                    })
                } else if (name.includes("date_")){
                    setFormData({
                        ...formData,
                        holidays: {
                            ...formData.holidays || {},
                            [index]: {
                                date: value
                            }
                        }
                    })
                }
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            }) 
        }

        
        console.log(formData)

    }

    const handleFormSubmit = async () => {
        console.log(formData)
        if(formData.city && formData.holidays && Object.keys(formData.holidays).length > 0){
            
            const holidaysData = []
            Object.keys(formData.holidays).map(key => holidaysData.push(formData.holidays[key]))

            const dataToSend = {
                city: formData.city,
                holidays: holidaysData
            }
            
            const { data, error } = await POST(URL.HOLIDAY.LOCAL, dataToSend)
            if(data){
                setShowModal(false)
                fetchData()
                setFormData({})
            }

            if(error){
                alert(error)
            }
        } else {
            if(!formData.state){
                setFormErrors(pre => ({...pre, state: "Please select state."}))
            }
            if(!formData.city){
                setFormErrors(pre => ({...pre, city: "Please select city."}))
            }
            if(!formData.holidays || formData.holidays.length == 0){
                setFormErrors(pre => ({...pre, holidays: "Please select holiday dates."}))
            }
        }
    }

    // useEffect(() => {
    //     // 2024-05-23
    //     setFormErrors({})
    // }, [formData])

    useEffect(() => {
        setFormErrors({})
        setFormData({})
        setCities([])
    }, [showModal])

    return(
        <>
          <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        <h3  className='pageTitle'>Local Holiday</h3>
                    </Col>
                    <Col lg={2} style={{ textAlign: 'right' }}>
                        <Button onClick={() => setShowModal('add')}>Add Holiday</Button>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>City Name</th>
                                <th>Number of Holidays</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.length > 0 && data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td>{item.city}</td>
                                            <td style={{ textAlign: 'center' }}>{item.holidays.length}</td>
                                            <td>
                                                <MdDeleteOutline
                                                    style={{ cursor: 'pointer' }}
                                                    size={25}
                                                    onClick={() => setDeleteId(item._id)}
                                                />
                                                <MdEdit
                                                    size={25}
                                                    style={{ marginInline: 10, cursor: 'pointer' }}
                                                    onClick={() => {
                                                        console.log(item)
                                                        let holidays_ = {}
                                                        let count = []
                                                        item.holidays.forEach((holiday, index) => {
                                                            holidays_[index] = {
                                                                name: holiday.name,
                                                                date: holiday.date,
                                                            }
                                                            count.push(index)
                                                        })
                                                        console.log(count)
                                                        setFormData({
                                                            ...item,
                                                            holidays: {...holidays_}
                                                        })
                                                        console.log(formData)
                                                        setHolidaysInputCount([...count])
                                                        setShowModal('edit')
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>  

            {/* Add */}
            <Modal
                size="lg"
                centered
                show={showModal == 'add'}
                onHide={() => setShowModal(false)}
            >
                <Modal.Header closeButton>
                <Modal.Title>Add A New Holiday</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form autoComplete='off' aria-autocomplete='none'>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formBasicText">
                                <Form.Label  className={ formErrors["state"] && 'text-danger'}>Select State</Form.Label>
                                <Form.Select  className={ formErrors["state"] && 'border-danger'} name='state'  onChange={handleOnChange}>
                                    <option value={null} >Select State</option>
                                    {
                                        states.map((item, index) => {
                                            return(
                                                <option key={index} value={item.name} >{item.name}</option>
                                            )
                                        })   
                                    }
                                </Form.Select>
                                <Form.Text className='text-danger'>
                                    { formErrors["state"] }
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col>
                            {
                                formData.state &&
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label  className={ formErrors["city"] && 'text-danger'}>Enter city name</Form.Label>
                                    <Form.Control  className={ formErrors["city"] && 'border-danger'} name='city' type='text' onChange={handleOnChange}>
                                    </Form.Control>
                                    <Form.Text className='text-danger'>
                                        { formErrors["city"] }
                                    </Form.Text>
                                </Form.Group> 
                            }
                        </Col>
                        <Col></Col>
                    </Row>

                    <hr />
                    {
                        formData && formData.city && <h5 className='mt-1'>Add Local Holidays for {formData.city}</h5>
                    }

                    { formData && formData.city && 
                        holidaysInputCount && holidaysInputCount.map((count, index) => {
                            return(
                            <>
                                <Row key={index} className='mt-3'>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Holiday Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name={"name_" + count}
                                        onChange={handleOnChange}
                                    />
                                    <Form.Text className="text-muted">
                                        {/* No special characters or spaces are allowed except undersocre. */}
                                    </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Holiday Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Select Date"
                                        name={"date_" + count}
                                        onChange={handleOnChange}
                                    />
                                    <Form.Text className="text-muted">
                                        {/* This value will be visible to end users as Car Model Name. */}
                                    </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                                >
                                {
                                    <LuMinusCircle
                                        onClick={() => {
                                            const d = holidaysInputCount;
                                            d.length = d.length - 1;
                                            if (d.length == 0) {
                                                setHolidaysInputCount([]);
                                            } else {
                                                setHolidaysInputCount([...d]);
                                            }
                                            const holidays = formData.holidays 
                                            if(holidays){
                                                delete holidays[count]
                                                setFormData({
                                                    ...formData,
                                                    holidays: {
                                                        ...holidays
                                                    }
                                                })
                                            }
                                        }}
                                        size={25}
                                        style={{ marginBottom: 7, cursor: "pointer" }}
                                    />
                                }
                                </Col>
                                </Row>
                            </>
                            )
                        })
                    }

                    {
                        formData && formData.city &&
                        <Row>
                    <Col>
                        <Row>
                        <Col
                            style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            }}
                        >
                            <LuPlusCircle size={20} />
                            <Button
                            style={{
                                backgroundColor: "rgba(0,0,0,0)",
                                border: "none",
                                color: "black",
                            }}
                            onClick={() => {
                                setHolidaysInputCount([
                                ...holidaysInputCount,
                                holidaysInputCount.length,
                                ]);
                            }}
                            >
                            Add More
                            </Button>
                        </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                    </Row>
                    }
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                    Add
                </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit */}
            <Modal
                size="lg"
                centered
                show={showModal == 'edit'}
                onHide={() => setShowModal(false)}
            >
                <Modal.Header closeButton>
                <Modal.Title>Edit Holiday</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form autoComplete='off' aria-autocomplete='none'>

                    <Row>
                        <Col>
                            {
                                formData &&
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Select City</Form.Label>
                                    <Form.Control disabled name='city'  value={formData.city} onChange={handleOnChange}>
                                    </Form.Control>
                                </Form.Group> 
                            }
                        </Col>
                        <Col></Col>
                    </Row>

                    <hr />
                    {
                        formData && formData.city && <h5 className='mt-1'>Add Local Holidays for {formData.city}</h5>
                    }

                    { showModal == 'edit' && formData && formData.city && 
                        holidaysInputCount && holidaysInputCount.map((count, index) => {
                            return(
                            <>
                                <Row key={index} className='mt-3'>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Holiday Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name={"name_" + count}
                                        value={formData.holidays[count].name}
                                        onChange={handleOnChange}
                                    />
                                    <Form.Text className="text-muted">
                                        {/* No special characters or spaces are allowed except undersocre. */}
                                    </Form.Text>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>Holiday Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        placeholder="Select Date"
                                        name={"date_" + count}
                                        onChange={handleOnChange}
                                        value={formData.holidays[count].date.includes("T") ? DateTime.fromISO(formData.holidays[count].date).toISO().split("T")[0] : formData.holidays[count].date}
                                    />
                                    <Form.Text className="text-muted">
                                        {/* This value will be visible to end users as Car Model Name. */}
                                    </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                                >
                                {
                                    <LuMinusCircle
                                        onClick={() => {
                                            const d = holidaysInputCount;
                                            d.length = d.length - 1;
                                            if (d.length == 0) {
                                                setHolidaysInputCount([]);
                                            } else {
                                                setHolidaysInputCount([...d]);
                                            }
                                            const holidays = formData.holidays 
                                            if(holidays){
                                                delete holidays[count]
                                                setFormData({
                                                    ...formData,
                                                    holidays: {
                                                        ...holidays
                                                    }
                                                })
                                            }
                                        }}
                                        size={25}
                                        style={{ marginBottom: 7, cursor: "pointer" }}
                                    />
                                }
                                </Col>
                                </Row>
                            </>
                            )
                        })
                    }

                    {
                        formData && formData.city &&
                        <Row>
                    <Col>
                        <Row>
                        <Col
                            style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            }}
                        >
                            <LuPlusCircle size={20} />
                            <Button
                            style={{
                                backgroundColor: "rgba(0,0,0,0)",
                                border: "none",
                                color: "black",
                            }}
                            onClick={() => {
                                setHolidaysInputCount([
                                ...holidaysInputCount,
                                holidaysInputCount.length,
                                ]);
                            }}
                            >
                            Add More
                            </Button>
                        </Col>
                        </Row>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                    </Row>
                    }
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                    Update
                </Button>
                </Modal.Footer>
            </Modal>


            <Modal centered show={deleteId != null} onHide={() => setDeleteId(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete City</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this city and its local holidays ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteId(null)}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LocalHoliday