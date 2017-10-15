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
    financialAdvisor : "Financial Advisor",
    javaBackEndDeveloper : "Java Back-End Developer",
    ProgramaFrontEnd : "Programa Front-end",
    DigitalMarketingAndBinding : "Digital Marketing and Branding",
    ITManager: "IT Manager",
    InformationSecurityAnalyst : "Information Security Analyst",
    RetailCareerAdvancement : "Retail Career Advancement",
    Carpenter:"Carpenter",
    Plumbers : "Plumbers",
    Pipefitters : "Pipefitters", 
    Steamfitters : "Steamfitters",
    MarketingConsultant:"Marketing Consultant"

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
        allCareers.chef,
        allCareers.RetailCareerAdvancement
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

var TechnologyCourse = {
        category: "Technology Course",
        careers: [
            allCareers.javaBackEndDeveloper,
            allCareers.ProgramaFrontEnd,
            allCareers.InformationSecurityAnalyst
        ]
}

var MarketingCourse = {
    category: "Marketing",
    careers: [
        allCareers.DigitalMarketingAndBinding,
        allCareers.MarketingConsultant
    ]
}

var constructionindustry = {
    category : "Craft Professions",
    careers : [
        allCareers.Carpenter,
        allCareers.Pipefitters,
        allCareers.Steamfitters

    ]
}

var india = [healthCareCourse, foodAndBeverageCourse];

var kenya = [sewingCourse, salesCourse, financialServicesCourse];

var mexico = [financialServicesCourse,salesCourse,TechnologyCourse];

var spain = [TechnologyCourse,MarketingCourse];

var usa = [healthCareCourse,foodAndBeverageCourse,constructionindustry,TechnologyCourse];

var publisJobs = [];