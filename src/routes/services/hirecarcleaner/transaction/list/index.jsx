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
import { GET } from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import { DateTime } from 'luxon'

const TransactionList = () => {

    const [data, setData] = useState([])


    const fetchData = async () => {

        const {data, error} = await GET(URL.TRANSACTION.ROOT)
        if(data) setData(data)
        console.log(data)
            
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <>
        <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        <h3 className='pageTitle'>Transaction List</h3>
                    </Col>
                    <Col lg={2} style={{ textAlign: 'right' }}>
                        {/* <Button onClick={() => setShowModal('add')}>Add Discount</Button> */}
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>ID</th>
                                <th>Payment ID</th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Sub. ID</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && data.length > 0 && data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td style={{ textAlign: 'center' }}>{item.transaction_id}</td>
                                            <td style={{ textAlign: 'center' }}>{item.payment_id}</td>
                                            <td style={{ textAlign: 'center' }}>{item.order_id}</td>
                                            <td style={{ textAlign: 'center' }}>{item.paid_by.customer_id}</td>
                                            <td style={{ textAlign: 'center' }}>{item.amount}</td>
                                            <td style={{ textAlign: 'center' }}>{item.method || '-'}</td>
                                            <td style={{ textAlign: 'center' }}>{item.subscription_id.subscription_id}</td>
                                            <td style={{ textAlign: 'center' }}>{DateTime.fromISO(item.created_at).toISODate()}</td>
                                            <td style={{ textAlign: 'center' }}>{DateTime.fromISO(item.created_at).toISOTime().split('.')[0]}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row>

            </Container>
    </>
}

export default TransactionList