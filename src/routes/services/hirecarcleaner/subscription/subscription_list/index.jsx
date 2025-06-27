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
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'


const SubscriptionList = () => {

    const [data, setData] = useState([])

    const fetchData = async () => {

        const subscription = await GET(URL.SUBSCRIPTION)
        console.log(subscription)
        if(subscription.data && subscription.data.length > 0){
            setData(subscription.data)

            console.log(subscription.data.length)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        <h3 className='pageTitle'>Subscription</h3>
                    </Col>
                    <Col lg={2} style={{ textAlign: 'right' }}>
                        {/* <Button onClick={() => setShowModal(true)}>Add Package</Button> */}
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Subscription ID</th>
                                <th>Package ID</th>
                                <th>Customer</th>
                                <th>Car ID</th>
                                <th>Cluster</th>
                                <th>Price</th>
                                <th>Days</th>
                                <th>Int. Cleaning</th>
                                <th>Ext. Cleaning</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.length > 0 && data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td>{item.subscription_id}</td>
                                            <td>{item.package.package_id}</td>
                                            <td>{item.customer.name}</td>
                                            <td>{item.car.car_id}</td>
                                            <td>{item.cluster && item.cluster.value || ''}</td>
                                            <td style={{ textAlign: 'center' }}>{item.price}</td>
                                            <td style={{ textAlign: 'center' }}>{item.number_of_days}</td>
                                            <td style={{ textAlign: 'center' }}>{item.interior_cleaning}</td>
                                            <td style={{ textAlign: 'center' }}>{item.exterior_cleaning}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
        </>
    )
}


export default SubscriptionList