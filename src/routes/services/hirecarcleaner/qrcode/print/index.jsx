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
    DELETE
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import { Link } from 'react-router-dom'


const Print = () => {

    const [showModal, setShowModal] = useState(null)
    const [data, setData] = useState([])
    const [formData, setFormData] = useState({})
    const [deleteId, setDeleteId] = useState(null)
    const [selectedSeriesRange, setSelectedSeriesRange] = useState(null)


    const fetchData = async () => {
        
        const {data, error} = await GET(URL.QRCODE_SERIES.SERIES)
        
        if(data)
            setData(data)
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        
        if(showModal == 'generate' && name === 'series_name'){
            const selectedSeries = data && data.filter(series => series._id == value)
            if(selectedSeries.length && selectedSeries[0].range){
                setSelectedSeriesRange(selectedSeries[0].range)
            }else{
                setSelectedSeriesRange(null)
            }
        }

        if(showModal == 'print' && name === 'series_id'){
            const selectedSeries = data && data.filter(series => series._id == value)
            if(selectedSeries.length && selectedSeries[0].generated_range){
                setSelectedSeriesRange(selectedSeries[0].generated_range)
            }else{
                setSelectedSeriesRange(null)
            }
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const deleteData = async () => {
        const {data, error} = await DELETE(`${URL.QRCODE_SERIES.SERIES}/${deleteId}`)
        if(data){
            setDeleteId(null)
            fetchData()
        }

        if(error)
            alert(error)
    }

    const handleFormSubmit = async () => {
        console.log(formData)
        if(formData.series_id && formData.range){
            
            const dataToSend = {
                series_id: formData.series_id,
                range: formData.range
            }
            
            const {data, error} = await POST(URL.QRCODE_SERIES.PRINT, {"Content-Type": "image/png"}, dataToSend)
            if(data){
                setShowModal(false)
                fetchData()
            }

            if(error){
                alert(error)
            }
        }else{ 
            alert("All fields are required.")
            console.log("Validation error.")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        setSelectedSeriesRange(null)
    }, [showModal])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={9}>
                        <h3 className='pageTitle'>Print QR Code</h3>
                    </Col>
                    <Col lg={3} style={{ textAlign: "right" }}>
                        <Row className='justify-content-lg-end'>

                        </Row>
                    </Col>
                </Row>

                <Row className='mt-2'>
                    <Form autoComplete='off' aria-autocomplete='none'>
                        <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Col className='mt-1'>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>QR Code Series</Form.Label>
                                    <Form.Select name='series_id'  onChange={handleOnChange}>
                                        <option value={null} >Select QR Code Series</option>
                                        {
                                            data && data.map(series => {
                                                return (<option key={series._id} value={series._id}>{ series.name }</option>)
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        .
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col className='mt-1'>
                                <Form.Group className="mb-3" controlId="formBasicText">
                                    <Form.Label>QR Code Range</Form.Label>
                                    <Form.Control type="text" placeholder="QR Code Range" name='range'  onChange={handleOnChange}/>
                                    <Form.Text className="text-muted">
                                        Use - as separator. Example: 1-100
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Button variant="primary" type='submit' onClick={handleFormSubmit}>
                                    Print QR Code
                                </Button>
                            </Col>
                            <Col>
                                
                            </Col>
                        </Row>
                    </Form>
                </Row>

                {/* <Row className='mt-5'>
                    <Table striped bordered hover>
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>Series ID</th>
                                <th>Name</th>
                                <th>QR Code Range</th>
                                <th>Generated Range</th>
                                <th>Cluster</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => {
                                    return(
                                        <tr key={item._id}>
                                            <td>{index +  1}</td>
                                            <td><Link to={"/qrcode/series/view/" + item._id}>{item.series_id}</Link></td>
                                            <td><Link to={"/qrcode/series/view/" + item._id}>{item.name}</Link></td>
                                            <td style={{ textAlign: 'center' }}>{item.range}</td>
                                            <td style={{ textAlign: 'center' }}>{item.generated_range || '-'}</td>
                                            <td>{item.cluster}</td>
                                            <td>
                                                <MdDeleteOutline style={{ cursor: 'pointer' }} onClick={() => setDeleteId(item._id)} size={25} />
                                                <MdEdit size={25} style={{ marginInline: 10, cursor: 'pointer' }} />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                </Row> */}

            </Container>
        </>
    )
}

export default Print