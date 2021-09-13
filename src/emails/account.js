const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY= process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

const welcomeEmail = (email,name)=>{
    const welcomeMsg = {
        from : email,
        to : 'karupusamyks3@gmail.com',
        subject : 'Thanks for joining in!',
        text : `Welcome to the app, ${name}. Let me know how you get along with the app.`
    };
    sgMail.send(welcomeMsg).then((result)=>{
        console.log()
    }).catch((error)=>{
        console.log()
    });
}
    
const cancelEmail = (email,name)=>{
    const cancelmsg = {
        from : email,
        to : 'karupusamyks3@gmail.com',
        subject : 'Sorry to see you go!',
        text : `Good bye, ${name}. Let me know why you cancel your Task App account.`
    };
    sgMail.send(cancelmsg).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    });
}

module.exports = {welcomeEmail,cancelEmail};
  