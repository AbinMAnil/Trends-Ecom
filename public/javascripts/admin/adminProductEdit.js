

         var imageArray1 = [];
         var colorArray = [];
         var sizeArray = [];

         $('document').ready(function() {
         //modal1 and image 1
             var image1 = document.getElementById('sampleImage1');
             var modal1 = $('#modal1');
             var cropper1;
         
             $('#image1').change(function (event) {
                 var files = event.target.files;
         
                 var done = function (url) {
                     
                     image1.src = url;
                     modal1.modal('show');
                 };
         
                 if (files && files.length > 0) {
                     reader = new FileReader();
                     reader.onload = function (event) {
                         done(reader.result);
                     };
                     reader.readAsDataURL(files[0]);
                 }
             });
         
             modal1.on('shown.bs.modal', function () {
                 cropper1 = new Cropper(image1, {
                     aspectRatio: 3/4,
                     viewMode: 1,
                     preview: '#preview1'
                 });
             }).on('hidden.bs.modal', function () {
                 cropper1.destroy();
                 cropper1 = null;
             });
         
             $('#crop1').click(function () {
                 canvas = cropper1.getCroppedCanvas({
                     width: 800,
                     height: 900
                 });
         
                 canvas.toBlob(function (blob) {
                     url = URL.createObjectURL(blob);
                     var reader = new FileReader();
                     reader.readAsDataURL(blob);
                     reader.onloadend = function () {
                         var base64data = reader.result;
                         modal1.modal('hide');
                         var currentId = document.getElementById('publicId1').value ;
                         
                         if(currentId != "") imageArray1 =  imageArray1.filter((iter => iter.publicId !== currentId));
         
                         // sending the image base64 to the backend to uplaod in coloudanry;
                         document.getElementById("imageSpinner1").style.display = "block";
                         $.ajax({
                         url: '/admin/products/uploadImage',
                         data: {base64 : base64data , productId : document.getElementById("publicId1").value},
                         method: "post",
                         success:(result)=>{
                             $('#chekPreview1').attr('src', base64data);
                             $("#imageValue1").val(result.status.url);  
                             document.getElementById('publicId1').value = result.status.publicId;
                             document.getElementById("imageSpinner1").style.display = "none";
         
                             var sampleObj = {
                                 publicId : result.status.publicId,
                                 imageUrl : result.status.url
                             }
                             imageArray1.unshift(sampleObj);
         
                             
                         }
                         })
         
                     
                        
                     };
                 });
             });
         
         
         
         //modal2 and image 2
         var image2 = document.getElementById('sampleImage2');
             var modal2 = $('#modal2');
             var cropper2;
         
             $('#image2').change(function (event) {
                 var files = event.target.files;// getting the files;
         
              // image preview happended here;
                 var done = function (url) {
                     image2.src = url;
                     modal2.modal('show');
                 };
         
                 if (files && files.length > 0) {
                     reader = new FileReader();
                     reader.onload = function (event) {
                         done(reader.result);
                     };
                     reader.readAsDataURL(files[0]);
                 }
             });
         
             modal2.on('shown.bs.modal', function () {
                 cropper2 = new Cropper(image2, {
                     aspectRatio: 1,
                     viewMode: 3,
                     preview: '#preview2'
                 });
             }).on('hidden.bs.modal', function () {
                 cropper2.destroy();
                 cropper2 = null;
             });
         
             $('#crop2').click(function () {
                 canvas = cropper2.getCroppedCanvas({
                     width: 400,
                     height: 400
                 });
         
                 canvas.toBlob(function (blob) {
                     url = URL.createObjectURL(blob);
                     var reader = new FileReader();
                     reader.readAsDataURL(blob);
                     reader.onloadend = function () {
                         var base64data = reader.result;
                         modal2.modal('hide');
                         var currentId = document.getElementById('publicId2').value ;
                         
                         if(currentId != "") imageArray1 =  imageArray1.filter((iter => iter.publicId !== currentId));
         
                          // sending the image base64 to the backend to uplaod in coloudanry;
                          document.getElementById("imageSpinner2").style.display = "block";
                         $.ajax({
                         url: '/admin/products/uploadImage',
                         data: {base64 : base64data , productId : document.getElementById("publicId2").value},
                         method: "post",
                         success:(result)=>{
                             $('#chekPreview2').attr('src', base64data);
                             $("#imageValue2").val(result.status.url);  
                             document.getElementById('publicId2').value = result.status.publicId;
                             document.getElementById("imageSpinner2").style.display = "none";
                             var sampleObj = {
                                 publicId : result.status.publicId,
                                 imageUrl : result.status.url
                             }
                             imageArray1.push(sampleObj);
         
                             
                         }
                         })
                     };
                 });
             });
         //image  3  and modal 3 end
         
         
         
         
         //modal3 and image 3
         var image3 = document.getElementById('sampleImage3');
             var modal3 = $('#modal3');
             var cropper3;
         
             $('#image3').change(function (event) {
                 var files = event.target.files;// getting the files;
         
              // image preview happended here;
                 var done = function (url) {
                     image3.src = url;
                     modal3.modal('show');
                 };
         
                 if (files && files.length > 0) {
                     reader = new FileReader();
                     reader.onload = function (event) {
                         done(reader.result);
                     };
                     reader.readAsDataURL(files[0]);
                 }
             });
         
             modal3.on('shown.bs.modal', function () {
                 cropper3 = new Cropper(image3, {
                     aspectRatio: 1,
                     viewMode: 3,
                     preview: '#preview3'
                 });
             }).on('hidden.bs.modal', function () {
                 cropper3.destroy();
                 cropper3 = null;
             });
         
             $('#crop3').click(function () {
                 canvas = cropper3.getCroppedCanvas({
                     width: 400,
                     height: 400
                 });
         
                 canvas.toBlob(function (blob) {
                     url = URL.createObjectURL(blob);
                     var reader = new FileReader();
                     reader.readAsDataURL(blob);
                     reader.onloadend = function () {
                         var base64data = reader.result;
                         modal3.modal('hide');
                         var currentId = document.getElementById('publicId3').value ;
                         
                         if(currentId != "") imageArray1 =  imageArray1.filter((iter => iter.publicId !== currentId));
         
                         // sending the image base64 to the backend to uplaod in coloudanry;
                         document.getElementById("imageSpinner3").style.display = "block";
                         $.ajax({
                         url: '/admin/products/uploadImage',
                         data: {base64 : base64data , productId : document.getElementById('publicId3').value},
                         method: "post",
                         success:(result)=>{
                             $('#chekPreview3').attr('src', base64data);
                             $("#imageValue3").val(result.status.url);  
                             document.getElementById('publicId3').value = result.status.publicId;
                             document.getElementById("imageSpinner3").style.display = "none";
         
                             var sampleObj = {
                                 publicId : result.status.publicId,
                                 imageUrl : result.status.url
                             }
                             imageArray1.push(sampleObj);
         
                             
                         }
                         })
                     };
                 });
             });
         //image 3 and modal 3  end  
         });
         
         function closeModal1(id){
              $('#modal'+id).modal('hide')
         
         }
         
          function addImg(id){
              // alert(document.getElementById('img'+id).value);
                  var oFReader = new FileReader();
                  oFReader.readAsDataURL(document.getElementById("img"+id).files[0]);
          
                  oFReader.onload = function (e){
                      document.getElementById("uploadPreview"+id).src = e.target.result;
                  }
          }
          //end of  image preview
          
          
          // get sub catagory with ajax call
          function getSub() {
          
            document.getElementById("subCatSel").innerText = ""
          
            var data = {
             catagory: document.getElementById("mainCat").value
            }
          
          
            if (data.catagory != "") {
             document.getElementById("loaderForSubCatagory").style.display = "block"
         
              $.ajax({
                url: '/admin/catagory/getSubs',
                data: data,
                method: "post",
                success: (data) => {
                 setTimeout(()=>{
                     var select = document.getElementById("subCatSel");
                     const demo = document.createElement('option');
                     demo.innerText = "";
                     select.appendChild(demo)
                  for (var i = 0; i < data.status.length; i++) {
                    const newOption = document.createElement('option');
                    newOption.innerText = data.status[i];
                    select.appendChild(newOption)
                  }
                 document.getElementById("loaderForSubCatagory").style.display = "none"
                 } , 500)        
                }
              })
            }
          }
         
          // end of the ajax get sub catagory

          // ------------------------------------------------------


    //     var objectId ;
    //     var varientLimit ;
    //     var varientArr = [];
    //  var varientErr = document.getElementById("varientErr");
     var productName = document.getElementById('productName');
     var brandName = document.getElementById('brandName');
     var catagory = document.getElementById('mainCat');
     var subCatagory = document.getElementById('subCatSel');
     var discription = document.getElementById("discription");
  





