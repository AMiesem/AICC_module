/* *************************************************************************
   WEB BASED TRAINING
   =========================================================================
   AICC script
   ************************************************************************* */

/* ------------ GLOBAL FUNCTIONS ------------------------------------------- */

/**
 * urlParse
 *
 * given the KEY value expected to be found in a URL, return the value
 * associated with it. If not matching key is found, return NULL.
 *
 * @param {string} url
 * @param {string} key
 * @returns {string} Value from URL, or NULL if no match
 **/
function urlParse(url, key) {
  var startPos,
      endPos,
      value;

  if ( url !== null ) {
    // URL is there, check to see if key exists
    if ( url.indexOf(key) >= 0 ) {
      // extract value from URL string

      // locate beginning and end of string
      startPos = url.indexOf(key) + key.length + 1;
      endPos = url.indexOf('&', startPos);

      // if the key-value pair is at the end, then
      // endPos will be -1
      if ( endPos > 0 ) {
        value = url.substring(startPos, endPos);
      } else {
        value = url.substring(startPos);
      }
    }
  }
  return value;
}

/**
 * AICC object
 *
 * Object that holds AICC settings and state for coruse
 *
 **/
class AICC {
  /**
   * constructor function
   **/
  constructor() {
    this.URL = window.location.search ? unescape(top.location.search) : null;

    // AICC protocol data
    this.protocol = {
      "version" : "2.2",
      "SID" : urlParse(this.URL, "AICC_SID"),
      "URL" : urlParse(this.URL,"AICC_URL"),
      "valid" : null
    }


    // course execution data
    this.course = {
      "time" : {
        "start" : null,
        "end" : null,
        // previous time spent on course, if in localstorage
        "previous" : null
      }
    }

    // user data -- FUTURE EXPANSION
    this.user = {
      "ID" : null
    }

    // sanity check to ensure this AICC object is valid
    if (( this.protocol.SID !== null ) && ( this.protocol.URL !== null )) {
      this.protocol.valid = true;
    } else {
      this.protocol.valid = false;
    }

    // -- end constructor
  }

  /**
   * timeStart
   *
   * record the start time of the course
   *
   **/
  timeStart() {
    this.course.time.start = new Date().getTime();
  }

  timeStop() {
    this.course.time.end = new Date().getTime();

    var start = this.course.time.start;
    var end = this.course.time.end;

    if (( start !== null ) && ( end !== null )) {
      var rawTime = end - start;
      var rawSec = Math.round(rawTime / 1000);
      var rawMin = Math.floor(rawSec / 60);

      var timeHrs = Math.floor(rawMin / 60);
      var timeMin = rawMin - (timeHrs * 60);
      var timeSec = rawSec - (rawMin * 60);

      if (timeHrs.toString().length === 1) {
        timeHrs = '0' + timeHrs;
      }

      if (timeMin.toString().length === 1) {
        timeMin = '0' + timeMin;
      }

      if (timeSec.toString().length === 1) {
        timeSec = '0' + timeSec;
      }

      this.lessonTime = timeHrs + ":" + timeMin + ":" + timeSec;
    }
  }
  /**
   * addForm
   *
   * add a reference to the form so other functions can access it.
   *
   * @param {string} formElement A CSS selector used to identify the form
   *
   **/
  addForm(formElement) {
    this.form = document.querySelector(formElement);
  }

  /**
   * command
   *
   * AICC Request function. Handles form interactions with LMS when sent URL.
   *
   * @param {string} reqCommand Command sent to the LMS
   * @param {string} reqStatus Lesson status to be sent back to LMS
   * @returns {bool} true or false, depending on success or failure of action
   */
  command(reqCommand, reqStatus = 'P') {
    if ( ( this.form !== null )
      && ( this.lessonTime !== null )
      && ( this.valid !== false ) ) {
      var baseURL = this.protocol.URL;
      var command = reqCommand ? reqCommand : 'error';
      var status = reqStatus ? reqStatus.toUpperCase() : 'P';

      /**
       * aiccData
       *
       * string to hold [core] data
       **/
      var aiccData;

      /**
       * error
       *
       * holds errorlevel information
       **/
      var error = {
        "level" : 0,
        "message" : "no errors"
      }

      if ( command == 'error' ) {
        error.level = 1;
        error.message = 'No AICC Command Specified';
        return error;
      }

      // create core data
      if ( command === 'PutParam' ) {
        aiccData = '[CORE]\r\n';
        aiccData += 'Lesson_Status=' + status + '\r\n';
        aiccData += 'time=' + this.lessonTime;
      }

      this.form.setAttribute('action',this.protocol.URL);

      this.form.children.command.value = command;
      this.form.children.version.value = this.protocol.version;
      this.form.children.session_id.value = this.protocol.SID;
      this.form.children.aicc_data.value = aiccData;

      var submitted = this.form.submit();

      return error;
    } else {
      return false;
    }
  }

}
