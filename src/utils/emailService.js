const nodemailer = require('nodemailer');
const config = require('config');
const logger = require('../utils/logger');
const gmail_email= "Email";
const gmail_password= "password";

const { domain } = config.get('frontEnd');

function doSend(email, subject, text, html_text) {
  logger.info(html_text);
  const msg = {
    to: email,
    from: gmail_email,
    subject: subject,
    text: text,
    html: html_text,
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmail_email,
      pass: gmail_password
    }
  });

  const mailOptions = {
    from: gmail_email,
    to: email,
    subject: subject,
    text: text,
    html: html_text
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  return Promise.resolve(true);
}

function sendNewUserEmail(fullName, email, password) {
  const html_text = `Hello ${fullName},`
  + '<br /><br /><b>You have signed up successfully!</b><br /><br />Please find your login credentials below: <br /><br /><b>Email: </b>' + email + '<br /><b>Password: </b><span style="color:blue;">' + password + "</span></b>"
  + '<br /><br /><br />Thank you,'
  + '<br />Support team.';

  const subject = 'Login Credentials';
  const text = 'Login Credentials';

  return doSend(email, subject, text, html_text);
}

function sendChangeUserPasswordEmail(user) {
  const html_text = `Hello ${user[0].first_name} ${user[0].last_name},`
  + '<br /><br /><b>Your account password has been updated successfully!</b>'
  + '<br /><br /><br />Thank you,'
  + '<br />Support team.';

  const subject = 'Account Password Update';
  const text = 'Account Password Update';

  return doSend(user[0].email, subject, text, html_text);
}

function sendResetUserPasswordEmail(user, password) {
  const html_text = `Hello ${user.first_name} ${user.last_name},`
  + '<br /><br /><b>We have received password reset request. </b>'
  + '<br /><br /><br />Please find your new login credentials below: <br /><br /><b>Email: </b>' + user.email + '<br /><b>Password: </b><span style="color:blue;">' + password + '</span></b>'
  + '<br /><br />If it wasn\'t you, take no action or contact support.'
  + '<br /><br /><br />Thank you,'
  + '<br />Support team.';

  const subject = 'Account Password Reset Request';
  const text = 'Account Password Reset Request';
  
  return doSend(user.email, subject, text, html_text);
}

function sendVerifyUserEmail(fullName, email, user_token) {
  const html_text ='Hello '+ fullName +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:3001\/api\/auth\/confirmation\/' + email + '\/' + user_token + '\n\nThank You!\n';
  const subject = 'Spreadbliss Account Verification';
  const text = 'Spreadbliss Account Verification';

  return doSend(email, subject, text, html_text);
}

module.exports = {
  sendNewUserEmail,
  sendChangeUserPasswordEmail,
  sendResetUserPasswordEmail,
  sendVerifyUserEmail
};
