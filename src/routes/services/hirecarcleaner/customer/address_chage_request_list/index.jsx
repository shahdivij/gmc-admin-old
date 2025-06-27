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
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import URL_STRING from "./../../../../../utility/URL_STRINGS"
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'

const AddressChangeRequestList = () => {

    const [data, setData] = useState([])

    const fetchData = async () => {
        const { data, error } = await GET(URL.CUSTOMER.CHANGE_ADDRESS_REQUEST)
        if(data){
            console.log(data)
            setData(data)


        }

        if(error){
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getAddressFormatted = (addressObject) => {
        if(addressObject && Object.keys(addressObject).length > 0){
            return addressObject.line_1 + ( addressObject.line_2 ? ", " + addressObject.line_2 + ", " + addressObject.area : + addressObject.area) + ", " + addressObject.city + ", " + addressObject.state + ", " + addressObject.country + ", " + addressObject.zip_code
        }
        return ""
    }

    return(
        <Container fluid className='pt-2'>
                <Row>
                    <Col lg={11}>
                        <h3 className='pageTitle'>Address Change Request</h3>
                    </Col>
                    <Col lg={1}>
                        {/* <Button onClick={() => setShowModal(true)}>Add</Button> */}
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Request ID</th>
                                <th>Customer ID</th>
                                <th>Customer Name</th>
                                <th>Customer Mobile</th>
                                <th>Address</th>
                                <th>Request Raised</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td style={{ textAlign: 'center' }}>{index +  1}</td>
                                            <td>{item.request_id}</td>
                                            <td>{item.customer.customer_id}</td>
                                            <td>{item.customer.name}</td>
                                            <td>{item.customer.mobile_number}</td>
                                            <td>{getAddressFormatted(item.customer.addresses.filter(address => address._id == item.address_to_change)[0])}</td>
                                            <td>{DateTime.fromISO(item.created_at).toFormat('yyyy LLL dd | HH:mm ')}</td>
                                            <td>{item.comment || "-" }</td>
                                            <td>{item.status}</td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={console.log("first")} size={25} />
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
    )
}

export default AddressChangeRequestList