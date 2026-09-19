/**
 * Build curated sample datasets for MiniSpaceX Address.
 * Label: sample/test data only — not a live postal database dump.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/data");
fs.mkdirSync(outDir, { recursive: true });

function write(name, obj) {
  const body = `/** Sample/test dataset — MiniSpaceX Address. Not for real registration. */\nwindow.MSA_DATA = window.MSA_DATA || {};\nwindow.MSA_DATA[${JSON.stringify(name)}] = ${JSON.stringify(obj)};\n`;
  fs.writeFileSync(path.join(outDir, `${name}.js`), body);
  console.log("wrote", name, Buffer.byteLength(body), "bytes");
}

const FIRST = ["James","John","Robert","Michael","William","David","Richard","Joseph","Thomas","Charles","Mary","Patricia","Jennifer","Linda","Elizabeth","Barbara","Susan","Jessica","Sarah","Karen","Christopher","Daniel","Matthew","Anthony","Mark","Emily","Ashley","Amanda","Melissa","Stephanie","Kevin","Brian","George","Timothy","Jason","Ryan","Jacob","Nicole","Helen","Samantha","Wei","Ming","Fang","Jing","Hao","Yan","Alex","Sam","Jordan","Taylor","Casey","Morgan","Riley","Avery","Quinn","Cameron","Oliver","Harry","Amelia","Sophie","Yuki","Hiroshi","Aiko","Kenji","Priya","Arjun","Neha","Rahul","Wei Ling","Mei Ling","Jia Hui"];
const LAST = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Hernandez","Lopez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin","Lee","Perez","Thompson","White","Harris","Clark","Lewis","Robinson","Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores","Green","Adams","Nelson","Baker","Chen","Wang","Zhang","Liu","Yang","Kim","Park","Patel","Singh","Murphy","Sullivan","Wong","Chan","Lam","Cheung","Tanaka","Suzuki","Sato","Yamamoto","Schmidt","Mueller","Weber","Fischer","Tan","Lim","Ng","Gupta","Sharma","Lin","Huang","Wu"];
const OCC = ["Software Engineer","Product Designer","Data Analyst","Marketing Specialist","Accountant","Teacher","Nurse","Retail Associate","Freelance Writer","Project Manager","Graphic Designer","Customer Support","Sales Representative","HR Coordinator","Chef","Electrician","Photographer","Librarian","Lab Technician","Logistics Coordinator","UX Researcher","Content Strategist","IT Support","Real Estate Agent","Pharmacist"];
const APT = ["","Apt 1","Apt 2","Apt 3B","Apt 4A","Unit 101","Unit 202","Suite 10","#12","#5"];

write("common", { firstNames: FIRST, lastNames: LAST, occupations: OCC, aptUnits: APT });

// --- US streets helpers ---
const US_STREETS = ["Main St","Oak St","Maple Ave","Cedar Ln","Pine St","Washington Ave","Park Ave","Lakeview Dr","Hillcrest Rd","Sunset Blvd","2nd Ave","3rd St","Broadway","Market St","Church St","Elm St","Walnut St","River Rd","Forest Ave","Valley Rd","Highland Ave","Center St","Spring St","Mill Rd","College Ave","Jefferson St","Lincoln Ave","Madison St","Franklin St","Jackson Blvd","Wilson Ave","Adams St","Monroe St","Harrison Ave","Grant St","Pearl St","Front St","Water St","State St","Union St","Liberty Ave","Hope St","Garden Way","Meadow Ln","Birch Ct","Willow Dr","Aspen Way","Cypress Ave","Magnolia Dr","Cherry Ln"];
const US_NUM = () => 100 + Math.floor(Math.random() * 8900);

function usAddrs(cities, n = 80) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const c = cities[i % cities.length];
    out.push({
      street: `${US_NUM()} ${US_STREETS[i % US_STREETS.length]}`,
      city: c.city,
      zip: c.zips[i % c.zips.length],
    });
  }
  return out;
}

const TAXFREE = {
  AK: { name: "Alaska", nameZh: "阿拉斯加", areaCodes: ["907"], cities: [
    { city: "Anchorage", zips: ["99501","99502","99503","99504","99507","99508","99515","99516","99517","99518"] },
    { city: "Fairbanks", zips: ["99701","99709","99712"] },
    { city: "Juneau", zips: ["99801","99802"] },
    { city: "Sitka", zips: ["99835"] },
    { city: "Ketchikan", zips: ["99901"] },
    { city: "Wasilla", zips: ["99654"] },
    { city: "Kenai", zips: ["99611"] },
  ]},
  DE: { name: "Delaware", nameZh: "特拉华", areaCodes: ["302"], cities: [
    { city: "Wilmington", zips: ["19801","19802","19803","19805","19806","19808","19809","19810"] },
    { city: "Dover", zips: ["19901","19904"] },
    { city: "Newark", zips: ["19702","19711","19713"] },
    { city: "Middletown", zips: ["19709"] },
    { city: "Bear", zips: ["19701"] },
    { city: "Smyrna", zips: ["19977"] },
  ]},
  MT: { name: "Montana", nameZh: "蒙大拿", areaCodes: ["406"], cities: [
    { city: "Billings", zips: ["59101","59102","59105","59106"] },
    { city: "Missoula", zips: ["59801","59802","59804","59808"] },
    { city: "Great Falls", zips: ["59401","59404","59405"] },
    { city: "Bozeman", zips: ["59715","59718"] },
    { city: "Helena", zips: ["59601"] },
    { city: "Kalispell", zips: ["59901"] },
  ]},
  NH: { name: "New Hampshire", nameZh: "新罕布什尔", areaCodes: ["603"], cities: [
    { city: "Manchester", zips: ["03101","03102","03103","03104"] },
    { city: "Nashua", zips: ["03060","03062","03063"] },
    { city: "Concord", zips: ["03301"] },
    { city: "Dover", zips: ["03820"] },
    { city: "Portsmouth", zips: ["03801"] },
    { city: "Keene", zips: ["03431"] },
    { city: "Rochester", zips: ["03867"] },
  ]},
  OR: { name: "Oregon", nameZh: "俄勒冈", areaCodes: ["503","541","971"], cities: [
    { city: "Portland", zips: ["97201","97202","97205","97209","97210","97212","97214","97217","97219","97220","97221","97222","97225","97229","97230"] },
    { city: "Eugene", zips: ["97401","97402","97405"] },
    { city: "Salem", zips: ["97301","97302","97304"] },
    { city: "Bend", zips: ["97701","97702"] },
    { city: "Beaverton", zips: ["97005","97006","97007","97008"] },
    { city: "Hillsboro", zips: ["97123","97124"] },
    { city: "Medford", zips: ["97501","97504"] },
    { city: "Corvallis", zips: ["97330","97333"] },
  ]},
};

const taxStates = {};
for (const [code, st] of Object.entries(TAXFREE)) {
  taxStates[code] = {
    name: st.name,
    nameZh: st.nameZh,
    areaCodes: st.areaCodes,
    addresses: usAddrs(st.cities, code === "OR" ? 160 : 100),
  };
}
// US tax-free + nationwide street samples are built from Census TIGER/Line ADDRFEAT
// via `npm run data:us` (scripts/build-us-tiger.py). Do not overwrite those assets here.
// write("us-taxfree", { states: taxStates, taxFreeCodes: ["AK","DE","MT","NH","OR"] });
console.log("skip us-taxfree (use npm run data:us / existing TIGER extract)");

// All US states (sample cities) — tax-free included + major others
const ALL_US = {
  ...TAXFREE,
  AL: { name: "Alabama", nameZh: "阿拉巴马", areaCodes: ["205","251","256"], cities: [{ city: "Birmingham", zips: ["35203","35205"] },{ city: "Montgomery", zips: ["36104"] },{ city: "Mobile", zips: ["36602"] }] },
  AZ: { name: "Arizona", nameZh: "亚利桑那", areaCodes: ["480","520","602"], cities: [{ city: "Phoenix", zips: ["85001","85003","85004","85008","85016"] },{ city: "Tucson", zips: ["85701","85705"] },{ city: "Mesa", zips: ["85201"] },{ city: "Scottsdale", zips: ["85251"] }] },
  AR: { name: "Arkansas", nameZh: "阿肯色", areaCodes: ["501","870"], cities: [{ city: "Little Rock", zips: ["72201"] },{ city: "Fayetteville", zips: ["72701"] }] },
  CA: { name: "California", nameZh: "加利福尼亚", areaCodes: ["213","310","415","408","619","714"], cities: [
    { city: "Los Angeles", zips: ["90001","90012","90015","90024","90028","90036","90045","90046","90064","90066"] },
    { city: "San Francisco", zips: ["94102","94103","94107","94109","94110","94114","94117","94118","94122"] },
    { city: "San Diego", zips: ["92101","92103","92109"] },
    { city: "San Jose", zips: ["95110","95112","95113"] },
    { city: "Sacramento", zips: ["95814","95816"] },
    { city: "Oakland", zips: ["94607","94612"] },
    { city: "Irvine", zips: ["92612","92614","92618"] },
  ]},
  CO: { name: "Colorado", nameZh: "科罗拉多", areaCodes: ["303","720"], cities: [{ city: "Denver", zips: ["80202","80203","80205","80206","80209"] },{ city: "Boulder", zips: ["80301","80302"] },{ city: "Colorado Springs", zips: ["80903"] }] },
  CT: { name: "Connecticut", nameZh: "康涅狄格", areaCodes: ["203","860"], cities: [{ city: "Hartford", zips: ["06103"] },{ city: "New Haven", zips: ["06510"] },{ city: "Stamford", zips: ["06901"] }] },
  FL: { name: "Florida", nameZh: "佛罗里达", areaCodes: ["305","407","561","813","904"], cities: [
    { city: "Miami", zips: ["33101","33125","33130","33131","33132","33133"] },
    { city: "Orlando", zips: ["32801","32803"] },
    { city: "Tampa", zips: ["33602","33606"] },
    { city: "Jacksonville", zips: ["32202"] },
    { city: "Fort Lauderdale", zips: ["33301"] },
  ]},
  GA: { name: "Georgia", nameZh: "佐治亚", areaCodes: ["404","678","770"], cities: [{ city: "Atlanta", zips: ["30303","30308","30309","30318"] },{ city: "Savannah", zips: ["31401"] },{ city: "Augusta", zips: ["30901"] }] },
  HI: { name: "Hawaii", nameZh: "夏威夷", areaCodes: ["808"], cities: [{ city: "Honolulu", zips: ["96813","96815","96816"] },{ city: "Hilo", zips: ["96720"] }] },
  ID: { name: "Idaho", nameZh: "爱达荷", areaCodes: ["208"], cities: [{ city: "Boise", zips: ["83702","83705"] },{ city: "Idaho Falls", zips: ["83401"] }] },
  IL: { name: "Illinois", nameZh: "伊利诺伊", areaCodes: ["312","773","847"], cities: [{ city: "Chicago", zips: ["60601","60605","60611","60614","60622","60640","60657"] },{ city: "Naperville", zips: ["60540"] },{ city: "Springfield", zips: ["62701"] }] },
  IN: { name: "Indiana", nameZh: "印第安纳", areaCodes: ["317","812"], cities: [{ city: "Indianapolis", zips: ["46201","46204"] },{ city: "Fort Wayne", zips: ["46802"] }] },
  IA: { name: "Iowa", nameZh: "艾奥瓦", areaCodes: ["319","515"], cities: [{ city: "Des Moines", zips: ["50309"] },{ city: "Cedar Rapids", zips: ["52401"] }] },
  KS: { name: "Kansas", nameZh: "堪萨斯", areaCodes: ["316","785"], cities: [{ city: "Wichita", zips: ["67202"] },{ city: "Kansas City", zips: ["66101"] },{ city: "Topeka", zips: ["66603"] }] },
  KY: { name: "Kentucky", nameZh: "肯塔基", areaCodes: ["502","859"], cities: [{ city: "Louisville", zips: ["40202"] },{ city: "Lexington", zips: ["40507"] }] },
  LA: { name: "Louisiana", nameZh: "路易斯安那", areaCodes: ["504","225"], cities: [{ city: "New Orleans", zips: ["70112","70115","70116","70118"] },{ city: "Baton Rouge", zips: ["70801"] }] },
  ME: { name: "Maine", nameZh: "缅因", areaCodes: ["207"], cities: [{ city: "Portland", zips: ["04101"] },{ city: "Augusta", zips: ["04330"] }] },
  MD: { name: "Maryland", nameZh: "马里兰", areaCodes: ["301","410"], cities: [{ city: "Baltimore", zips: ["21201","21202","21218"] },{ city: "Annapolis", zips: ["21401"] },{ city: "Rockville", zips: ["20850"] }] },
  MA: { name: "Massachusetts", nameZh: "马萨诸塞", areaCodes: ["617","508","781"], cities: [{ city: "Boston", zips: ["02108","02109","02110","02115","02116","02118"] },{ city: "Cambridge", zips: ["02138","02139"] },{ city: "Worcester", zips: ["01608"] }] },
  MI: { name: "Michigan", nameZh: "密歇根", areaCodes: ["313","248","734"], cities: [{ city: "Detroit", zips: ["48201","48226"] },{ city: "Ann Arbor", zips: ["48104"] },{ city: "Grand Rapids", zips: ["49503"] }] },
  MN: { name: "Minnesota", nameZh: "明尼苏达", areaCodes: ["612","651"], cities: [{ city: "Minneapolis", zips: ["55401","55403","55408"] },{ city: "Saint Paul", zips: ["55101"] }] },
  MS: { name: "Mississippi", nameZh: "密西西比", areaCodes: ["601"], cities: [{ city: "Jackson", zips: ["39201"] },{ city: "Gulfport", zips: ["39501"] }] },
  MO: { name: "Missouri", nameZh: "密苏里", areaCodes: ["314","816"], cities: [{ city: "St. Louis", zips: ["63101","63103"] },{ city: "Kansas City", zips: ["64105","64108"] }] },
  NE: { name: "Nebraska", nameZh: "内布拉斯加", areaCodes: ["402"], cities: [{ city: "Omaha", zips: ["68102"] },{ city: "Lincoln", zips: ["68508"] }] },
  NV: { name: "Nevada", nameZh: "内华达", areaCodes: ["702","775"], cities: [{ city: "Las Vegas", zips: ["89101","89109","89119"] },{ city: "Reno", zips: ["89501"] }] },
  NJ: { name: "New Jersey", nameZh: "新泽西", areaCodes: ["201","609","732"], cities: [{ city: "Newark", zips: ["07102"] },{ city: "Jersey City", zips: ["07302"] },{ city: "Princeton", zips: ["08540"] }] },
  NM: { name: "New Mexico", nameZh: "新墨西哥", areaCodes: ["505"], cities: [{ city: "Albuquerque", zips: ["87102"] },{ city: "Santa Fe", zips: ["87501"] }] },
  NY: { name: "New York", nameZh: "纽约", areaCodes: ["212","718","917","516"], cities: [
    { city: "New York", zips: ["10001","10002","10003","10011","10012","10013","10014","10016","10019","10022","10023","10024","10025","10036"] },
    { city: "Brooklyn", zips: ["11201","11215","11217"] },
    { city: "Buffalo", zips: ["14202"] },
    { city: "Rochester", zips: ["14604"] },
    { city: "Albany", zips: ["12207"] },
  ]},
  NC: { name: "North Carolina", nameZh: "北卡罗来纳", areaCodes: ["704","919"], cities: [{ city: "Charlotte", zips: ["28202","28204"] },{ city: "Raleigh", zips: ["27601"] },{ city: "Durham", zips: ["27701"] }] },
  ND: { name: "North Dakota", nameZh: "北达科他", areaCodes: ["701"], cities: [{ city: "Fargo", zips: ["58102"] },{ city: "Bismarck", zips: ["58501"] }] },
  OH: { name: "Ohio", nameZh: "俄亥俄", areaCodes: ["216","614","513"], cities: [{ city: "Columbus", zips: ["43215"] },{ city: "Cleveland", zips: ["44113"] },{ city: "Cincinnati", zips: ["45202"] }] },
  OK: { name: "Oklahoma", nameZh: "俄克拉荷马", areaCodes: ["405","918"], cities: [{ city: "Oklahoma City", zips: ["73102"] },{ city: "Tulsa", zips: ["74103"] }] },
  PA: { name: "Pennsylvania", nameZh: "宾夕法尼亚", areaCodes: ["215","412","717"], cities: [{ city: "Philadelphia", zips: ["19102","19103","19107","19146"] },{ city: "Pittsburgh", zips: ["15222"] },{ city: "Harrisburg", zips: ["17101"] }] },
  RI: { name: "Rhode Island", nameZh: "罗得岛", areaCodes: ["401"], cities: [{ city: "Providence", zips: ["02903"] },{ city: "Newport", zips: ["02840"] }] },
  SC: { name: "South Carolina", nameZh: "南卡罗来纳", areaCodes: ["803","843"], cities: [{ city: "Charleston", zips: ["29401"] },{ city: "Columbia", zips: ["29201"] }] },
  SD: { name: "South Dakota", nameZh: "南达科他", areaCodes: ["605"], cities: [{ city: "Sioux Falls", zips: ["57104"] },{ city: "Rapid City", zips: ["57701"] }] },
  TN: { name: "Tennessee", nameZh: "田纳西", areaCodes: ["615","901"], cities: [{ city: "Nashville", zips: ["37201","37203"] },{ city: "Memphis", zips: ["38103"] },{ city: "Knoxville", zips: ["37902"] }] },
  TX: { name: "Texas", nameZh: "得克萨斯", areaCodes: ["214","512","713","210","817"], cities: [
    { city: "Austin", zips: ["78701","78702","78704","78705"] },
    { city: "Houston", zips: ["77002","77005","77006","77019"] },
    { city: "Dallas", zips: ["75201","75204","75214"] },
    { city: "San Antonio", zips: ["78205"] },
    { city: "Fort Worth", zips: ["76102"] },
  ]},
  UT: { name: "Utah", nameZh: "犹他", areaCodes: ["801"], cities: [{ city: "Salt Lake City", zips: ["84101","84111"] },{ city: "Provo", zips: ["84601"] }] },
  VT: { name: "Vermont", nameZh: "佛蒙特", areaCodes: ["802"], cities: [{ city: "Burlington", zips: ["05401"] },{ city: "Montpelier", zips: ["05602"] }] },
  VA: { name: "Virginia", nameZh: "弗吉尼亚", areaCodes: ["703","804","757"], cities: [{ city: "Richmond", zips: ["23219"] },{ city: "Virginia Beach", zips: ["23451"] },{ city: "Arlington", zips: ["22201"] }] },
  WA: { name: "Washington", nameZh: "华盛顿州", areaCodes: ["206","425","253"], cities: [{ city: "Seattle", zips: ["98101","98102","98103","98104","98109","98112","98115","98121"] },{ city: "Bellevue", zips: ["98004"] },{ city: "Tacoma", zips: ["98402"] },{ city: "Spokane", zips: ["99201"] }] },
  WV: { name: "West Virginia", nameZh: "西弗吉尼亚", areaCodes: ["304"], cities: [{ city: "Charleston", zips: ["25301"] },{ city: "Morgantown", zips: ["26505"] }] },
  WI: { name: "Wisconsin", nameZh: "威斯康星", areaCodes: ["414","608"], cities: [{ city: "Milwaukee", zips: ["53202"] },{ city: "Madison", zips: ["53703"] }] },
  WY: { name: "Wyoming", nameZh: "怀俄明", areaCodes: ["307"], cities: [{ city: "Cheyenne", zips: ["82001"] },{ city: "Jackson", zips: ["83001"] }] },
  DC: { name: "District of Columbia", nameZh: "华盛顿特区", areaCodes: ["202"], cities: [{ city: "Washington", zips: ["20001","20002","20005","20009","20036"] }] },
};

const usStates = {};
for (const [code, st] of Object.entries(ALL_US)) {
  const n = ["CA","NY","TX","FL","OR"].includes(code) ? 120 : (TAXFREE[code] ? 90 : 48);
  usStates[code] = {
    name: st.name,
    nameZh: st.nameZh,
    areaCodes: st.areaCodes,
    addresses: usAddrs(st.cities, n),
  };
}
// write("us", { states: usStates });
console.log("skip us (use npm run data:us / existing TIGER extract)");

// --- HK ---
const HK_DISTRICTS = [
  { region: "香港岛", regionEn: "Hong Kong Island", areas: [
    { zh: "中环", en: "Central", streetsZh: ["皇后大道中","德辅道中","遮打道","雪厂街"], streetsEn: ["Queen's Road Central","Des Voeux Road Central","Chater Road","Ice House Street"] },
    { zh: "铜锣湾", en: "Causeway Bay", streetsZh: ["轩尼诗道","怡和街","告士打道","波斯富街"], streetsEn: ["Hennessy Road","Yee Wo Street","Gloucester Road","Percival Street"] },
    { zh: "湾仔", en: "Wan Chai", streetsZh: ["庄士敦道","骆克道","轩尼诗道"], streetsEn: ["Johnston Road","Lockhart Road","Hennessy Road"] },
    { zh: "北角", en: "North Point", streetsZh: ["英皇道","渣华道"], streetsEn: ["King's Road","Java Road"] },
  ]},
  { region: "九龙", regionEn: "Kowloon", areas: [
    { zh: "尖沙咀", en: "Tsim Sha Tsui", streetsZh: ["弥敦道","广东道","梳士巴利道","海防道"], streetsEn: ["Nathan Road","Canton Road","Salisbury Road","Haiphong Road"] },
    { zh: "旺角", en: "Mong Kok", streetsZh: ["弥敦道","亚皆老街","豉油街","通菜街"], streetsEn: ["Nathan Road","Argyle Street","Soy Street","Tung Choi Street"] },
    { zh: "油麻地", en: "Yau Ma Tei", streetsZh: ["弥敦道","窝打老道"], streetsEn: ["Nathan Road","Waterloo Road"] },
    { zh: "观塘", en: "Kwun Tong", streetsZh: ["观塘道","开源道"], streetsEn: ["Kwun Tong Road","Hoi Yuen Road"] },
  ]},
  { region: "新界", regionEn: "New Territories", areas: [
    { zh: "沙田", en: "Sha Tin", streetsZh: ["沙田正街","大涌桥路"], streetsEn: ["Sha Tin Centre Street","Tai Chung Kiu Road"] },
    { zh: "大埔", en: "Tai Po", streetsZh: ["广福道","宝乡街"], streetsEn: ["Kwong Fuk Road","Po Heung Street"] },
    { zh: "元朗", en: "Yuen Long", streetsZh: ["青山公路","元朗安宁路"], streetsEn: ["Castle Peak Road","Yuen Long On Ning Road"] },
    { zh: "荃湾", en: "Tsuen Wan", streetsZh: ["青山公路","沙咀道"], streetsEn: ["Castle Peak Road","Sha Tsui Road"] },
  ]},
];
const hkAddrs = [];
for (const reg of HK_DISTRICTS) {
  for (const a of reg.areas) {
    for (let i = 0; i < 12; i++) {
      const floor = 1 + (i % 30);
      const unit = 100 + (i % 20) * 5;
      const si = i % a.streetsZh.length;
      const num = 10 + i * 7;
      hkAddrs.push({
        region: reg.region, regionEn: reg.regionEn,
        district: a.zh, districtEn: a.en,
        streetZh: `${num}号${a.streetsZh[si]}`,
        streetEn: `${num} ${a.streetsEn[si]}`,
        floorUnitZh: `${floor}楼 ${unit}室`,
        floorUnitEn: `${floor}/F, Unit ${unit}`,
        postal: "000000",
      });
    }
  }
}
write("hk", {
  addresses: hkAddrs,
  firstNamesZh: ["志明","家辉","美玲","嘉欣","伟强","晓彤","俊杰","雅婷","建华","诗琪","国豪","佩珊"],
  lastNamesZh: ["陈","李","黄","张","林","王","吴","郑","周","叶","何","梁"],
  firstNamesEn: ["Michael","David","Emily","Sophie","Jason","Amy","Kevin","Grace","Eric","Helen"],
  lastNamesEn: ["Chan","Wong","Lam","Cheung","Leung","Ho","Ng","Lee","Cheng","Lau"],
  areaCodes: ["5","6","9"],
});

// --- UK ---
const UK_PLACES = [
  { city: "London", region: "Greater London", streets: ["High Street","Oxford Street","Baker Street","King's Road","Victoria Street","Fleet Street","Bond Street"], postcodes: ["SW1A 1AA","W1A 1AA","EC1A 1BB","N1 9GU","SE1 9SG","E1 6AN","NW1 6XE"] },
  { city: "Manchester", region: "Greater Manchester", streets: ["Deansgate","Market Street","Oxford Road","Portland Street"], postcodes: ["M1 1AE","M2 3AW","M3 2JA","M4 1HQ"] },
  { city: "Birmingham", region: "West Midlands", streets: ["New Street","Corporation Street","Broad Street"], postcodes: ["B1 1AA","B2 4QA","B3 1EH"] },
  { city: "Liverpool", region: "Merseyside", streets: ["Church Street","Bold Street","Dale Street"], postcodes: ["L1 1JQ","L2 2EN","L3 1BP"] },
  { city: "Edinburgh", region: "Scotland", streets: ["Princes Street","Royal Mile","George Street","Lothian Road"], postcodes: ["EH1 1YZ","EH2 2AN","EH3 9DR"] },
  { city: "Glasgow", region: "Scotland", streets: ["Buchanan Street","Sauchiehall Street","Argyle Street"], postcodes: ["G1 1XQ","G2 3EX","G3 8AZ"] },
  { city: "Bristol", region: "South West England", streets: ["Park Street","Queen Square","Whiteladies Road"], postcodes: ["BS1 4DJ","BS8 1QU"] },
  { city: "Leeds", region: "West Yorkshire", streets: ["Briggate","The Headrow","Call Lane"], postcodes: ["LS1 6JB","LS2 8AJ"] },
  { city: "Cardiff", region: "Wales", streets: ["Queen Street","St Mary Street","Cathedral Road"], postcodes: ["CF10 1AR","CF11 9LJ"] },
  { city: "Belfast", region: "Northern Ireland", streets: ["Donegall Place","Royal Avenue","Lisburn Road"], postcodes: ["BT1 5GS","BT9 6AG"] },
];
const ukAddrs = [];
for (const p of UK_PLACES) {
  for (let i = 0; i < 16; i++) {
    ukAddrs.push({
      street: `${10 + i * 3} ${p.streets[i % p.streets.length]}`,
      city: p.city,
      region: p.region,
      postcode: p.postcodes[i % p.postcodes.length],
    });
  }
}
write("uk", {
  addresses: ukAddrs,
  firstNames: ["Oliver","Harry","George","Noah","Jack","Leo","Amelia","Olivia","Isla","Ava","Mia","Emily"],
  lastNames: ["Smith","Jones","Williams","Brown","Taylor","Wilson","Johnson","Davies","Patel","Wright"],
  areaCodes: ["20","161","121","141","131","29","28"],
});

// --- DE ---
const DE_PLACES = [
  { city: "Berlin", streets: ["Unter den Linden","Friedrichstraße","Kurfürstendamm","Alexanderplatz","Potsdamer Straße"], zips: ["10117","10178","10719","10969","10557"] },
  { city: "München", streets: ["Marienplatz","Leopoldstraße","Maximilianstraße","Sendlinger Straße"], zips: ["80331","80802","80539","80336"] },
  { city: "Hamburg", streets: ["Reeperbahn","Mönckebergstraße","Jungfernstieg","Speicherstadt"], zips: ["20359","20095","20354","20457"] },
  { city: "Frankfurt am Main", streets: ["Zeil","Goethestraße","Mainzer Landstraße"], zips: ["60313","60325","60329"] },
  { city: "Köln", streets: ["Hohe Straße","Schildergasse","Rudolfplatz"], zips: ["50667","50676"] },
  { city: "Stuttgart", streets: ["Königstraße","Schlossplatz"], zips: ["70173","70174"] },
  { city: "Düsseldorf", streets: ["Königsallee","Schadowstraße"], zips: ["40212","40213"] },
  { city: "Leipzig", streets: ["Petersstraße","Augustusplatz"], zips: ["04109","04109"] },
];
const deAddrs = [];
for (const p of DE_PLACES) {
  for (let i = 0; i < 14; i++) {
    deAddrs.push({
      street: `${p.streets[i % p.streets.length]} ${5 + i}`,
      city: p.city,
      zip: p.zips[i % p.zips.length],
    });
  }
}
write("de", {
  addresses: deAddrs,
  firstNames: ["Hans","Klaus","Thomas","Anna","Maria","Sophie","Lukas","Felix","Laura","Julia","Max","Emma"],
  lastNames: ["Müller","Schmidt","Schneider","Fischer","Weber","Meyer","Wagner","Becker","Schulz","Hoffmann"],
});

// --- SG ---
const SG_PLACES = [
  { area: "Central", streets: ["Orchard Road","Raffles Place","Robinson Road","Cecil Street","Boat Quay"], zips: ["238801","048616","048545","049705","049514"] },
  { area: "East", streets: ["East Coast Road","Marine Parade Road","Bedok North Avenue"], zips: ["428802","449282","460201"] },
  { area: "West", streets: ["Jurong Gateway Road","Clementi Avenue","Bukit Batok Central"], zips: ["608549","129580","650150"] },
  { area: "North", streets: ["Woodlands Avenue","Yishun Avenue","Sembawang Road"], zips: ["738265","760101","758611"] },
  { area: "Northeast", streets: ["Serangoon Road","Hougang Avenue","Punggol Walk"], zips: ["218108","530501","828864"] },
];
const sgAddrs = [];
for (const p of SG_PLACES) {
  for (let i = 0; i < 16; i++) {
    const blk = 10 + i * 5;
    sgAddrs.push({
      street: `Blk ${blk} ${p.streets[i % p.streets.length]} #${String(1 + (i % 20)).padStart(2,"0")}-${String(100 + i).padStart(3,"0")}`,
      area: p.area,
      city: "Singapore",
      zip: p.zips[i % p.zips.length],
    });
  }
}
write("sg", {
  addresses: sgAddrs,
  firstNames: ["Wei","Jia","Mei","Hui","Jun","Yi","Kai","Ling","Ryan","Sarah","Daniel","Amanda"],
  lastNames: ["Tan","Lim","Ng","Lee","Ong","Wong","Goh","Chua","Koh","Teo"],
});

