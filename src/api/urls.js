const BASE_URL = import.meta.env.VITE_API_BASE_URL

const URL = {
    BASE_URL,
    CUSTOMER: {
        CUSTOMER: BASE_URL + '/customer',
        ADDRESS: BASE_URL + "/customer/id/address",
        CHANGE_ADDRESS_REQUEST: BASE_URL + "/customer/addresschangerequest",
        PACKAGE_COST: BASE_URL + "/customer/packagecost",
        CAR: BASE_URL + "/customer/customerID/car/carID"
    },
    CAR: {
        CAR: BASE_URL + "/car",
        MODEL: BASE_URL + "/car/model",
        BRAND: BASE_URL + "/car/brand",
        CATEGORY: BASE_URL + "/car/category",
        FUEL_TYPE: BASE_URL + "/car/fuel",
        REGISTRATION_TYPE: BASE_URL + "/car/registration",
        TRANSMISSION_TYPE: BASE_URL + "/car/transmission"
    },
    CLUSTER: {
        CLUSTER: BASE_URL + "/cluster",
        REGISTERED: BASE_URL + "/cluster/registered",
        RESIDENCE: BASE_URL + "/cluster/residence",
        ROLE: BASE_URL + "/cluster/request/role",
        REQUEST: BASE_URL + "/cluster/request",
        PACKAGE: BASE_URL + "/cluster/package",
        CLEANER_RATE_LIST: BASE_URL + "/cluster/cluster_id/cleanerratelist",
        TIME_SLOT: BASE_URL + "/cluster/timeslot",
        CLUSTER_TIME_SLOT: BASE_URL + "/cluster/registered/cluster_id/time_slot"
    },
    QRCODE_SERIES: {
        QRCODE_SERIES: BASE_URL + "/qrcode",
        SERIES: BASE_URL + "/qrcode/series",
        ASSIGN: BASE_URL + "/qrcode/series/assign",
        GENERATE: BASE_URL + "/qrcode/generate",
        PRINT: BASE_URL + "/qrcode/print",
    },
    PACKAGE: BASE_URL + "/package",
    SUBSCRIPTION: BASE_URL + "/subscription",
    HOLIDAY: {
        ROOT: BASE_URL + "/holiday",
        NATIONAL: BASE_URL + "/holiday/national",
        LOCAL: BASE_URL + "/holiday/local"
    },
    SCHEDULE: {
        ROOT: BASE_URL + "/schedule",
        STATUS: BASE_URL + "/schedule/status"
    },
    PAYMENT: {
        ORDER: BASE_URL + "/payment/order",
        VERIFY: BASE_URL + "/payment/verify"
    },
    DISCOUNT: {
        ROOT: BASE_URL + "/discount",
    },
    TRANSACTION: {
        ROOT: BASE_URL + "/transaction"
    }
}

export default URL
