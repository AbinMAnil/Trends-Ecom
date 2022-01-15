

// {{errors}}
var err1 = document.getElementById('varientErr');
var err2 = document.getElementById('mainErr');


// var imageArray1 = [];
var varientArray = [];
var colorArray = [];

// {{ function  to  clerar varient err }}
 function cleaerColorErr(){
      err1.innerHTML = "";
 }

 // {{ function to clear the main error of the  full form }}
 function clearMainErr(){
      err2.innerHTML = "";
 }

 function colorFix(){
 var proColor = document.getElementById("ProductColor").value;
   if(proColor == ""){
        document.getElementById('colorErr').innerHTML = "Please Select One Color"
        return;
   }

   if(colorArray.includes(proColor)) {
     document.getElementById('colorErr').innerHTML = "This Color is Already Exists"
     return;

   }

   document.getElementById('colorErr').innerHTML = ""
   colorArray.push(proColor)


   let newPre = `<a class="shadow" style=" background-color:${proColor}; color:white">${proColor}</a>`;
   document.getElementById('funcPreColr').innerHTML += newPre;
   const Toast = Swal.mixin({
     toast: true,
     position: 'top-end',
     showConfirmButton: false,
     timer: 2000,
     timerProgressBar: true,
     didOpen: (toast) => {
       toast.addEventListener('mouseenter', Swal.stopTimer)
       toast.addEventListener('mouseleave', Swal.resumeTimer)
     }
   })
   
   Toast.fire({
     icon: 'success',
     title: ' Color Varient  Added SuccesFully'
   })

 }
//  if(  price == "" || quantity == "" || proSize == ""){
//      err1.innerHTML = "Please Fill The All Input Fields"
//      return ;
//   }

// 



// {{function to add varient }}
function  addVarient (){
     var sizeErr =  document.getElementById('sizeErr');


           // {{ varient wise }}
          var proSize = document.getElementById('productSize').value;

         
     // {{ validation of the varients }};
   if(proSize == ""){
     sizeErr.innerHTML = "Please Select One Size ";
      return ;
   }
    
          // {{ check the  varient is exists now }};
          if(varientArray.length   !== 0 ) {
              if(varientArray.includes(proSize)){
               sizeErr.innerHTML = "This Size is already Exists"
               return;
              }
          }

          sizeErr.innerHTML = ""

          // {{ pushing the details of the varient into an array }}

          varientArray.push(proSize);


          const Toast = Swal.mixin({
               toast: true,
               position: 'top-end',
               showConfirmButton: false,
               timer: 2000,
               timerProgressBar: true,
               didOpen: (toast) => {
                 toast.addEventListener('mouseenter', Swal.stopTimer)
                 toast.addEventListener('mouseleave', Swal.resumeTimer)
               }
             })
             
             Toast.fire({
               icon: 'success',
               title: 'Varient Detail Added SuccesFully'
             })
             document.getElementById('productSize').value = ""

             //{{ adding to the preview  div  }}

             var prevewPack = `
               <a>  ${proSize} </a>  
             `;
             document.getElementById('sizePreview').innerHTML += prevewPack;
}   

//{{ validation of the main form }}

function subminManiForm(){
     // {{initilising the all inputfields}}
     var quantity = document.getElementById('quanitity').value;
    var price = document.getElementById('productPrice').value;
     var productName = document.getElementById('productName').value;
     var brandName = document.getElementById('brandName').value;
     var catagory = document.getElementById('mainCat').value;
     var subCatagory = document.getElementById('subCatSel').value;
     var discription = document.getElementById("discription").value;

     //{{ validation of all Main fiels are  empth }};

     if(quantity == "" || price == "" || productName == "" || brandName == "" || catagory == "" || subCatagory == "" || discription == ""){
          err2.innerHTML = "please fill  The All fields ";
          return;
     }
     err2.innerHTML = "";
     // {{ upload 3 images must }}
     if(imageArray1.length != 3){
          err2.innerHTML = "You Have to upload 3 picture of the product ";
          return ;
     }
     err2.innerHTML = "";

          // {{ enter atleast on varient }};

          if(varientArray.length  <= 0 ){
               err2.innerHTML = "You Have to Enter Atleast One Varient  of Size";
               return;
          }
          
     err2.innerHTML = "";

     if(colorArray.length <= 0){err2.innerHTML = "You Have to Select atleast One Color" ; return ;}
     err2.innerHTML = "";


     // {{ end of the validation of the form}}

     var PackProduct = {
          productName : productName,
          brand : brandName,
          catagory : catagory,
          subCatagory : subCatagory,
          image : JSON.stringify(imageArray1),
          discription : discription ,
          size :  JSON.stringify(varientArray),
          color : JSON.stringify(colorArray),
          price : parseInt(price),
          quantity : parseInt(quantity),
     };

     // {{ sending the details to the backend}};

     $.ajax({
          url: '/admin/products/addProduct',
          data: PackProduct,
          method:'post',
          success:(result)=>{
               if(result.status == true){
                    Swal.fire(
                         'Success!',
                         'Product Added SuccessFully',
                         'success'
                       )
               }else{
                    Swal.fire(
                         'Sorry!',
                         result.status,
                         'error'
                       )
               }
          }
     })



}