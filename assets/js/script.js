let alldata = [];
let currentPage = 1;
let dataCount;
let pageList = document.getElementById("pageList");
let limits = parseInt(document.getElementById("pageList").value);
pageList.addEventListener("change", () => {
    limits = parseInt(document.getElementById("pageList").value);
    fetching(limits, currentPage);
    listTable(limits, dataCount);
});

let searchInput = "";
function search() {
    searchInput = document.getElementById("searchBar").value;
    fetching(limits, currentPage)
}
//fetching data 
async function fetching(limits, currentPage) {
    try {
        const res = await fetch(`http://localhost:5001/employees?page=${currentPage}&limit=${limits}&search=${searchInput}`)
        const data = await res.json();
        if (!res.ok) {
            throw new Error(`error in fetch ${res.status}`)
        }
        alldata = data.data;
        dataCount = data.count;
        // alldata.reverse();
        if (dataCount == 0) {
            const table_body = document.getElementById("table_body");
            table_body.innerHTML = "<h5>employee not found</h5>";
        } else {
            displayEmployee(alldata, currentPage, limits);
        }
        listTable(limits, dataCount);
    }
    catch (Error) {
        console.log(Error);
    }
}
fetching(limits, currentPage);

function displayEmployee(data, starts, limit) {
    const table_body = document.getElementById("table_body");
    const startIndex = (starts - 1) * limit;
    let dataInput = "";

    for (let i = 0; i < data.length; i++) {
        const serialNumber = startIndex + i + 1
        dataInput += `<tr>
        <td scope="row">#${numberCount(serialNumber)}${serialNumber}</td>
        <td><img src="http://localhost:5001/empImage/${data[i]._id}.png" height="30px" width="35px" style="border-radius: 50%">${data[i].salutation}.${data[i].firstName} ${data[i].lastName}</td>
        <td>${data[i].email}</td>
        <td>${data[i].phone}</td>
        <td>${data[i].gender}</td>
        <td>${data[i].dob}</td>
        <td>${data[i].country}</td>
        <td><div class="dropdown">
            <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li><a class="dropdown-item" href="view.html?id=${data[i]._id}"><i class="fa-regular fa-eye"></i>View Details</a></li>
              <li><a class="dropdown-item" onclick="editEmployee('${data[i]._id}')" href="#" id="editForm"><i class="fa-solid fa-pen"></i>Edit</a></li>
              <li><a class="dropdown-item" onclick="deleteEmployee('${data[i]._id}')" href="#"><i class="fa-solid fa-trash"></i>Delete</a></li>
            </ul>
          </div></td>
      </tr>`
        starts++;
        table_body.innerHTML = dataInput;
    }
}

function numberCount(count) {
    if (count < 9) {
        return 0
    } else {
        return ""
    }
}

// popup and hide  add employee form
const addEmployeform = document.getElementById("addEmploye");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const empAddBtn = document.getElementById("empAddBtn");
const addEmpBtn = document.getElementById("addEmpBtn");
const employeeAddForm = document.getElementById("employeeAddForm")

// // ovarley close all
overlay.addEventListener('click', (e) => {
    e.preventDefault();
    addEmployeform.style.display = "none";
    overlay.style.display = "none"
})

// add new employee

const salutation = document.getElementById("salutation");
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const emailAddress = document.getElementById("emailAddress");
const mobileNumber = document.getElementById("mobileNumber");
const username = document.getElementById("username");
const password = document.getElementById("password");
const dateofBirth = document.getElementById("dateofBirth");
const male = document.getElementById("male");
const female = document.getElementById("female");
const qualifications = document.getElementById("qualifications");
const address = document.getElementById("address");
const country = document.getElementById("country");
const state = document.getElementById("state");
const city = document.getElementById("city");
const pinZip = document.getElementById("pinZip");
//dob change
function DOB(date) {
    const dobArray = date.split("-");
    let year = dobArray[0];
    let month = dobArray[1];
    let day = dobArray[2];
    let dateformatte = day + "-" + month + "-" + year;
    return dateformatte;
}
function genderCheck() {
    if (male.checked) {
        return "Male"
    } else if (female.checked) {
        return "Female"
    }
}

