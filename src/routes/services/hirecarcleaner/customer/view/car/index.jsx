import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GET } from "../../../../../../api/fetch"
import URL from "../../../../../../api/urls"
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Form
} from 'react-bootstrap'
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosInformationCircleOutline } from "react-icons/io"
import { MdArrowBackIos, MdDeleteOutline, MdEdit } from "react-icons/md"
import {
    useNavigate
} from 'react-router-dom'
import { DateTime } from "luxon"

const CarView = () => {
    
    const params = useParams()
    const navigate = useNavigate()
    const [carData, setCarData] = useState(null)

    const fetchData = async () => {
        console.log(URL.CUSTOMER.CAR.replace("customerID", params.customerID).replace("carID", params.carID))
        const {data, error} = await GET(URL.CUSTOMER.CAR.replace("customerID", params.customerID).replace("carID", params.carID))
        if(data){
            setCarData(data[0])
        }
        console.log(data[0])
        console.log(error)
    }

    useEffect(() => {
        console.log(params)
        fetchData()
    }, [])



    return(
        <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        <h3 className='pageTitle'> <MdArrowBackIos size={28} onClick={() => navigate(-1)} style={{ cursor: "pointer" }}/> { (carData && carData.customer_id && carData.customer_id.name) + " / " + (carData && carData.car_id) }</h3>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <h4 className="mb-3 pageTitle">Customer Car Information</h4>
                    {   carData && 
                        <>
                            <Col style={{ borderRight: 'solid black 0.05rem' }}>
                                <Row>
                                    <Col lg={8}>Car ID</Col>
                                    <Col>{ carData && carData?.car_id }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Registration Number</Col>
                                    <Col>{ carData && carData?.registration_number }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Model</Col>
                                    <Col>{ carData && carData?.model?.name }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Brand</Col>
                                    <Col>{ carData && carData?.model?.brand?.name }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Category</Col>
                                    <Col>{ carData && carData?.model?.category?.name }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Parking Number</Col>
                                    <Col>{ carData && carData?.parking_lot_number }</Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Col lg={8}>Fuel Type</Col>
                                    <Col>{ carData && carData?.fuel_type?.name }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Transmission Type</Col>
                                    <Col>{ carData && carData?.transmission_type?.name }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Registration Type</Col>
                                    <Col>{ carData && carData?.registration_type?.name }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>QR Code ID</Col>
                                    <Col>{ carData && carData?.qr_code?.qr_code_id }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Cleaning Balance Amount</Col>
                                    <Col>{  }</Col>
                                </Row>
                                <Row>
                                    <Col lg={8}>Cleanings Balance (Int./Ext.)</Col>
                                    <Col>{  }</Col>
                                </Row>
                            </Col>
                        </>
                    }  
                </Row>
                <hr></hr>

                <Row className='mt-2'>
                    <Row>
                        <Col>
                            <h4 className="mb-3 pageTitle">Customer Car Subscriptions</h4>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            {
                                // <Button onClick={() => {console.log("first")}}>Take Subscription</Button>
                            }    
                        </Col>
                    </Row>
                    <Col>
                        <Table className="m-2" bordered striped hover>
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th>#</th>
                                    <th>Subscription ID</th>
                                    <th>Package ID</th>
                                    <th>Schedule ID</th>
                                    <th>Price</th>
                                    <th>Days</th>
                                    <th>Interior</th>
                                    <th>Exterior</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                carData && carData.subscription && carData.subscription.map((subscription, index) => {
                                    return (
                                        <>
                                           <tr key={index}>
                                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                <td>{subscription.subscription_id}</td>
                                                <td>{subscription.package.package_id}</td>
                                                <td>{subscription.schedule.schedule_id}</td>
                                                <td style={{ textAlign: 'center' }}>{subscription.price}</td>
                                                <td style={{ textAlign: 'center' }}>{subscription.number_of_days}</td>
                                                <td style={{ textAlign: 'center' }}>{subscription.interior_cleaning}</td>
                                                <td style={{ textAlign: 'center' }}>{subscription.exterior_cleaning}</td>
                                                <td style={{ textAlign: 'center' }}>{DateTime.fromISO(subscription.schedule.start_date).toISODate()}</td>
                                                <td style={{ textAlign: 'center' }}>{DateTime.fromISO(subscription.schedule.end_date).toISODate()}</td>
                                                <td style={{ color: subscription.active_status == "Active" ? 'green' : 'blue' }}>{subscription.active_status}</td>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>

        </Container>
    )
}

export default CarView