// --- JP ---
const JP_PLACES = [
  { pref: "東京都", prefEn: "Tokyo", cities: [
    { city: "渋谷区", cityEn: "Shibuya", streets: ["道玄坂","宇田川町","神南"], zips: ["150-0043","150-0042","150-0041"] },
    { city: "新宿区", cityEn: "Shinjuku", streets: ["西新宿","歌舞伎町","高田馬場"], zips: ["160-0023","160-0021","169-0075"] },
    { city: "港区", cityEn: "Minato", streets: ["六本木","青山","芝"], zips: ["106-0032","107-0062","105-0014"] },
    { city: "千代田区", cityEn: "Chiyoda", streets: ["丸の内","神田","永田町"], zips: ["100-0005","101-0047","100-0014"] },
  ]},
  { pref: "大阪府", prefEn: "Osaka", cities: [
    { city: "大阪市北区", cityEn: "Kita-ku, Osaka", streets: ["梅田","中之島"], zips: ["530-0001","530-0005"] },
    { city: "大阪市中央区", cityEn: "Chuo-ku, Osaka", streets: ["心斎橋","難波"], zips: ["542-0086","542-0076"] },
  ]},
  { pref: "京都府", prefEn: "Kyoto", cities: [
    { city: "京都市下京区", cityEn: "Shimogyo-ku, Kyoto", streets: ["四条通","烏丸通"], zips: ["600-8001","600-8149"] },
  ]},
  { pref: "神奈川県", prefEn: "Kanagawa", cities: [
    { city: "横浜市中区", cityEn: "Naka-ku, Yokohama", streets: ["山下町","日本大通"], zips: ["231-0023","231-0021"] },
  ]},
];
const jpAddrs = [];
for (const pref of JP_PLACES) {
  for (const c of pref.cities) {
    for (let i = 0; i < 12; i++) {
      const chome = 1 + (i % 5);
      const banchi = 1 + (i % 20);
      const go = 1 + (i % 10);
      jpAddrs.push({
        pref: pref.pref, prefEn: pref.prefEn,
        city: c.city, cityEn: c.cityEn,
        streetZh: `${c.streets[i % c.streets.length]}${chome}丁目${banchi}-${go}`,
        streetEn: `${chome}-${banchi}-${go} ${c.streets[i % c.streets.length]}`,
        zip: c.zips[i % c.zips.length],
      });
    }
  }
}
write("jp", {
  addresses: jpAddrs,
  firstNames: ["太郎","花子","健太","美咲","翔太","結衣","大輝","陽菜","Yuki","Haruto","Sakura","Aoi"],
  lastNames: ["佐藤","鈴木","高橋","田中","伊藤","渡辺","山本","中村","小林","加藤"],
});

