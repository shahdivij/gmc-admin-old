import {
    Container,
    Row,
    Col,
} from 'react-bootstrap'
import logo_white from './../../../public/logo_white.png'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './index.css'
import { useEffect, useState } from 'react'
import { MdArrowBackIos, MdHome, MdApartment, MdOutlineQrCode } from "react-icons/md"
import { FaUser, FaCar, FaBoxOpen } from "react-icons/fa6"
import { VscLayersActive } from "react-icons/vsc"
import URL_STRINGS from '../../utility/URL_STRINGS'
import { LuCalendarOff, LuCalendarClock } from "react-icons/lu"
import { Typography } from '@mui/material'
import { BiSolidDiscount } from "react-icons/bi"
import { PiCurrencyInrFill } from "react-icons/pi"

const Sidebar = () => {

    const [showSubMenu, setShowSubMenu] = useState(null)
    const [activeLink, setActiveLink] = useState(null)

    const location = useLocation()
    const navigate = useNavigate()


    const handleLocation = (location) => {
        // handling main route
        console.log(location)
        if(location == URL_STRINGS.HIRE_CAR_CLEANER.ROOT){
            setActiveLink(null)
            setShowSubMenu(null)
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST)
            }
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_VIEW)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST)
            }
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ADDRESS_CHANGE_REQUEST_LIST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ADDRESS_CHANGE_REQUEST_LIST)
            }
            if(location.includes("carview")){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST)
            }
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CAR.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.CAR.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CAR.MODEL)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.MODEL)
            } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CAR.BRAND)) {
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.BRAND)
            } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CAR.CATEGORY)) {
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.CATEGORY)
            } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CAR.FUEL_TYPE)) {
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.FUEL_TYPE)
            } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CAR.REGISTRATION_TYPE)) {
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.REGISTRATION_TYPE)
            } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CAR.TRANSMISSION_TYPE)) {
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.TRANSMISSION_TYPE)
            } 
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REGISTERED)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REGISTERED)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUESTOR_ROLE)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUESTOR_ROLE)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUEST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUEST)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.RESIDENCE_TYPE)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.RESIDENCE_TYPE)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.VIEW)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REGISTERED)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.TIME_SLOT)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.TIME_SLOT)
            }
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.SERIES)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.SERIES)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.GENERATE)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.GENERATE)
            } else if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.PRINT)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.PRINT)
            }
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST)
            }
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.SUBSCRIPTION_LIST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.SUBSCRIPTION_LIST)
            }
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.LIST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.LIST)
            }
        } else if (location.includes(URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.ROOT)) {
            setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.ROOT)
            setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.ROOT)
            if(location.includes(URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.LIST)){
                setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.LIST)
            }
        } else {
            console.log("first")
        }
    }

    useEffect(() => {
        handleLocation(location.pathname)
    }, [location])

    return(
        <Container fluid style={{ height: '100%', backgroundColor: 'rgb(15, 143, 255)', color: 'white' }}>
            <Row style={{ cursor: 'pointer' }} onClick={() => navigate(URL_STRINGS.ROOT)}>
                <img src={logo_white} />
            </Row>

            {
                !showSubMenu && 
                <Row className='mt-1'>
                    <Col>
                        <Row>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ROOT)}>
                                    <FaUser style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }}  className='m-2'>Customer</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.CAR.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.CAR.ROOT)}>
                                    <FaCar style={{ marginRight: 3 }} size={'1rem'} />
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }}  className='m-2'>Car</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.ROOT)}>
                                    <MdApartment style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }}  className='m-2'>Car Cluster</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.ROOT)}>
                                    <MdOutlineQrCode style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }}  className='m-2'>QR Code</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.ROOT)}>
                                    <FaBoxOpen style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }}  className='m-2'>Package</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.ROOT)}>
                                    <VscLayersActive style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }}  className='m-2'>Subscription</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.ROOT)}>
                                    <LuCalendarOff style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }}  className='m-2'>Holiday</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.ROOT)}>
                                    <LuCalendarClock style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }} className='m-2'>Schedule</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.ROOT)}>
                                    <BiSolidDiscount style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }} className='m-2'>Discount</Typography>
                                </div>
                            </Link>
                            <Link className='hover-bg-white' to={URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.ROOT}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className='hover-bg-white' onClick={() => setShowSubMenu(URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.ROOT)}>
                                    <PiCurrencyInrFill style={{ marginRight: 3 }} size={'1rem'}/>
                                    <Typography variant='h5'  style={{ fontSize: '1.2rem' }} className='m-2'>Transaction</Typography>
                                </div>
                            </Link>
                        </Row>
                    </Col>
                </Row>
            }

            
            {
                showSubMenu && 
                <Row className='mt-2'>
                    <Col>
                        <Row>
                            {
                                // Customer
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ROOT && 
                                <>
                                    
                                        <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }}  size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Customer</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }} size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}  >Customer</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ADDRESS_CHANGE_REQUEST_LIST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ADDRESS_CHANGE_REQUEST_LIST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ADDRESS_CHANGE_REQUEST_LIST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }} >Address Change Request</h6></div>
                                    </Link>
                                </>
                            }
                            {
                                // Car
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.CAR.ROOT && 
                                <>
                                    
                                        <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }}  size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Car</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }}  size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    
                                    
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CAR.BRAND} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CAR.BRAND ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.BRAND)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Brand</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CAR.MODEL} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CAR.MODEL ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.MODEL)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Model</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CAR.CATEGORY} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CAR.CATEGORY ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.CATEGORY)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Category</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CAR.FUEL_TYPE} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CAR.FUEL_TYPE ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.FUEL_TYPE)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Fuel Type</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CAR.TRANSMISSION_TYPE} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CAR.TRANSMISSION_TYPE ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.TRANSMISSION_TYPE)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Transmission Type</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CAR.REGISTRATION_TYPE} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CAR.REGISTRATION_TYPE ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CAR.REGISTRATION_TYPE)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Registration Type</h6></div>
                                    </Link>
                                </>
                            }
                            {
                                // Car cluster
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }}   size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Car Cluster</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }}  size={'1.3rem'}/>
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REGISTERED} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REGISTERED ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REGISTERED)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Registered</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.RESIDENCE_TYPE} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.RESIDENCE_TYPE ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.RESIDENCE_TYPE)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Residence Type</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUEST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUEST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUEST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Service Requests</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUESTOR_ROLE} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUESTOR_ROLE ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUESTOR_ROLE)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Requester Role</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.TIME_SLOT} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.TIME_SLOT ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.TIME_SLOT)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Time Slot</h6></div>
                                    </Link>
                                </>
                            }
                            {
                                // QR code
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }}  size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >QR Code</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }}  size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.SERIES} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.SERIES ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.SERIES)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>QR Code Series</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.GENERATE} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.GENERATE ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.GENERATE)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Generate QR Code</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.PRINT} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.PRINT ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.PRINT)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Print QR Code</h6></div>
                                    </Link>
                                </>
                            }
                            {
                                // Package
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }}  size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Package</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }}  size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Packages</h6></div>
                                    </Link>
                                </>
                            }
                            
                            {
                                // Subscription
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }}  size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Subscription</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }}  size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.SUBSCRIPTION_LIST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.SUBSCRIPTION_LIST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.SUBSCRIPTION_LIST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Subscriptions</h6></div>
                                    </Link>
                                </>
                            }
                            
                            {
                                // Holiday
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }}  size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Holiday</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }}  size={'1.3rem'}/>
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.NATIONAL.ROOT} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.NATIONAL.ROOT ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.NATIONAL.ROOT)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>National</h6></div>
                                    </Link>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.LOCAL.ROOT} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.LOCAL.ROOT ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.LOCAL.ROOT)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Local</h6></div>
                                    </Link>
                                </>
                            }
                            
                            {
                                // Schedule
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }} size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Schedule</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }} size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.LIST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.LIST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.LIST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Schedule List</h6></div>
                                    </Link>
                                </>
                            }
                            
                            {
                                // Discount
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }} size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Discount</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }} size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.LIST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.LIST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.LIST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Discount</h6></div>
                                    </Link>
                                </>
                            }

                            {
                                // Transaction
                                showSubMenu == URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.ROOT && 
                                <>
                                    <Row>
                                            <Col>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} style={{ textDecoration: 'none', display: 'flex',}} className='mb-2 back-button' onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                            }}>
                                                <Col lg={1}>
                                                    <MdArrowBackIos style={{ color: 'white' }} size={'1rem'} />
                                                </Col>
                                                <Col>
                                                    <h4 style={{ color: 'white', fontSize: '1.2rem' }} >Transaction</h4>
                                                </Col>
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Link to={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} onClick={() => {
                                                    setShowSubMenu(null)
                                                    setActiveLink(null)
                                                }}>
                                                    <MdHome style={{ color: 'white' }} size={'1.3rem'} />
                                                </Link>
                                            </Col>
                                        </Row>
                                    <Link to={URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.LIST} className={activeLink == URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.LIST ? 'bg-white text-black' : 'hover-bg-white'} onClick={() => setActiveLink(URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.LIST)}>
                                        <div><h6 className='m-2' style={{ fontSize: '1rem' }}>Transaction</h6></div>
                                    </Link>
                                </>
                            }

                        </Row>
                    </Col>
                </Row>
            }
        </Container>
    )
}

export default Sidebar