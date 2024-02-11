// const RC = require('@ringcentral/sdk').SDK


// // Instantiate the SDK and get the platform instance
// var rcsdk = new RC({
//     'server':       SERVER_URL,
//     'clientId':     CLIENT_ID,
//     'clientSecret': CLIENT_SECRET
// });
// var platform = rcsdk.platform();

// /* Authenticate a user using a personal JWT token */
// platform.login({ 'jwt': JWT_TOKEN })

// platform.on(platform.events.loginSuccess, function(e){
//     read_extension_phone_number_detect_sms_feature()
// });

// platform.on(platform.events.loginError, function(e){
//     console.log("Unable to authenticate to platform. Check credentials.", e.message)
//     process.exit(1)
// });

// /*
//   Read phone number(s) that belongs to the authenticated user and detect if a phone number
//   has the SMS capability
// */
// async function read_extension_phone_number_detect_sms_feature(){
//     try {
//         let endpoint = "/restapi/v1.0/account/~/extension/~/phone-number"
//         var resp = await platform.get(endpoint)
//         var jsonObj = await resp.json()
//         for (var record of jsonObj.records){
//             for (feature of record.features){
//                 if (feature == "SmsSender"){
//                     // If a user has multiple phone numbers, check and decide which number
//                     // to be used for sending SMS message.
//                     return send_sms(record.phoneNumber)
//                 }
//             }
//         }
//         if (jsonObj.records.length == 0)
//           console.log("This user does not own a phone number!")
//         else
//           console.log("None of this user's phone number(s) has the SMS capability!")
//     } catch(e) {
//         console.log(e.message)
//         process.exit(1)
//     }
// }

// /*
//  Send a text message from a user own phone number to a recipient number
// */
// async function send_sms(fromNumber){
//     try {
//         let bodyParams = {
//             from: {'phoneNumber': fromNumber},
//             to: [{'phoneNumber': RECIPIENT_NUMBER}],
//             text: TEXT_MESSAGE
//         }
//         let endpoint = "/restapi/v1.0/account/~/extension/~/sms"
//         var resp = await platform.post(endpoint, bodyParams)
//         var jsonObj = await resp.json()
//         console.log("SMS sent. Message id: " + jsonObj.id)
//         check_message_status(jsonObj.id);
//     } catch(e) {
//         console.log(e.message)
//         process.exit(1)
//     }
// }

// /*
//  Check the sending message status until it's out of the queued status
// */
// async function check_message_status(messageId){
//     try {
//         let endpoint = `/restapi/v1.0/account/~/extension/~/message-store/${messageId}`
//         let resp = await platform.get(endpoint);
//         let jsonObj = await resp.json()
//         console.log("Message status: ", jsonObj.messageStatus)
//         if (jsonObj.messageStatus == "Queued"){
//           await sleep (5000);
//           check_message_status(jsonObj.id);
//         }
//     } catch (e) {
//       console.log(e.message)
//       process.exit(1)
//     }
// }

// const sleep = async (ms) => {
//   await new Promise(r => setTimeout(r, ms));
// }
