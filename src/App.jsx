import{useState,useEffect,useCallback,useMemo,useRef}from"react";
import{useRemoteEvents}from"./useRemoteEvents";
import{initBilling,purchaseLocalsGuide,restorePurchases}from"./billing";
import{T as TR,LANGUAGES}from"./translations";
import{FOOD_FREE,FOOD_PREMIUM}from"./food-data";
import{COMMUNITY}from"./community-data";

// PhillyHub — FINAL with i18n, light/dark, pannable map, haptics, all 11 fixes
// Lil Pill Studios © 2026

// ─── THEME (dark + light) ────────────────────────────────────────────
const DK={sky:"#89CFF0",coral:"#F09898",yellow:"#F5E87A",green:"#7BD4A0",purple:"#C4A8E0",orange:"#E0A870",red:"#E63946",gold:"#D4AF37",bg:"#0F1117",bgCard:"#161820",bgSheet:"#12141C",bgElev:"#1C1E28",text:"rgba(255,255,255,0.92)",textSec:"rgba(255,255,255,0.55)",textMut:"rgba(255,255,255,0.3)",textHint:"rgba(255,255,255,0.18)",bdr:"rgba(255,255,255,0.06)",grad:"linear-gradient(135deg,#89CFF0,#F09898,#F5E87A)",gradG:"linear-gradient(135deg,#D4AF37,#F5E87A,#D4AF37)",r:12,rs:8};
const LT={sky:"#2563EB",coral:"#E11D48",yellow:"#CA8A04",green:"#16A34A",purple:"#7C3AED",orange:"#EA580C",red:"#DC2626",gold:"#B8860B",bg:"#F8F9FA",bgCard:"#FFFFFF",bgSheet:"#FFFFFF",bgElev:"#F0F1F3",text:"rgba(0,0,0,0.87)",textSec:"rgba(0,0,0,0.55)",textMut:"rgba(0,0,0,0.33)",textHint:"rgba(0,0,0,0.12)",bdr:"rgba(0,0,0,0.08)",grad:"linear-gradient(135deg,#2563EB,#E11D48,#CA8A04)",gradG:"linear-gradient(135deg,#B8860B,#CA8A04,#B8860B)",r:12,rs:8};
const RC={BSL:"#FF6600",MFL:"#0066CC",trolley:"#5E8C31",bus:"#1E90FF",regional:"#8B4FCF",stadium:"#E63946"};

// ─── LANDMARKS ───────────────────────────────────────────────────────
const LM=[
{id:"lb01",name:"Liberty Bell",lat:39.9496,lng:-75.1503,type:"monument",year:1753,addr:"526 Market St",desc:"Iconic symbol of American independence.",u:false},
{id:"lb02",name:"Independence Hall",lat:39.9489,lng:-75.1500,type:"monument",year:1753,addr:"520 Chestnut St",desc:"Where the Declaration and Constitution were adopted. UNESCO World Heritage.",u:false},
{id:"lb03",name:"Philadelphia Museum of Art",lat:39.9656,lng:-75.1810,type:"museum",year:1876,addr:"2600 Benjamin Franklin Pkwy",desc:"240K+ works. 2026: 'A Nation of Artists.'",u:false},
{id:"lb04",name:"Eastern State Penitentiary",lat:39.9683,lng:-75.1727,type:"museum",year:1829,addr:"2027 Fairmount Ave",desc:"Al Capone did time here. Now a museum.",u:false},
{id:"lb05",name:"Betsy Ross House",lat:39.9529,lng:-75.1446,type:"monument",year:1740,addr:"239 Arch St",desc:"Where the first American flag was reportedly sewn.",u:false},
{id:"lb06",name:"Elfreth's Alley",lat:39.9527,lng:-75.1425,type:"monument",year:1702,addr:"124-126 Elfreth's Alley",desc:"Oldest continuously inhabited street in America.",u:false},
{id:"lb07",name:"Christ Church",lat:39.9523,lng:-75.1441,type:"church",year:1695,addr:"20 N American St",desc:"Washington and Franklin worshipped here.",u:false},
{id:"lb08",name:"Reading Terminal Market",lat:39.9533,lng:-75.1592,type:"monument",year:1893,addr:"1136 Arch St",desc:"80+ merchants. Amish vendors — get there early Saturday.",u:false},
{id:"lb09",name:"City Hall",lat:39.9524,lng:-75.1636,type:"monument",year:1901,addr:"1401 JFK Blvd",desc:"Largest municipal building in the U.S. Observation deck.",u:false},
{id:"lb10",name:"LOVE Park",lat:39.9543,lng:-75.1656,type:"park",year:1965,addr:"1599 JFK Blvd",desc:"Robert Indiana's LOVE sculpture. Perfect photo op.",u:false},
{id:"lb11",name:"Museum of the American Revolution",lat:39.9483,lng:-75.1464,type:"museum",year:2017,addr:"101 S 3rd St",desc:"2026: 'The Declaration's Journey' exhibit.",u:false},
{id:"lb12",name:"Penn's Landing",lat:39.9459,lng:-75.1416,type:"park",year:1682,addr:"101 S Columbus Blvd",desc:"Waterfront on the Delaware. Summer concerts.",u:false},
{id:"lb13",name:"Carpenter's Hall",lat:39.9482,lng:-75.1476,type:"monument",year:1774,addr:"320 Chestnut St",desc:"First Continental Congress site.",u:true},
{id:"lb14",name:"Edgar Allan Poe House",lat:39.9618,lng:-75.1498,type:"museum",year:1843,addr:"532 N 7th St",desc:"Only surviving Poe residence in Philly. Free.",u:false},
{id:"lb15",name:"Mütter Museum",lat:39.9531,lng:-75.1764,type:"museum",year:1863,addr:"19 S 22nd St",desc:"Medical oddities. Einstein's brain, 9-foot colon.",u:false},
{id:"lb16",name:"Rittenhouse Square",lat:39.9496,lng:-75.1718,type:"park",year:1683,addr:"210 W Rittenhouse Sq",desc:"Tree-lined paths, fountain, upscale restaurants.",u:false},
{id:"lb17",name:"African American Museum",lat:39.9536,lng:-75.1515,type:"museum",year:1976,addr:"701 Arch St",desc:"First institution by a major city for African American heritage. 2026: Special 250th exhibits on Black Philadelphia's role in founding America.",u:false},
{id:"lb18",name:"Declaration House",lat:39.9500,lng:-75.1520,type:"monument",year:1776,addr:"700 Market St",desc:"Jefferson drafted the Declaration here.",u:true},
{id:"lb19",name:"Gloria Dei Church",lat:39.9340,lng:-75.1435,type:"church",year:1698,addr:"916 S Swanson St",desc:"Oldest church in PA. Swedish colonists.",u:true},
{id:"lb20",name:"Franklin's Grave",lat:39.9498,lng:-75.1519,type:"monument",year:1790,addr:"340 N 5th St",desc:"Christ Church Burial Ground. Toss a penny.",u:false},
{id:"lb21",name:"Lemon Hill (Fan Festival)",lat:39.9715,lng:-75.1830,type:"park",year:1800,addr:"Sedgley Dr, Fairmount Park",desc:"Official soccer fan festival site — up to 25K daily for international matches.",u:false},
{id:"lb22",name:"Mann Center",lat:39.9770,lng:-75.2105,type:"park",year:1976,addr:"5201 Parkside Ave",desc:"Open-air concerts. Philly Orchestra summer home.",u:false},
{id:"lb23",name:"Please Touch Museum",lat:39.9797,lng:-75.2094,type:"museum",year:1976,addr:"4231 Avenue of the Republic",desc:"2026: 'Discovering Democracy' civics exhibit.",u:false},
{id:"lb24",name:"Laurel Hill Cemetery",lat:40.0072,lng:-75.1838,type:"monument",year:1836,addr:"3822 Ridge Ave",desc:"Victorian garden cemetery. National Historic Landmark.",u:true},
{id:"lb25",name:"69th Street Terminal",lat:39.9619,lng:-75.2559,type:"monument",year:1907,addr:"100 W 69th St, Upper Darby",desc:"Major transit hub. MFL terminus.",u:false},
{id:"lb26",name:"Bartram's Garden",lat:39.9265,lng:-75.2135,type:"park",year:1728,addr:"5400 Lindbergh Blvd",desc:"America's oldest botanical garden. 2026: FloatLab.",u:true},
{id:"lb27",name:"Manayunk Main Street",lat:40.0265,lng:-75.2245,type:"park",year:1824,addr:"Main St, Manayunk",desc:"Canal town turned restaurant strip.",u:false},
{id:"lb28",name:"Wissahickon Valley Park",lat:40.0400,lng:-75.2115,type:"park",year:1868,addr:"Forbidden Dr",desc:"1,800 acres of forest. Forbidden Drive: 5.5mi car-free.",u:true},
{id:"lb29",name:"Sports Complex",lat:39.9060,lng:-75.1680,type:"monument",year:1971,addr:"3501 S Broad St",desc:"Lincoln Financial Field, Citizens Bank Park.",u:false},
{id:"lb30",name:"FDR Park",lat:39.9005,lng:-75.1760,type:"park",year:1926,addr:"1500 Pattison Ave",desc:"200 acres near stadiums. Pre-match hangout.",u:false},
{id:"lb31",name:"Cheltenham Square",lat:40.0590,lng:-75.1340,type:"monument",year:1960,addr:"Cheltenham Ave & Ogontz",desc:"Montgomery County border transit hub.",u:false},
{id:"lb32",name:"Frankford Arsenal",lat:40.0100,lng:-75.0660,type:"museum",year:1816,addr:"4501 Tacony St",desc:"Former Army munitions factory. Now arts spaces.",u:true},
// ─── BLACK AMERICAN HISTORY ────────────────────────────────────────
{id:"lb33",name:"Mother Bethel AME Church",lat:39.9438,lng:-75.1498,type:"church",year:1794,addr:"419 S 6th St",desc:"Oldest AME congregation in America. Founded by Richard Allen, born enslaved. National Historic Landmark. 250th context: Black Philadelphia shaped American freedom from the start.",u:false},
{id:"lb34",name:"Johnson House Historic Site",lat:40.0340,lng:-75.1710,type:"museum",year:1768,addr:"6306 Germantown Ave",desc:"Confirmed Underground Railroad station. Germantown Quakers sheltered freedom seekers here. Tours available.",u:true},
{id:"lb35",name:"Belmont Mansion",lat:39.9780,lng:-75.2020,type:"museum",year:1745,addr:"2000 Belmont Mansion Dr",desc:"Underground Railroad site in Fairmount Park. Now the American Women's Heritage Museum. Free.",u:true},
{id:"lb36",name:"Octavius V. Catto Memorial",lat:39.9524,lng:-75.1636,type:"monument",year:2017,addr:"City Hall, S Plaza",desc:"First public statue of a named African American in Philadelphia. Civil rights pioneer, murdered for fighting for Black voting rights in 1871.",u:false},
{id:"lb37",name:"President's House",lat:39.9497,lng:-75.1498,type:"monument",year:2010,addr:"525 Market St",desc:"Where Washington and Adams lived as president — and where 9 enslaved people served them. Open-air memorial next to the Liberty Bell.",u:false},
{id:"lb38",name:"Paul Robeson House",lat:39.9570,lng:-75.1870,type:"museum",year:1911,addr:"4951 Walnut St",desc:"Home of the athlete, actor, singer, and civil rights activist. West Philly. National Historic Landmark.",u:true},
{id:"lb39",name:"Colored Girls Museum",lat:39.9600,lng:-75.2050,type:"museum",year:2015,addr:"4613 Newhall St",desc:"Intimate museum in a Germantown rowhouse celebrating the stories of ordinary Black women. By appointment.",u:true},
{id:"lb40",name:"Church of the Advocate",lat:39.9780,lng:-75.1620,type:"church",year:1897,addr:"1801 W Diamond St",desc:"North Philly. Site of the 1970 Black Panther convention. Murals by Walter Edmonds. Gothic Revival architecture.",u:true},
{id:"lb41",name:"Fair Hill Burial Ground",lat:39.9920,lng:-75.1420,type:"monument",year:1703,addr:"2901 Germantown Ave",desc:"Resting place of Lucretia Mott and Robert Purvis — abolitionists who shaped the movement. Quaker cemetery.",u:true},
{id:"lb42",name:"Engine Company 11",lat:39.9540,lng:-75.1700,type:"monument",year:1871,addr:"1226 Ridge Ave",desc:"First Black firehouse in Philadelphia. The men who served here fought for the right to fight fires.",u:true},
{id:"lb43",name:"Henry 'Hank' Gathers Recreation Center",lat:39.9750,lng:-75.1560,type:"monument",year:1993,addr:"2501 W Lehigh Ave",desc:"Named for the North Philly basketball legend. Community center in the heart of Strawberry Mansion.",u:true},
// ─── STEPHEN GIRARD LANDMARKS ──────────────────────────────────────
{id:"lb44",name:"Girard College / Founder's Hall",lat:39.9720,lng:-75.1740,type:"museum",year:1848,addr:"2101 S College Ave",desc:"Founded by Stephen Girard for orphaned children. Founder's Hall is a Greek Revival masterpiece. 250th context: Girard financed the War of 1812, saving the nation. Desegregated via Supreme Court in 1968.",u:false},
{id:"lb45",name:"First Bank of the United States",lat:39.9481,lng:-75.1451,type:"monument",year:1797,addr:"116 S 3rd St",desc:"America's first central bank. Hamilton's vision, Girard saved it. One of the oldest bank buildings in the country.",u:false},
{id:"lb46",name:"Girard Row",lat:39.9435,lng:-75.1570,type:"monument",year:1833,addr:"326-334 Spruce St",desc:"Row houses built by Girard's estate. Greek Revival architecture. Still standing in Society Hill.",u:true},
{id:"lb47",name:"Bush Hill (Girard's Yellow Fever Hospital)",lat:39.9650,lng:-75.1700,type:"monument",year:1793,addr:"Near 17th & Spring Garden (site)",desc:"During the 1793 yellow fever epidemic, Girard personally nursed the sick here when everyone else fled. 5,000 Philadelphians died. 250th context: The epidemic reshaped American public health.",u:true},
];

