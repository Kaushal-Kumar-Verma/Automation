const puppeteer = require("puppeteer");
// let {email, password} = require("./secrets");
let email = "kv20071997@gmail.com";
let password = "kk1997";
let { answer } = require("./code");
let cTab;
let browserOPenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
  //chrome://version/
    executablePath: "C://Program Files//Google//Chrome//Application/chrome.exe",
    args: ["--start-maximized"],
  });
  //  console.log(browserOPenPromise); //--> pending stage
  browserOPenPromise //fullfill
  .then(function (browser) {
    console.log("browser is open");
    //console.log(browserOPenPromise); //--> print browser information
    //   console.log(browser);
    //   //An array of all open pages inside the Browser.
    let allTabsPromise = browser.pages(); //--> browser.newPage() -> open a new tab ==>(This is a current tab)
    //cTab = allTabsArr[0]; ==> dont write this page when you write -> (let allTabsPromise = browser.pages();)
    return allTabsPromise;
  })
  .then(function (allTabsArr) {
    cTab = allTabsArr[0];
    console.log("new tab");
    //URL to navigate page to
    let visitingLoginPagePromise = cTab.goto(
      "https://www.hackerrank.com/auth/login"
    );
    return visitingLoginPagePromise;
  })
  .then(function () {
    console.log("open hackerrank login page");

// selector(where to typ),data(what to typ)
    let emailWillBeTypedPromise = cTab.type("input[name='username']", email,{delay:100});
    return emailWillBeTypedPromise;
  })
  .then(function () {
    console.log("email is typed");
  })
  .then(function () {
    let passwordWillBeTypedPromise = cTab.type(
      "input[type='password']",
      password,
      { delay: 100 }
    );
    return passwordWillBeTypedPromise;
  })
  .then(function () {
    console.log("password is typed");
  })
  .then(function () {
    let willBeLoggedToPrimise = cTab.click
    (".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    return willBeLoggedToPrimise;
  })
  .then(function () {
    console.log("login to hackerrank sucessfully");
//   })
//    .then(function () {

//let algorithmTabWillBeOpenPromise = cTab.click("div[data-automation='algorithms']");
//Error: No node found for selector: div[data-automation='algorithms']
// Q-> how to get the algorithm page
//ans-> use .waitForSelector will wait for the selector load, and then click on the node

let algorithmTabWillBeOpenPromise = waitAndClick("div[data-automation='algorithms']");
    return algorithmTabWillBeOpenPromise;
  })
  .then(function () {
    console.log("algorithm page is opend");
      let allQuesPromise = cTab.waitForSelector(
      'a[data-analytics="ChallengeListChallengeName"]'
    );
    return allQuesPromise;
  })
  .then(function () {
    function getAllQuesLinks() {
      let allElemArr = document.querySelectorAll(
        'a[data-analytics="ChallengeListChallengeName"]'
      );
      let linksArr = [];
      for (let i = 0; i < allElemArr.length; i++) {
        linksArr.push(allElemArr[i].getAttribute("href"));
      }
      return linksArr;
      }
      // and then call the fun { because this fun wont run withought call }
      let linksArrPromise = cTab.evaluate(getAllQuesLinks);
      return linksArrPromise;
    })
    .then(function (linksArr) {
      console.log("links to all ques received");
 //     console.log(linksArr);

    //========== ( question solve krna h ) ========
                                  //link to the question to besolved, idx of the linksArr
    let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
    // for (let i = 1; i < linksArr.length; i++){
    //   questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function () {
    //     return questionSolver(linksArr[i], i);
    //   })
    // }
    return questionWillBeSolvedPromise;
  }).
  then(function () {
    console.log("question is solved");
  })
  .catch(function (err) {
    console.log(err);
  });

// ========= creating oue own promise  =========

function waitAndClick(algoBtn){
    let waitClikPromise = new Promise(function ( resolve, reject){
      let waitForSelectorPromise = cTab.waitForSelector(algoBtn);
      waitForSelectorPromise
      .then(function () {
        console.log("algo button is found");
        let clickPromise = cTab.click(algoBtn);
        //click is a asycn fun..
        return clickPromise;
      })
      .then(function () {
        console.log("algo button is clicked");
        resolve();
      })
      .catch(function (err){
        reject(err);
      })
    });
      return waitClikPromise ;
    }
    function questionSolver(url, idx, ) {
      return new Promise(function (resolve, reject) {
        let fullLink = `https://www.hackerrank.com${url}`;
        let goToQuesPagePromise = cTab.goto(fullLink);
        goToQuesPagePromise
          .then(function () {
            console.log("question opened");
            //tick the custom input box mark
            let waitForCheckBoxAndClickPromise =
              waitAndClick(".checkbox-input");
            return waitForCheckBoxAndClickPromise;
          })
          .then(function () {
            //select the box where code will be typed
            let waitForTextBoxPromise = cTab.waitForSelector(".custominput");
            return waitForTextBoxPromise;
          })
          .then(function () {
            let codeWillBeTypedPromise = cTab.type(
              ".custominput",
              answer[idx],
              { delay: 100 }
            );
            return codeWillBeTypedPromise;
          })
          .then(function () {
            //control key is pressed promise
            let controlPressedPromise = cTab.keyboard.press("Control");
            return controlPressedPromise;
          })
          .then(function () {
            let aKeyPressedPromise =cTab.keyboard.press("a");
            return aKeyPressedPromise;
          })
          .then(function () {
            let xKeyPressedPromise = cTab.keyboard.press("x");
            return xKeyPressedPromise;
          })
          .then(function () {
            //select the editor promise
            let cursorOnEditorPromise = cTab.click(
              ".monaco-editor.no-user-select.vs"
            );
            return cursorOnEditorPromise;
          })
          .then(function () {
            let aKeyPressedPromise = cTab.keyboard.press("a");
            return aKeyPressedPromise;
          })
          .then(function () {
            let vKeyPressedPromise = cTab.keyboard.press("v");
            return vKeyPressedPromise;
          })
          .then(function () {
            let submitButtonClickedPromise = cTab.click(".hr-monaco-submit");
            return submitButtonClickedPromise;
          })
          .then(function () {
            let controlDownPromise = cTab.keyboard.up("Control");
            return controlDownPromise;
          })
          .then(function () {
            console.log("code submitted successfully");
            resolve();
          })
          .catch(function (err) {
            reject(err);
          });
      });
    }