function editProudct(id){


     var productName = document.getElementById('productName');
     var brandName = document.getElementById('brandName');
     var catagory = document.getElementById('mainCat');
     var subCatagory = document.getElementById('subCatSel');
     var discription = document.getElementById("discription");

  
     $.ajax({
          url: '/admin/products/getProductById',
          data:{id:id},
          method:'post',
          success :(data)=>{


               objectId = data.porduct._id;
               productName.value = data.porduct.productName
               brandName.value = data.porduct.brand
               discription.value = data.porduct.discription;
               imageArray1  = data.porduct.image
            //    //{{ adding the cataogory  into options }}
               var demoSubCat = document.createElement("option");
               demoSubCat.innerHTML = data.porduct.subCatagory;
               subCatagory.appendChild(demoSubCat)
               
               var option = document.createElement("option");
                option.innerHTML = data.porduct.catagory ;
               catagory.appendChild(option);

            document.getElementById('productPrice').value = parseInt(data.porduct.price);
            document.getElementById('quanitity').value = parseInt(data.porduct.quantity);

               for(var i = 0 ;i<data.catagory.length;i++){
                    if(data.porduct.catagory != data.catagory[i].catagory){
                         var option = document.createElement("option");
                         option.innerHTML = data.catagory[i].catagory;
                          catagory.appendChild(option);
                    }
                    else{
                       for(var j =0 ;j<data.catagory[i].subCatagory.length ;j++){
                          if(data.catagory[i].subCatagory[j] != data.porduct.subCatagory )
                          var option2 = document.createElement("option");
                        //  option2.innerHTML =data.catagory[i].subCatagory[j]
                        //   subCatagory.appendChild(option2);
                       }
                    }
                   
               };

               // // {{ setting the image }}
               for(var i =0 ;i< data.porduct.image.length ; i++){
                    var x = i+1
                 document.getElementById("publicId"+x).value =data.porduct.image[i].publicId
                 document.getElementById("imageValue"+x).value =data.porduct.image[i].imageUrl;
                 document.getElementById("chekPreview"+x).src =data.porduct.image[i].imageUrl;
               };
               var sizePre2 = document.getElementById('sizePreview2')
               var colorpre2 = document.getElementById('funcPreColr')
               colorArray =  data.porduct.color;
               sizeArray = data.porduct.size

               for(var i = 0 ;i< colorArray.length ; i++){
                  
                   var setPreCol = ` <a id="">${colorArray[i]}</a>`
                    colorpre2.innerHTML += setPreCol
               }
               for(var i =0  ;i< sizeArray.length ; i++){
                
                   var setPreSize = `<a id="">${sizeArray[i]}</a>`
                   sizePre2.innerHTML += setPreSize;
               }

           
          
          }
     })

     document.getElementById('productEdit').style.display='block'

}