// ─── EVENTS ──────────────────────────────────────────────────────────
const EV=[
{id:"ev01",title:"Ivory Coast vs Ecuador",date:"2026-06-14",time:"7:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group E opener. First international soccer match in Philadelphia.",tix:"https://www.fifa.com/tickets"},
{id:"ev02",title:"Brazil vs Haiti",date:"2026-06-19",time:"9:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group C. Brazil's first match — massive international crowds.",tix:"https://www.fifa.com/tickets"},
{id:"ev03",title:"France vs Playoff Winner",date:"2026-06-22",time:"5:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group I. France faces the intercontinental playoff winner.",tix:"https://www.fifa.com/tickets"},
{id:"ev04",title:"Curaçao vs Ivory Coast",date:"2026-06-25",time:"4:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group E final matchday.",tix:"https://www.fifa.com/tickets"},
{id:"ev05",title:"Croatia vs Ghana",date:"2026-06-27",time:"5:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group L. Last group stage match in Philadelphia.",tix:"https://www.fifa.com/tickets"},
{id:"ev06",title:"Round of 16 Match",date:"2026-07-04",time:"5:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Knockout round on America's 250th Anniversary.",tix:"https://www.fifa.com/tickets"},
{id:"ev07",title:"Soccer Fan Festival at Lemon Hill",date:"2026-06-11",time:"All Day",venue:"Lemon Hill",addr:"Sedgley Dr, Fairmount Park",lat:39.9715,lng:-75.1830,cat:"fifa",free:true,desc:"5-week watch party festival. Up to 25K daily. Big screens, food, music."},
{id:"ev08",title:"52 Weeks of Firsts",date:"2026-01-01",time:"Weekly",venue:"Citywide",addr:"Various",lat:39.9524,lng:-75.1636,cat:"america250",free:true,desc:"Free weekly events honoring Philly firsts."},
{id:"ev09",title:"Red, White & Blue To-Do",date:"2026-06-28",time:"All Day",venue:"Historic District",addr:"Independence Mall",lat:39.9489,lng:-75.1500,cat:"america250",free:true,desc:"Parades, concerts in America's most historic square mile."},
{id:"ev10",title:"Wawa Welcome America",date:"2026-06-19",time:"All Day",venue:"Benjamin Franklin Pkwy",addr:"Benjamin Franklin Parkway",lat:39.9630,lng:-75.1750,cat:"america250",free:true,desc:"16 days, 6 nights fireworks, July 3 parade."},
{id:"ev11",title:"July 4th Fireworks & Concert",date:"2026-07-04",time:"8:00 PM",venue:"Art Museum / Parkway",addr:"2600 Benjamin Franklin Pkwy",lat:39.9656,lng:-75.1810,cat:"fireworks",free:true,desc:"Nation's biggest July 4th event."},
{id:"ev12",title:"MLB All-Star Game",date:"2026-07-16",time:"7:00 PM",venue:"Citizens Bank Park",addr:"1 Citizens Bank Way",lat:39.9061,lng:-75.1665,cat:"concert",free:false,desc:"Baseball's midsummer classic."},
{id:"ev13",title:"PGA Championship",date:"2026-05-11",time:"All Day",venue:"Aronimink Golf Club",addr:"3600 St Davids Rd, Newtown Square",lat:39.9835,lng:-75.4135,cat:"concert",free:false,desc:"One of golf's four majors. May 11-17."},
{id:"ev14",title:"Universal Parks Exhibition",date:"2026-02-14",time:"10 AM",venue:"Franklin Institute",addr:"222 N 20th St",lat:39.9582,lng:-75.1736,cat:"festival",free:false,desc:"18K sq ft, 8 galleries, 100+ artifacts."},
{id:"ev15",title:"A Nation of Artists",date:"2026-05-01",time:"10 AM",venue:"Philadelphia Museum of Art",addr:"2600 Benjamin Franklin Pkwy",lat:39.9656,lng:-75.1810,cat:"festival",free:false,desc:"Three centuries of American art."},
{id:"ev16",title:"The Declaration's Journey",date:"2026-01-01",time:"10 AM",venue:"Museum of the American Revolution",addr:"101 S 3rd St",lat:39.9483,lng:-75.1464,cat:"america250",free:false,desc:"How the Declaration shaped rights worldwide."},
{id:"ev17",title:"ArtPhilly: What Now",date:"2026-05-01",time:"Various",venue:"Citywide",addr:"Various",lat:39.9524,lng:-75.1636,cat:"festival",free:true,desc:"30+ original art projects citywide."},
{id:"ev18",title:"Juneteenth Parade",date:"2026-06-21",time:"10 AM",venue:"Malcolm X Park",addr:"Pine St & 52nd St",lat:39.9570,lng:-75.1590,cat:"parade",free:true,desc:"Music, dance, food, celebration of freedom."},
{id:"ev19",title:"Neighborhood Tour Series",date:"2026-04-01",time:"Weekends",venue:"20 neighborhoods",addr:"Various",lat:39.9524,lng:-75.1636,cat:"america250",free:true,desc:"20-week series, different neighborhood each week."},
{id:"ev20",title:"Philadelphia Flower Show",date:"2026-02-28",time:"10 AM",venue:"Convention Center",addr:"1101 Arch St",lat:39.9545,lng:-75.1597,cat:"festival",free:false,desc:"'Rooted: Origins of American Gardening.' Feb 28 - Mar 8."},
];

