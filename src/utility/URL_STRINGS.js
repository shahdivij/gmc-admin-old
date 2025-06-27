export default {
    ROOT: '/',
    HIRE_CAR_CLEANER: {
        ROOT: "/hirecarcleaner",
        CUSTOMER: {
            ROOT: "/hirecarcleaner/customer",
            CUSTOMER_LIST: "/hirecarcleaner/customer/customerlist",
            CUSTOMER_VIEW: "/hirecarcleaner/customer/customerview",
            ADDRESS_CHANGE_REQUEST_LIST: "/hirecarcleaner/customer/addresschangerequestlist",
            CAR_VIEW: "/hirecarcleaner/customer/:customerID/carview/:carID"
        },
        CAR: {
            ROOT: "/hirecarcleaner/car",
            MODEL: "/hirecarcleaner/car/model",
            BRAND: "/hirecarcleaner/car/brand",
            CATEGORY: "/hirecarcleaner/car/category",
            FUEL_TYPE: "/hirecarcleaner/car/fueltype",
            TRANSMISSION_TYPE: "/hirecarcleaner/car/transmissiontype",
            REGISTRATION_TYPE: "/hirecarcleaner/car/registrationtype",
        },
        CLUSTER: {
            ROOT: "/hirecarcleaner/cluster",
            REGISTERED: "/hirecarcleaner/cluster/registered",
            REQUEST: "/hirecarcleaner/cluster/request",
            REQUESTOR_ROLE: '/hirecarcleaner/cluster/requestorrole',
            RESIDENCE_TYPE: "/hirecarcleaner/cluster/residencetype",
            VIEW: "/hirecarcleaner/cluster/view",
            TIME_SLOT: "/hirecarcleaner/cluster/timeslot"
        },
        QR_CODE: {
            ROOT: "/hirecarcleaner/qrcode",
            SERIES: "/hirecarcleaner/qrcode/series",
            GENERATE: "/hirecarcleaner/qrcode/generate",
            PRINT: "/hirecarcleaner/qrcode/print",
            VIEW: "/hirecarcleaner/qrcode/series/view"
        },
        PACKAGE: {
            ROOT: "/hirecarcleaner/package",
            PACKAGE_LIST: "/hirecarcleaner/package/packagelist"
        },
        SUBSCRIPTION: {
            ROOT: "/hirecarcleaner/subscription",
            SUBSCRIPTION_LIST: "/hirecarcleaner/subscription/subscriptionlist"
        },
        HOLIDAY: {
            ROOT: "/hirecarcleaner/holiday",
            NATIONAL: {
                ROOT: "/hirecarcleaner/holiday/national",
            },
            LOCAL: {
                ROOT: "/hirecarcleaner/holiday/local"
            }
        },
        SCHEDULE: {
            ROOT: "/hirecarcleaner/schedule",
            LIST: "/hirecarcleaner/schedulelist",
            VIEW: "/hirecarcleaner/scheduleview",
        },
        DISCOUNT: {
            ROOT: "/hirecarcleaner/discount",
            LIST: "/hirecarcleaner/discount/list",
        },
        TRANSACTION: {
            ROOT: "/hirecarcleaner/transaction",
            LIST: "/hirecarcleaner/transaction/list"
        }
    }
}