// --- CA ---
const CA_PLACES = [
  { province: "ON", provinceName: "Ontario", cities: [
    { city: "Toronto", streets: ["Yonge Street","Bay Street","Queen Street West","King Street East","Bloor Street"], zips: ["M5H 2N2","M5J 2R8","M5V 2A8","M5C 1S4","M4W 1A5"] },
    { city: "Ottawa", streets: ["Rideau Street","Sparks Street"], zips: ["K1N 5Y8","K1P 5B4"] },
  ]},
  { province: "BC", provinceName: "British Columbia", cities: [
    { city: "Vancouver", streets: ["Robson Street","Granville Street","West Georgia Street"], zips: ["V6B 2Z6","V6C 2W6","V6E 4A2"] },
    { city: "Victoria", streets: ["Government Street","Douglas Street"], zips: ["V8W 1H6","V8W 2C3"] },
  ]},
  { province: "QC", provinceName: "Quebec", cities: [
    { city: "Montreal", streets: ["Rue Sainte-Catherine","Boulevard René-Lévesque","Rue Sherbrooke"], zips: ["H3B 1A7","H3B 4W8","H3A 1G1"] },
    { city: "Quebec City", streets: ["Grande Allée","Rue Saint-Jean"], zips: ["G1R 2J5","G1R 1S1"] },
  ]},
  { province: "AB", provinceName: "Alberta", cities: [
    { city: "Calgary", streets: ["Stephen Avenue","17 Avenue SW"], zips: ["T2P 1J4","T2T 0A1"] },
    { city: "Edmonton", streets: ["Jasper Avenue","Whyte Avenue"], zips: ["T5J 1W8","T6E 1Z5"] },
  ]},
];
const caAddrs = [];
for (const p of CA_PLACES) {
  for (const c of p.cities) {
    for (let i = 0; i < 14; i++) {
      caAddrs.push({
        street: `${100 + i * 11} ${c.streets[i % c.streets.length]}`,
        city: c.city,
        province: p.province,
        provinceName: p.provinceName,
        postal: c.zips[i % c.zips.length],
      });
    }
  }
}
write("ca", {
  addresses: caAddrs,
  firstNames: ["Liam","Noah","Oliver","Emma","Olivia","Ava","Lucas","Mason","Sophia","Isabella","Ethan","Mia"],
  lastNames: ["Smith","Brown","Tremblay","Martin","Roy","Gagnon","Lee","Wilson","Taylor","Anderson"],
  areaCodes: ["416","647","604","778","514","403","780","613"],
});

