module.exports = valid

const VALIDATE = Symbol('VALIDATE')
const AWAIT = Symbol('AWAIT')

function valid(validationFn) {

    let prevValidate = this;

    function validate(payload, flush) {
        const chain = typeof prevValidate === 'function' && prevValidate.tag === VALIDATE ? 
            prevValidate(payload, flush) : 
            Promise.resolve(payload)

        const errors = {}
        return chain
            .then(payload => cursor(payload, errors))
            .then(c => Promise.resolve(validationFn(c))
                .then(c[AWAIT])
                .then(() => {
                    cleanupErrors(errors)
                    if (Object.keys(errors).length) {
                        flush(errors)
                        return new Promise((resolve, reject) => null)
                    }
                })
                .then(() => new Promise(resolve => c(resolve))))
    }
    validate.tag = VALIDATE
    return validate
}

/*

cursor: raw => Cursor[raw]


Cursor(raw => boolean, [errorCode])

Cursor.prop --> Cursor[raw.prop]

*/

function cursor(raw, errors, awaiting=[]) {
    function validate(validationFn, error=null) {
        const promise = Promise.resolve(validationFn(raw)).then(isValid => {
            if (!isValid) {
                addError(errors, error || validationFn.errorCode)
            }
        })
        awaiting.push(promise)
        return promise
    }

    if (Array.isArray(raw)) {
        validate.forEach = function forEach(callback) {
            raw.forEach((item, at) => 
                callback(cursor(item, errors[at] = errors[at] || {}, awaiting)))
        }
    }

    if (typeof raw === 'object' && raw != null) {
        Object.keys(raw).forEach(key => {
            if (typeof raw === 'object') {
                validate[key] = cursor(raw[key], errors[key] = errors[key] || {}, awaiting)
            }
        })
    }

    validate[AWAIT] = function() {
        return Promise.all(awaiting.slice())
    }

    return validate
}

function addError(errors, error) {
    const code = typeof error === 'string' ? error : (error && error.errorCode || null)
    errors[code] = typeof error === 'string' ? true : error
}

// Remove empty objects from errors tree
function cleanupErrors(errors) {
    for (let key in errors) {
        if (errors[key] == null) {
            delete errors[key]
        } else if (typeof errors[key] === 'object') { 
            cleanupErrors(errors[key])
            if (!Object.keys(errors[key]).length) {
                delete errors[key]
            }
        }
    }
}
/*

const validate = valid(profile => {

}).valid(profile => {

})

*/