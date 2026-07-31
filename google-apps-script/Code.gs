/**
 * Google Apps Script backend for the portfolio contact form.
 *
 * SETUP:
 * 1. Create a new Google Sheet. Add a header row: Timestamp | Name | Email | Message
 * 2. In the Sheet, go to Extensions > Apps Script.
 * 3. Delete any starter code and paste this file's contents in.
 * 4. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, authorize the script, and copy the generated Web app URL.
 * 6. Paste that URL into GOOGLE_SCRIPT_URL in js/main.js.
 *
 * Optional: set NOTIFY_EMAIL below to also get an email for every submission.
 */

const NOTIFY_EMAIL = ""; // e.g. "you@example.com" — leave blank to skip email alerts

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    const name = (data.name || "").toString().slice(0, 200);
    const email = (data.email || "").toString().slice(0, 200);
    const message = (data.message || "").toString().slice(0, 5000);
    const submittedAt = data.submittedAt || new Date().toISOString();

    sheet.appendRow([submittedAt, name, email, message]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New portfolio contact form message from " + name,
        body: "Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message,
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
