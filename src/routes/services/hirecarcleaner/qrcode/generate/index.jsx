import { useEffect, useState } from 'react'
import {
    Container,
    Row,
    Col,
    Table,
    Button,
    Modal,
    Form,
    Pagination,
    Spinner
} from 'react-bootstrap'
import {
    GET,
    POST
} from '../../../../../api/fetch'
import URL from '../../../../../api/urls'
import { setPagination } from '../../../../../utility/commonFunctions'
import { DateTime } from 'luxon'


const Generate = () => {

    const [seriesData, setSeriesData] = useState([])
    const [formData, setFormData] = useState({})
    const [selectedSeriesRange, setSelectedSeriesRange] = useState(null)
    const [generatedCodeData, setGeneratedCodeData] = useState([])
    const [selectedPage, setSelectedPage] = useState(1)
    const [pages, setPages] = useState([])
    const [imageData, setImageData] = useState(null)
    const [loading, setLoading] = useState(false)


    const fetchData = async () => {
        
        const {data: seriesData_, error: seriesError} = await GET(URL.QRCODE_SERIES.SERIES)
        if(seriesData_){
            setSeriesData(seriesData_)
        }
        
        const {data, error} = await GET(URL.QRCODE_SERIES.QRCODE_SERIES)
        
        if(data){
            console.log(data)
            setGeneratedCodeData(setPagination(data.filter(qrcode => qrcode.data.image_data)))
        }
    }

    const handleOnChange = async event => {
        const target = event.target
        let value = target.value
        const name = target.name 
        
        if(name === 'series_id'){
            const selectedSeries = seriesData && seriesData.filter(series => series._id == value)
            if(selectedSeries.length && selectedSeries[0].range){
                setSelectedSeriesRange(selectedSeries[0].range)
            }else{
                setSelectedSeriesRange(null)
            }
        }

        setFormData({
            ...formData,
            [name]: value
        })
    }

    

    const handleFormSubmit = async (event) => {
        
        event.preventDefault()

        if(formData.series_id && formData.range){
            setLoading(true)
            
            const dataToSend = {
                series_id: formData.series_id,
                range: formData.range
            }
            

            const {data, error} = await POST(URL.QRCODE_SERIES.GENERATE, dataToSend)
            if(data){
                fetchData()
            }
            
            if(error){
                fetchData()
            }
            setLoading(false)
        }else{ 
            alert("All fields are required.")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if(generatedCodeData.length){
            console.log(generatedCodeData)
            const pagesCount = []
            for(let i = 1; i <= generatedCodeData[0].pages; i++){
                pagesCount.push(i)
            }
            setPages(pagesCount)
        }
    }, [generatedCodeData])

    useEffect(() => {
        if(imageData && imageData.image_data){
            console.log(imageData.image_data)
        }
    }, [])
    
    return(
        <>
            <Container fluid className='pt-2'>
                <Row>
                    <Col lg={9}>
                        <h3 className='pageTitle'>Generate QR Code</h3>
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
                                            seriesData && seriesData.map(series => {
                                                return (<option key={series._id} value={series._id}>{ series.name }</option>)
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text className="text-muted">
                                        {
                                            selectedSeriesRange ? `${selectedSeriesRange} is the range for this series.` : 'Select QR Code Series'
                                        }
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
                                    Generate QR Code
                                </Button>
                            </Col>
                            <Col>
                                
                            </Col>
                        </Row>
                    </Form>
                </Row>

                <Row className='mt-2'>
                    <Row>
                        <Col lg={11}>
                            <h4 className="mb-3 pageTitle">Generated QR Codes</h4>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            
                        </Col>
                    </Row>
                    <Row>


                        <Col>
                            <Table className="m-2" bordered striped hover>
                                <thead>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th>#</th>
                                        <th>QR Code ID</th>
                                        <th>Is Active</th>
                                        <th>Assigned To</th>
                                        <th>Generated At</th>
                                        <th>Generated By</th>
                                        {/* <th>QR Code Image</th> */}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    generatedCodeData.length && generatedCodeData[0]?.data[selectedPage - 1]?.data && generatedCodeData[0].data[selectedPage - 1].data.map((qrcode, index) => {
                                        return (
                                            qrcode.data.image_data && <>
                                                <tr key={index}>
                                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                                    <td><a style={{ cursor: 'pointer' }} className='text-primary' onClick={() => setImageData({name: "NA", image_data: qrcode.data.image_data})}>{qrcode.qr_code_id}</a></td>
                                                    <td>{qrcode.is_active ? 'Yes' : 'No'}</td>
                                                    <td>{qrcode.assigned_to || '-'}</td>
                                                    <td style={{ textAlign: 'center' }}>{DateTime.fromISO(qrcode.data.generated_at).toISODate()}</td>
                                                    <td>{qrcode.data.generated_by || '-'}</td>
                                                    {/* <td><a onClick={() => setImageData({name: "NA", image_data: qrcode.data.image_data})}>{'View Image'}</a></td> */}
                                                    <td>{'-'}</td>
                                                </tr>
                                            </>
                                        )
                                    })
                                }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col></Col>
                        <Col style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Pagination>
                                {
                                    pages.map(pageNumber => {
                                        return (
                                            <Pagination.Item onClick={() => setSelectedPage(pageNumber)} key={pageNumber} active={pageNumber === selectedPage}>
                                                {pageNumber}
                                            </Pagination.Item>
                                        )
                                    })
                                }
                            </Pagination>
                        </Col>
                    </Row>
                </Row>

            </Container>

            <Modal size="lg" centered show={imageData != null} onHide={() => setImageData(null)}>
                <Modal.Header closeButton>
                {/* <Modal.Title>{imageData && imageData.name}</Modal.Title> */}
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    { imageData && <div dangerouslySetInnerHTML={{ __html: imageData.image_data }} /> }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" type='submit' onClick={() => setImageData(null)}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>

            <Modal size='md' centered show={loading} onHide={() => console.log("nothing")}>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                    <h3>Generating QR Codes...</h3>
                    <Spinner animation="border" className='m-5 text-primary' role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p>This might take some time</p>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Generate