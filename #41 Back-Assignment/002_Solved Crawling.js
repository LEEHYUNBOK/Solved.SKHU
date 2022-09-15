module.exports = {
    Assign: async function (LIST) {
        console.log('0. Assign', LIST);
        ID_LIST = LIST;
        run();
    },
    getResult: async function () {
        return results.toString;
    },
};

const puppeteer = require("puppeteer");
const WaitNotify = require('wait-notify');
const waitNotify = new WaitNotify();
const cheerio = require("cheerio");
process.setMaxListeners(50);

let pID = 1085;
let processID;
let results = [];
let isAssigned = false;
let mAsyncTaskExecute = false;
let urls = ['https://www.acmicpc.net/status?problem_id=', '&user_id=', '&language_id=-1&result_id=4'];

/* Test Data => replace by Req */
let ID_LIST = [
    "q9922000"
    // , "asas6614", "kwj9294", "skhu1024", "rladnr128",
    // "yebinac", "idotu", "neck392", "qmffmzpdl", "skl0519"
];
/* */

async function run() {
    console.log('1. run');
    console.log('ID_LIST', ID_LIST);
    console.log('pID', pID);
    processID = ID_LIST.shift();
    let url = urls[0] + pID + urls[1] + processID + urls[2];
    execute('https://solved.ac/ranking/o/309');
};

async function execute(url) {
    console.log("2. execute");
    puppeteer.launch({ headless: true }).then(async browser => {

        if (mAsyncTaskExecute) {
            await waitNotify.wait();
        }

        console.log("now process\t", processID);
        mAsyncTaskExecute = true;
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "networkidle2" });

        console.log('get content');
        const content = await page.content();
        // $에 cheerio를 로드한다.
        const $ = cheerio.load(content);
        let re=[];
        // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
        const lists = $("#__next > div > div.css-17s3yfp > div.css-qijqp5 > table > tbody > tr");
        
        console.log('lists len:',lists.length);
        console.log(lists);
        // 모든 리스트를 순환한다.
        lists.each((index, list) => {
            const name = $(list).find("td").toString();

            console.log('index of q9922000:',name.lastIndexOf("q9922000"));
            console.log(name.substring(name.lastIndexOf("q9922000")));
            const name0 = $(list).find("td").text();
            console.log('index',index);
            console.log(name);
            console.log(name0);
            // 인덱스와 함께 로그를 찍는다.
            // console.log({
            //     index, name
            // });
        });

        // console.log(page);
        // await page.$eval("td",e=>e.outerHTML)

        // const html0 = await page.$eval("tr", e => e.outerHTML);
        // const html1 = await page.$eval("td", e => e.outerHTML);
        // // const html0 = await page.$eval("#solution-13513003 > td:nth-child(1)", e => e.outerHTML);
        // // const html1 = await page.$eval("tr", e => e.outerHTML);
        // // const html2 = await page.$eval("#solution-13513003", e => e.outerHTML);
        // // console.log(html0);
        // // console.log(html1);

        // console.log("tr", html0.toString());
        // console.log("td", html1.toString());

        // const tbodyChilds = document.querySelector("tr"); // history 테이블의 <tbody> 내용
        // console.log(tbodyChilds);

        // const reactHistory = await page.evaluate(() => {
        //     let scrappedData = []; // 스크래핑 내용 담을 빈 배열
        //     const tbodyChilds = document.querySelector("tr"); // history 테이블의 <tbody> 내용
        //     console.log(tbodyChilds);

        //     // 반복문으로 <tbody> 내용 객체 형식으로 빈 배열에 추가
        //     // for (let i = 1; i < tbodyChilds.length; i++) {
        //     //     scrappedData.push({
        //     //         version: tbodyChilds[i].children[0].textContent,
        //     //         released: tbodyChilds[i].children[1].textContent,
        //     //         changes: tbodyChilds[i].children[2].textContent
        //     //     });
        //     // }
        //     return scrappedData;
        // });

        // console.log(re);
        
        // const html = await page.$eval("td.result", e => e.outerHTML);
        // console.log("td.result", html.toString());
        // results.push(processID, html.includes('맞았습니다!!'));
        // console.log("\t\t", processID, "is solve");
        isFinish();

    }).catch(error => {
        console.log("\t\t", processID, "isn't solve");
        results.push(processID, false);
        isFinish();
    });
}

async function isFinish() {
    console.log('3. isFinish');
    waitNotify.notify();
    mAsyncTaskExecute = false;
    if (ID_LIST.length == 0) {
        console.log(results);
        isAssigned = true;
        process.exit(0);
    }
    else {
        console.log('-------------------------------------------------------------------------');
        run();
    }
};

run();