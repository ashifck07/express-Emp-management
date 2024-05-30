const url = new URLSearchParams(document.location.search);
const id = url.get("id");
console.log("ithe id is",id);





    var imageView=document.getElementById("imageView");
    var nameView=document.getElementById("nameView");
     var emailView=document.getElementById("emailView");
     var genderView=document.getElementById("genderView");
     var ageView=document.getElementById("ageView");
     var dobView=document.getElementById("dobView");
     var mobNumberView=document.getElementById("mobNumberView");
     var qualificationView=document.getElementById("qualificationView");
     var addressView=document.getElementById("addressView");
     var usernameView=document.getElementById("usernameView");
     profileView(id);

     async function profileView(id){
        try{
            const res=await fetch(`http://localhost:5001/employees/${id}`,{
                method:"GET",
            })
            if(!res.ok){
                throw new Error(`error found in view ${res.status}`)
            }
            const data=await res.json();


            imageView.src=(`http://localhost:5001/empImage/${id}.png`);
            nameView.textContent=data.salutation+". "+ data.firstName+" " +data.lastName;
            emailView.textContent=data.email;
            genderView.textContent=data.gender;
            ageView.textContent=ageCalculation(data.dob);
            dobView.textContent=data.dob;
            mobNumberView.textContent=data.phone;
            qualificationView.textContent=data.qualification;
            addressView.textContent=data.address;
            usernameView.textContent=data.userName;
        }catch(eroor){
            console.log(eroor);
        }

     }
//age calculation
     function ageCalculation(dateofbirth) {
        let dob=dateofbirth.split("-");

        //get in string format 
        //eg  ['14', '08', '2000']
        let dateofBirth=[];
        for(let j=0; j<3; j++){
            dateofBirth.push(Number(dob[j]));
        }
        //get number format 14-08-2000
        const currentDate=new Date();
        let age=currentDate.getFullYear()-dateofBirth[2];
        const sameMonth=currentDate.getMonth()<dateofBirth[1]||(currentDate.getMonth()==dateofBirth[1]&&currentDate.getDate()<dateofBirth[0]);
        if(sameMonth){
            age--;
        }
        return age;
        
   
    }

    // edit section in view
 
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
const editEmpForm=document.getElementById("viewEdit");
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
//date of birth change
function DOB(data){
            const dobArray=data.split("-");
            let year=dobArray[0];
            let month=dobArray[1];
            let day=dobArray[2];
            let dateformatte=day+"-"+month+"-"+year;
        
        
        
            return dateformatte;
         }

// edit function start
async function editEmployee(id){
  
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
        saveEdit.addEventListener("click",e => {
                const valid=editValidation();
                if(!valid){
                    return
                }else{
                    editEmpUpdate(id)
                }

            // editValidation();
            // editEmpUpdate(id)
          
          
          });
        
    }
    catch(error){

        console.log(`edit form error`,error);
      
    }



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
            throw new Error(`view edit is not updated${res.status}`)
        }
        const data=await res.json();
        const avatarEdit=edit_input_file.files[0];
        const editFormaData=new FormData();
        editFormaData.append("avatar",avatarEdit);
        await fetch(`http://localhost:5001/employees/${id}/avatar`,{
            method:"POST",
            body:editFormaData,
        })
        window.location.href=`view.html?id=${id}`
    }
    catch(eroor){
        console.log("error found in edit view",eroor);
    }

}
}
// vallidation edit
const error=document.getElementsByClassName("msgError");
function editValidation(){
    let isvalid=true;
    const validateInput=(inputData,no,msg)=>{
        if(inputData.value===""){
            error[no].innerHTML=msg; 
            inputData.focus();
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
    overlay.style.display="block";
    editEmpForm.style.display="block";
}
editFormBtn.addEventListener('click', e => {
    editEmpFormOpen(),
    editEmployee(id)

});

const closeFromEmpEdit=function(){
    editEmpForm.style.display="none";
    overlay.style.display="none";
}
editCancel.addEventListener('click',closeFromEmpEdit);
closeEdit.addEventListener('click',closeFromEmpEdit);
overlay.addEventListener('click',closeFromEmpEdit);

//delete section

async function viewDelete(id)

{
 
  try {

    const res = await fetch(`http://localhost:5001/employees/${id}`,{
     
    method: "DELETE"
    })

   if(!res.ok){

    throw new Error(`Error in deletion ${res.status}`)
   }

   window.location.href="index.html";

    
  } catch (error) {
    
    console.log(error);
  }
  


  
}



// display and hide delete 
const deleteSection=document.getElementById("deletepopup");
const closeDltBtn=document.getElementById("closeDlt");
const cancelDltBtn=document.getElementById("cancelDlt");
const deleteBtnView=document.getElementById("deleteBtn");
const deleteForm=document.getElementById("deleteForm");

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

deleteForm.addEventListener("click",e=>{
    openDltMsg()
    
})

deleteBtnView.addEventListener("click",e => {

    viewDelete(id);
})