// --- IN ---
const IN_PLACES = [
  { state: "Maharashtra", cities: [
    { city: "Mumbai", streets: ["Marine Drive","Linking Road","SV Road","Colaba Causeway"], pins: ["400001","400005","400050","400052"] },
    { city: "Pune", streets: ["FC Road","JM Road","Baner Road"], pins: ["411001","411004","411045"] },
  ]},
  { state: "Karnataka", cities: [
    { city: "Bengaluru", streets: ["MG Road","Brigade Road","Indiranagar 100 Feet Road","Koramangala 5th Block"], pins: ["560001","560025","560038","560095"] },
  ]},
  { state: "Delhi", cities: [
    { city: "New Delhi", streets: ["Connaught Place","Janpath","Karol Bagh"], pins: ["110001","110001","110005"] },
  ]},
  { state: "Tamil Nadu", cities: [
    { city: "Chennai", streets: ["Anna Salai","T Nagar Usman Road","OMR"], pins: ["600002","600017","600096"] },
  ]},
  { state: "Telangana", cities: [
    { city: "Hyderabad", streets: ["Banjara Hills Road","Hitech City Road","Gachibowli"], pins: ["500034","500081","500032"] },
  ]},
];
const inAddrs = [];
for (const st of IN_PLACES) {
  for (const c of st.cities) {
    for (let i = 0; i < 14; i++) {
      inAddrs.push({
        street: `${10 + i} ${c.streets[i % c.streets.length]}`,
        city: c.city,
        state: st.state,
        pin: c.pins[i % c.pins.length],
      });
    }
  }
}
write("in", {
  addresses: inAddrs,
  firstNames: ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Ananya","Diya","Isha","Kavya","Rohan","Neha"],
  lastNames: ["Sharma","Patel","Singh","Kumar","Gupta","Reddy","Nair","Iyer","Mehta","Joshi"],
  areaCodes: ["22","11","80","44","40"],
});