// ─── SERVICES ────────────────────────────────────────────────────────
const SVC=[
{id:"s01",name:"PNC ATM",lat:39.9520,lng:-75.1640,addr:"1600 Market St",type:"atm",h24:true},
{id:"s02",name:"Wells Fargo ATM",lat:39.9500,lng:-75.1510,addr:"123 S Broad St",type:"atm",h24:true},
{id:"s03",name:"Chase ATM",lat:39.9540,lng:-75.1660,addr:"1700 Market St",type:"atm",h24:true},
{id:"s04",name:"Citizens Bank",lat:39.9530,lng:-75.1590,addr:"1201 Market St",type:"bank",h24:false},
{id:"s05",name:"TD Bank",lat:39.9488,lng:-75.1502,addr:"300 Chestnut St",type:"bank",h24:false},
{id:"s06",name:"Wawa (Broad)",lat:39.9485,lng:-75.1640,addr:"1500 Walnut St",type:"gas",h24:true},
{id:"s07",name:"Sunoco (Columbus)",lat:39.9430,lng:-75.1400,addr:"100 Columbus Blvd",type:"gas",h24:true},
{id:"s08",name:"CVS (24h)",lat:39.9505,lng:-75.1560,addr:"1826 Chestnut St",type:"pharmacy",h24:true},
{id:"s09",name:"Walgreens (Broad)",lat:39.9528,lng:-75.1638,addr:"1500 S Broad St",type:"pharmacy",h24:false},
{id:"s10",name:"Rite Aid (South)",lat:39.9425,lng:-75.1520,addr:"601 South St",type:"pharmacy",h24:false},
{id:"s11",name:"Restroom (Liberty Bell)",lat:39.9498,lng:-75.1505,addr:"526 Market St",type:"restroom",h24:false},
{id:"s12",name:"Restroom (Reading Terminal)",lat:39.9535,lng:-75.1590,addr:"1136 Arch St",type:"restroom",h24:false},
{id:"s13",name:"Restroom (LOVE Park)",lat:39.9545,lng:-75.1658,addr:"1599 JFK Blvd",type:"restroom",h24:false},
{id:"s14",name:"Wawa (Market)",lat:39.9510,lng:-75.1555,addr:"34 S 11th St",type:"gas",h24:true},
{id:"s15",name:"Shell (Spring Garden)",lat:39.9615,lng:-75.1500,addr:"800 Spring Garden St",type:"gas",h24:true},
];

// ─── PREMIUM CONTENT ─────────────────────────────────────────────────
const PTOURS=[
{id:"pt01",name:"Revolutionary Secrets Walk",stops:[
  {sid:"lb13",note:"Ask a docent about the secret tunnel rumor to Independence Hall."},
  {sid:"lb18",note:"Stand in the room where Jefferson wrote the words that changed the world."},
  {sid:"lb07",note:"Find Franklin's pew — it's still marked with a brass plate."},
  {sid:"lb20",note:"Toss a penny on the headstone. Locals say it's good luck."},
  {sid:"lb02",note:"End where it all began. The Assembly Room still has the original chairs."}
],dur:"90 min",dist:"1.3 mi",bestTime:"Weekday mornings before 10am — fewer tour groups, quieter streets.",tip:"Bring water. The cobblestones in Old City are beautiful but unforgiving on your feet.",direction:"Start in Old City, loop south through the Historic District.",tags:["Easy walk","History deep","Photo ops"],startLat:39.9482,startLng:-75.1476,desc:"The stories guides don't tell. Carpenter's Hall, Declaration House, Franklin's grave."},
{id:"pt02",name:"South Philly Food Crawl",stops:[
  {sid:"f01",note:"Order 'whiz wit' — that's Cheez Whiz with onions. Don't overthink it."},
  {sid:"f02",note:"Cross the street for the rivalry. Compare and pick your side forever."},
  {sid:"f04",note:"The roast pork Italian might be better than both cheesesteaks. Seriously."},
  {sid:"f13",note:"Weekend only. Get the barbacoa tacos — James Beard didn't lie."},
  {sid:"f03",note:"Rebuilt after the 2022 fire. Many locals say this is the actual best."}
],dur:"2 hours",dist:"3.4 mi",bestTime:"Saturday 10am-1pm — all spots open, Barbacoa is only weekends.",tip:"Come hungry. Skip breakfast. You're eating at 5 stops. Pace yourself.",direction:"Start at the Passyunk cheesesteak corner, head south to the Italian Market, loop back up to South Street.",tags:["Food heavy","Easy walk","Kid friendly"],startLat:39.9335,startLng:-75.1593,desc:"Pat's vs Geno's vs John's — settle the debate. Then barbacoa tacos and Jim's."},
{id:"pt03",name:"Art & Architecture Loop",stops:[
  {sid:"lb03",note:"Run the Rocky steps first. Then go inside — 240K works spanning 2,000 years."},
  {sid:"lb09",note:"Take the elevator to the observation deck. 360° of the entire city."},
  {sid:"lb10",note:"The LOVE sculpture is smaller than you think. Best shot: stand across JFK Blvd."},
  {sid:"lb16",note:"Grab a bench, people-watch. This is Philly's living room."},
  {sid:"lb15",note:"Einstein's brain is here. Also a 9-foot colon. You've been warned."}
],dur:"2.5 hours",dist:"2.3 mi",bestTime:"Start at 5pm — catch golden hour at the Art Museum steps, end at Rittenhouse at sunset.",tip:"Wear comfortable shoes. The Parkway stretch from Art Museum to City Hall is all pavement.",direction:"Start at the Art Museum on the Parkway, head east through Center City to Rittenhouse.",tags:["Easy walk","Photo ops","Cultural"],startLat:39.9656,startLng:-75.1810,desc:"Art Museum to City Hall to Rittenhouse. Philly's most photogenic mile."},
{id:"pt04",name:"Hidden Philly",stops:[
  {sid:"lb13",note:"Quieter than Independence Hall, equally historic. First Continental Congress met here."},
  {sid:"lb18",note:"Free to enter. Most tourists walk right past this one."},
  {sid:"lb19",note:"Oldest church in Pennsylvania. Swedish colonists built it in 1698. Cemetery dates to the 1600s."},
  {sid:"lb24",note:"Overlooks the Schuylkill. Victorian funerary art. Bring a camera."},
  {sid:"lb26",note:"America's oldest botanical garden. The new FloatLab opens in 2026."}
],dur:"Half day",dist:"12.7 mi (use transit between stops)",bestTime:"Weekend morning. Take BSL south for Gloria Dei, then transit to Laurel Hill and Bartram's.",tip:"This tour requires transit between stops 3-4 and 4-5. Use the Transit tab to plan. Not walkable end-to-end.",direction:"Start in Old City, head south to Queen Village, then transit to East Falls and Southwest Philly.",tags:["Half day","Transit needed","Off the beaten path"],startLat:39.9482,startLng:-75.1476,desc:"The spots most tourists walk right past. Deep Philly for the curious."},
{id:"pt05",name:"Matchday Circuit",stops:[
  {sid:"lb29",note:"Arrive early. Explore the Sports Complex — Lincoln Financial Field, Citizens Bank Park, Wells Fargo Center all within walking distance."},
  {sid:"lb30",note:"200 acres of lakes and trails. Perfect pre-match tailgate spot. Food trucks line up on game days."},
  {sid:"lb21",note:"Up to 25K fans watching on big screens. Live music, food vendors, the energy is unreal."},
  {sid:"lb03",note:"End at the Rocky steps for sunset over the city. Best view in Philadelphia."}
],dur:"Full day",dist:"5.9 mi (BSL connects stadium to Fan Festival)",bestTime:"Match day. Get to FDR Park 3 hours before kickoff. Head to Fan Festival after the final whistle.",tip:"Take BSL from NRG Station to Spring Garden for the Fan Festival — don't try to drive. Wear your colors.",direction:"Start at the Sports Complex in South Philly, head north via BSL to Lemon Hill and the Art Museum.",tags:["Full day","Transit needed","Game day","High energy"],startLat:39.9060,startLng:-75.1680,desc:"FDR Park tailgate → the match → Fan Festival at Lemon Hill → Art Museum sunset."},
];
const PGEMS=[
{id:"pg01",name:"Tun Tavern Site",lat:39.9465,lng:-75.1420,addr:"Front & Walnut Sts",desc:"Birthplace of the U.S. Marine Corps (1775). New recreation opens 2026."},
{id:"pg02",name:"Mummers Museum",lat:39.9178,lng:-75.1602,addr:"1100 S 2nd St",desc:"South Philly's strangest tradition explained."},
{id:"pg03",name:"Magic Gardens",lat:39.9429,lng:-75.1593,addr:"1020 South St",desc:"Isaiah Zagar's mosaic labyrinth. Stunning photos."},
{id:"pg04",name:"The Rail Park",lat:39.9610,lng:-75.1550,addr:"1300 Noble St",desc:"Elevated park on abandoned rail line. Philly's High Line."},
{id:"pg05",name:"Graffiti Pier",lat:39.9720,lng:-75.1310,addr:"Delaware Ave & Cumberland St",desc:"Abandoned pier covered in street art. Raw Philly energy."},
{id:"pg06",name:"Woodlands Cemetery",lat:39.9470,lng:-75.2050,addr:"4000 Woodland Ave",desc:"National Historic Landmark garden cemetery. Free, stunning."},
];

