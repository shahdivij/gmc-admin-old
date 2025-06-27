import { Routes, Route } from "react-router-dom"
import URL_STRINGS from "../utility/URL_STRINGS"
import HireCarCleanerRoot from "./services/hirecarcleaner/Root"
import CustomerComponent from "./services/hirecarcleaner/customer"
import CarComponent from "./services/hirecarcleaner/car"
import ClusterComponent from "./services/hirecarcleaner/cluster"
import PackageComponent from "./services/hirecarcleaner/package"
import QRCodeComponent from "./services/hirecarcleaner/qrcode"
import SubscriptionComponent from "./services/hirecarcleaner/subscription"
import WelcomePage from "./WelcomePage"
import HolidayComponent from "./services/hirecarcleaner/holiday"
import ScheduleComponent from "./services/hirecarcleaner/schedule"
import DiscountComponent from "./services/hirecarcleaner/discount"
import TransactionComponent from "./services/hirecarcleaner/transaction"

const AppRouter = () => {
    return(
        <>
            <Routes>
                <Route path="/" element={<WelcomePage />}/>
                
                {/* Hire Car Cleaner Routing */}
                <Route path={URL_STRINGS.HIRE_CAR_CLEANER.ROOT} element={<HireCarCleanerRoot />}>
                    {/* Customer Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ROOT} element={<CustomerComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_LIST} element={<CustomerComponent.LIST />}/>
                    <Route path={`${URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CUSTOMER_VIEW}/:id`} element={<CustomerComponent.VIEW />}/>
                    <Route path={`${URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.ADDRESS_CHANGE_REQUEST_LIST}`} element={<CustomerComponent.ADDRESS_CHANGE_REQUEST_LIST />}/>
                    <Route path={`${URL_STRINGS.HIRE_CAR_CLEANER.CUSTOMER.CAR_VIEW}`} element={<CustomerComponent.CAR_VIEW />}/>
                    
                    {/* Car Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CAR.ROOT} element={<CarComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CAR.MODEL} element={<CarComponent.MODEL />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CAR.BRAND} element={<CarComponent.BRAND />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CAR.CATEGORY} element={<CarComponent.CATEGORY />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CAR.FUEL_TYPE} element={<CarComponent.FUEL />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CAR.TRANSMISSION_TYPE} element={<CarComponent.TRANSMISSION />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CAR.REGISTRATION_TYPE} element={<CarComponent.REGISTRATION />} />
                   
                    {/* Cluster Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.ROOT} element={<ClusterComponent.ROOT />}/>
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REGISTERED} element={<ClusterComponent.REGISTERED />}/>
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUEST} element={<ClusterComponent.REQUESTS />}/>
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.REQUESTOR_ROLE} element={<ClusterComponent.REQUESTER_ROLE />}/>
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.RESIDENCE_TYPE} element={<ClusterComponent.RESIDENCE />}/>
                    <Route path={`${URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.VIEW}/:id`} element={<ClusterComponent.VIEW />}/>
                    <Route path={`${URL_STRINGS.HIRE_CAR_CLEANER.CLUSTER.TIME_SLOT}`} element={<ClusterComponent.TIME_SLOT />}/>
                
                    {/* Package Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.ROOT} element={<PackageComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.PACKAGE.PACKAGE_LIST} element={<PackageComponent.LIST />} />
                
                    {/* QRCode Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.ROOT} element={<QRCodeComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.PRINT} element={<QRCodeComponent.PRINT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.GENERATE} element={<QRCodeComponent.GENERATE />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.SERIES} element={<QRCodeComponent.SERIES />} />
                    <Route path={`${URL_STRINGS.HIRE_CAR_CLEANER.QR_CODE.VIEW}/:id`} element={<QRCodeComponent.VIEW />} />

                    {/* Subscription Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.ROOT} element={<SubscriptionComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.SUBSCRIPTION.SUBSCRIPTION_LIST} element={<SubscriptionComponent.LIST />} />
                    
                    {/* Subscription Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.ROOT} element={<HolidayComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.NATIONAL.ROOT} element={<HolidayComponent.NATIONAL />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.HOLIDAY.LOCAL.ROOT} element={<HolidayComponent.LOCAL />} />
                    
                    {/* Schedule Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.ROOT} element={<ScheduleComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.LIST} element={<ScheduleComponent.LIST />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.SCHEDULE.VIEW + "/:id"} element={<ScheduleComponent.VIEW />} />
                    
                    {/* Discount Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.ROOT} element={<DiscountComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.DISCOUNT.LIST} element={<DiscountComponent.LIST />} />
                    
                    {/* Transaction Routing */}
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.ROOT} element={<TransactionComponent.ROOT />} />
                    <Route path={URL_STRINGS.HIRE_CAR_CLEANER.TRANSACTION.LIST} element={<TransactionComponent.LIST />} />
                    
                </Route>

                {/*  */}
            </Routes>
        </>
    )
}

export default AppRouter