// --- TW ---
const TW_PLACES = [
  { city: "台北市", cityEn: "Taipei", districts: [
    { d: "大安区", dEn: "Da'an", streets: ["忠孝东路","新生南路","和平东路","敦化南路"], zips: ["106","106","106","106"] },
    { d: "中山区", dEn: "Zhongshan", streets: ["南京东路","民生东路","林森北路"], zips: ["104","104","104"] },
    { d: "信义区", dEn: "Xinyi", streets: ["松仁路","信义路","基隆路"], zips: ["110","110","110"] },
  ]},
  { city: "新北市", cityEn: "New Taipei", districts: [
    { d: "板桥区", dEn: "Banqiao", streets: ["文化路","县民大道"], zips: ["220","220"] },
    { d: "中和区", dEn: "Zhonghe", streets: ["景安路","中山路"], zips: ["235","235"] },
  ]},
  { city: "台中市", cityEn: "Taichung", districts: [
    { d: "西屯区", dEn: "Xitun", streets: ["台湾大道","市政路"], zips: ["407","407"] },
    { d: "北区", dEn: "North", streets: ["一中街","进化路"], zips: ["404","404"] },
  ]},
  { city: "高雄市", cityEn: "Kaohsiung", districts: [
    { d: "前镇区", dEn: "Qianzhen", streets: ["中山路","成功路"], zips: ["806","806"] },
    { d: "左营区", dEn: "Zuoying", streets: ["博爱路","明诚路"], zips: ["813","813"] },
  ]},
];
const twAddrs = [];
for (const c of TW_PLACES) {
  for (const dist of c.districts) {
    for (let i = 0; i < 12; i++) {
      const num = 10 + i * 8;
      const lane = i % 3 === 0 ? `巷${1 + (i % 5)}` : "";
      twAddrs.push({
        city: c.city, cityEn: c.cityEn,
        district: dist.d, districtEn: dist.dEn,
        streetZh: `${dist.streets[i % dist.streets.length]}${num}号${lane}`,
        streetEn: `No. ${num}, ${dist.streets[i % dist.streets.length]}${lane ? `, Ln. ${1+(i%5)}` : ""}`,
        zip: dist.zips[i % dist.zips.length],
      });
    }
  }
}
write("tw", {
  addresses: twAddrs,
  firstNames: ["志伟","雅婷","家豪","怡君","建宏","诗涵","冠宇","佩蓉","俊杰","心怡"],
  lastNames: ["陈","林","黄","张","李","王","吴","刘","蔡","杨"],
});