// ─── TRANSIT ─────────────────────────────────────────────────────────
const RTS=[
{id:"MFL",name:"Market-Frankford (L)",type:"subway",color:RC.MFL,desc:"69th St to Frankford. 28 stops.",stops:[{id:"mfl01",name:"69th St TC",lat:39.9619,lng:-75.2559},{id:"mfl11",name:"15th St",lat:39.9527,lng:-75.1665},{id:"mfl14",name:"8th-Market",lat:39.9499,lng:-75.1530},{id:"mfl15",name:"5th St",lat:39.9491,lng:-75.1471},{id:"mfl16",name:"2nd St",lat:39.9475,lng:-75.1415},{id:"mfl17",name:"Spring Garden",lat:39.9611,lng:-75.1500},{id:"mfl19",name:"Berks",lat:39.9710,lng:-75.1340},{id:"mfl23",name:"Allegheny",lat:39.9918,lng:-75.1215},{id:"mfl28",name:"Frankford TC",lat:40.0230,lng:-75.0840}]},
{id:"BSL",name:"Broad Street (B)",type:"subway",color:RC.BSL,desc:"Fern Rock to NRG Station. 21 stops.",stops:[{id:"bsl01",name:"Fern Rock",lat:40.0380,lng:-75.1500},{id:"bsl09",name:"Cecil B. Moore",lat:39.9749,lng:-75.1567},{id:"bsl14",name:"City Hall",lat:39.9524,lng:-75.1636},{id:"bsl15",name:"Walnut-Locust",lat:39.9487,lng:-75.1650},{id:"bsl19",name:"Snyder",lat:39.9286,lng:-75.1693},{id:"bsl20",name:"Oregon",lat:39.9195,lng:-75.1700},{id:"bsl21",name:"NRG Station",lat:39.9058,lng:-75.1720}]},
{id:"B4",name:"Bus 4 — Stadium",type:"stadium",color:RC.stadium,desc:"Direct to Sports Complex.",stops:[{id:"b41",name:"5th & Market",lat:39.9498,lng:-75.1470},{id:"b42",name:"Broad & Walnut",lat:39.9487,lng:-75.1638},{id:"b43",name:"Broad & Oregon",lat:39.9195,lng:-75.1700},{id:"b44",name:"Sports Complex",lat:39.9060,lng:-75.1720}]},
{id:"B49",name:"Bus 49 — Fan Festival",type:"stadium",color:RC.stadium,desc:"City Hall to Lemon Hill.",stops:[{id:"b491",name:"City Hall",lat:39.9524,lng:-75.1636},{id:"b492",name:"Art Museum",lat:39.9645,lng:-75.1800},{id:"b493",name:"Lemon Hill",lat:39.9715,lng:-75.1830}]},
{id:"RR",name:"Airport Line",type:"regional",color:RC.regional,desc:"PHL Airport to Center City.",stops:[{id:"rr1",name:"Terminal E-F",lat:39.8764,lng:-75.2453},{id:"rr4",name:"30th St Station",lat:39.9556,lng:-75.1821},{id:"rr5",name:"Suburban",lat:39.9539,lng:-75.1681},{id:"rr6",name:"Jefferson",lat:39.9525,lng:-75.1580}]},
];

// ─── UTILS ───────────────────────────────────────────────────────────
function dKm(a,b,c,d){const R=6371,x=((c-a)*Math.PI)/180,y=((d-b)*Math.PI)/180,z=Math.sin(x/2)**2+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)**2;return R*2*Math.atan2(Math.sqrt(z),Math.sqrt(1-z))}
function dL(k){const m=k*0.621371;return m<0.1?`${Math.round(m*5280)} ft`:`${m.toFixed(1)} mi`}
function wM(k){return Math.max(1,Math.round((k/4.8)*60))}
function pC(t){return{monument:"#F09898",museum:"#F5E87A",park:"#7BD4A0",church:"#C4A8E0"}[t]||"#89CFF0"}
function tI(t){return{subway:"M",trolley:"T",bus:"B",regional:"R",stadium:"S"}[t]||"B"}
function gA(s,r){const v=(s+r).split("").reduce((a,c)=>a+c.charCodeAt(0),0);return{nm:((v*7)%12)+1,d:((v*13)%5)>2?Math.floor(((v*3)%4)+1):0}}
function nT(l,uLat,uLng){let b=null,bd=Infinity;const ref=uLat?{lat:uLat,lng:uLng}:l;for(const r of RTS)for(const s of r.stops){const d=dKm(ref.lat,ref.lng,s.lat,s.lng);if(d<bd){bd=d;b={route:r,stop:s,dist:d}}}return b}
function eC(c){return{fifa:"#E63946",america250:"#3B82F6",fireworks:"#F59E0B",concert:"#8B5CF6",festival:"#10B981",parade:"#EC4899"}[c]||"#89CFF0"}
function eL(c){return{fifa:"Soccer 2026",america250:"250th",fireworks:"July 4th",concert:"Sports",festival:"Arts",parade:"Parade"}[c]||c}
function fD(d){const dt=new Date(d+"T12:00:00");return dt.toLocaleDateString("en-US",{month:"short",day:"numeric"})}
function fCC(c){return{cheesesteak:"#FF6B35","fine-dining":"#C084FC",pizza:"#FBBF24",cafe:"#34D399","food-truck":"#F472B6",bar:"#60A5FA",israeli:"#F59E0B",american:"#818CF8",mexican:"#F97316","middle-eastern":"#2DD4BF",vietnamese:"#22D3EE",lebanese:"#FB923C",market:"#A78BFA","puerto-rican":"#FB7185",bakery:"#FBBF24",convenience:"#6EE7B7",seafood:"#22D3EE",brunch:"#FCA5A5",italian:"#F472B6",french:"#C084FC",thai:"#F59E0B",filipino:"#FB923C","korean-mexican":"#F97316",vegan:"#4ADE80",portuguese:"#F97316",georgian:"#E879F9","cocktail-bar":"#818CF8",cajun:"#F97316",steakhouse:"#EF4444",chinese:"#F43F5E",japanese:"#7DD3FC",indonesian:"#FBBF24",tibetan:"#C084FC",malaysian:"#34D399",dessert:"#FCA5A5"}[c]||"#89CFF0"}
function sC(t){return{atm:"#7BD4A0",bank:"#89CFF0",gas:"#E0A870",pharmacy:"#F09898",restroom:"#C4A8E0"}[t]||"#89CFF0"}
function cmC(t){return{shelter:"#F09898",meals:"#F5E87A",volunteer:"#7BD4A0"}[t]||"#89CFF0"}
const pL=p=>["","$","$$","$$$","$$$$"][p]||"";
const mkCATS=t=>[{id:"all",l:t.all,i:"⊞",c:"#89CFF0"},{id:"monument",l:t.monuments,i:"⛫",c:"#F09898"},{id:"museum",l:t.museums,i:"🏛",c:"#F5E87A"},{id:"park",l:t.parks,i:"🌳",c:"#7BD4A0"},{id:"church",l:t.churches,i:"⛪",c:"#C4A8E0"},{id:"unmarked",l:t.hidden,i:"👁",c:"#E0A870"},{id:"food",l:t.food,i:"🍴",c:"#FF6B35"},{id:"services",l:t.services,i:"📍",c:"#7BD4A0"},{id:"community",l:"Community",i:"❤",c:"#F09898"}];
const mkTTS=t=>[{id:"all",l:t.allLines},{id:"subway",l:t.subway},{id:"bus",l:t.bus},{id:"stadium",l:t.stadium},{id:"regional",l:t.regional}];
const mkECS=t=>[{id:"all",l:t.allEvents},{id:"fifa",l:t.fifa},{id:"america250",l:t.america250},{id:"fireworks",l:t.july4th},{id:"festival",l:t.arts},{id:"concert",l:t.sports},{id:"parade",l:t.parade}];
const mkSFS=t=>[{id:"all",l:t.all},{id:"atm",l:t.atm},{id:"bank",l:t.bank},{id:"gas",l:t.gas},{id:"pharmacy",l:t.pharmacy},{id:"restroom",l:t.restroom}];
const TODAY=new Date().toISOString().slice(0,10);
const haptic=()=>{try{navigator?.vibrate?.(10)}catch{}};

