function preventNumber(e) {
     var keyCode = (e.keyCode ? e.keyCode : e.which);
     if (keyCode > 47 && keyCode < 58) {
         e.preventDefault();
     }
 }





 function showAddressForm(){
    document.getElementById("addressForm").style.display = "block"
    document.getElementById("cancelbutton").style.visibility = "visible"
    document.getElementById("cancelbutton").style.display = "block"
}
function clearForm (){
   $('#address')[0].reset();
   document.getElementById("addressForm").style.display = "none"
   document.getElementById("cancelbutton").style.display = "none"
}




