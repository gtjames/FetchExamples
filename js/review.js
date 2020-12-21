let nameField = document.getElementById('name');
nameField.addEventListener('blur', validateName);

let colorField = document.getElementById('color');
colorField.addEventListener('change', changeColor);

let error = document.getElementById('error');

function validateName() {
    if (this.value.length == 0) {
        error.innerHTML = 'User Name is missing';
    } else {
        error.innerHTML = '';
    }
}

function changeColor() {
    document.body.style.backgroundColor = this.value;
}