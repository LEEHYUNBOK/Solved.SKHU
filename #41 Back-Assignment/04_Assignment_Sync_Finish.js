const puppeteer = require("puppeteer");
const WaitNotify = require('wait-notify');
const waitNotify = new WaitNotify();
const cheerio = require("cheerio");
process.setMaxListeners(50);

let processID;
let results = [];
let mAsyncTaskExecute = false;
let urls = ['https://www.acmicpc.net/status?problem_id=', '&user_id=', '&language_id=-1&result_id=4'];

/* Test Data => replace by Req */
let pId=1085;
let ID_LIST = [
    "kshyun419", "asas6614", "kwj9294", "skhu1024", "rladnr128",
    "yebinac", "idotu", "neck392", "qmffmzpdl", "skl0519"
];
/* */

async function run() {
    console.log('1. run');
    processID=ID_LIST.shift();
    let url = urls[0] + pId + urls[1] + processID + urls[2];
    execute(url);
};

async function execute(url) {
    console.log("2. execute");
    puppeteer.launch({ headless: true }).then(async browser => {

        if(mAsyncTaskExecute){
          await waitNotify.wait();
        }

        console.log("now process\t",processID);
        mAsyncTaskExecute = true;
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        const html = await page.$eval("td.result", e => e.outerHTML);

        results.push(processID, html.includes('맞았습니다!!'));
        console.log("\t\t",processID,"is solve");
        isFinish();

    }).catch(error => {
        console.log(processID,"isn't solve");
        results.push("\t\t",processID, false);
        isFinish();
    });
}

async function isFinish() {
    console.log('3. isFinish');
    waitNotify.notify();
    mAsyncTaskExecute=false;
    if (ID_LIST.length==0) {
        console.log(results);
        process.exit(0);
    }
    console.log('-------------------------------------------------------------------------');
    run();
};

async function Assign(){
    run();
    return results;
}