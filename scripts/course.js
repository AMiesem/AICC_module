const FIRSTPAGE = 'module_01.html';

var courseWindow;

class ButtonHandler {
    constructor() {
      this.buttons = {};
    }

    /**
     * @param {string} id
     * @param {string} target
     */
    addButton(id,target,disabled=false) {
      var elm = document.querySelector(target);
      this.buttons[id] = elm;
      this.buttons[id].disabled = disabled;
    }

    /**
     * @param {string} button
     **/
    disableButton(button) {
      this.buttons[button].disabled = true;
    }

    /**
     * @param {string} button
     **/
    enableButton(button) {
      this.buttons[button].disabled = false;
    }

    /**
     * @param {string} button
     * @param {string} message
     **/
    changeText(button, message) {
      this.buttons[button].value = message;
    }
}

/* instantiate new button handler */
lButtons = new ButtonHandler();

/* setup AICC object */

var aicc = new AICC();

/* set up appropriate submission form */
aicc.addForm('.aicc-form');

/* set initial button states */
lButtons.addButton('launch','#launcher',false);
lButtons.addButton('credit','#credit-request',true);

function courseComplete() {
  lButtons.changeText('launch','Begin');
  lButtons.disableButton('launch');
  lButtons.enableButton('credit');
  courseWindow.close();
}

function reqCredit() {
  lButtons.disableButton('credit');
  aicc.timeStop();
  aicc.command('PutParam','P');
  setTimeout("aicc.command('ExitAU');",1500);
  setTimeout("window.close();",2000);
}

function courseLaunch() {
  // set AICC variables for course start
  aicc.timeStart();

  // open new window with course content
  var aw = screen.width;
  var ah = screen.height;
  var cw = 1280;
  var ch = 1024;
  var width = cw > aw ? aw : cw;
  var height = ch > ah ? ah : ch;
  var top = ( ah / 2 ) - ( height / 2 );
  var left = ( aw / 2 ) - ( width / 2 );
  var winOpts = "menubar=no, location=no, resizable=yes";
  winOpts += ", scrollbars=no, status=yes";
  winOpts += ", width=" + width;
  winOpts += ", height=" + height;
  winOpts += ", top=" + top;
  winOpts += ", left=" + left;
  courseWindow = window.open(FIRSTPAGE,"courseWindow",winOpts);
  lButtons.changeText('launch','Restart Course');
}
