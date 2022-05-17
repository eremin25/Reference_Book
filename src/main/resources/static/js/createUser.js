async function createUser() {
    const createUserForm = document.getElementById('createUserForm')
    createUserForm.addEventListener('submit', getFormValue)
    function getFormValue(event) {
        event.preventDefault()
        let firstName = createUserForm.querySelector('[id=createFirstName]')
        let lastName = createUserForm.querySelector('[id=createLastName]')
        let age = createUserForm.querySelector('[id=createAge]')
        let email = createUserForm.querySelector('[id=createEmail]')
        let password = createUserForm.querySelector('[id=createPassword]')
        let roles = []
        let options = createUserForm.querySelector('#createRoles').options
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                roles.push(rolesUser[i])
            }
        }

        const data = {
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            email: email.value,
            password: password.value,
            roles: roles
        }

        userFetch.createUser(data)

        usersTable()

    }

}




// const createUserForm = document.getElementById('createUserForm')
// form.addEventListener('submit', getFormValue)
// function getFormValue(event) {
//     event.preventDefault()
//     let firstName = form.querySelector('[id=createFirstName]')
//     let lastName = form.querySelector('[id=createLastName]')
//     let age = form.querySelector('[id=createAge]')
//     let email = form.querySelector('[id=createEmail]')
//     let password = form.querySelector('[id=createPassword]')
//     let userRoles = []
//     let role = form.querySelector('[id=createRoles]').options
//     for (let i = 0; i < role.length; i++) {
//         if (role[i].selected) {
//             userRoles.push(roles[i])
//         }
//     }
//
//     const data = {
//         firstName: firstName.value,
//         lastName: lastName.value,
//         age: age.value,
//         email: email.value,
//         password: password.value,
//         roles: userRoles
//
//     }
//
//     console.log(data)
//
//     userFetch.createUser(data)
// }


