let alldata=[];

async function fetching(){
try{
        const res=await fetch(`http://localhost:5001/employees`)
        const data= await res.json();
        console.log("new",data);
        if(!res.ok){
            throw new Error(`error in fetch ${res.status}`) 
        }
        alldata=data;
        console.log(data);
        alldata.reverse();
        displayEmployee(alldata,0);
        listTable(); 
     }
catch(Error){
    console.log(Error);
    }
}
fetching();


function displayEmployee(data,starts){
    const table_body=document.getElementById("table_body");

  
    let dataInput="";

    for(let i=0;i<data.length;i++){
        dataInput+=`<tr>
        <td scope="row">#${numberCount(starts)}${starts+1}</td>
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
      table_body.innerHTML=dataInput;
    }
}
function numberCount(count){
    if(count<9){
       return 0
    }else{
        return ""
    }
}


// popup and hide  add employee form

const addEmployeform = document.getElementById("addEmploye");
const overlay= document.getElementById("overlay");
const closeBtn = document.getElementById("closeBtn");
const cancelBtn = document.getElementById("cancelBtn");
const empAddBtn = document.getElementById("empAddBtn");
const addEmpBtn=document.getElementById("addEmpBtn");
const employeeAddForm=document.getElementById("employeeAddForm")

// display form
const addEmpForm=function(){
    addEmployeform.style.display="block";
    overlay.style.display="block"
    employeeAddForm.reset();
    avatarImg.src="images/avatar" ; 
    
}
addEmpBtn.addEventListener('click',addEmpForm);
// close form
const addEmpCloseForm=function(){
    addEmployeform.style.display="none";
    overlay.style.display="none"
}
// close form
closeBtn.addEventListener('click', function(event) {
     event.preventDefault();
     addEmployeform.style.display="none";
     overlay.style.display="none"
    });

// cancel btn
cancelBtn.addEventListener('click', function(event) {
    event.preventDefault();
    addEmployeform.style.display="none";
    overlay.style.display="none"
   });
// ovarley close all
overlay.addEventListener('click',(e)=> {
    e.preventDefault();
    addEmployeform.style.display="none";
    overlay.style.display="none"
})

// add new employee
 

const salutation=document.getElementById("salutation");
const firstName=document.getElementById("firstName");
const lastName=document.getElementById("lastName");
const emailAddress=document.getElementById("emailAddress");
const mobileNumber=document.getElementById("mobileNumber");
const username=document.getElementById("username");
const password=document.getElementById("password");
const dateofBirth=document.getElementById("dateofBirth");
const male=document.getElementById("male");
const female=document.getElementById("female");
const qualifications=document.getElementById("qualifications");
const address=document.getElementById("address");
const country=document.getElementById("country");
const state=document.getElementById("state");
const city=document.getElementById("city");
const pinZip=document.getElementById("pinZip");
//dob change
function DOB(date){
    const dobArray=date.split("-");
    let year=dobArray[0];
    let month=dobArray[1];
    let day=dobArray[2];
    let dateformatte=day+"-"+month+"-"+year;



    return dateformatte;
 }
 function genderCheck(){
    if(male.checked){
        return "Male"
    } else if(female.checked){
        return "Female"
    }
 }

 //image input
const avatarImg=document.getElementById("avatarImg");
const inputFile=document.getElementById("input_file");

inputFile.onchange = function(){
    let imageObject=inputFile.files[0];
        avatarImg.src =URL.createObjectURL(imageObject)
}


 async function addNewEmployee() {
    let addnewEmp={
        salutation:salutation.value,
        firstName:firstName.value,
        lastName:lastName.value,
        email:emailAddress.value,
        phone:mobileNumber.value,
        dob:DOB(dateofBirth.value),
        gender:genderCheck(),
        qualification:qualifications.value,
        address:address.value,
        city:city.value,
        state:state.value,
        country:country.value,
        userName:username.value,
        password:password.value,
        pinZip:pinZip.value

    };
    try{
        const res=await fetch(`http://localhost:5001/employees`,{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify(addnewEmp)
        })


        if(!res.ok){
            throw new Error(`error in post ${res.status}`) 
        }
        const responseData= await res.json();
        const avatarId=responseData._id;
        const formData=new FormData();
        formData.append("avatar",inputFile.files[0]);
        await fetch(`http://localhost:5001/employees/${avatarId}/avatar`,{
            method:"POST",
            body:formData,
        });
        alldata.unshift(addnewEmp);
        addnewEmp._id=avatarId;
        tableDataShow(0)
        addEmpCloseForm();
        Swal.fire({
            icon: "success",
            title: "Employee Added Successfully!",
            confirmButtonText: "OK",
          });   
       

    } catch(eroor){
        console.log("add eroor",eroor);
    }


}


empAddBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    const valid= vallidation();
    // console.log(valid)
   
    if(!valid){
        return;
    }
    else{
        addNewEmployee();

    }

});




// vallidation 

const errorMsg=document.getElementsByClassName("error");
const addEmploye=document.getElementById("addEmploye");


function vallidation()

{
    let isvalid=true;
    const validateInput=(inputData,no,msg)=>{

        if(inputData.value===""){
          errorMsg[no].innerHTML=msg; 
        inputData.focus();
        isvalid=false;

        }
        else{
            errorMsg[no].innerHTML="";
        }
    }
    const genderInput=()=>{
        if(male.checked===false&&female.checked===false){
            errorMsg[8].innerHTML="select the gender";
            male.focus()||female.focus();
            isvalid=false;
        }

    }
    const mobileNumberInput=(inputData,no,msg)=>{
        let mobileValue=inputData.value.trim();
        if(inputData.value===""){
            errorMsg[no].innerHTML=msg;
            inputData.focus();
            isvalid=false;
        }else if((mobileValue.length)!=10){
            errorMsg[no].innerHTML="enter a valid number"; 
            inputData.focus();
            isvalid=false;

        }
        else{
              errorMsg[no].innerHTML="";
          }

    }
    
    const emailInput=(inputData,no,msg)=>{
        let emailValue=inputData.value.trim();
        let emailregex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(inputData.value===""){
            errorMsg[no].innerHTML=msg; 
            inputData.focus();
            isvalid=false;
        }else if(!(emailValue.match(emailregex))){
            errorMsg[no].innerHTML="enter a valid email"; 
            inputData.focus();
            isvalid=false;
        }
        else{
              errorMsg[no].innerHTML="";
          }

    }
    
    
    validateInput(pinZip,14,"please enter pincode");
    validateInput(city,13,"please enter city");
    validateInput(state,12,"select state");
    validateInput(country,11,"select country");
    validateInput(address,10,"please enter address");
    validateInput(qualifications,9,"qualification");
    genderInput();
    validateInput(dateofBirth,7,"select dob");
    validateInput(password,6,"enter password");
    validateInput(username,5,"please enter userName");
    mobileNumberInput(mobileNumber,4,"please enter mobilenumber");
    emailInput(emailAddress,3,"enter email");
    validateInput(lastName,2,"please enter lastName");
    validateInput(firstName,1,"please enter firstname");
    validateInput(salutation,0,"select salutation");
   
    const removeValidationInput=(no)=>{
        errorMsg[no].innerHTML=""
    }



    const removeGenderInput=()=>{
        addEventListener('input',()=>{
         if(male.checked||female.checked){
             errorMsg[8].innerHTML="";
          }
        })
     }


    salutation.addEventListener('input',()=>{removeValidationInput(0)})
    firstName.addEventListener('input',()=>{removeValidationInput(1)})
    lastName.addEventListener('input',()=>{removeValidationInput(2)})
    emailAddress.addEventListener('input',()=>{removeValidationInput(3)})
    mobileNumber.addEventListener('input',()=>{removeValidationInput(4)})
    username.addEventListener('input',()=>{removeValidationInput(5)})
    password.addEventListener('input',()=>{removeValidationInput(6)})
    dateofBirth.addEventListener('input',()=>{removeValidationInput(7)})
    removeGenderInput();
    qualifications.addEventListener('input',()=>{removeValidationInput(9)})
    address.addEventListener('input',()=>{removeValidationInput(10)})
    country.addEventListener('input',()=>{removeValidationInput(11)})
    state.addEventListener('input',()=>{removeValidationInput(12)})
    city.addEventListener('input',()=>{removeValidationInput(13)})
    pinZip.addEventListener('input',()=>{removeValidationInput(14)})
   return isvalid;
    
}

////editing section


