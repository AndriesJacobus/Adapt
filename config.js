var allCareers = {
    nurse: "Nurse",
    pharmacist: "Pharmacist",
    healthWorker: "Health Care Worker",
    waiter: "Waiter",
    manager: "Manager",
    chef: "Chef",
    juniorSeamstress : "Junior Seamstress",
    seniorSeamstress : "Senior Seamstress",
    suitTailor : "Suit Tailor",
    salesAssistant : "Sales Assistant",
    salesManager : "Sales Manager",
    insuranceBroker : "Insurance Broker",
    financialAdvisor : "Financial Advisor"
};

var healthCareCourse = {
    category: "Health Care",
    careers: [
        allCareers.nurse,
        allCareers.pharmacist,
        allCareers.healthWorker
    ]
};

var foodAndBeverageCourse = {
    category : "Food and Beverage",
    careers: [
        allCareers.waiter,
        allCareers.manager,
        allCareers.chef
    ]
}

var sewingCourse = {
    category : "Sewing",
    careers : [
        allCareers.juniorSeamstress,
        allCareers.seniorSeamstress,
        allCareers.suitTailor
    ]
}

var salesCourse = {
    category: "Sales",
    careers: [
        allCareers.salesAssistant,
        allCareers.salesManager
    ]
}

var financialServicesCourse = {
    category: "Financial Services",
    careers: [
        allCareers.insuranceBroker,
        allCareers.financialAdvisor
    ]
}

var india = [healthCareCourse, foodAndBeverageCourse];

var kenya = [sewingCourse, salesCourse, financialServicesCourse];