//image input
const avatarImg = document.getElementById("avatarImg");
const inputFile = document.getElementById("input_file");
let checkImage = false;

inputFile.onchange = function () {
    let imageObject = inputFile.files[0];
    avatarImg.src = URL.createObjectURL(imageObject)
}

function formdata() {
    let addnewEmp = {
        salutation: salutation.value,
        firstName: firstName.value,
        lastName: lastName.value,
        email: emailAddress.value,
        phone: mobileNumber.value,
        dob: DOB(dateofBirth.value),
        gender: genderCheck(),
        qualification: qualifications.value,
        address: address.value,
        city: city.value,
        state: state.value,
        country: country.value,
        userName: username.value,
        password: password.value,
        pinZip: pinZip.value

    };
    return addnewEmp
}

async function addNewEmployee() {
    try {
        const res = await fetch(`http://localhost:5001/employees`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formdata())
        })
        if (!res.ok) {
            throw new Error(`error in post ${res.status}`)
        }
        const responseData = await res.json();
        const avatarId = responseData._id;
        const formData = new FormData();
        formData.append("avatar", inputFile.files[0]);
        await fetch(`http://localhost:5001/employees/${avatarId}/avatar`, {
            method: "POST",
            body: formData,
        });
        alldata.unshift(formdata());
        tableDataShow(1)
        addEmpCloseForm();
        Swal.fire({
            icon: "success",
            title: "Employee Added Successfully!",
            confirmButtonText: "OK",
        });
    } catch (eroor) {
        console.log("add eroor", eroor);
    }
}

empAddBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const valid = vallidation();
    if (!valid) {
        return;
    }
    else {
        addNewEmployee();
    }
});

// vallidation of form 

const errorMsg = document.getElementsByClassName("error");
const addEmploye = document.getElementById("addEmploye");

function vallidation() {
    let isvalid = true;
    const validateInput = (inputData, no, msg) => {

        if (inputData.value === "") {
            errorMsg[no].innerHTML = msg;
            inputData.focus();
            isvalid = false;

        }
        else {
            errorMsg[no].innerHTML = "";
        }
    }
    const genderInput = () => {
        if (male.checked === false && female.checked === false) {
            errorMsg[8].innerHTML = "select the gender";
            male.focus() || female.focus();
            isvalid = false;
        }

    }
    const mobileNumberInput = (inputData, no, msg) => {
        let mobileValue = inputData.value.trim();
        if (inputData.value === "") {
            errorMsg[no].innerHTML = msg;
            inputData.focus();
            isvalid = false;
        } else if ((mobileValue.length) != 10) {
            errorMsg[no].innerHTML = "enter a valid number";
            inputData.focus();
            isvalid = false;

        }
        else {
            errorMsg[no].innerHTML = "";
        }

    }

    const emailInput = (inputData, no, msg) => {
        let emailValue = inputData.value.trim();
        let emailregex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (inputData.value === "") {
            errorMsg[no].innerHTML = msg;
            inputData.focus();
            isvalid = false;
        } else if (!(emailValue.match(emailregex))) {
            errorMsg[no].innerHTML = "enter a valid email";
            inputData.focus();
            isvalid = false;
        }
        else {
            errorMsg[no].innerHTML = "";
        }

    }

    validateInput(pinZip, 14, "please enter pincode");
    validateInput(city, 13, "please enter city");
    validateInput(state, 12, "select state");
    validateInput(country, 11, "select country");
    validateInput(address, 10, "please enter address");
    validateInput(qualifications, 9, "qualification");
    genderInput();
    validateInput(dateofBirth, 7, "select dob");
    validateInput(password, 6, "enter password");
    validateInput(username, 5, "please enter userName");
    mobileNumberInput(mobileNumber, 4, "please enter mobilenumber");
    emailInput(emailAddress, 3, "enter email");
    validateInput(lastName, 2, "please enter lastName");
    validateInput(firstName, 1, "please enter firstname");
    validateInput(salutation, 0, "select salutation");

    const removeValidationInput = (no) => {
        errorMsg[no].innerHTML = ""
    }

    const removeGenderInput = () => {
        addEventListener('input', () => {
            if (male.checked || female.checked) {
                errorMsg[8].innerHTML = "";
            }
        })
    }

    salutation.addEventListener('input', () => { removeValidationInput(0) })
    firstName.addEventListener('input', () => { removeValidationInput(1) })
    lastName.addEventListener('input', () => { removeValidationInput(2) })
    emailAddress.addEventListener('input', () => { removeValidationInput(3) })
    mobileNumber.addEventListener('input', () => { removeValidationInput(4) })
    username.addEventListener('input', () => { removeValidationInput(5) })
    password.addEventListener('input', () => { removeValidationInput(6) })
    dateofBirth.addEventListener('input', () => { removeValidationInput(7) })
    removeGenderInput();
    qualifications.addEventListener('input', () => { removeValidationInput(9) })
    address.addEventListener('input', () => { removeValidationInput(10) })
    country.addEventListener('input', () => { removeValidationInput(11) })
    state.addEventListener('input', () => { removeValidationInput(12) })
    city.addEventListener('input', () => { removeValidationInput(13) })
    pinZip.addEventListener('input', () => { removeValidationInput(14) })
    return isvalid;

}



