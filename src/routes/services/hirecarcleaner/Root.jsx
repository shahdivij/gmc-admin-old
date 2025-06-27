import { Typography } from "@mui/material"
import Sidebar from "../../../components/sidebar"
import {
    Container,
    Row,
    Col
} from 'react-bootstrap'
import {
    Link,
    Outlet,
} from "react-router-dom"
import URL_STRINGS from "../../../utility/URL_STRINGS"


const Root = () => {



    return(
        <Container fluid={true} style={{ maxHeight: '100vh', overflow: 'hidden' }}>
            <Row>
                <Col md={3} lg={2} style={{height: '98vh'}} className="m-0 p-0">
                   <Sidebar></Sidebar>
                </Col>
                <Col md={9} lg={10} className="bg-white" style={{height: '98vh', overflow: 'auto'}}>
                    <Row className="p-3" style={{ backgroundColor: 'rgb(15, 143, 255)', position: 'fixed', top: 0, width: '100%' }}>
                        <Col>
                            <Typography variant="h5" className="text-white" style={{ textDecoration: 'none', fontSize: '1.3rem' }} ><Link style={{ textDecoration: 'none', color: 'white' }} to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT}><b>Hire Car Cleaner</b></Link></Typography>
                        </Col>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                    <Row className="p-3 mt-5">
                        <Outlet />
                    </Row>
                </Col>
            </Row>
        </Container>
    )

}

export default Root