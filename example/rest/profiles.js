const shaper = require('body-shaper')
const valid = require('express-valid')
const db = require('../db');
const profiles = db.get('profiles');
const { isNotEmpty, isEmail } = require('./validators');

const shape = shaper({
    firstName: String,
    lastName: String,
    email: String,
    experiences: [
        {
            company: String,
            years: {
                from: Number,
                to: Number
            }
        }
    ]
})

const validate = 
    valid(profile => {
        profile.firstName(isNotEmpty)
        profile.firstName(isNotEmpty)
        profile.lastName(isNotEmpty)
        profile.email(isNotEmpty) && 
            profile.email(isEmail) && 
            profile.email(email => profiles.filter({ email }).isEmpty().value(), 'duplicate')

        profile.experiences.forEach(experience => {
            experience.company(isNotEmpty)
            experience.years.from(isNotEmpty) && experience.years.to(isNotEmpty)
                && experience.years(({from, to}) => from >= to, 'range')
        })
    })

exports.post = (req, res, next) =>
    validate(shape(req.body), res)
        .then(profile => profiles.push(profile).write())
        .then(record => {
            res.send()
        })
        .catch(next)