import { useEffect, useState } from 'react'
import {
    Container,
    Row,
    Col,
    Table,
} from 'react-bootstrap'
import {
    GET
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import { Link } from 'react-router-dom'
import URL_STRINGS from '../../../../../utility/URL_STRINGS'
import { DateTime } from 'luxon'


const ScheduleList = () => {

    const [data, setData] = useState([])

    const fetchData = async () => {

        const {data, error} = await GET(URL.SCHEDULE.ROOT)
        if(data) setData(data)
    }

    useEffect(() => {
        fetchData()
    }, [])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={10}>
                        <h3 className='pageTitle'>Schedule List</h3>
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
                                <th>Schedule ID</th>
                                <th>Subscription ID</th>
                                <th>Schedule Start Date</th>
                                <th>Schedule End Date</th>
                                <th>Working Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.length > 0 && data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td><Link to={URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.VIEW + "/" + item._id}>{item.schedule_id}</Link></td>
                                            <td>{item.subscription.subscription_id}</td>
                                            <td style={{ textAlign: 'center' }}>{DateTime.fromISO(item.start_date).toISODate()}</td>
                                            <td style={{ textAlign: 'center' }}>{DateTime.fromISO(item.end_date).toISODate()}</td>
                                            <td style={{ textAlign: 'center' }}>{item.dates.filter(date => date.day_type == "WORKING_DAY").length}</td>
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


export default ScheduleList