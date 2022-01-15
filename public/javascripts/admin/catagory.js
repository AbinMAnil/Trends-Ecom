var err = document.getElementById("err");
var catagoryError = document.getElementById("AddCatErr");
var addSubCatErr = document.getElementById("err2");
var previewOfSubCat = document.getElementById("previewOfSubCat");
var subCatArray = [];

function storeInArray() {
  var subcat = document.getElementById("sub-cat").value;

  var catagory = document.getElementById("selectCatToAddSubCat").value;
  if (catagory == "")
    addSubCatErr.innerText = "Please Select One Catagory First  ";
  else {
    if (subcat == "") addSubCatErr.innerText = "velachil  Edukalledey ...";
    else {
      previewOfSubCat.style.display = "block";

      if (subCatArray.includes(subcat))
        swal.fire("Please Check", "Sub Catagory **  " + subcat + "  **  is already");
      else {
        subCatArray.push(subcat);

        var a = document.createElement("a");
        a.innerText = subcat;
        previewOfSubCat.appendChild(a);
        subcat = "";
        document.getElementById("sub-cat").value = "";
      }
    }
  }
}

function insertSubCat() {
  var subcat = document.getElementById("sub-cat").value;
  var catagory = document.getElementById("selectCatToAddSubCat").value;
  if (catagory == "") {
    addSubCatErr.innerText = "Please Select One Catagory First ";
    return;
  } else {
    if (subCatArray.length <= 0) {
      addSubCatErr.innerText = "";
      swal.fire("Error ", "please Enter Atleast One SubCatagory");
    } else {
      addSubCatErr.innerText = "";
      var subMitData = {
        catagory: catagory,
        subCatagory: subCatArray.toString(),
      };
      $.ajax({
        url: "/admin/catagory/addSubCat",
        data: subMitData,
        method: "post",
        success: (result) => {
          if (result.status == true) {

		  	  for(var i =0 ;i< subCatArray.length ;i++){

      
      
          var innerCode = `<tr class="tr" id="tableRow${subCatArray[i]}">
            <td>
            <span id="name${subCatArray[i]}">${subCatArray[i]}</span>
            <input  type="text" name="" id="input${subCatArray[i]}" class="form-control hide" value="${subCatArray[i]}" >
          </td>
          <td><i   onclick="deleteSubCatagory('${subCatArray[i]}')"  class="text-danger  fas fa-trash table-icon" id="dlt${subCatArray[i]}"></i>
          <i   onclick="showSubCatEdit('${subCatArray[i]}')"   class="text-success  fas fa-pen-fancy table-icon" id="editItem${subCatArray[i]}"></i>

          <i   onclick="editConfirm('${subCatArray[i]}' , '${catagory}')"   class="fas fa-check hide  table-icon"  id="confirm${subCatArray[i]}"></i>
          <i   onclick="cancelEdit('${subCatArray[i]}')"  class="far fa-window-close hide table-icon" id="cancel${subCatArray[i]}"></i>

          <i onclick="showOfferForm('${subCatArray[i]}' , '${catagory}') "  id="offer${subCatArray[i]}' , '${catagory}" style="margin-left: 20%; color: yellow;" class="fas fa-tags"></i>

            </td>
              </tr>`

              document.getElementById(catagory).innerHTML += innerCode;
        } 

			




            subCatArray.pop();
            document.getElementById("previewOfSubCat").style.display = "none";

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: "success",
              title: "Catagories Added SucessFully",
            });
          }
        },
      });
    }
  }
}