var err = document.getElementById('mainErr');

function clearMainErr(){
     err.innerHTML = ""
}



function addColorVarient(){
    var sizePre2 = document.getElementById('sizePreview2')
    var colorpre2 = document.getElementById('funcPreColr')
    var color = document.getElementById('ProductColor').value;
    var colorErr = document.getElementById('colorErr')
    colorErr.innerHTML = "";    
    if(color == ""){colorErr.innerHTML = "please Select A color" ; return ;};
    colorErr.innerHTML = "";    
    if(colorArray.includes(color)){colorErr.innerHTML = "please Select Another Color The Color is already exists " ; return ;}
    colorErr.innerHTML = "";   
    colorArray.push(color)

    var setPreCol = ` <a id="">${color}</a>`
                    colorpre2.innerHTML += setPreCol;

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
                        title: 'Color Added SuccessFully'
                      })
}



function addSizeVarient(){

    var sizePre2 = document.getElementById('sizePreview2')
    var color = document.getElementById('productSize').value;
    var colorErr = document.getElementById('sizeErr')
    colorErr.innerHTML = "";    
    if(color == ""){colorErr.innerHTML = "please Select A size" ; return ;};
    colorErr.innerHTML = "";    
    if(sizeArray.includes(color)){colorErr.innerHTML = "please Select Another size The Color is already exists " ; return ;}
    colorErr.innerHTML = "";   
    colorArray.push(color)

    var setPreCol = ` <a id="">${color}</a>`
    sizePre2.innerHTML += setPreCol;

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
                        title: 'New size  Added SuccessFully'
                      })

                      sizeArray.push(color);

}



// {{ end of the  prolist edit form }}

// {{ start of the submit form}};

     function submitEditForm(){




         var price = document.getElementById('productPrice').value;
         var quantity = document.getElementById('quanitity').value;
         if(price == "" || price == 0){err.innerHTML = "please Enter A valid price" ; return};
         if(quantity == "" || quantity == 0){err.innerHTML = "please Enter A valid price" ; return};
         
        
          if(productName.value == "" || brandName.value == "" || catagory.value == "" || subCatagory.value == "" || discription.value == ""){
               err.innerHTML = "please Fill all The fields "
               return;
          }
          // {{ validattion the size vaient }}
         
          var PackProduct = {
               productName : productName.value,
               brand : brandName.value,
               catagory : catagory.value,
               subCatagory : subCatagory.value,
               image : JSON.stringify(imageArray1),
               discription : discription.value,
               color : JSON.stringify(colorArray),
               size : JSON.stringify(sizeArray),
               price:parseInt(price),
               quantity : parseInt(quantity),
               id:objectId
     };

      //{{ updation to the dtabase}}

      $.ajax({
           url:'/admin/products/editProducts',
           data:PackProduct,
           method:"post",
           success:(result)=>{
                if(result.status == true){
               Swal.fire(
               'Success ',
               'Changer Are Applied SuccessFully',
               'success'
               ).then(()=>{
                    location.reload()
               })
                }else{
                Swal.fire(
               'Soory ',
               result.status,
               'error'
               ).then(()=>{
                    location.reload()
               })  
                }
           }
           
      })

          
     }


