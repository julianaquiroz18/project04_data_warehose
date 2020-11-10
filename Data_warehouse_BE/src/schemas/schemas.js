const registerSchema = {
    type: 'object',
    required: ['name', 'lastname', 'email', 'isAdmin', 'password'],
    properties: {
        name: { type: 'string' },
        lastname: { type: 'string' },
        email: { type: 'string', pattern: "^[A-Za-z0-9._-]*@[a-z]*.com$" },
        isAdmin: { type: 'string', minLength: 4 },
        password: { type: 'string', pattern: '^[A-Za-z0-9.!#$%&‘*+=?^_`{|}~-]{4,}$' },
        repeatPassword: { type: 'string', pattern: '^[A-Za-z0-9.!#$%&‘*+=?^_`{|}~-]{4,}$' }
    }
}

const updateRegisterSchema = {
    type: 'object',
    required: ['name', 'lastname', 'email', 'isAdmin'],
    properties: {
        name: { type: 'string' },
        lastname: { type: 'string' },
        email: { type: 'string', pattern: "^[A-Za-z0-9._-]*@[a-z]*.com$" },
        isAdmin: { type: 'string', minLength: 4 },
        password: { type: 'string', pattern: '^[A-Za-z0-9.!#$%&‘*+=?^_`{|}~-]{4,}$' },
        repeatPassword: { type: 'string', pattern: '^[A-Za-z0-9.!#$%&‘*+=?^_`{|}~-]{4,}$' }
    }
}

const companySchema = {
    type: 'object',
    required: ['name', 'address', 'telephone', 'email', 'city'],
    properties: {
        name: { type: 'string' },
        address: { type: 'string' },
        telephone: { type: 'string' },
        email: { type: 'string', pattern: "^[A-Za-z0-9._-]*@[a-z]*.com$" },
        city: { type: 'string', minLength: 10 }
    }
}

const contactSchema = {
    type: 'object',
    required: ['name', 'lastname', 'position', 'email', 'company', 'city'],
    properties: {
        name: { type: 'string' },
        lastname: { type: 'string' },
        position: { type: 'string' },
        email: { type: 'string', pattern: "^[A-Za-z0-9._-]*@[a-z]*.com$" },
        company: { type: 'string', minLength: 10 },
        city: { type: 'string', minLength: 10 },
        address: { type: 'string' },
        interest: { type: 'integer' },
        contactChannel: { type: 'array' }
    }
}

const regionSchema = {
    type: 'object',
    required: ['name'],
    properties: {
        name: { type: 'string', minLength: 3 },
        countries: { type: 'array' }
    }
}

const countrySchema = {
    type: 'object',
    required: ['region', 'name'],
    properties: {
        region: { type: 'string' },
        name: { type: 'string', minLength: 3 },
        cities: { type: 'array' }
    }
}

const citySchema = {
    type: 'object',
    required: ['country', 'name'],
    properties: {
        country: { type: 'string' },
        name: { type: 'string', minLength: 3 }
    }
}

const nameSchema = {
    type: 'object',
    required: ['name'],
    properties: {
        name: { type: 'string', minLength: 3 }
    }
}




module.exports = {
    registerSchema,
    companySchema,
    contactSchema,
    regionSchema,
    countrySchema,
    citySchema,
    updateRegisterSchema,
    nameSchema
}