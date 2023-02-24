function requestRites(){
  // DEBUG setting
  var debug = true
  
  // Set the list of selected rites
  var requestedRites = []

  // Set the list of people to email
  var teacherEmail = []

  // Set list of Teachers
  var teachers = []

  // Get the sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // get the used rows
  var sheet_length = sheet.getLastRow();
  
  // build a list of rites requested
  for (let rows=4; rows <= sheet_length; rows++){
    var cb = sheet.getRange(rows, 10).getValue();
    if (cb == true){
      requestedRites.push([sheet.getRange(rows, 1).getValue(),sheet.getRange(rows, 2).getValue(),sheet.getRange(rows, 3).getValue()]);
      teacherEmail.push(sheet.getRange(rows,6).getValue());
      teachers.push(sheet.getRange(rows, 4).getValue());
    }
    
  }
  
  // Get the character name that's requesting
  var character = sheet.getRange("C1").getValue();
  
  // Get character rank
  var characterRank = sheet.getRange("E1").getValue();
  
  // Create the email details
  var emailTo = [...new Set(teacherEmail.join(", ").split(", "))]
  var teachers = [...new Set(teachers.join(", ").split(", "))]
  var emailFrom = Session.getActiveUser().getEmail();
  var subject = `${character} is requesting rites.`
  var body = `Greetings ${teachers},\n${character} would like to learn the following rites from you:\n\t`
  for (rite in requestedRites){
    if (requestedRites[rite][0] == "Minor"){
      body=body + requestedRites[rite][1]+": "+requestedRites[rite][2] + "\n\t";
    }
    else{
      body=body + requestedRites[rite][0]+": " + requestedRites[rite][1]+": "+requestedRites[rite][2] + "\n\t";
    }
  }
  body = body + `\nIf you agree to teaching the above mentioned Rites to the ${characterRank} ${character} please reply to this email stating your approval. Lack of response will be considered a denial of teaching.\n\nThank you,\n-The Management`
  
  // Compile the email deets
  var message = {
    to: `${emailTo}`,
    subject: `${subject}`,
    body: `${body}`,
    cc: `${emailFrom}`,
    // bcc: "bcc@example.com",
    name: `${character}`
  }
  
  if (debug){
    // Send an alert the the mail has been sent
    SpreadsheetApp.getUi().alert("===== DEBUG MODE IS ON, NO EMAIL SENT =====\n\nYour request for Rites instruction has been submitted, you may now close this sheet.");  
    SpreadsheetApp.getUi().alert(JSON.stringify(message));
  } else {
    SpreadsheetApp.getUi().alert("Your request for Rites instruction has been submitted, you may now close this sheet.");  
    // Send the email
    MailApp.sendEmail(message);
  }
 
  // Clear the check boxes
  for (let rows=4; rows <= sheet_length; rows++){
    cb = sheet.getRange(rows, 10);
    if (cb.getValue()){
      sheet.getRange(rows, 10).setValue(false);
    }
  }
  
  // Clear the character name
  sheet.getRange("C1").setValue("");
  // Reset the Rank
  sheet.getRange("E1").setValue("Cub");
}