const salutationEdit= document.getElementById("salutationEdit");
const firstnameEdit= document.getElementById("firstnameEdit");
const lastnameEdit= document.getElementById("lastnameEdit");
const emailEdit= document.getElementById("emailEdit");
const mobileEdit= document.getElementById("mobileEdit");
const usernameEdit= document.getElementById("usernameEdit");
const passwordEdit= document.getElementById("passwordEdit");
const dobEdit= document.getElementById("dobEdit");
const maleEdit= document.getElementById("maleEdit");
const femaleEdit= document.getElementById("femaleEdit");
const qualificationEdit= document.getElementById("qualificationEdit");
const addressEdit= document.getElementById("addressEdit");
const countryEdit= document.getElementById("countryEdit");
const stateEdit= document.getElementById("stateEdit");
const cityEdit= document.getElementById("cityEdit");
const pinEdit=document.getElementById("pinEdit");
//show and remove forms ids
const editFormBtn=document.getElementById("editForm");
const editEmpForm=document.getElementById("editPopup");
const editCancel=document.getElementById("editCancel");
const saveEdit=document.getElementById("saveEdit");
const closeEdit=document.getElementById("closeEdit");

//image 
const imageEdit=document.getElementById("imageEdit");
const edit_input_file=document.getElementById("edit_input_file");

edit_input_file.onchange = function(){
    let imageObjectEdit=edit_input_file.files[0];
    imageEdit.src =URL.createObjectURL(imageObjectEdit)
}


async function editEmployee(id){
    console.log("edit id is",id);
    editEmpFormOpen();
    try{
        const res=await fetch(`http://localhost:5001/employees/${id}`,{
        method:"GET",
        })
        if(!res.ok){
            throw new Error(`error in get data ${res.status}`) 
        }
        const data= await res.json();

        salutationEdit.value=data.salutation;
        firstnameEdit.value=data.firstName;
        lastnameEdit.value=data.lastName;
        emailEdit.value=data.email;
        mobileEdit.value=data.phone;
        usernameEdit.value=data.userName;
        passwordEdit.value=data.password;
        dobEdit.value=DOB(data.dob);
        console.log("edit dob",  dobEdit.value);
        genderCheck();
        qualificationEdit.value=data.qualification;
        addressEdit.value=data.address;
        countryEdit.value=data.country;
        stateEdit.value=data.state;
        cityEdit.value=data.city;
        pinEdit.value=data.pinZip;

   
       
         function genderCheck(){
            const maleEdit= document.getElementById("maleEdit");
            const femaleEdit= document.getElementById("femaleEdit");
            gender = data.gender;
            if (gender === "Male") {
                maleEdit.checked = true;
            } else 
                femaleEdit.checked = true;
            
         }
       

        imageEdit.src=(`http://localhost:5001/empImage/${id}.png`);
        
    }
    catch(error){

        console.log(`edit form error`,error);
      
    }

    //save edit click
saveEdit.addEventListener('click',(e)=>{
    e.preventDefault();
    const valid=  editValidation();

    if(!valid){
        return
    }
    else{
        editEmpUpdate(id);
    }
});

async function editEmpUpdate(id){
    let editData={
        salutation:salutationEdit.value,
        firstName:firstnameEdit.value,
        lastName:lastnameEdit.value,
        email:emailEdit.value,
        phone:mobileEdit.value,
        dob:DOB(dobEdit.value),
        gender:(maleEdit.checked===true) ? 'Male':'Female',
        qualification:qualificationEdit.value,
        address:addressEdit.value,
        city:cityEdit.value,
        state:stateEdit.value,
        country:countryEdit.value,
        userName:usernameEdit.value,
        password:passwordEdit.value,
        pinZip:pinEdit.value
    }
try{
    const res=await fetch(`http://localhost:5001/employees/${id}`,{
        method:"PUT",
         headers:{"Content-type":"application/json"},
        body:JSON.stringify(editData)
    })
    if(!res.ok){
        throw new Error(`edit is not updated${res.status}`)
    }
    const data=await res.json();
    const avatarEdit=edit_input_file.files[0];
    const editFormaData=new FormData();
    editFormaData.append("avatar",avatarEdit);
    await fetch(`http://localhost:5001/employees/${id}/avatar`,{
        method:"POST",
        body:editFormaData,
    });
    alldata.push(editData);
    editData.id=id;
    tableDataShow(alldata,0);
    const result= await Swal.fire({
        icon: "success",
            title: "Employee Edited Successfully!",
        confirmButtonText: 'Ok'
      })
      if(result.isConfirmed)
    {
    Swal.close();
    }
    location.reload();
    closeFromEmpEdit();

}
catch(error){

    console.log(`edit form error`,error);
  
}
}

}


