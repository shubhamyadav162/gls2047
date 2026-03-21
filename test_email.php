<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {
    // SMTP Settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'invitation@glsvision2047.com';
    $mail->Password   = 'Avanger@16143777';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Recipients
    $mail->setFrom('invitation@glsvision2047.com', 'GLS Vision 2047 - Test');
    $mail->addAddress('shubham.1614@gmail.com');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'SMTP Test: GLS Vision 2047 System';
    $mail->Body    = "
        <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
            <h2 style='color: #002D62;'>SMTP Setup Successful!</h2>
            <p>Hi Shubham,</p>
            <p>This is a demo email to confirm that your official email system for <strong>Global Leadership Summit Vision 2047</strong> is now working perfectly.</p>
            <p><strong>Configured Email:</strong> invitation@glsvision2047.com</p>
            <p><strong>Status:</strong> Live and Active</p>
            <br>
            <p>Best Regards,<br>GLS Vision 2047 GLS Team</p>
        </div>
    ";

    $mail->send();
    echo "SUCCESS: Email has been sent to shubham.1614@gmail.com";
} catch (Exception $e) {
    echo "ERROR: Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>
