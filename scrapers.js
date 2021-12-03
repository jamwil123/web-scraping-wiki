const puppeteer = require("puppeteer")
const hillList = require('./finalHillListData.json')
process.setMaxListeners(Infinity)
const { writeFile } = require('fs/promises')

async function scrapeWiki(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage() 
    await page.goto(url);

    const [el] = await page.$x('//*[@id="mw-content-text"]/div[1]/table/tbody/tr[2]/td/a/img')
    const src = await el.getProperty('src')
    const img_url = await src.jsonValue();

    const [el2] = await page.$x('//*[@id="mw-content-text"]/div[1]/p[1]')
    const txt = await el2.getProperty('textContent')
    const description  = await txt.jsonValue();
    
    return ({img_url: img_url, description: description})
    

   
}


const newFunction = async () => {
    const reducedList = hillList.filter((hill, index)=> {
        return index > 150 && index <= 200
    })
// console.log(reducedList)
return Promise.all(reducedList.map((hill, i)=> {
    
    return scrapeWiki(`https://en.wikipedia.org/wiki/${hill.hillname}`).then((res)=> {
       return {...hill,
                img_url:res.img_url,
                description: res.description
    }
    }).catch((err)=> {
        if(err) {
            return {...hill}
        }
    })
}))



}

newFunction().then((res)=> {
    console.log(res)
    writeFile('output3.json', JSON.stringify(res))
})














