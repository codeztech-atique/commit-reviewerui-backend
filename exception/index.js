module.exports.userException = (key) => {
    switch(key) {
        case 'UsernameExistsException': 
            return {
                message: 'User already exists.',
                exception: 'UsernameExistsException'
            }
        case 'NotAuthorizedException': 
            return {
                message: 'User name & password are incorrect.',
                exception: 'NotAuthorizedException'
            }
        case 'BadFormatException': 
            return {
                message: 'Bad format',
                exception: 'BadFormatException'
            }
        case 'InvalidPasswordException': 
            return {
                message: `Invalid password, Password should be 6 character'`,
                exception: 'InvalidPasswordException'
            }
        default: 
            return {
                message: 'Something went wrong.',
                exception: 'InternalServerError'
            }    
    }
}