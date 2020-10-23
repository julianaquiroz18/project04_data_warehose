const registerSchema = {
    type: 'object',
    required: ['name', 'lastname', 'email', 'isAdmin', 'password'],
    properties: {
        name: { type: 'string' },
        lastname: { type: 'string' },
        email: { type: 'string', pattern: "^[A-Za-z0-9._-]*@[a-z]*.com$" },
        isAdmin: { tipe: 'string' },
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
        city: { tipe: 'string' }
    }
}



const productSchema = {
    type: 'object',
    required: ['img', 'name', 'price'],
    properties: {
        img: { type: 'string' },
        name: { type: 'string' },
        price: { type: 'integer' }
    }
}


const orderSchema = {
    type: 'object',
    required: ['products', 'paymentMethod'],
    properties: {
        products: { type: 'array' },
        paymentMethod: { type: 'string' }
    }
}

const orderStatusSchema = {
    type: 'object',
    required: ['status'],
    properties: {
        status: { type: 'string' }
    }
}



module.exports = {
    registerSchema,
    companySchema
}