//updated image section storage file
const imageEdit = document.getElementById("imageEdit");
const edit_input_file = document.getElementById("edit_input_file");
let imgCheck = false;
edit_input_file.onchange = function () {
    imgCheck = true;
    let imageObjectEdit = edit_input_file.files[0];
    imageEdit.src = URL.createObjectURL(imageObjectEdit)
}

//delete section

function deleteEmployee(id) {
    openDltMsg();
    deleteBtn.addEventListener('click', async function () {
        try {
            const res = await fetch(`http://localhost:5001/employees/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                throw new Error(`delete cant done,${res.status}`);
            }
            alldata.filter((element, index) => {

                if (id === element._id) {
                    alldata.splice(index, 1)
                    tableDataShow(1);
                }

            });
            const result = await Swal.fire({
                title: 'Delete!',
                text: 'Do you want to continue',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
            if (result.isConfirmed) {
                Swal.close();
            }
            closeDltMsg();
        }
        catch (error) {
            console.log(error);
        }
    })

}

// display and hide delete 
const deleteSection = document.getElementById("deletepopup");
const closeDltBtn = document.getElementById("closeDlt");
const cancelDltBtn = document.getElementById("cancelDlt");
const deleteBtn = document.getElementById("deleteBtn");


const openDltMsg = function () {
    deleteSection.style.display = "block";
    overlay.style.display = "block";
}
const closeDltMsg = function () {
    deleteSection.style.display = "none";
    overlay.style.display = "none";
}
closeDltBtn.addEventListener('click', closeDltMsg)
cancelDltBtn.addEventListener('click', closeDltMsg)
overlay.addEventListener('click', closeDltMsg)

//pagination 
const pageNumberBtn = document.getElementById("pageNumber");
let buttonNumber;
function listTable(limits, dataCount) {
    let pageNumberList = limits;

    buttonNumber = Math.ceil(dataCount / pageNumberList);
    let numberofpage = ""
    for (let i = 1; i <= buttonNumber; i++) {
        numberofpage += `<li class="page-item" id="pageNumber"><a class="page-link d-flex gap-2" href="#" onclick="tableDataShow(${i})">${i}</a></li>`
    }
    pageNumberBtn.innerHTML = numberofpage;

}

function tableDataShow(nextList) {
    currentPage = nextList;
    fetching(limits, currentPage);
}

// // final page

function finalpage() {
    currentPage = buttonNumber;

    tableDataShow(currentPage);
}

// //next
function next() {
    if (currentPage < buttonNumber) {
        currentPage++;
        tableDataShow(currentPage)
    } else {
        tableDataShow(currentPage);

    }
}
// //  previous page
function previous() {
    if (currentPage > 1) {
        currentPage--;
        tableDataShow(currentPage);
    }
    else {
        tableDataShow(currentPage);
    }
}
// updated data section
imgEdit = document.getElementById("imgEdit");
editHeader = document.getElementById("editHeader");
addHeader = document.getElementById("addHeader")

function editEmpForm() {
    addEmployeform.style.display = "block";
    overlay.style.display = "block";
    uploadImage.style.display = "none";
    footer_add.style.display = "none";

    imgEdit.style.display = "block";
    footer_edit.style.display = "block";
    ChangeName.textContent = "Edit Employee"
    employeeAddForm.reset();

}

const addEmpForm = function () {
    addEmployeform.style.display = "block";
    overlay.style.display = "block";
    uploadImage.style.display = "block"
    employeeAddForm.reset();
    avatarImg.src = "/images/avatar";
    footer_add.style.display = "block"
    ChangeName.textContent = "Add Employee"

}
const addEmpCloseForm = function () {
    addEmployeform.style.display = "none";
    overlay.style.display = "none"
    employeeAddForm.reset();
    uploadImage.style.display = "none";
    footer_add.style.display = "none";
    imgEdit.style.display = "none";
    footer_edit.style.display = "none";
}
let editId = '';
async function editEmployee(id) {
    editId = id;
    editEmpForm();
    try {
        const res = await fetch(`http://localhost:5001/employees/${editId}`, {
            method: "GET",
        })
        if (!res.ok) {
            throw new Error(`error in get data ${res.status}`)
        }
        const data = await res.json();
        salutation.value = data.salutation;
        firstName.value = data.firstName;
        lastName.value = data.lastName;
        emailAddress.value = data.email;
        mobileNumber.value = data.phone;
        username.value = data.userName;
        password.value = data.password;
        dateofBirth.value = DOB(data.dob);
        genderCheck();
        qualifications.value = data.qualification;
        address.value = data.address;
        country.value = data.country;
        state.value = data.state;
        city.value = data.city;
        pinZip.value = data.pinZip;

        function genderCheck() {
            const maleEdit = document.getElementById("male");
            const femaleEdit = document.getElementById("female");
            gender = data.gender;
            if (gender === "Male") {
                maleEdit.checked = true;
            } else
                femaleEdit.checked = true;

        }
        imageEdit.src = (`http://localhost:5001/empImage/${editId}.png`);
    } catch (error) {
        console.log(error);
    }

    //     //save edit click
    saveEdit.addEventListener('click', (e) => {
        e.preventDefault();
        const valid = vallidation();
        if (!valid) {
            return
        }
        else {
            editEmpUpdate();
        }
    });
    // update  employee   
    async function editEmpUpdate() {

        try {
            const res = await fetch(`http://localhost:5001/employees/${editId}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(formdata())
            })
            if (!res.ok) {
                throw new Error(`edit is not updated${res.status}`)
            }
            const data = await res.json();
            const avatarEdit = edit_input_file.files[0];
            const editFormaData = new FormData();
            editFormaData.append("avatar", avatarEdit);
            if (imgCheck == true) {
                await fetch(`http://localhost:5001/employees/${editId}/avatar`, {
                    method: "POST",
                    body: editFormaData,
                });

            }

            const result = await Swal.fire({
                icon: "success",
                title: "Employee Edited Successfully!",
                confirmButtonText: 'Ok'
            })
            if (result.isConfirmed) {
                Swal.close();
            }
            location.reload();
            addEmpCloseForm();
        }
        catch (error) {
            console.log(`edit form error`, error);

        }
    }
}