function addCatagory() {
  var cat = document.getElementById("addCatInput").value;
  if (cat != "") {
    document.getElementById("id01").style.display = "block";
    $.ajax({
      url: "/admin/catagory/addCatagory",
      data: {
        catagory: cat,
      },
      method: "post",
      success: (result) => {
        document.getElementById("id01").style.display = "none";
        document.getElementById("addCatInput").value = "";
        if (result.status == true) {

		var innerTabel= `<tbody id="${cat}" class="hide  common" >   </tbody>   ` 
		document.getElementById('table').innerHTML += innerTabel


          swal.fire({
            title: "job Done !",
            text: "Catagory Added Sucessfully",
            icon: "success",
            button: "oh Ya !",
          });
          var eidtCatSelect = document.getElementById("mainCata");
          var select = document.getElementById("selectCatToAddSubCat");
          var option = document.createElement("option");
          var option2 = document.createElement("option");
          option.innerText = cat;
          option2.innerText = cat;
          eidtCatSelect.appendChild(option);
          select.appendChild(option2);
        } else {
          swal.fire("Sorry ", result.status);
        }
      },
    });
  } else {
    catagoryError.innerText = "Please Eneter The Catagory  Name first";
  }
}

function cleareCatError() {
  catagoryError.innerText = "";
}

function insertIntoEdit() {
  if (document.getElementById("mainCata").value == "") {
    hideForm();
  }
  document.getElementById("form").value =
    document.getElementById("mainCata").value;
}

function clearError() {
  err.innerText = "";
}

function showEditForm() {
  if (document.getElementById("mainCata").value != "") {
    document.getElementById("edit-form").style.display = "block";
  } else {
    err.innerText = "Please Select One Catagory";
    document.getElementById("edit-form").style.display = "none";
  }
}

function hideForm() {
  document.getElementById("form").value = "";
  document.getElementById("edit-form").style.display = "none";
}

function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = "#061f4f";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

function editCatagory(cata) {

  var altCat = document.getElementById("form").value;
  var orgCat = document.getElementById("mainCata").value;
  if (altCat == "") {
    swal.fire("Eroor", "please Enter the New Name Of Catagory " + orgCat);
  } else {
    if (altCat == orgCat) {
      swal.fire("Sorry ", " you didnt Make any Changes ");
    } else {
	document.getElementById('id01').style.display = 'block'

      var data = {
        oldCatagory: orgCat,
        newCatgory: altCat,
      };

      $.ajax({
        url: "/admin/catagory/editCatagory",
        data: data,
        method: "post",
        success: (result) => {
		document.getElementById('id01').style.display = 'none'
          if (result.status == true) {
            Swal.fire(
              "Job done",
              "Catagory Added successfully ",
              "success"
            ).then(() => {
              location.reload();
            });
          } else {
            Swal.fire("Sorry ", result.status, "error");
          }
        },
      });
    }
  }
}

function deleteCatgory() {
  var catagory = document.getElementById("mainCata").value;
  if (catagory == "") {
    Swal.fire("please Select One Catagory ");
    return;
  } else {
	// document.getElementById('id01').style.display = 'block'

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "you want to Delete catagory " + catagory,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            url: "/admin/catagory/deleteCatagory",
            data: {
              catagory: catagory,
            },
            method: "post",
            success: (result) => {
			document.getElementById('id01').style.display = 'none'
              if (result.status == true) {
                Swal.fire(
                  " Deleted",
                  "Catagory " + catagory + " deleted Sucessfully",
                  "success"
                ).then(() => {
                  location.reload();
                });
              } else {
                swalWithBootstrapButtons
                  .fire("Error", result.status, "error")
                  .then(() => {
                    location.reload();
                  });
              }
            },
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "The Catagories are safe",
            "error"
          );
        }
      });
  }
}

function getSubCatagoryToTable() {
	var catagory = document.getElementById("mainCata").value;

	document.getElementById("overCata").innerHTML = catagory;


	var otherSubs = document.getElementsByClassName('common');
	for(var i =0 ;i<otherSubs.length;i++){
		otherSubs[i].classList.add("hide")
	}



  var result = document.getElementById(catagory);
  result.classList.remove("hide");
}

var onEditAtATime = true;

