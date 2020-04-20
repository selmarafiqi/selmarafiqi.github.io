<?php
/*------------------------------------------------------------------
Directory:
	/php/configPrivate.php

File Description:
	Basic settings for PHPMailer contact form.

Notes:
    This file may contain private information. Do not share this
    file if it contains your email address, password, and other
    private information. Visit Luminal Documentation for instructions
	on how to properly set up the contact form.
-------------------------------------------------------------------*/

$mail->isSMTP();
$mail->SMTPSecure = 'tls';
$mail->Port = 587;
$mail->SMTPDebug = 0;
$mail->SMTPAuth = true;
$mail->isHTML(false);
$mail->SetLanguage("en", "../phpmailer/language/"); // Language

$mail->Host = 'smtp.outlook.com'; // The smtp host of your email provider.
$mail->Username = 'selma.rafiqi@outlook.com'; // The username of the email account that will receive the email messages. Most likely an email address.
$mail->Password = '12311Sat!'; // The password of the email account that will receive the email messages.
$sendTo = 'selma.rafiqi@outlook.com'; // The email address that will receive the email messages. Must correspond with the email account used to login.
$sendToName = 'Selma Rafiqi'; // Name of the person that will receive the email messages.​​​​​​​

$input1_label = 'NAME:'; // NAME:
$input2_label = 'EMAIL ADDRESS:'; // EMAIL ADDRESS:
$input3_label = 'SUBJECT:'; // SUBJECT:
$fallbackSubject = 'New Email From:'; // NEW EMAIL FROM:

$notice_msg_sent = 'Message Sent'; // Message Sent
$err_msg_required_inputs = 'One or more required fields are empty.'; // One or more required fields are empty.
$err_msg_upload_limit = 'Cannot send message. Attachment is too large.'; // Cannot send message. Attachment is too large.
$err_msg_include_attachments = 'Failed to include attachments. Please try again.'; // Failed to include attachments. Please try again.

?>
