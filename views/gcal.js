var CLIENT_ID = '130003801174-p6lr4grn4k5qmm1r06sbi354ffl1e812.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

      /**
       * Check if current user has authorized this application.
       */
      function checkAuth() {
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /**
       * Handle response from authorization server.
       *
       * @param {Object} authResult Authorization result.
       */
      function handleAuthResult(authResult) {

        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          alert("login ok!");
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          //alert('login error!');
        }
      }
