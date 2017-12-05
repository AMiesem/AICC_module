/* ------------ PER-COURSE CONSTANTS --------------------------------------- */
const FIRSTPAGE = 'module_01.html';

var courseWindow;
/* setup AICC object */

var aicc = new AICC();

aicc.timeStart();

/* set up appropriate submission form */
aicc.addForm('.aicc-form');

function reqCredit() {
  aicc.timeStop();
  aicc.command('PutParam','P');
  setTimeout("aicc.command('ExitAU');",1500);
  setTimeout("window.close();",2000);
}
