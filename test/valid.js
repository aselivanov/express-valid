let test = require('tape')
let shaper = require('body-shaper')
let valid = require('..')

let profileShape = shaper({
    firstName: String,
    lastName: String,
    email: String,
    educations: [{
        school: String,
        years: {
            from: Number,
            to: Number
        }
    }]
})

let isNotEmpty = v => !!v
isNotEmpty.errorCode = 'empty'

test('sync validator with explicit error code', t => {
    t.plan(1)

    let validate = valid(profile => {
        profile.firstName(v => !!v, 'empty')
    })

    validate(profileShape({}), errors => {
        t.deepEqual(errors, {
            firstName: { empty: true }
        })
    }).then(profile => {
        t.fail('should not validate')
    })
})

test('sync validator with error code assigned as validator attribute', t => {
    t.plan(1)

    let validate = valid(profile => {
        profile.firstName(isNotEmpty)
    })

    validate(profileShape({}), errors => {
        t.deepEqual(errors, { firstName: { empty: true }})
    }).then(profile => {
        t.fail('should not validate')
    })
})

test('async validator', t => {
    t.plan(1)

    let validate = valid(profile => 
        profile.email(v => new Promise(resolve => {
            resolve(false)
        }), 'duplicate')
    )

    validate(profileShape({ email: 'box@example.org' }), errors => {
        t.deepEqual(errors, { email: { duplicate: true }})
    }).then(profile => {
        t.fail('should not validate')
    })
})

test('async validation await all cursor promises', t => {
    t.plan(1)

    let resolved = {
        a: false,
        b: false
    } 

    let validate = valid(root => {
        root.a(value => new Promise(resolve =>
            setTimeout(() => {
                resolved.a = true
                resolve(true)
            }, 50)))
        root.b(value => new Promise(resolve =>
            setTimeout(() => {
                resolved.b = true
                resolve(true)
            }, 100)))
    })

    validate(shaper({
        a: String,
        b: String
    })({}), errors => {
        t.fail('should validate')
    })
        .then(data => {
            if (resolved.a && resolved.b) {
                t.pass()
            } else {
                t.fail('not all cursor promises resolved')
            }
        })
})

test('validate returns payload', t => {
    t.plan(1)

    let validate = valid(root => {})

    validate({ hello: 'world' }).then(data => 
        t.deepEqual(data, { hello: 'world' }))
})

test('validate array items', t => {
    t.plan(1)

    let shapeProfile = shaper({
        employments: [{
            company: String,
            years: {
                from: Number,
                to: Number
            }
        }]
    })

    let validate = valid(profile => {
        profile.employments.forEach((employment, employments, at) => {
            employment.company(isNotEmpty)
            employment.years.from(isNotEmpty)
            employment.years.to(isNotEmpty)
            employment.years(({ from, to }) => from <= to, 'range')
        })
    })
    
    validate(shapeProfile({
        employments: [
            {
                company: 'Beep',
                years: {
                    from: 2000,
                    to: 2010
                }
            },
            {
                years: {
                }
            },
            { 
                company: 'Boop',
                years: {
                    from: 2005,
                    to: 2015
                }
            }
        ]
    }), errors => {
        t.deepEqual(errors, {
            employments: {
                1: {
                    company: { empty: true },
                    years: {
                        from: { empty: true },
                        to: { empty: true }
                    }
                }
            }
        })
    }).then(() => {
        t.fail('should not validate')
    });
})