"use strict"


var url = 'https://poraeh-pay.herokuapp.com';
var authKey = JSON.parse(localStorage.getItem('authKey')).userApi.trim() || {userApi:'not available'};

var registration = {
	getPhone : ()=>{
		
		return document.getElementById('phone').value;
	},
	getEmail : ()=>{
		
		return document.getElementById('email').value;
	},
	getUserName : ()=>{
		
		return document.getElementById('username').value;
	},
	getPassword : ()=>{

		return document.getElementById('password').value;
	},
	tncAccepted : ()=>{

		return document.getElementById('checkbox').checked;
	},
	init:()=>{

		var email = registration.getEmail().trim() || false;
		var phone = registration.getPhone().trim() || false;
		var username = registration.getUserName().trim() || false;
		var password = registration.getPassword().trim() || false;


		if (!email || !username || !password || !phone || !registration.tncAccepted()) {
			alert('ENSURE YOU FILL IN ALL FIELDS!!')
		}else{
			registration.signUp(phone,email,username,password);
		}

 	},
 	signUp : (phone,email,username,password)=>{
	
		var the_url = `${url}/users/create`;///${username}/${email}/${password}`;

		fetch(the_url,{
			method:'POST',
			headers : new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}),
			body:JSON.stringify({
				username:username,
				email:email,
				phone:phone,
				password:password
			})
		})
		.then(function(res){

			return res.json();
		
		})
		.then(function(data){

			if (data.success == true) {
				window.location.href = 'page-login.html';
				console.log(data);
			alert(`Welcome back ${data.user_name}`);
			}
			
		})
		.catch((err)=>{
			console.log(err);
		})
	}

}




var login = {

	getEmail : ()=>{
		
		return document.getElementById('email').value;
	},
	getPassword : ()=>{

		return document.getElementById('password').value;
	},
	init : ()=>{

		var email = registration.getEmail().trim() || false;
		var password = registration.getPassword().trim() || false;


		if (!email || !password ) {
			alert('ENSURE YOU FILL IN ALL FIELDS!!')
		}else{
			login.signInUser(email,password);
		}
	},
	signInUser : (email,password)=>{
	
		var the_url = `${url}/users/login`;

		fetch(the_url,{
			method:'POST',
			headers : new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}),
			body:JSON.stringify({
				email:email,
				password:password
			})
		})
		.then(function(res){

			return res.json();
		
			console.log(res.headers);
		
		})
		.then(function(data){


			console.log(data.headers);
			
			if (data.success == true) {

				localStorage.setItem('authKey',JSON.stringify(data));

				window.location.href = '../';
				console.log(data);
				alert(`Welcome back ${data.username}`);
			}else{

				console.log(`ERROR HAPPENED`);
				console.log(data);

			}
			
		})
		.catch((err)=>{
			console.log(err);
		})
	}

}


var loadDashBoard = {

	amountInAcc : ()=>{

	},
	transactionsMadeSoFar : ()=>{

	},
	transactionHistory : ()=>{

	},
	signedInDevices : ()=>{

	},
	myUserProfile : ()=>{

	}
}


var sendMoney = {

	openModal : (open)=>{

		var modal = $('#sendMoneyModal');

		if (open) {
			modal.addClass('show');
		}else{
			modal.removeClass('show');
		}
	},
	expectedRecipient:(email)=>{
		var the_url = `${url}/users/profile/public`;
		fetch(the_url,{
			method:'POST',
			headers : new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}),
			body:JSON.stringify({
				email:email,
				authKey:JSON.parse(localStorage.getItem('authKey')).userApi
			})
		})
		.then((res)=>{
			console.log(res);
			return res.json();
		})
		.then((data)=>{
			if (data.success == true) {
				console.log(`SUCCESSFULLY GOT USER \n ${JSON.stringify(data)}` )

					$('#recipientInfo_username').text(data.user_name);
					$('#recipientInfo_email').text(data.email);
					$('#recipientInfo_phone').text(data.phone);
					$('#NoteOnRecipient').html(`
						This recipient will recieve money via this email [${email}] .<br>
						If money is not withdrawn within 72hours - It will be refunded back to you`);
				

			}else{
				console.log(data);

					$('#recipientInfo_username').text('Not Found');
					$('#recipientInfo_email').text('Not Found');
					$('#recipientInfo_phone').text('Not Found');
					$('#NoteOnRecipient').html(`
						This user has not registered with us but will recieve money via this email [${email}] .<br>
						If money is not withdrawn within 72hours - It will be refunded back to you`);
			}
		})
		.catch((err)=>{
			console.log(err);
		})
	},
	loadQRCode : (transactionInfo)=>{


		var the_url = `${url}/transact/send/loadqrcode`;

		fetch(the_url,
		{
			method:'POST',
			headers:new Headers({
				'Accept':'application/json',
				'Content-Type':'application/json'
			}),
			body:JSON.stringify(transactionInfo)

		})
		.then((res)=>{
			return res.json();
		})
		.then((data)=>{
			if (data.success == true) {
				console.log(`IMAGE DATA URL \n ${JSON.stringify(data)}`);
				$('#qrcodeSlot')[0].src = data.qrcode;
			}else{
				navigation.loginPage();
				console.log(data);
			}
		})
		.catch((err)=>{
			console.log(err);
		})
	},
	getEmail : ()=>{

		return document.getElementById('sendMoney_email').value.trim();
	},
	getPassword : ()=>{

		return document.getElementById('sendMoney_onetimepin').value.trim();
	},
	getAmount : ()=>{

		return document.getElementById('sendMoney_amount').value.trim();
	},
	getNote : ()=>{

		return document.getElementById('sendMoney_notearea').value.trim();
	},
	init:()=>{

		var recipient = sendMoney.getEmail().trim() || false;
		var password = sendMoney.getPassword().trim() || false;
		var amount = sendMoney.getAmount().trim() || false;
		var note = sendMoney.getNote().trim() || false;


		if (!recipient || !password || !amount) {
			alert('ENSURE YOU FILL IN ALL FIELDS!!')
		}else{
			var transactionInfo = {
				authKey:authKey,
				amountToSend:amount,
				recipient:recipient,
				note:note,
				password:password
			}
			sendMoney.expectedRecipient(recipient);	

			sendMoney.loadQRCode(transactionInfo);

		}


	}


}

const navigation = {
	loginPage : ()=>{

		window.location.href = '../page-login.html';
	},
	signUpPage : ()=>{

		window.location.href = '../page-register.html';
	},
	dashboardPage:()=>{
		window.location.href = '../././';
	}
}
/*
*TRIGGERS
*/

//Sign up button clicked
$('#signUpbtn').click((e)=>{
	e.preventDefault();
	registration.init();

})



//login button clicked
$('#signInBtn').click((e)=>{
	e.preventDefault();
	login.init();

})

//send money modal has been opened
$('.sendMoneyLink').click((e)=>{
	e.preventDefault();
    sendMoney.openModal(true)
    //sendMoney.loadQRCode()
})


//listen blur of expected recipient
$('#confirmRecipientDetails').click((e)=>{

	e.preventDefault();

	var recipient = sendMoney.getEmail().trim() || false;

		if (!recipient) {
			alert('ENSURE YOU FILL IN THE RECIPIENT FIELD !!')
		}else{
			sendMoney.expectedRecipient(recipient);	
		}

})

$('#sendMoneyNow').click((e)=>{
	e.preventDefault();
	sendMoney.init();	
})