// --- MAC OUI (common vendors, curated sample) ---
const OUI = [
  ["000C29","VMware, Inc."],["005056","VMware, Inc."],["001C14","VMware, Inc."],
  ["001A11","Google, Inc."],["3C5AB4","Google, Inc."],["F4F5E8","Google, Inc."],
  ["001B63","Apple, Inc."],["ACBC32","Apple, Inc."],["F0D1A9","Apple, Inc."],["A4B197","Apple, Inc."],["28CFDA","Apple, Inc."],["FCFC48","Apple, Inc."],
  ["00000C","Cisco Systems, Inc."],["001BD7","Cisco Systems, Inc."],["F87B20","Cisco Systems, Inc."],["00D0D3","Cisco Systems, Inc."],
  ["0019D1","Intel Corporate"],["3C970E","Intel Corporate"],["F8F21E","Intel Corporate"],["A0A8CD","Intel Corporate"],
  ["001E10","Huawei Technologies Co.,Ltd"],["00E0FC","Huawei Technologies Co.,Ltd"],["C8D15E","Huawei Technologies Co.,Ltd"],["285FDB","Huawei Technologies Co.,Ltd"],
  ["001632","Samsung Electronics Co.,Ltd"],["5C0A5B","Samsung Electronics"],["FCF136","Samsung Electronics"],["A00798","Samsung Electronics"],
  ["00155D","Microsoft Corporation"],["0050F2","Microsoft Corporation"],["7C1E52","Microsoft Corporation"],
  ["00159A","ARRIS Group, Inc."],["E46F13","ARRIS Group"],
  ["0026BB","Apple, Inc."],["B8E856","Apple, Inc."],
  ["DCA266","Hon Hai / Foxconn"],["00E04C","Realtek Semiconductor"],["001E33","TP-Link Technologies"],["50C7BF","TP-Link"],
  ["B0BE76","TP-Link"],["14CC20","TP-Link"],["F4EC38","TP-Link"],
  ["0017FA","ASUSTek Computer"],["AC220B","ASUSTek"],["2C4D54","ASUSTek"],
  ["001E8C","ASUSTek Computer Inc."],["04D4C4","ASUSTek"],
  ["002719","TP-Link"],["001D0F","TP-Link"],
  ["000E8F","Sercomm Corporation"],["001A2B","Ayecom Technology"],
  ["001CC0","Intel Corporate"],["B4B676","Intel Corporate"],
  ["002590","Super Micro Computer"],["AC1F6B","Super Micro"],
  ["00155F","Dell Inc."],["F8B156","Dell Inc."],["18A99B","Dell Inc."],["D4AE52","Dell Inc."],
  ["001E67","Intel Corporate"],["8C8D28","Intel Corporate"],
  ["001A79","TELECOM ITALIA S.p.A."],
  ["000D93","Apple, Inc."],["0010FA","Apple, Inc."],
  ["00A0C9","Intel Corporation"],["001B21","Intel Corporate"],
  ["FCF647","Fiberhome Telecommunication"],["00E0B8","Allied Telesis"],
  ["0013E8","Intel Corporate"],["0016EB","Intel Corporate"],
  ["00265E","Hon Hai Precision"],["C8A030","Xiaomi Communications"],["28E31F","Xiaomi"],["64CC2E","Xiaomi"],
  ["A4C138","Telink Semiconductor"],["00E022","Analog Devices"],
  ["001A11","Google"],["546009","Google"],["94EB2C","Google"],
  ["3C5A37","Samsung Electronics"],["001632","Samsung"],
  ["00D0B7","Intel"],["001517","Intel"],
  ["001F3A","Hon Hai"],["002481","Hon Hai"],
  ["B827EB","Raspberry Pi Foundation"],["DC:A6:32","Raspberry Pi Trading".replace(/:/g,"")],
  ["E45F01","Raspberry Pi Trading"],["B8:27:EB","Raspberry Pi Foundation".replace(/:/g,"")],
  ["D8A0E8","Xiaomi"],["F0B429","Xiaomi"],
  ["000C41","Cisco-Linksys"],["0018F8","Cisco-Linksys"],
  ["00259C","Cisco-Linksys"],["C0C1C0","Cisco-Linksys"],
  ["001E13","Cisco Systems"],["F40F1B","Cisco Systems"],
  ["A03D6E","Cisco"],["F87A41","Cisco"],
  ["001560","Hewlett Packard"],["3C5232","Hewlett Packard"],["B499BA","Hewlett Packard"],
  ["001635","Hewlett Packard"],["D07E28","Hewlett Packard"],
  ["002264","Hewlett Packard"],["A02BB8","Hewlett Packard"],
  ["001A4B","Hewlett Packard"],["9457A5","Hewlett Packard"],
  ["00E018","ASUSTeK"],["1C872C","ASUSTeK"],
  ["04D4C4","ASUSTeK COMPUTER INC."],
  ["001DD8","Microsoft"],["7C1E52","Microsoft"],
  ["0050F2","Microsoft"],["00155D","Microsoft"],
  ["F4CE46","Hewlett Packard"],["B4B52F","Hewlett Packard"],
  ["0026B0","Apple"],["68D93C","Apple"],["AC87A3","Apple"],
  ["28E14C","Apple"],["A4D1D2","Apple"],
];
// clean OUI entries
const ouiClean = [];
const seen = new Set();
for (const [raw, vendor] of OUI) {
  const o = String(raw).replace(/[^0-9A-Fa-f]/g, "").toUpperCase().slice(0, 6);
  if (o.length !== 6 || seen.has(o)) continue;
  seen.add(o);
  ouiClean.push({ oui: o, vendor });
}
write("mac-oui", { vendors: ouiClean });

console.log("done. vendors:", ouiClean.length);
