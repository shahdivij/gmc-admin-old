import { Container, Row, Col, Stack } from "react-bootstrap"
import { MdLocalCarWash } from "react-icons/md"
import "./welcomepage.css"
import { MdOutlineScreenSearchDesktop } from "react-icons/md"
import { RiCustomerService2Fill } from "react-icons/ri"
import { MdHomeRepairService } from "react-icons/md"
import { IoIosNotifications } from "react-icons/io"
import { VscSymbolMisc } from "react-icons/vsc"
import { useNavigate } from "react-router-dom"
import URL_STRINGS from "../utility/URL_STRINGS"
import logo_white from './../../public/logo_white.png'
import { Typography } from "@mui/material"

const WelcomePage = () => {

    const navigate = useNavigate()

    return(
        <>
            <div className="main">
                <Container fluid className="p-3" style={{ height: '100%', maxHeight: '100vh' }}>
                    <Row style={{ alignItems: 'center' }}>
                        {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h1" className="text-white" style={{ marginRight: '1.2rem', fontSize: '2.5rem' }}>Welcome to</Typography>
                            <img src={logo_white} style={{ width: '27rem' }} />
                        </div> */}
                        <Col style={{ textAlign: 'right' }}>
                            <Typography variant="h1" className="text-white" style={{ fontSize: '2.5rem' }}>Welcome to</Typography>
                        </Col>
                        <Col>
                            <img src={logo_white} style={{ width: '27rem' }} />
                        </Col>
                        <Col></Col>
                    </Row>
                    <Container className="mt-5">
                    <Row>
                            <Col className="Item-Box m-2 p-5" onClick={() => navigate(URL_STRINGS.HIRE_CAR_CLEANER.ROOT)}>
                                <Stack className="text-center">
                                    <Col>
                                        <MdLocalCarWash size={'3rem'}/>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Hire Car Cleaner</Typography>
                                </Stack>
                            </Col>
                            <Col className="Item-Box m-2 p-5">
                                <Stack className="text-center">
                                    <Col>
                                        <MdOutlineScreenSearchDesktop size={'3rem'}/>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Search & Connect</Typography>
                                </Stack>
                            </Col>
                            <Col className="Item-Box m-2 p-5">
                                <Stack className="text-center">
                                    <Col>
                                        <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="3rem" height="3rem"><path d="M 39.544922 8.0351562 C 38.929768 8.0325757 38.303197 8.0692526 37.673828 8.1464844 C 36.415091 8.3009479 35.144206 8.6185225 33.933594 9.1113281 A 1.50015 1.50015 0 1 0 35.066406 11.888672 C 36.944182 11.124283 39.167137 10.891123 40.947266 11.130859 C 42.727394 11.370596 43.890575 12.123045 44.152344 12.658203 A 1.50015 1.50015 0 1 0 46.847656 11.341797 C 45.870425 9.3439547 43.683028 8.4727165 41.347656 8.1582031 C 40.763814 8.0795748 40.160076 8.0377368 39.544922 8.0351562 z M 38.130859 12.037109 C 36.771979 12.080545 35.320528 12.393592 33.890625 13.029297 A 1.5004117 1.5004117 0 0 0 35.109375 15.771484 C 36.531837 15.139089 37.993855 14.951093 39.154297 15.068359 C 40.314739 15.185626 41.109736 15.656281 41.316406 15.921875 A 1.5002494 1.5002494 0 0 0 43.683594 14.078125 C 42.708264 12.824719 41.166886 12.255015 39.455078 12.082031 C 39.027126 12.038785 38.58382 12.022631 38.130859 12.037109 z M 46.431641 15.982422 A 1.50015 1.50015 0 0 0 45.158203 16.830078 L 42.572266 22 L 39.052734 22.003906 A 1.50015 1.50015 0 0 0 39.021484 22.003906 A 1.50015 1.50015 0 0 0 38.884766 22.003906 L 32.044922 22.009766 A 1.50015 1.50015 0 0 0 31.738281 22.009766 L 27.177734 22.015625 L 28.714844 19 L 29.5 19 A 1.50015 1.50015 0 1 0 29.5 16 L 27.794922 16 L 10.148438 16 A 1.50015 1.50015 0 0 0 8.8105469 16.820312 L 0.16210938 33.820312 A 1.50015 1.50015 0 0 0 1.5 36 L 8.3710938 36 A 1.50015 1.50015 0 0 0 9.7089844 35.177734 L 11.830078 31 L 18.337891 31 A 1.50015 1.50015 0 0 0 19.673828 30.179688 L 22.300781 25.017578 L 24.730469 25.017578 L 29.447266 25.013672 L 24.964844 33.820312 A 1.50015 1.50015 0 0 0 26.300781 36 L 33.371094 36 A 1.50015 1.50015 0 0 0 34.707031 35.179688 L 39.888672 25.003906 L 43.501953 25 A 1.50015 1.50015 0 0 0 44.841797 24.169922 L 47.841797 18.169922 A 1.50015 1.50015 0 0 0 46.431641 15.982422 z M 37.583984 16.03125 C 36.342589 15.96133 34.99246 16.314113 33.736328 17.132812 A 1.500316 1.500316 0 1 0 35.375 19.646484 C 36.131868 19.153185 36.877411 18.997009 37.416016 19.027344 C 37.95462 19.057674 38.210931 19.270579 38.251953 19.332031 A 1.50015 1.50015 0 1 0 40.748047 17.667969 C 40.034069 16.598421 38.82538 16.101166 37.583984 16.03125 z M 11.068359 19 L 25.345703 19 L 25.021484 19.638672 L 23.808594 22.017578 L 21.603516 22.017578 A 1.50015 1.50015 0 0 0 21.164062 22.017578 L 13.591797 22.017578 A 1.50015 1.50015 0 1 0 13.591797 25.017578 L 18.935547 25.017578 L 17.417969 28 L 10.908203 28 A 1.50015 1.50015 0 0 0 9.5703125 28.822266 L 7.4511719 33 L 3.9472656 33 L 11.068359 19 z M 36.519531 25.005859 L 32.451172 33 L 28.748047 33 L 32.814453 25.009766 L 36.519531 25.005859 z"/></svg>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Fast Tag</Typography>
                                </Stack>
                            </Col>
                            <Col className="Item-Box m-2 p-5">
                                <Stack className="text-center">
                                    <Col>
                                        <MdHomeRepairService size={'3rem'}/>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Service Bookings</Typography>
                                </Stack>
                            </Col>
                    </Row>
                    <Row>
                            <Col className="Item-Box m-2 p-5">
                                <Stack className="text-center">
                                    <Col>
                                        <MdLocalCarWash size={'3rem'}/>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Steam Car Wash</Typography>
                                </Stack>
                            </Col>
                            <Col className="Item-Box m-2 p-5">
                                <Stack className="text-center">
                                    <Col>
                                        <RiCustomerService2Fill size={'3rem'}/>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Customer Support</Typography>
                                </Stack>
                            </Col>
                            <Col className="Item-Box m-2 p-5">
                                <Stack className="text-center">
                                    <Col>
                                        <IoIosNotifications size={'3rem'}/>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Notifications</Typography>
                                </Stack>
                            </Col>
                            <Col className="Item-Box m-2 p-5">
                                <Stack className="text-center">
                                    <Col>
                                        <VscSymbolMisc size={'3rem'}/>
                                    </Col>
                                    <Typography variant="h5" style={{fontSize: '1.3rem'}} className="mt-2">Others</Typography>
                                </Stack>
                            </Col>
                    </Row>
                    </Container>

                </Container>
            </div>
        </>
    )
}


export default WelcomePage