const server = 'http://127.0.0.1:8000/'

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

window.onload = function () {
    // const divSearch = document.getElementsByClassName("bs-searchbox")[0];
    // const inputSearch = divSearch.getElementsByClassName("form-control")[0];
    const dropdown_parent = document.querySelector('#dropdown_parent');
    const logo = document.querySelector('#logo');
    const editar_button = document.querySelector('#editar_button');
    const file = document.querySelector('.m-input-file');

    dropdown_parent.addEventListener('click', toggleDropdown);
    logo.addEventListener('click', goHome);
    
    // Agrega el eventListener que muestra el modal a todos los productos de la 
    // categoria activa
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        let activeTabpane = document.querySelector('.tab-pane.active');
        let products = activeTabpane.querySelectorAll('.m-product-card');
        
        products.forEach(element => {
            element.addEventListener('click', showModal);
        });
    })

    if (editar_button) {
        editar_button.addEventListener('click', goToEditar);
    }

    if (file) {
        let input_file = document.querySelector(`#${file.attributes["for"].value}`);
        input_file.addEventListener('change', () => {
            let filename = input_file.value.replace(/^C:\\fakepath\\/, "");
            file.innerText = filename;
        });
    }

    inputSearch.onkeyup = searchUsers(inputSearch);
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

getProducto = (elementoHTML) => {
    const csrftoken = getCookie('csrftoken');
    const tipoProducto = elementoHTML.dataset.tipoproducto;
    const idProducto = elementoHTML.dataset.idproducto;

    fetch(server + 'getProducto', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            'tipoProducto': tipoProducto,
            'idProducto': idProducto
        })
    })
        .then(res => {
            return res.json();
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
}

// function showEditPopup(url) {
//     var win = window.open(url, "Edit",
//         'height=500,width=800,resizable=yes,scrollbars=yes');
//     return false;
// }

function showAddPopup(triggeringLink, resultContainer) {
    const id = triggeringLink;
    const name = triggeringLink.id.replace(/^add_/, '');
    const href = triggeringLink.getAttribute('data-url');
    const win = window.open(href, name, 'height=500,width=800,resizable=yes,scrollbars=yes');
    localStorage.setItem('id_field', resultContainer);
    win.focus();
    return false;
}

function closePopup(win, newID, newRepr, id) {
    let select = document.getElementById(id);
    let option = document.createElement('option');
    option.appendChild(document.createTextNode(newRepr));
    option.value = newID;
    option.setAttribute('selected', 'selected');
    select.appendChild(option);
    win.close();

    localStorage.removeItem('id');
}

// function searchUsers(text) {
//     // console.log(text.value);
//     const csrftoken = getCookie('csrftoken');

//     fetch('http://127.0.0.1:8000/searchUsers', {
//         method: 'POST',
//         credentials: 'same-origin',
//         headers: {
//             'Accept': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
//             'X-CSRFToken': csrftoken,
//         },
//         body: JSON.stringify({
//             'textoBusqueda': text.value
//         })

//     })
//         .then(res => {
//             return res.json();
//         })
//         .then(res => {
//             const users = res['users'];
//             const selectUsers = document.getElementsByClassName("dropdown-menu inner show")[0];
//             users.forEach(user => {
//                 console.log(user["first_name"]);
//                 console.log(selectUsers);

//                 // let newLi = document.createElement("li");
//                 // let newAnchor = document.createElement("a");
//                 // newAnchor.id = "bs-select-1-"+user["id"];
//                 // newAnchor.className = "dropdown-item";
//                 // newAnchor.role = "option";
//                 // newAnchor.tabIndex = "0";
//                 // // newAnchor.aria-setsize=3;
//                 // // newAnchor.aria-pointset=2;

//                 // let spanText = document.createElement("span");
//                 // spanText.className = "text";
//                 // spanText.appendChild(document.createTextNode(user["first_name"]));


//                 // newAnchor.appendChild(spanText);
//                 // // console.log(newAnchor);
//                 // newLi.appendChild(newAnchor);
//                 // selectUsers.appendChild(newLi);

//                 // console.log(selectUsers);

//                 selectUsers.innerHTML+='<li><a role="option" class="dropdown-item active selected" id="bs-select-1-0" tabindex="0" aria-setsize="4" aria-posinset="1" aria-selected="true"><span class="text">Mustardddddd</span></a></li>';







//             });

//         })
//         .catch(err => {
//             console.log(err);
//         });
// }

function showModal(){
    $('#detallesModal').modal('show');
}

function toggleDropdown() {
    const dropdown = document.querySelector('#dropdown');
    dropdown.classList.toggle('h-display');
}

function goHome() {
    window.location.href = "/home";
}

function goToEditar() {
    window.location.href = "/profile";
}

async function getLineasForm() {
    // showAddPopup('investigacion');

    let form = await fetch('/lineas/create');
    let response = await form.text();

    let modal = document.querySelector('.modal-body');
    modal.innerHTML = response;
}
