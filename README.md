# Validation middleware for Express

## API

`express-valid` extends request object with two things: `req.error()` reporter 
and `req.valid()` assertion. Let's get it by example.

### req.error([path], code)

Report an error 

#### `path` is a string representation of path in the resulting error tree.
Examples: `username`, `educations.0.school`.

req.error('firstName': 'empty');
req.error('educations.2.years.from', { outOfRange: [1990, 2020] });



`code` is a string error code like `empty` or `outOfRange`. Usually this is
interpreted on front-end and some message is provided to user and field is
highlighted.

`extra` is an `Object` containing extra pr

Report an error at arbitrary path.

    app.post('/signup', (req, res, next) => {
        let username = String(req.body.username || '').trim();
        if (!username) {
            req.error('username', 'empty')
        } else if (!/^[a-z]+$/i.test(username)) {
            req.error('username', 'format', 'Letters only.');
        }
        let password = String(req.body.password || '').trim();
        if (!req.password) {
            req.error('password', 'empty')
        } else if (!/^[a-z0-9]$/i.test(password)) {
            req.error('password', 'format', 'Alphanumeric characters only.')
        } else if (password.length < 8 && password.length > 20) {
            req.error('password', 'outOfRange', 'Must be 8 to 20 characters long.')
        }

        req.valid()
        .then(() => 
            sequelize.transaction(transaction =>
                User.findOne({ where: { username }, transaction })
                .then(user => {
                    if (user) {
                        req.error('username', 'taken', 'User with this username is already there.')
                    }
                    return req.valid()
                })
                .then(() => User.create({ username, password }, { transaction }))
                .then(user => res.send({ 
                    id: user.id,
                    username: user.username
                }))
            }));
            .catch(next)
    });

`valid` is a breakpoint to make sure we continue with all data is valid or 
flush oustanding errors to client.