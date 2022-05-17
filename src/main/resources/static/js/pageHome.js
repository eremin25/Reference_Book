$(async function() {
    await navbarPrincipal();
    await getAllUsersTable();
    await getUserTable();
    await createNewUser();
    await getDefaultModal();
    await deleteUser();
    await updateUser();
})

let listRoles = [{id: 1, name: "ADMIN"},{id: 2, name: "USER"}]
let roles = [];

const userFetchService = {
    headers: {
        'Content-Type': 'application/json',
    },
    showPrincipal: async () => await fetch('http://localhost:8080/api/principal'),
    showAllUsers: async () => await fetch('http://localhost:8080/api/users'),
    createUser: async (user) => await fetch('http://localhost:8080/api/users', {method: 'POST', headers: userFetchService.headers, body: JSON.stringify(user)}),
    updateUser: async (user) => await fetch('http://localhost:8080/api/users', {method: 'PUT', headers: userFetchService.headers, body: JSON.stringify(user)}),
    deleteUser: async (id) => await fetch(`http://localhost:8080/api/users/${id}`, {method: 'DELETE', headers: userFetchService.headers}),
    showUserById: async (id) => await fetch(`http://localhost:8080/api/users/${id}`)
}

async function getAllUsersTable() {
    let table = $('#allUsersTable tbody');
    table.empty();
    await userFetchService.showAllUsers()
        .then(response => response.json())
        .then(users => {users.forEach(user => {
        let tableFilling = `$(
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => ' ' + role.name)}</td>
            <td>
                <button class="btn btn-info text-white" data-userid="${user.id}" data-action="update"  data-target="#deleteModal" data-toggle="modal" type="button">Изменить</button>
            </td>
            <td>
                <button class="btn btn-danger text-white" data-userid="${user.id}" data-action="delete" data-target="#updateModal" data-toggle="modal" type="button">Удалить</button>
            </td>
        </tr>
        )`;
        table.append(tableFilling);
        })
        })
    $('#allUsersTable').find('button').on('click', event => {
        let defaultModal = $('#defaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getDefaultModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'update':
                updateUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function deleteUser(modal, id) {

    let userId = id;
    $('#action').html('Удаление пользователя');
    let deleteButton = `<button  class="btn btn-danger" id="deleteUserButton" data-bs-dismiss="modal">Удалить</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>`
    $('#modal-footer').html(closeButton + deleteButton);

    await userFetchService.showUserById(userId).then(response => response.json()).then(user => {
        let modalFilling = `
        <form class="form-group text-center" id="deleteUser">
            <div class="modal-body col-md row g-3">
                <div class="col-auto text-center m-auto">
                    <fieldset disabled>
                        <div class="mb-3">
                            <label for="idDelete"><b>ID</b></label>
                            <input class="form-control" type="text" value="${user.id}"  id="idDelete"/>
                        </div>
                        <div class="mb-3">
                            <label for="firstNameDelete"><b>Имя</b></label>
                            <input class="form-control" type="text" value="${user.firstName}" id="firstNameDelete"/>
                        </div>
                        <div class="mb-3">
                            <label for="lastNameDelete"><b>Фамилия</b></label>
                            <input class="form-control" type="text" value="${user.lastName}" id="lastNameDelete"/>
                        </div>
                        <div class="mb-3">
                            <label for="ageDelete"><b>Возраст</b></label>
                            <input class="form-control" type="text" value="${user.age}" id="ageDelete"/>
                        </div>
                        <div class="mb-3">
                            <label for="emailDelete"><b>Email</b></label>
                            <input class="form-control" type="text" value="${user.email}" id="emailDelete"/>
                        </div>
                        <div class="mb-3">
                            <label for="passwordDelete"><b>Пароль</b></label></td>
                            <input class="form-control" type="password" value="${user.password}" id="passwordDelete"/>
                        </div>
                        <div class="mb-3">
                            <label for="rolesDelete"><b>Роли</b></label>
                            <select  multiple class="form-control form-control-sm" id="rolesDelete" size="2" required="required">
                                <option>${user.roles.map(role => ' ' + role.name)}</option>
                            </select>
                        </div>
                    </fieldset>
                </div>
            </div>
        </form>
        `;
        $('#modal-body').html(modalFilling);
    })
    $('#deleteUserButton').on('click', async () => {
        await userFetchService.deleteUser(userId);
        await getAllUsersTable()
    })
}

async function getUserTable() {
    let table = $('#userTable tbody');
    await userFetchService.showPrincipal().then(response => response.json()).then(user => {
        let tableFilling = `$(
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(r => ' ' + r.name)}</td>
        </tr>
        )`;
        table.append(tableFilling);
    })
}

async function createNewUser() {
    $('#createUser').on('click', async () => {
        let newUserForm = $('#createUserForm');
        let firstName = newUserForm.find('#createFirstName').val();
        let lastName = newUserForm.find('#createLastName').val();
        let age = newUserForm.find('#createAge').val();
        let email = newUserForm.find('#createEmail').val();
        let password = newUserForm.find('#createPassword').val();
        let rolesNameArray = newUserForm.find('#createRoles').val();

        console.log(rolesNameArray)

        for (let i = 0; i < rolesNameArray.length; i++) {
            console.log(rolesNameArray[i] === listRoles[i].name)
            if (rolesNameArray[i] === listRoles[i].name) {
                roles[i] = listRoles[i]
            } else {
                roles[i] = listRoles[1]
            }
        }

        const userDel = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }

        await userFetchService.createUser(userDel);

        newUserForm.find('#createFirstName').val('');
        newUserForm.find('#createLastName').val('');
        newUserForm.find('#createAge').val('');
        newUserForm.find('#createEmail').val('');
        newUserForm.find('#createPassword').val('');
        newUserForm.find('#createRoles').val('');
        await getAllUsersTable()
        $('#usersTablePanel').click();
    })
}

async function updateUser(modal, id) {
    let userId = id;
    $('#action').html('Изменение пользователя');
    let updateButton = `<button  class="btn btn-primary" id="updateUserButton" data-bs-dismiss="modal">Изменить</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>`
    $('#modal-footer').html(closeButton + updateButton);

    await userFetchService.showUserById(userId).then(response => response.json()).then(user => {
        let modalFilling = `
        <form class="form-group text-center" id="updateUser">
            <div class="modal-body col-md row g-3">
                <div class="col-auto text-center m-auto">
                    <div class="mb-3">
                        <label for="idUpdate"><b>ID</b></label>
                        <input class="form-control" type="text" value="${user.id}"  id="idUpdate"/>
                    </div>
                    <div class="mb-3">
                        <label for="firstNameUpdate"><b>Имя</b></label>
                        <input class="form-control" type="text" value="${user.firstName}" id="firstNameUpdate"/>
                    </div>
                    <div class="mb-3">
                        <label for="lastNameUpdate"><b>Фамилия</b></label>
                        <input class="form-control" type="text" value="${user.lastName}" id="lastNameUpdate"/>
                    </div>
                    <div class="mb-3">
                        <label for="ageUpdate"><b>Возраст</b></label>
                        <input class="form-control" type="text" value="${user.age}" id="ageUpdate"/>
                    </div>
                    <div class="mb-3">
                        <label for="emailUpdate"><b>Email</b></label>
                        <input class="form-control" type="text" value="${user.email}" id="emailUpdate"/>
                    </div>
                    <div class="mb-3">
                        <label for="passwordUpdate"><b>Пароль</b></label></td>
                        <input class="form-control" type="password" value="${user.password}" id="passwordUpdate"/>
                    </div>
                    <div class="mb-3">
                        <label for="rolesUpdate"><b>Роли</b></label>
                        <select multiple class="form-control form-control-sm" id="rolesUpdate" size="2" required="required">
                            <option value="ADMIN">ADMIN</option>
                            <option value="USER">USER</option>
                        </select>
                    </div>
                </div>
            </div>
        </form>
        `;
        $('#modal-body').html(modalFilling);
    })
    $('#updateUserButton').on('click', async () => {
        let updateUser = $('#updateUser')
        let id = updateUser.find('#idUpdate').val();
        let firstName = updateUser.find('#firstNameUpdate').val();
        let lastName = updateUser.find('#lastNameUpdate').val();
        let age = updateUser.find('#ageUpdate').val();
        let email = updateUser.find('#emailUpdate').val();
        let password = updateUser.find('#passwordUpdate').val();
        let rolesNameArray = updateUser.find('#rolesUpdate').val();

        roles = [{id: 2, name: "USER"}]

        for (let i = 0; i < rolesNameArray.length; i++) {
            console.log(rolesNameArray[i] === listRoles[i].name)
            if (rolesNameArray[i] === listRoles[i].name) {
                roles[i] = listRoles[i]
            } else {
                roles[i] = listRoles[1]
            }
        }

        const userUp = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }

        console.log(userUp)

        await userFetchService.updateUser(userUp);
        await getAllUsersTable()
    })
}


async function navbarPrincipal() {
    let navbar = $('#navbar span');
    let temp = '';
    await userFetchService.showPrincipal().then(response => response.json()).then(user => {

        temp += `<span style="color: white" class="h5">
                    <b>${user.email}</b> с ролями: ${user.roles.map(r => ' ' + r.name)} 
                  </span>`;
    })
    navbar.html(temp);
}



