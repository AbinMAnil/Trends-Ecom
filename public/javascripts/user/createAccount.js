var interevel;
var checker = 4;
var timerChecker = true;


function submitOtp() {
    if (checker > 0 && timerChecker) {
        checker--;
        document.getElementById("limitIndicator").innerHTML = checker;
        var phone = document.getElementById('phone').value
        var otp = document.getElementById("otp").value;
        if (otp.length == 6) {
            document.getElementById('id01').style.display = 'block'
            var showItems = document.getElementsByClassName("hideBeforeOtp");
            var hideButton = document.getElementsByClassName('hideButton');
            $.ajax({
                url: "/otp",
                data: {
                    otp: otp,
                    phone: phone
                },
                method: "post",
                success: (result) => {
                    document.getElementById('id01').style.display = 'none'
                    if (result.status === true) {

                        var phone = document.getElementById("phone")
                        phone.disabled = false;
                        phone.style.display = "none";
                        phone.value = result.phone;
                        document.getElementById("createAccountHide").style.display = "none";
                        document.getElementById("otpField").style.display = "none";
                        document.getElementById('err').innerHTML = ""
                        clearInterval(interevel);
                        for (var i = 0; i < showItems.length; i++) {
                            showItems[i].style.display = "block";
                        }
                        for (var i = 0; i < hideButton.length; i++) {
                            hideButton[i].style.display = 'none  ';
                        }

                    }
                    else {

                        document.getElementById("err").innerHTML = result.status;
                    }
                }
            })
        }
        else {
            document.getElementById("err").innerHTML = "otp requres 6 numbers";
        }
    }
    else {
        clearInterval(interevel);
        swal("Sorry !", "Try again ", "error").then(() => {
            location.reload();
        })

    }

}

// to send the number and check the user is approprieat ;
function numberSubmit() {

    var phone = (document.getElementById('phone').value)

    if (phone.length == 10) {
        document.getElementById('id01').style.display = 'block'
        $.ajax({
            url: "/isValidPhone",
            data: {
                phone: phone
            },
            method: "post",
            success: (result) => {
                document.getElementById('id01').style.display = 'none'
                if (result.status === true) {
                    document.getElementById('id01').style.display = 'none'
                    document.getElementById("goBack").style.display = "block"
                    document.getElementById("chanceIndicator").style.display = "block"
                    document.getElementById("phone").disabled = true
                    document.getElementById("showOtpSubmitButton").style.display = "block";
                    document.getElementById("timer").style.display = "block";
                    document.getElementById("continueButton").style.display = "none"
                    document.getElementsByClassName("otpField")[0].style.display = "block";
                    document.getElementById("err").innerHTML = ""
                    startTimer();
                }
                else {
                    document.getElementById("err").innerHTML = result.status
                }

            }

        })
    }
    else {
        document.getElementById("err").innerHTML = "The Phone Number requres atleast 10 numbers"
    }
}


// functon to stop timer
function stopTimer() {
    clearInterval(interevel);
    swal("Sorry !", "Try again ", "error").then(() => {
        location.reload();
    })
    timerChecker = false;
}
// function to start timer;
function startTimer() {
    var timer = document.getElementById("timer");
    var minute = 2;
    var second = 30;

    interevel = setInterval(() => {
        second--;
        if (second == 0) {
            minute--;
            second = 60;
            if (minute == 0) {
                second = "00";
                minute = "00";
                stopTimer();
            }
        }
        timer.innerHTML = "0" + minute + ":" + second;
    }, 1000);
}

// function to check the user is exists  or not .then()=>{do signup}
function Check(me) {
    me.value = me.value.replace(/[0-9]/g, "");
}

function submitData() {

    var err = document.getElementById("err")

    var form = $('#createUserForm').serialize()
    var validate = document.getElementsByClassName("form");
    var check = false;
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if (validate[0].value.length < 2) {
        check = false;
        err.innerText = "Name Field need atleast 2 characters "
        return
    }
    else {
        check = true;
        err.innerText = ""
    }
    if (validate[1].value.match(pattern) === null) {
        check = false
        err.innerText = "Check  your Email "
        return
    }
    else {
        check = true
        err.innerText = "";
    }
    if (validate[2].value.length < 10) {
        check = false;
        err.innerText = "The Phone number field requires 10 number"
        return;
    }
    else {
        check = true;
        err.innerText = "";
    }
    if (validate[3].value.length < 6) {
        check = false
        err.innerText = "Password  need 6 letter atleast";
        return;
    }
    else {
        check = true;
        err.innerText = "";
    }

    if (check) {
        $.ajax({
            url: "/createAccountPost",
            data: form,
            method: "post",
            success: (reuslt) => {
                if (reuslt.status == true) {
                    location.href = "/";
                }
                else {
                    err.innerHTML = reuslt.status;
                }
            }

        })
    }


}