function showSubCatEdit(id){
	if(onEditAtATime){
		onEditAtATime = false;
	var tableName = document.getElementById("name"+id);
	var tabelInput = document.getElementById("input"+id);

	var dlt = document.getElementById("dlt"+id);
	var edit = document.getElementById("editItem"+id);

	var confirm = document.getElementById("confirm"+id);
	var cancel = document.getElementById("cancel"+id);
	
	tableName.classList.add("hide")
	tabelInput.classList.remove('hide')

	edit.classList.add('hide')
	dlt.classList.add('hide')
  document.getElementById("offer"+id).classList.add('hide')

	confirm.classList.remove('hide')
	cancel.classList.remove("hide");

	}else{
		swal.fire("Warrning ", "You Have to Close the Currnet Editing First ");
		return ;
	}

}

function clearSubCatInsert (){
    document.getElementById("previewOfSubCat").style.display= "none"
    document.getElementById("selectCatToAddSubCat").value = ""
    document.getElementById('sub-cat').value = ""
    subCatArray.pop();
}




function cancelEdit(id){
  document.getElementById("offer"+id).classList.remove('hide')

	document.getElementById("dlt"+id).classList.remove("hide")
	document.getElementById("editItem"+id).classList.remove("hide");

	 document.getElementById("confirm"+id).classList.add("hide")
	 document.getElementById("cancel"+id).classList.add('hide');



	var oldSubCat = document.getElementById("name"+id).classList.remove('hide');
	var newSubCat = document.getElementById("input"+id).classList.add('hide');

						onEditAtATime = true
}

function editConfirm(id , catagory){
  document.getElementById("offer"+id).classList.remove('hide')

	var dlt = document.getElementById("dlt"+id);
	var edit = document.getElementById("editItem"+id);

	var confirm = document.getElementById("confirm"+id);
	var cancel = document.getElementById("cancel"+id);



	var oldSubCat = document.getElementById("name"+id).innerHTML;
	var newSubCat = document.getElementById("input"+id).value;


	if(newSubCat == ""){swal.fire("Error" , "You have to write a new CAtagory name ")  ; return ;}
	else{
		if(oldSubCat == newSubCat ){
			swal.fire("Seriously .." ,"You Didnt Make any Canages ") ;
			 return ;
		}
		else{
			document.getElementById("id01").style.display = "block";
			$.ajax({
				url: "/admin/catagory/editSubCat",
				data:{oldSubCat : oldSubCat ,   newSubCat : newSubCat   , catagory:catagory},
				method:"post",
				success : (result)=>{
						var allCatBtn = document.getElementById("allCatManageBtn")
						var addCatBtn = document.getElementById("addCatBtn");

					


  					  document.getElementById("id01").style.display = "none";
					if(result.status == true){
						document.getElementById("input"+id).value =  document.getElementById("input"+id).value;
						document.getElementById("name"+id).innerHTML=  document.getElementById("input"+id).value;

						confirm.classList.add('hide')
						cancel.classList.add("hide");

						edit.classList.remove('hide')
						dlt.classList.remove('hide')

						var newSubCat = document.getElementById("input"+id).classList.add('hide');
						var newSubCat = document.getElementById("name"+id).classList.remove('hide');
						
						onEditAtATime = true

						Swal.fire(
							'Success',
							 oldSubCat  + "  change to " +  newSubCat,
							'success'
						   )
					}else{
						Swal.fire(
							'Eroor',
							 result.status,
							'error'
						   )
					}
				}
			})
		}
	}
}


function deleteSubCatagory(id){
	var subCat = document.getElementById('name'+id).innerHTML
	var mainCat = document.getElementById('mainCata').value

	Swal.fire({
		title: 'Are you sure?',
		text: "Do you Want to Delete sub-Catagory  " +subCat,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	   }).then((result) => {
		if (result.isConfirmed) {
		  $.ajax({
			url:"/admin/catagory/deleteSubCatagory",
			data:{catagory:mainCat , subCatagory: subCat},
			method:'post',
			success:(data)=>{
			   if(data.status == true){
           document.getElementById("tableRow"+subCat).style.display = "none";
          Swal.fire(
            'Deleted!',
            'Sub-Catagory ' + subCat + ' is Deleted',
            'success'
             )
         }else{
          Swal.fire(
            'Error !',
            data.status,
            'error'
             )
         }
			}
		  })
		}
	   })
}