//edit vallidation
const error=document.getElementsByClassName("msgError");
function editValidation(){
    let isvalid=true;
    const validateInput=(inputData,no,msg)=>{
        if(inputData.value===""){
            inputData.focus();
            error[no].innerHTML=msg;
            isvalid=false; 
           
        }else{
            error[no].innerHTML="";
        }
    }
    const genderInput=()=>{
        if(!maleEdit.checked===true&&!femaleEdit.checked===true){
            error[8].innerHTML="select the gender";
            inputData.focus();
            isvalid=false; 
        }

    }
    const mobileNumberInput=(inputData,no,msg)=>{
        let mobileValue=inputData.value.trim();
        if(inputData.value===""){
            error[no].innerHTML=msg; 
            inputData.focus();
            isvalid=false; 
        }else if((mobileValue.length)!=10){
            error[no].innerHTML="enter a valid number";
            inputData.focus();
            isvalid=false; 
        }
        else{
            error[no].innerHTML="";
          }

    }
    const emailInput=(inputData,no,msg)=>{
        let emailValue=inputData.value.trim();
        let emailregex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(inputData.value===""){
            error[no].innerHTML=msg; 
            inputData.focus();
            isvalid=false; 
        }else if(!(emailValue.match(emailregex))){
            error[no].innerHTML="enter a valid email";
            inputData.focus(); 
            isvalid=false; 
        }
        else{
            error[no].innerHTML="";
          }

    }

    const removeValidationInput=(no)=>{
        error[no].innerHTML=""
    }
    const removeGenderInput=()=>{
       addEventListener('input',()=>{
        if(male.checked||female.checked){
            error[8].innerHTML="";
         }
       })
    }
    

    validateInput(salutationEdit,0,"select salutation");
    validateInput(firstnameEdit,1,"please enter firstname");
    validateInput(lastnameEdit,2,"please enter lastName");
    emailInput(emailEdit,3,"enter email");
    mobileNumberInput(mobileEdit,4,"please enter mobilenumber");
    validateInput(usernameEdit,5,"please enter userName");
    validateInput(passwordEdit,6,"enter password");
    validateInput(dobEdit,7,"select dob");
    genderInput();
    validateInput(qualificationEdit,9,"qualification");
    validateInput(addressEdit,10,"please enter address");
    validateInput(countryEdit,11,"select country");
    validateInput(stateEdit,12,"select state");
    validateInput(cityEdit,13,"please enter city");
    validateInput(pinEdit,14,"please enter pincode");


    salutationEdit.addEventListener('input',()=>{removeValidationInput(0)})
    firstnameEdit.addEventListener('input',()=>{removeValidationInput(1)})
    lastnameEdit.addEventListener('input',()=>{removeValidationInput(2)})
    emailEdit.addEventListener('input',()=>{removeValidationInput(3)})
    mobileEdit.addEventListener('input',()=>{removeValidationInput(4)})
    usernameEdit.addEventListener('input',()=>{removeValidationInput(5)})
    passwordEdit.addEventListener('input',()=>{removeValidationInput(6)})
    dobEdit.addEventListener('input',()=>{removeValidationInput(7)})
    removeGenderInput();
    qualificationEdit.addEventListener('input',()=>{removeValidationInput(9)})
    addressEdit.addEventListener('input',()=>{removeValidationInput(10)})
    countryEdit.addEventListener('input',()=>{removeValidationInput(11)})
    stateEdit.addEventListener('input',()=>{removeValidationInput(12)})
    cityEdit.addEventListener('input',()=>{removeValidationInput(13)})
    pinEdit.addEventListener('input',()=>{removeValidationInput(14)})
      
    return isvalid;
    
}

//display and hide the edit employee form

const editEmpFormOpen=function(){
    editEmpForm.style.display="block";
    overlay.style.display="block";
}
editFormBtn.addEventListener('click',editEmpFormOpen);

const closeFromEmpEdit=function(){
    editEmpForm.style.display="none";
    overlay.style.display="none";
}
editCancel.addEventListener('click',closeFromEmpEdit);
closeEdit.addEventListener('click',closeFromEmpEdit);
overlay.addEventListener('click',closeFromEmpEdit);