// ─── Styles (theme-aware) ────────────────────────────────────────────
const mkS=P=>({
  app:{position:"relative",width:"100%",maxWidth:480,margin:"0 auto",height:"100dvh",overflow:"hidden",background:P.bg,fontFamily:"system-ui,-apple-system,sans-serif",color:P.text,WebkitFontSmoothing:"antialiased"},
  sI:{width:"100%",height:42,padding:"0 40px 0 14px",background:P===DK?"rgba(15,17,23,0.88)":"rgba(255,255,255,0.92)",backdropFilter:"blur(20px)",border:`1px solid ${P.bdr}`,borderRadius:21,color:P.text,fontSize:14,outline:"none"},
  sh:ty=>({position:"absolute",bottom:0,left:0,right:0,zIndex:20,background:P.bgSheet,borderRadius:"24px 24px 0 0",transition:"transform 0.35s cubic-bezier(0.32,0.72,0,1)",transform:`translateY(${ty}px)`,boxShadow:"0 -8px 40px rgba(0,0,0,0.3)",touchAction:"none"}),
  ch:(a,c)=>({display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:20,cursor:"pointer",background:a?`${c}18`:"transparent",border:`1px solid ${a?`${c}40`:P.bdr}`,color:a?c:P.textSec,fontSize:12,fontWeight:500,whiteSpace:"nowrap",flexShrink:0}),
  cd:d=>({background:P.bgCard,borderRadius:P.r,padding:"12px 14px",marginBottom:8,cursor:"pointer",border:`1px solid ${P.bdr}`,animation:`fsu 0.3s ease ${d}s both`}),
  bg:c=>({display:"inline-flex",padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:600,background:`${c}18`,color:c,letterSpacing:0.3}),
  ov:{position:"absolute",inset:0,zIndex:30,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fi 0.2s ease"},
  dc:{width:"100%",maxWidth:480,background:P.bgSheet,borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",animation:"su 0.3s ease",maxHeight:"85dvh",overflowY:"auto"},
  cb:{width:34,height:34,borderRadius:17,border:`1px solid ${P.bdr}`,background:P.bgElev,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0},
  ir:{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:P.bgElev,borderRadius:P.rs,marginBottom:6},
  nv:{position:"absolute",bottom:0,left:0,right:0,zIndex:25,background:P===DK?"rgba(15,17,23,0.92)":"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",borderTop:`1px solid ${P.bdr}`,display:"flex",justifyContent:"space-around",alignItems:"center",paddingTop:10,paddingBottom:"calc(env(safe-area-inset-bottom, 8px) + 4px)",minHeight:64},
  ni:a=>({display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 16px",color:a?P.sky:P.textMut,position:"relative"}),
  cps:{display:"flex",gap:6,padding:"12px 14px 6px",overflowX:"auto",scrollbarWidth:"none"},
  lst:{padding:"0 14px 100px",overflowY:"auto",maxHeight:"calc(70dvh - 110px)",scrollbarWidth:"none"},
  cnt:{padding:"3px 14px 6px",fontSize:11,color:P.textMut,fontFamily:"monospace",letterSpacing:0.5},
  gl:{height:2,borderRadius:1,background:P.grad,opacity:0.5},
  tt:{fontSize:20,fontWeight:700,lineHeight:1.2,marginBottom:6},
  nm:{fontSize:14,fontWeight:600,marginBottom:3},
});

// ─── Leaflet Map ─────────────────────────────────────────────────────
function MapV({pins,selId,onPin,uLat,uLng,showT,tR,P}){
  const mapRef=useRef(null);const mapInst=useRef(null);const markersRef=useRef([]);const routesRef=useRef([]);const userRef=useRef(null);
  const isDark=P===DK;
  const tileUrl=isDark?"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png":"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  // Init map once
  useEffect(()=>{
    if(!mapRef.current||mapInst.current)return;
    const L=window.L;if(!L)return;
    const map=L.map(mapRef.current,{center:[39.9526,-75.1652],zoom:13,zoomControl:false,attributionControl:false});
    L.tileLayer(tileUrl,{maxZoom:18}).addTo(map);
    mapInst.current=map;
    return()=>{map.remove();mapInst.current=null};
  },[]);

  // Update tiles on theme change
  useEffect(()=>{
    if(!mapInst.current)return;const L=window.L;
    mapInst.current.eachLayer(l=>{if(l instanceof L.TileLayer)mapInst.current.removeLayer(l)});
    L.tileLayer(tileUrl,{maxZoom:18}).addTo(mapInst.current);
  },[isDark]);

  // Update pins
  useEffect(()=>{
    if(!mapInst.current)return;const L=window.L;
    markersRef.current.forEach(m=>mapInst.current.removeLayer(m));markersRef.current=[];
    pins.forEach(pin=>{
      const c=pin.pc||pC(pin.type||"");
      const sel=selId===pin.id;
      const size=sel?16:12;
      const icon=L.divIcon({className:"",html:`<div style="width:${size}px;height:${size}px;border-radius:50%;background:${c};border:2px solid white;box-shadow:0 0 ${sel?8:4}px ${c}80;transform:scale(${sel?1.3:1});transition:transform 0.2s"></div>`,iconSize:[size,size],iconAnchor:[size/2,size/2]});
      const marker=L.marker([pin.lat,pin.lng],{icon}).addTo(mapInst.current);
      marker.on("click",()=>{onPin(pin.id);haptic()});
      if(sel){marker.bindTooltip(pin.name,{permanent:true,direction:"top",offset:[0,-10],className:"phl-tooltip"}).openTooltip()}
      markersRef.current.push(marker);
    });
  },[pins,selId]);

  // Update transit routes
  useEffect(()=>{
    if(!mapInst.current)return;const L=window.L;
    routesRef.current.forEach(r=>mapInst.current.removeLayer(r));routesRef.current=[];
    if(showT&&tR){tR.forEach(r=>{const coords=r.stops.map(s=>[s.lat,s.lng]);
      const line=L.polyline(coords,{color:r.color,weight:3,opacity:0.7,dashArray:"8 4"}).addTo(mapInst.current);
      routesRef.current.push(line);
      r.stops.forEach(s=>{const dot=L.circleMarker([s.lat,s.lng],{radius:4,fillColor:r.color,color:"white",weight:1.5,fillOpacity:1}).addTo(mapInst.current);
        routesRef.current.push(dot)});
    })}
  },[showT,tR]);

  // Update user location
  useEffect(()=>{
    if(!mapInst.current)return;const L=window.L;
    if(userRef.current){mapInst.current.removeLayer(userRef.current);userRef.current=null}
    if(uLat){
      const icon=L.divIcon({className:"",html:'<div style="width:14px;height:14px;border-radius:7px;background:#3B82F6;border:2.5px solid white;box-shadow:0 0 12px #3B82F680"></div>',iconSize:[14,14],iconAnchor:[7,7]});
      userRef.current=L.marker([uLat,uLng],{icon,zIndexOffset:1000}).addTo(mapInst.current);
      mapInst.current.setView([uLat,uLng],14);
    }
  },[uLat,uLng]);

  // Fit bounds to pins
  useEffect(()=>{
    if(!mapInst.current||!pins.length)return;const L=window.L;
    if(uLat)return; // don't override user-centered view
    const bounds=L.latLngBounds(pins.map(p=>[p.lat,p.lng]));
    mapInst.current.fitBounds(bounds,{padding:[40,40],maxZoom:14});
  },[pins]);

  return<div ref={mapRef} style={{position:"absolute",inset:0,zIndex:1}}>
    <style>{`.phl-tooltip{background:${P.bgCard}!important;color:${P.text}!important;border:1px solid ${P.bdr}!important;border-radius:6px!important;font-size:10px!important;font-weight:600!important;padding:2px 6px!important;box-shadow:0 2px 8px rgba(0,0,0,0.3)!important}.phl-tooltip::before{border-top-color:${P.bgCard}!important}`}</style>
  </div>;
}

// ─── Onboarding ──────────────────────────────────────────────────────
function Onboarding({onDone,lang,onLang,P}){
  const[step,setStep]=useState(0);const t=TR[lang]||TR.en;
  if(step===0)return<div style={{position:"absolute",inset:0,zIndex:50,background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",animation:"fi 0.4s ease"}}>
    <div style={{fontSize:24,fontWeight:700,marginBottom:20,textAlign:"center"}}>{t.chooseLang}</div>
    <div style={{width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:8,maxHeight:"55dvh",overflowY:"auto",scrollbarWidth:"none"}}>
      {LANGUAGES.map(l=><div key={l.code} onClick={()=>{onLang(l.code);setStep(1);haptic()}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:lang===l.code?`${P.sky}15`:P.bgCard,border:`1px solid ${lang===l.code?`${P.sky}40`:P.bdr}`,cursor:"pointer"}}>
        <span style={{fontSize:18}}>{l.flag}</span><div><div style={{fontSize:14,fontWeight:600}}>{l.native}</div><div style={{fontSize:11,color:P.textMut}}>{l.name}</div></div>
        {lang===l.code&&<div style={{marginLeft:"auto",width:7,height:7,borderRadius:4,background:P.sky}}/>}
      </div>)}
    </div>
    <div style={{position:"absolute",bottom:16,fontSize:9,color:P.textHint,letterSpacing:3,fontFamily:"monospace"}}>LIL PILL STUDIOS</div>
  </div>;
  const steps=[{icon:"🧭",title:t.ob1Title,sub:t.ob1Sub,c:P.sky},{icon:"🚊",title:t.ob2Title,sub:t.ob2Sub,c:RC.BSL},{icon:"📅",title:t.ob3Title,sub:t.ob3Sub,c:P.coral}];
  const s=steps[step-1];
  return<div style={{position:"absolute",inset:0,zIndex:50,background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 30px",animation:"fi 0.4s ease"}}>
    <div style={{fontSize:48,marginBottom:20}}>{s.icon}</div>
    <div style={{fontSize:26,fontWeight:700,marginBottom:10,textAlign:"center"}}>{s.title}</div>
    <p style={{fontSize:14,color:P.textSec,textAlign:"center",lineHeight:1.6,maxWidth:300,marginBottom:36}}>{s.sub}</p>
    <div style={{display:"flex",gap:8,marginBottom:24}}>{steps.map((_,i)=><div key={i} style={{width:i===(step-1)?20:7,height:7,borderRadius:4,background:i===(step-1)?s.c:P.textHint,transition:"all 0.3s"}}/>)}</div>
    <button onClick={()=>{step<3?setStep(step+1):onDone();haptic()}} style={{padding:"12px 44px",borderRadius:22,border:"none",background:s.c,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer"}}>{step<3?t.next_btn:t.letsGo}</button>
    {step<3&&<div onClick={onDone} style={{marginTop:14,fontSize:13,color:P.textMut,cursor:"pointer"}}>{t.skip}</div>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════
export default function PhillyHub(){
  const[onboarded,setOB]=useState(()=>{try{return localStorage.getItem("ph_ob")==="1"}catch{return false}});
  const[isPro,setPro]=useState(()=>{try{return localStorage.getItem("ph_pro")==="1"}catch{return false}});
  const[lang,setLang]=useState(()=>{try{return localStorage.getItem("ph_lang")||"en"}catch{return"en"}});
  const[dark,setDark]=useState(()=>{try{const v=localStorage.getItem("ph_dark");if(v!==null)return v==="1";return window.matchMedia?.("(prefers-color-scheme:dark)").matches!==false}catch{return true}});
  const[showLP,setShowLP]=useState(false);
  const[tab,setTab]=useState("explore");
  const[cat,setCat]=useState("all");
  const[tF,setTF]=useState("all");
  const[eF,setEF]=useState("all");
  const[sF,setSF]=useState("all");
  const[srch,setSrch]=useState("");
  const[selPin,setSP]=useState(null);
  const[dtl,setDtl]=useState(null);
  const[sheet,setSh]=useState("half");
  const[favs,setFavs]=useState(()=>{try{return new Set(JSON.parse(localStorage.getItem("ph_favs")||"[]"))}catch{return new Set()}});
  const[uLat,setUL]=useState(null);const[uLng,setUN]=useState(null);
  const sheetRef=useRef(null);const dragRef=useRef(null);

  const P=dark?DK:LT;const S=useMemo(()=>mkS(P),[dark]);
  const t=TR[lang]||TR.en;
  const CATS=useMemo(()=>mkCATS(t),[lang]);
  const TTS=useMemo(()=>mkTTS(t),[lang]);
  const ECS=useMemo(()=>mkECS(t),[lang]);
  const SFS=useMemo(()=>mkSFS(t),[lang]);
  const allFood=useMemo(()=>isPro?[...FOOD_FREE,...FOOD_PREMIUM]:FOOD_FREE,[isPro]);
  const{events:remoteEV}=useRemoteEvents(EV);

  useEffect(()=>{try{localStorage.setItem("ph_favs",JSON.stringify([...favs]))}catch{}},[favs]);
  useEffect(()=>{initBilling(setPro)},[]);
  useEffect(()=>{try{localStorage.setItem("ph_lang",lang)}catch{}},[lang]);
  useEffect(()=>{try{localStorage.setItem("ph_dark",dark?"1":"0")}catch{}},[dark]);
  const tFav=useCallback(id=>{setFavs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});haptic()},[]);
  const rLoc=useCallback(()=>{navigator.geolocation?.getCurrentPosition(p=>{setUL(p.coords.latitude);setUN(p.coords.longitude)},()=>{},{enableHighAccuracy:true,timeout:8000})},[]);
  const finishOB=useCallback(()=>{setOB(true);try{localStorage.setItem("ph_ob","1")}catch{}},[]);
  const unlock=useCallback(()=>{purchaseLocalsGuide();haptic()},[]);
  const chLang=useCallback(c=>{setLang(c);setShowLP(false);try{localStorage.setItem("ph_lang",c)}catch{}},[]);

  // Sheet swipe
  const onShTS=e=>{const y=e.touches[0].clientY;dragRef.current={startY:y,curSheet:sheet}};
  const onShTM=e=>{if(!dragRef.current)return;const dy=e.touches[0].clientY-dragRef.current.startY;const cs=dragRef.current.curSheet;if(dy<-50&&cs!=="full"){setSh("full");dragRef.current.curSheet="full"}if(dy>50&&cs==="full"){setSh("half");dragRef.current.curSheet="half"}if(dy>100&&cs==="half"){setSh("peek");dragRef.current.curSheet="peek"}};
  const onShTE=()=>{dragRef.current=null};

  // Filters
  const fLm=useMemo(()=>{let l=LM;if(tab==="saved")l=l.filter(x=>favs.has(x.id));if(["food","services","community"].includes(cat))return[];if(cat==="unmarked")l=l.filter(x=>x.u);else if(cat!=="all")l=l.filter(x=>x.type===cat);if(srch.trim()){const q=srch.toLowerCase();l=l.filter(x=>x.name.toLowerCase().includes(q)||x.desc.toLowerCase().includes(q))}if(uLat)l=[...l].sort((a,b)=>dKm(uLat,uLng,a.lat,a.lng)-dKm(uLat,uLng,b.lat,b.lng));return l},[cat,srch,uLat,uLng,tab,favs]);
  const fFd=useMemo(()=>{if(cat!=="food")return[];let l=[...allFood];if(srch.trim()){const q=srch.toLowerCase();l=l.filter(x=>x.name.toLowerCase().includes(q)||x.cuisine.includes(q))}if(uLat)l.sort((a,b)=>dKm(uLat,uLng,a.lat,a.lng)-dKm(uLat,uLng,b.lat,b.lng));return l},[cat,srch,uLat,uLng,allFood]);
  const fSv=useMemo(()=>{if(cat!=="services")return[];let l=[...SVC];if(sF!=="all")l=l.filter(x=>x.type===sF);if(uLat)l.sort((a,b)=>dKm(uLat,uLng,a.lat,a.lng)-dKm(uLat,uLng,b.lat,b.lng));return l},[cat,sF,uLat,uLng]);
  const fCm=useMemo(()=>{if(cat!=="community")return[];return COMMUNITY},[cat]);
  const fEv=useMemo(()=>{let e=remoteEV.filter(x=>x.date>=TODAY);if(eF!=="all")e=e.filter(x=>x.cat===eF);if(srch.trim()){const q=srch.toLowerCase();e=e.filter(x=>x.title.toLowerCase().includes(q))}return e.sort((a,b)=>a.date.localeCompare(b.date))},[eF,srch,remoteEV]);
  const fR=useMemo(()=>tF==="all"?RTS:RTS.filter(r=>r.type===tF),[tF]);
  const shY=sheet==="peek"?420:sheet==="half"?240:0;
  const showT=tab==="transit";
  const mapPins=useMemo(()=>{if(tab==="events")return fEv.map(e=>({id:e.id,name:e.title,lat:e.lat,lng:e.lng,pc:eC(e.cat)}));if(cat==="food")return fFd.map(f=>({id:f.id,name:f.name,lat:f.lat,lng:f.lng,pc:fCC(f.cuisine)}));if(cat==="services")return fSv.map(s=>({id:s.id,name:s.name,lat:s.lat,lng:s.lng,pc:sC(s.type)}));if(cat==="community")return fCm.map(c=>({id:c.id,name:c.name,lat:c.lat,lng:c.lng,pc:cmC(c.type)}));return fLm},[tab,cat,fLm,fEv,fFd,fSv,fCm]);

  const NAV=[{id:"explore",icon:"🧭",l:t.explore},{id:"events",icon:"📅",l:t.events},{id:"transit",icon:"🚊",l:t.transit},{id:"saved",icon:"❤️",l:t.saved}];
  const openD=(tp,d)=>{setDtl({tp,d});haptic()};

  if(!onboarded)return<><style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes fsu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}*::-webkit-scrollbar{display:none}`}</style><Onboarding onDone={finishOB} lang={lang} onLang={chLang} P={P}/></>;

  return<div style={S.app}>
    <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes fsu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pu{0%,100%{opacity:.6}50%{opacity:1}}*{box-sizing:border-box;margin:0;padding:0}*::-webkit-scrollbar{display:none}input::placeholder{color:${P.textMut}}`}</style>

    <MapV pins={mapPins} selId={selPin} onPin={id=>{setSP(id);setSh("half")}} uLat={uLat} uLng={uLng} showT={showT} tR={fR} P={P}/>

    {/* Top bar */}
    <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,padding:"calc(env(safe-area-inset-top, 10px) + 6px) 14px 10px",display:"flex",gap:6,alignItems:"center"}}>
      <div style={{flex:1,position:"relative"}}><input type="text" placeholder={tab==="transit"?t.searchRoutes:tab==="events"?t.searchEvents:t.search} value={srch} onChange={e=>setSrch(e.target.value)} style={S.sI} onFocus={()=>setSh("full")}/></div>
      <div style={{width:38,height:38,borderRadius:19,border:`1px solid ${P.bdr}`,background:P.bgCard,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}} onClick={rLoc}><span style={{fontSize:16}}>{uLat?"📍":"🔵"}</span></div>
      <div style={{width:38,height:38,borderRadius:19,border:`1px solid ${P.bdr}`,background:P.bgCard,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}} onClick={()=>setShowLP(true)}><span style={{fontSize:14}}>{LANGUAGES.find(l=>l.code===lang)?.flag||"🌐"}</span></div>
    </div>

    {/* Settings/Language overlay */}
    {showLP&&<div style={S.ov} onClick={()=>setShowLP(false)}><div style={{...S.dc,maxHeight:"75dvh"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={S.tt}>{t.settings}</div><div style={S.cb} onClick={()=>setShowLP(false)}>✕</div></div>
      <div style={S.gl}/>
      {/* Dark/Light toggle */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${P.bdr}`}}>
        <span style={{fontSize:14}}>{dark?"🌙 Dark Mode":"☀️ Light Mode"}</span>
        <div onClick={()=>{setDark(!dark);haptic()}} style={{width:48,height:26,borderRadius:13,background:dark?P.sky:`${P.textMut}`,padding:2,cursor:"pointer",transition:"background 0.3s"}}>
          <div style={{width:22,height:22,borderRadius:11,background:"white",transform:dark?"translateX(22px)":"translateX(0)",transition:"transform 0.3s"}}/>
        </div>
      </div>
      {/* Language */}
      <div style={{fontSize:13,fontWeight:600,padding:"14px 0 8px"}}>{t.language}</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {LANGUAGES.map(l=><div key={l.code} onClick={()=>chLang(l.code)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:lang===l.code?`${P.sky}15`:P.bgCard,border:`1px solid ${lang===l.code?`${P.sky}40`:P.bdr}`,cursor:"pointer"}}>
          <span style={{fontSize:16}}>{l.flag}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{l.native}</div><div style={{fontSize:10,color:P.textMut}}>{l.name}</div></div>
          {lang===l.code&&<div style={{width:6,height:6,borderRadius:3,background:P.sky}}/>}
        </div>)}
      </div>
      <div onClick={()=>{restorePurchases();setShowLP(false)}} style={{marginTop:14,padding:"8px 0",textAlign:"center",fontSize:11,color:P.textMut,cursor:"pointer"}}>{t.restorePurchases}</div>
    </div></div>}

    {/* Sheet */}
    <div ref={sheetRef} style={S.sh(shY)} onTouchStart={onShTS} onTouchMove={onShTM} onTouchEnd={onShTE}>
      <div style={{width:36,height:4,borderRadius:2,margin:"8px auto 0",background:P.textHint}} onClick={()=>setSh(sheet==="full"?"half":sheet==="half"?"full":"half")}/>

      {/* EXPLORE */}
      {tab==="explore"&&<>
        <div style={S.cps}>{CATS.map(c=><div key={c.id} style={S.ch(cat===c.id,c.c||P.sky)} onClick={()=>{setCat(c.id);setSrch("");setSh("half");haptic()}}>{c.i} {c.l}</div>)}</div>
        {cat==="services"&&<div style={{...S.cps,paddingTop:0}}>{SFS.map(sf=><div key={sf.id} style={S.ch(sF===sf.id,P.sky)} onClick={()=>{setSF(sf.id);haptic()}}>{sf.l}</div>)}</div>}
        <div style={S.cnt}>{cat==="food"?`${fFd.length} ${t.spots}`:cat==="services"?`${fSv.length} ${t.nearby}`:cat==="community"?`${fCm.length}`:`${fLm.length} ${fLm.length===1?t.result:t.results}`}</div>
        <div style={S.lst}>
          {/* Premium upsell */}
          {cat==="all"&&!isPro&&<><div style={{...S.cd(0),background:`${P.gold}08`,border:`1px solid ${P.gold}25`}} onClick={unlock}>
            <div style={{fontSize:14,fontWeight:700,color:P.gold}}>👑 {t.localsGuide}</div>
            <div style={{fontSize:11,color:P.textSec,margin:"4px 0 8px"}}>{t.walkingTours}</div>
            <div style={{padding:"8px 0",borderRadius:8,background:P.gradG,textAlign:"center",fontSize:13,fontWeight:600,color:"#0F1117"}}>{t.unlockFor}</div>
          </div>
          <div style={{textAlign:"center",padding:"4px 0 12px",cursor:"pointer"}} onClick={()=>{restorePurchases();haptic()}}><span style={{fontSize:12,color:P.sky,fontWeight:500}}>{t.restorePurchases}</span></div></>}
          {/* Premium tours */}
          {cat==="all"&&isPro&&<>{PTOURS.map((tour,i)=><div key={tour.id} style={{...S.cd(i*0.04),borderColor:`${P.gold}20`}} onClick={()=>openD("tour",tour)}>
            <div style={S.nm}>👑 {tour.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}><span style={S.bg(P.gold)}>{tour.stops.length} stops</span><span style={{fontSize:11,color:P.textMut}}>{tour.dur}</span><span style={{fontSize:11,color:P.textMut}}>· {tour.dist}</span></div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{tour.tags.map(tag=><span key={tag} style={{fontSize:9,padding:"2px 6px",borderRadius:10,background:`${P.sky}12`,color:P.sky,fontWeight:500}}>{tag}</span>)}</div>
          </div>)}{PGEMS.map((g,i)=><div key={g.id} style={{...S.cd(i*0.04),borderColor:`${P.gold}15`}} onClick={()=>openD("gem",g)}>
            <div style={S.nm}>💎 {g.name}</div><div style={{fontSize:11,color:P.textMut}}>{g.desc.slice(0,80)}...</div>
          </div>)}</>}
          {/* Landmarks */}
          {!["food","services","community"].includes(cat)&&fLm.map((lm,i)=>{const c=pC(lm.type);const nt=nT(lm,uLat,uLng);return<div key={lm.id} style={S.cd(i*0.03)} onClick={()=>{openD("lm",lm);setSP(lm.id)}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}><div style={S.nm}>{lm.name}</div><div style={{display:"flex",gap:6,flexWrap:"wrap",fontSize:11}}><span style={S.bg(c)}>{lm.type}</span>{lm.u&&<span style={S.bg(P.orange)}>{t.hidden}</span>}{uLat&&<span style={{color:P.textMut}}>{dL(dKm(uLat,uLng,lm.lat,lm.lng))}</span>}</div></div>
              <div style={{padding:4,cursor:"pointer",flexShrink:0}} onClick={e=>{e.stopPropagation();tFav(lm.id)}}>{favs.has(lm.id)?"⭐":"☆"}</div></div>
            {nt&&<div style={{display:"flex",gap:6,marginTop:6,fontSize:10,color:P.textMut}}><span style={{color:nt.route.color,fontWeight:600}}>{nt.route.id}</span> {nt.stop.name} · {wM(nt.dist)} {t.min}</div>}
          </div>})}
          {/* Food */}
          {cat==="food"&&<>{!isPro&&<div style={{padding:"8px 12px",marginBottom:8,borderRadius:8,background:`${P.gold}08`,border:`1px solid ${P.gold}20`,fontSize:11,color:P.gold,cursor:"pointer"}} onClick={unlock}>👑 {t.unlockFor} — {FOOD_PREMIUM.length} more spots</div>}
          {fFd.map((f,i)=><div key={f.id} style={S.cd(i*0.03)} onClick={()=>openD("food",f)}>
            <div style={S.nm}>{f.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",fontSize:11}}><span style={S.bg(fCC(f.cuisine))}>{f.cuisine}</span><span style={{color:P.yellow}}>{pL(f.price)}</span><span>★{f.rating}</span>{f.local&&<span style={S.bg(P.green)}>{t.local}</span>}{uLat&&<span style={{color:P.textMut}}>{dL(dKm(uLat,uLng,f.lat,f.lng))}</span>}</div>
            {f.hours&&<div style={{fontSize:10,color:P.textMut,marginTop:3}}>🕐 {f.hours}</div>}
          </div>)}<div style={{fontSize:9,color:P.textHint,textAlign:"center",padding:"8px 0"}}>Hours are approximate. Confirm before visiting.</div></>}
          {/* Services */}
          {cat==="services"&&fSv.map((sv,i)=><div key={sv.id} style={S.cd(i*0.03)} onClick={()=>openD("svc",sv)}>
            <div style={S.nm}>{sv.name}</div><div style={{display:"flex",gap:6,fontSize:11}}><span style={S.bg(sC(sv.type))}>{sv.type}</span>{sv.h24&&<span style={{color:P.green}}>24h</span>}{uLat&&<span style={{color:P.textMut}}>{dL(dKm(uLat,uLng,sv.lat,sv.lng))}</span>}</div>
            <div style={{fontSize:10,color:P.textMut,marginTop:2}}>{sv.addr}</div>
          </div>)}
          {/* Community */}
          {cat==="community"&&fCm.map((cm,i)=><div key={cm.id} style={S.cd(i*0.03)} onClick={()=>openD("cm",cm)}>
            <div style={S.nm}>{cm.name}</div><div style={{display:"flex",gap:6,fontSize:11}}><span style={S.bg(cmC(cm.type))}>{cm.type}</span>{cm.volunteer&&<span style={S.bg(P.green)}>Volunteer OK</span>}</div>
            <div style={{fontSize:11,color:P.textSec,marginTop:3}}>{cm.desc.slice(0,100)}...</div>
            <div style={{fontSize:10,color:P.textMut,marginTop:2}}>📍 {cm.addr} · 🕐 {cm.hours}</div>
          </div>)}
        </div>
      </>}

      {/* EVENTS */}
      {tab==="events"&&<>
        <div style={S.cps}>{ECS.map(ec=><div key={ec.id} style={S.ch(eF===ec.id,eC(ec.id)||P.sky)} onClick={()=>{setEF(ec.id);haptic()}}>{ec.l}</div>)}</div>
        <div style={S.cnt}>{fEv.length} {fEv.length===1?t.event_count:t.events_count}</div>
        <div style={S.lst}>{fEv.map((ev,i)=>{const c=eC(ev.cat);return<div key={ev.id} style={S.cd(i*0.04)} onClick={()=>openD("ev",ev)}>
          <div style={{display:"flex",gap:10}}><div style={{width:42,minHeight:42,borderRadius:8,background:`${c}12`,border:`1px solid ${c}25`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:9,fontWeight:700,color:c,fontFamily:"monospace"}}>{fD(ev.date).split(" ")[0]}</span><span style={{fontSize:15,fontWeight:700,color:c,lineHeight:1}}>{fD(ev.date).split(" ")[1]}</span></div>
            <div style={{flex:1,minWidth:0}}><div style={S.nm}>{ev.title}</div><div style={{display:"flex",gap:6,fontSize:11}}><span style={S.bg(c)}>{eL(ev.cat)}</span><span style={{color:P.textMut}}>{ev.time}</span>{ev.free&&<span style={S.bg(P.green)}>{t.free}</span>}</div>
              <div style={{fontSize:10,color:P.textMut,marginTop:2}}>{ev.venue}</div></div></div>
        </div>})}</div>
      </>}

      {/* TRANSIT */}
      {tab==="transit"&&<>
        <div style={S.cps}>{TTS.map(tt=><div key={tt.id} style={S.ch(tF===tt.id,P.sky)} onClick={()=>{setTF(tt.id);haptic()}}>{tt.l}</div>)}</div>
        <div style={S.cnt}>{fR.length} {t.routes} · {fR.reduce((a,r)=>a+r.stops.length,0)} {t.stops}</div>
        <div style={S.lst}>{fR.map((r,ri)=><div key={r.id} style={S.cd(ri*0.05)}>
          <div style={{display:"flex",gap:8,marginBottom:6}}><span style={{fontSize:16}}>{tI(r.type)==="M"?"🚇":tI(r.type)==="S"?"🏟️":"🚌"}</span><div><div style={S.nm}>{r.name}</div><div style={{display:"flex",gap:6}}><span style={S.bg(r.color)}>{r.type}</span><span style={{fontSize:11,color:P.textMut}}>{r.stops.length} {t.stops}</span></div></div></div>
          <div style={{fontSize:11,color:P.textMut,marginBottom:6}}>{r.desc}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>{r.stops.map(st=>{const a=gA(st.id,r.id);return<div key={st.id} onClick={e=>{e.stopPropagation();openD("stop",{st,r})}} style={{display:"flex",gap:4,padding:"3px 6px",borderRadius:5,background:P.bgElev,border:`1px solid ${P.bdr}`,cursor:"pointer",fontSize:10}}>
            <span style={{width:4,height:4,borderRadius:2,background:r.color,marginTop:3}}/><span style={{color:P.textSec}}>{st.name}</span><span style={{color:a.d>0?P.coral:P.green,fontWeight:600}}>{a.nm}m</span>
          </div>})}</div>
        </div>)}</div>
      </>}

      {/* SAVED */}
      {tab==="saved"&&<>
        <div style={{padding:"12px 14px 6px",fontSize:15,fontWeight:600}}>{t.saved} <span style={{fontSize:11,color:P.textMut}}>{fLm.length}</span></div>
        <div style={S.lst}>{fLm.length===0?<div style={{textAlign:"center",padding:"40px 20px",color:P.textMut}}>❤️<p style={{marginTop:10,fontSize:13}}>{t.starToSave}</p></div>
          :fLm.map((lm,i)=><div key={lm.id} style={S.cd(i*0.04)} onClick={()=>{openD("lm",lm);setSP(lm.id)}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={S.nm}>{lm.name}</div><span style={S.bg(pC(lm.type))}>{lm.type}</span></div><div style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();tFav(lm.id)}}>⭐</div></div></div>)}</div>
      </>}
    </div>

    {/* DETAIL */}
    {dtl&&<div style={S.ov} onClick={()=>setDtl(null)}><div style={S.dc} onClick={e=>e.stopPropagation()}>
      {dtl.tp==="lm"&&(()=>{const lm=dtl.d;const c=pC(lm.type);const nt=nT(lm,uLat,uLng);return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>{lm.name}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><span style={S.bg(c)}>{lm.type}</span>{lm.u&&<span style={S.bg(P.orange)}>{t.unmarked}</span>}{lm.year&&<span style={{fontSize:11,color:P.textMut}}>{t.est} {lm.year}</span>}</div></div>
          <div style={{display:"flex",gap:6}}><div style={S.cb} onClick={()=>tFav(lm.id)}>{favs.has(lm.id)?"⭐":"☆"}</div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div></div>
        <div style={S.gl}/><p style={{fontSize:13,lineHeight:1.6,color:P.textSec,margin:"12px 0"}}>{lm.desc}</p>
        <div style={S.ir}>📍 {lm.addr}</div>
        {uLat&&<div style={S.ir}>📏 {dL(dKm(uLat,uLng,lm.lat,lm.lng))} {t.fromYou}</div>}
        {nt&&<div style={S.ir}><span style={{color:nt.route.color,fontWeight:600}}>{nt.route.id}</span> {nt.stop.name} · {wM(nt.dist)} {t.minWalk}</div>}
      </>})()}
      {dtl.tp==="ev"&&(()=>{const ev=dtl.d;const c=eC(ev.cat);return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>{ev.title}</div><div style={{display:"flex",gap:6}}><span style={S.bg(c)}>{eL(ev.cat)}</span>{ev.free&&<span style={S.bg(P.green)}>{t.free}</span>}</div></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={S.gl}/><div style={{margin:"12px 0"}}><div style={{fontSize:16,fontWeight:700,color:c}}>{fD(ev.date)} · {ev.time}</div><div style={{fontSize:13,color:P.textSec,marginTop:4}}>{ev.desc}</div></div>
        <div style={S.ir}>📍 {ev.addr}</div>
        <div style={S.ir}>🏟️ {ev.venue}</div>
        {ev.tix&&<div style={{...S.ir,cursor:"pointer",color:c,fontWeight:600}} onClick={()=>window.open(ev.tix,"_blank")}>🎟️ {t.getTickets}</div>}
      </>})()}
      {dtl.tp==="food"&&(()=>{const f=dtl.d;const c=fCC(f.cuisine);const nt=nT(f,uLat,uLng);return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>{f.name}</div><div style={{display:"flex",gap:6}}><span style={S.bg(c)}>{f.cuisine}</span><span style={{color:P.yellow}}>{pL(f.price)}</span><span>★{f.rating}</span>{f.local&&<span style={S.bg(P.green)}>{t.localPick}</span>}</div></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={S.gl}/><p style={{fontSize:13,lineHeight:1.6,color:P.textSec,margin:"12px 0"}}>{f.desc}</p>
        <div style={S.ir}>📍 {f.addr}</div>
        {f.hours&&<div style={S.ir}>🕐 {f.hours}</div>}
        {uLat&&<div style={S.ir}>📏 {dL(dKm(uLat,uLng,f.lat,f.lng))} {t.away}</div>}
        {nt&&<div style={S.ir}><span style={{color:nt.route.color,fontWeight:600}}>{nt.route.id}</span> {nt.stop.name} · {wM(nt.dist)} {t.minWalk}</div>}
        <div style={{fontSize:9,color:P.textHint,marginTop:8}}>Hours are approximate. Please confirm before visiting.</div>
      </>})()}
      {dtl.tp==="stop"&&(()=>{const{st,r}=dtl.d;const a=gA(st.id,r.id);return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div><span style={S.bg(r.color)}>{r.id}</span><div style={S.tt}>{st.name}</div><span style={{fontSize:12,color:P.textSec}}>{r.name}</span></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={S.gl}/><div style={{margin:"12px 0"}}><div style={{display:"flex",gap:8,marginBottom:8}}><span style={{fontWeight:600}}>{t.live}</span>{a.d>0&&<span style={{color:P.coral}}>{t.delayed}</span>}</div>
          <div style={{fontSize:18,fontWeight:700,color:a.d>0?P.coral:P.green}}>{a.nm<=2?t.now:`${a.nm}m`}</div>
          {a.d>0&&<div style={{fontSize:11,color:P.coral,marginTop:4}}>~{a.d} {t.runningBehind}</div>}
        </div>
        <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{t.stops} ({r.stops.length})</div>
        {r.stops.map(s=>{const cur=s.id===st.id;return<div key={s.id} style={{display:"flex",gap:8,padding:"3px 0",fontSize:12,color:cur?P.text:P.textMut,fontWeight:cur?600:400}}>
          <span style={{width:8,height:8,borderRadius:4,background:cur?r.color:`${r.color}40`,marginTop:3,flexShrink:0}}/>{s.name}{cur&&<span style={{fontSize:9,color:r.color,fontWeight:700,marginLeft:4}}>{t.here}</span>}
        </div>})}
      </>})()}
      {dtl.tp==="svc"&&(()=>{const sv=dtl.d;return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div><div style={S.tt}>{sv.name}</div><div style={{display:"flex",gap:6}}><span style={S.bg(sC(sv.type))}>{sv.type}</span>{sv.h24&&<span style={S.bg(P.green)}>24h</span>}</div></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={S.gl}/><div style={S.ir}>📍 {sv.addr}</div>
        {uLat&&<div style={S.ir}>📏 {dL(dKm(uLat,uLng,sv.lat,sv.lng))} {t.away}</div>}
      </>})()}
      {dtl.tp==="cm"&&(()=>{const cm=dtl.d;return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>{cm.name}</div><div style={{display:"flex",gap:6}}><span style={S.bg(cmC(cm.type))}>{cm.type}</span>{cm.volunteer&&<span style={S.bg(P.green)}>Volunteer OK</span>}</div></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={S.gl}/><p style={{fontSize:13,lineHeight:1.6,color:P.textSec,margin:"12px 0"}}>{cm.desc}</p>
        <div style={S.ir}>📍 {cm.addr}</div>
        <div style={S.ir}>🕐 {cm.hours}</div>
      </>})()}
      {dtl.tp==="tour"&&(()=>{const tour=dtl.d;const stopData=tour.stops.map(s=>{const spot=LM.find(l=>l.id===s.sid)||FOOD_FREE.find(f=>f.id===s.sid);return{...s,spot}});return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>👑 {tour.name}</div><div style={{display:"flex",gap:6,flexWrap:"wrap"}}><span style={S.bg(P.gold)}>{tour.stops.length} stops</span><span style={{fontSize:11,color:P.textMut}}>{tour.dur}</span><span style={{fontSize:11,color:P.textMut}}>· {tour.dist}</span></div></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>{tour.tags.map(tag=><span key={tag} style={{fontSize:10,padding:"3px 8px",borderRadius:12,background:`${P.sky}12`,color:P.sky,fontWeight:500}}>{tag}</span>)}</div>
        <div style={{height:2,background:P.gradG,borderRadius:1,opacity:0.6}}/>
        <p style={{fontSize:13,lineHeight:1.6,color:P.textSec,margin:"12px 0"}}>{tour.desc}</p>
        <div style={{...S.ir,background:`${P.sky}08`,border:`1px solid ${P.sky}20`}}>🧭 <span style={{fontSize:12,color:P.sky}}>{tour.direction}</span></div>
        <div style={{...S.ir,background:`${P.gold}08`,border:`1px solid ${P.gold}20`}}>⏰ <span style={{fontSize:12,color:P.gold}}>{tour.bestTime}</span></div>
        <div style={{...S.ir,background:`${P.green}08`,border:`1px solid ${P.green}20`}}>💡 <span style={{fontSize:12,color:P.green}}>{tour.tip}</span></div>
        <div style={{fontSize:13,fontWeight:600,margin:"14px 0 8px"}}>Route ({tour.stops.length} stops)</div>
        {stopData.map((s,i)=>{const spot=s.spot;const nextSpot=i<stopData.length-1?stopData[i+1].spot:null;const legDist=nextSpot&&spot?dKm(spot.lat,spot.lng,nextSpot.lat,nextSpot.lng):0;return spot?<div key={s.sid}>
          <div style={{display:"flex",gap:10,padding:"8px 0"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}>
              <div style={{width:26,height:26,borderRadius:13,background:`${P.gold}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:P.gold}}>{i+1}</div>
              {i<stopData.length-1&&<div style={{width:2,flex:1,background:`${P.gold}20`,marginTop:4}}/>}
            </div>
            <div style={{flex:1,paddingBottom:8}}>
              <div style={{fontSize:14,fontWeight:600}}>{spot.name}</div>
              {spot.addr&&<div style={{fontSize:10,color:P.textMut,marginTop:1}}>📍 {spot.addr}</div>}
              <div style={{fontSize:12,color:P.textSec,marginTop:4,lineHeight:1.5,fontStyle:"italic"}}>{s.note}</div>
            </div>
          </div>
          {i<stopData.length-1&&legDist>0&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"2px 0 6px 12px",fontSize:10,color:P.textMut}}>
            <span style={{flex:"0 0 auto"}}>↓</span><span>{dL(legDist)} walk{legDist>3?" (consider transit)":""}</span>
          </div>}
        </div>:null})}
        <div style={{marginTop:12,padding:"12px",borderRadius:10,background:P.sky,textAlign:"center",cursor:"pointer",fontWeight:600,fontSize:14,color:"#fff"}} onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${tour.startLat},${tour.startLng}&travelmode=walking`,"_blank")}>🗺️ Navigate to Start</div>
      </>})()}
      {dtl.tp==="gem"&&(()=>{const g=dtl.d;return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>💎 {g.name}</div><span style={S.bg(P.gold)}>{t.hiddenGem}</span></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={{height:2,background:P.gradG,borderRadius:1,opacity:0.6}}/><p style={{fontSize:13,lineHeight:1.6,color:P.textSec,margin:"12px 0"}}>{g.desc}</p>
        <div style={S.ir}>📍 {g.addr}</div>
        {uLat&&<div style={S.ir}>📏 {dL(dKm(uLat,uLng,g.lat,g.lng))} {t.away}</div>}
      </>})()}
    </div></div>}

    {/* Nav */}
    <div style={S.nv}>{NAV.map(n=><div key={n.id} style={S.ni(tab===n.id)} onClick={()=>{if(tab===n.id){setSh(prev=>prev==="peek"?"half":prev==="half"?"full":"half")}else{setTab(n.id);setSrch("");setSh("half");if(n.id==="explore")setCat("all")}haptic()}}><span style={{fontSize:18}}>{n.icon}</span><span style={{fontSize:10,fontWeight:500}}>{n.l}</span>{tab===n.id&&<div style={{position:"absolute",top:0,width:18,height:2,borderRadius:1,background:P.sky}}/>}</div>)}</div>
  </div>;
}