//delete section


function deleteEmployee(id){
    openDltMsg();
    deleteBtn.addEventListener('click',async function(){
      try{
        const res =await fetch(`http://localhost:5001/employees/${id}`,{
            method:"DELETE"
        });
        if(!res.ok){
            throw new Error(`delete cant done,${res.status}`);
        }
       
 const result= await Swal.fire({
    title: 'Delete!',
    text: 'Do you want to continue',
    icon: 'error',
    confirmButtonText: 'Ok'
  })
  if(result.isConfirmed)
{
Swal.close();
}
location.reload();
      }
      catch(error){
        console.log(error);
      }
    })
    
}

// display and hide delete 
 const deleteSection=document.getElementById("deletepopup");
 const closeDltBtn=document.getElementById("closeDlt");
 const cancelDltBtn=document.getElementById("cancelDlt");
 const deleteBtn=document.getElementById("deleteBtn");


const openDltMsg=function(){
    deleteSection.style.display="block";
    overlay.style.display="block";
}
const closeDltMsg=function(){
    deleteSection.style.display="none";
    overlay.style.display="none";
}
closeDltBtn.addEventListener('click',closeDltMsg)
cancelDltBtn.addEventListener('click',closeDltMsg)
overlay.addEventListener('click',closeDltMsg)


//pagination 



const pageList=document.getElementById("pageList");
const pageNumberBtn=document.getElementById("pageNumber");

let buttonNumber;
 function listTable(){
    let pageNumberList=Number(pageList.value);

    buttonNumber=Math.ceil(alldata.length/pageNumberList);
    // console.log("number",buttonNumber);
    let numberofpage=""
    for(let i=0;i<buttonNumber;i++){
        numberofpage+=`<li class="page-item" id="pageNumber"><a class="page-link d-flex gap-2" href="#" onclick="tableDataShow(${i})">${i+1}</a></li>`
    }
    pageNumberBtn.innerHTML=numberofpage;
    let startnumber=0  
    tableDataShow(startnumber);
}
 let currentPage;
function tableDataShow(nextList){
    // console.log(nextList);
    currentPage=nextList;
    // console.log("curennt page number",currentPage);

    let listNumber=Number(pageList.value);
    let tabledata=[];
    let pageStart=nextList*listNumber;
    for(let i=pageStart;i<(listNumber+pageStart)&&i<(alldata.length);i++){
        // if(alldata[i]==null){
        //     break;
        // }else{
        //     tabledata.push(alldata[i])
        // }
        tabledata.push(alldata[i])

    }
    displayEmployee(tabledata,pageStart)
}
// final page

function finalpage(){
    let finalBtn=buttonNumber-1;
    tableDataShow(finalBtn);
}

//next
function next(){
    if(currentPage<buttonNumber-1){
        currentPage++;
        tableDataShow(currentPage)
    }else{
        tableDataShow(currentPage);
        
    }
}
//  previous page
function previous(){
    if(currentPage>0){
        currentPage--;
        tableDataShow(currentPage)
    }else{
       tableDataShow(currentPage)
    }
}

//search section
const searchBar=document.getElementById("searchBar");
const table_body=document.getElementById("table_body");

let searchArray=[];

const searchEmployee=()=>{

   
    const paginationtest=document.getElementById("testpage");
    const empListSec=document.getElementById("pageList");
    const numberOf=document.getElementById("count");
   

    var filter=searchBar.value.toLowerCase();
    if(filter!==""){
        searchArray=[];
        for(let i=0; i<alldata.length;i++){
            let fName=alldata[i].firstName.toLowerCase();
            let lName=alldata[i].lastName.toLowerCase();
            let email=alldata[i].email.toLowerCase();
            let phone=alldata[i].phone.toString();

            if(fName.includes(filter)||lName.includes(filter)||email.includes(filter)||phone.includes(filter)){
                searchArray.push(alldata[i]);
                paginationtest.style.display="none";
                empListSec.style.display="none"
                numberOf.style.display="none"               
            }
            else{
                table_body.innerHTML="";
            }
          

        }
        // console.log("array in sear",searchArray);
        displayEmployee(searchArray,0)
        
    }
    else{
        paginationtest.style.display="block";
        empListSec.style.display="block"
        numberOf.style.display="block"
        tableDataShow(0)
      

    }

}




