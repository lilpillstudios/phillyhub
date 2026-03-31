/**
 * food-data.js — PhillyHub Restaurant Database
 * Lil Pill Studios © 2026
 *
 * 80 real Philadelphia restaurants curated from:
 * - Philadelphia Magazine "50 Best Restaurants" (2024-2025)
 * - Philadelphia Inquirer "Top 10" + "The 76" (2024-2025)  
 * - James Beard Award winners/nominees
 * - Resy staff picks 2024
 * - Best of Philly annual awards
 *
 * First 20 = free tier (classic Philly + essential tourist spots)
 * Remaining 60 = premium Local's Guide
 *
 * Hours disclaimer: Hours shown are approximate and may vary.
 * Always confirm with the restaurant before visiting.
 */

export const FOOD_FREE = [
  // ─── THE CLASSICS (cheesesteaks, roast pork, iconic) ───
  {id:"f01",name:"Pat's King of Steaks",lat:39.9335,lng:-75.1593,addr:"1237 E Passyunk Ave",cuisine:"cheesesteak",price:1,rating:4.2,local:true,hours:"24/7",desc:"The original since 1930. Order fast — 'Whiz wit' is the move."},
  {id:"f02",name:"Geno's Steaks",lat:39.9333,lng:-75.1589,addr:"1219 S 9th St",cuisine:"cheesesteak",price:1,rating:4.1,local:true,hours:"24/7",desc:"Pat's rival since 1966. Neon-lit corner across the street."},
  {id:"f03",name:"Jim's Steaks on South",lat:39.9428,lng:-75.1571,addr:"400 South St",cuisine:"cheesesteak",price:1,rating:4.4,local:true,hours:"Mon-Sat 10am-1am, Sun 11am-10pm",desc:"Reopened after the 2022 fire. Many locals say the real best."},
  {id:"f04",name:"John's Roast Pork",lat:39.9228,lng:-75.1355,addr:"14 E Snyder Ave",cuisine:"cheesesteak",price:1,rating:4.6,local:true,hours:"Mon-Fri 7am-3pm, Sat 7am-2pm",desc:"James Beard Award 2006. The roast pork might beat the cheesesteak."},
  {id:"f05",name:"Reading Terminal Market",lat:39.9533,lng:-75.1592,addr:"1136 Arch St",cuisine:"market",price:1,rating:4.7,local:true,hours:"Daily 8am-6pm",desc:"80+ vendors. DiNic's roast pork, Beiler's donuts, Amish stands."},
  // ─── ESSENTIAL DINING ───
  {id:"f06",name:"Zahav",lat:39.9467,lng:-75.1448,addr:"237 St James Pl",cuisine:"israeli",price:3,rating:4.8,local:false,hours:"Sun-Thu 5-10pm, Fri-Sat 5-11pm",desc:"James Beard Outstanding Restaurant. Modern Israeli. Reserve weeks ahead."},
  {id:"f07",name:"Federal Donuts",lat:39.9471,lng:-75.1465,addr:"1219 S 2nd St",cuisine:"cafe",price:1,rating:4.5,local:true,hours:"Daily 7am-7pm",desc:"Korean fried chicken + donuts. Multiple locations citywide."},
  {id:"f08",name:"Vernick Food & Drink",lat:39.9502,lng:-75.1720,addr:"2031 Walnut St",cuisine:"american",price:3,rating:4.6,local:false,hours:"Mon-Sat 5-10pm",desc:"Rittenhouse. The cultured butter toast changes lives."},
  {id:"f09",name:"Pizzeria Beddia",lat:39.9700,lng:-75.1340,addr:"1313 N Lee St",cuisine:"pizza",price:2,rating:4.5,local:true,hours:"Wed-Sun 5-10pm",desc:"Was named best pizza in America by Bon Appétit. Still incredible."},
  {id:"f10",name:"El Vez",lat:39.9462,lng:-75.1561,addr:"121 S 13th St",cuisine:"mexican",price:2,rating:4.3,local:false,hours:"Daily 11:30am-11pm",desc:"Upscale Mexican. Strong margaritas. Great for groups."},
  // ─── QUICK EATS & CAFES ───
  {id:"f11",name:"Huda",lat:39.9548,lng:-75.1629,addr:"1301 Walnut St",cuisine:"middle-eastern",price:2,rating:4.4,local:true,hours:"Mon-Sat 11am-9pm",desc:"Palestinian cafe. Fresh hummus, falafel, shawarma. Perfect lunch."},
  {id:"f12",name:"Goldie",lat:39.9505,lng:-75.1598,addr:"1526 Sansom St",cuisine:"middle-eastern",price:1,rating:4.3,local:true,hours:"Mon-Sat 11am-8pm",desc:"Falafel and tehina shakes from the Zahav team. Fast, cheap, perfect."},
  {id:"f13",name:"South Philly Barbacoa",lat:39.9295,lng:-75.1500,addr:"1140 S 9th St (inside Casa México)",cuisine:"mexican",price:1,rating:4.6,local:true,hours:"Sat-Sun 9am-3pm",desc:"James Beard Award. Barbacoa tacos at the Italian Market. Weekend-only."},
  {id:"f14",name:"Talula's Daily",lat:39.9488,lng:-75.1745,addr:"208 W Washington Sq",cuisine:"cafe",price:2,rating:4.5,local:false,hours:"Mon-Fri 7am-3pm, Sat-Sun 8am-3pm",desc:"Rittenhouse brunch. Farm-to-table sandwiches and pastries."},
  {id:"f15",name:"Cleo Bagels",lat:39.9550,lng:-75.2180,addr:"4530 Baltimore Ave",cuisine:"bakery",price:1,rating:4.4,local:true,hours:"Wed-Sun 7am-2pm",desc:"Best of Philly 2024. Inventive bagels including the Ramen Things sandwich."},
  // ─── TOURIST-ACCESSIBLE GREATS ───
  {id:"f16",name:"Vietnam Restaurant",lat:39.9567,lng:-75.1575,addr:"221 N 11th St",cuisine:"vietnamese",price:2,rating:4.5,local:true,hours:"Daily 11am-10pm",desc:"James Beard Award 2024. Chinatown staple since 1984."},
  {id:"f17",name:"The Franklin Fountain",lat:39.9508,lng:-75.1436,addr:"116 Market St",cuisine:"dessert",price:1,rating:4.6,local:false,hours:"Daily 11am-11pm",desc:"Old City ice cream parlor. Best ice cream cake in Philly (Best of Philly)."},
  {id:"f18",name:"Suraya",lat:39.9725,lng:-75.1340,addr:"1528 Frankford Ave",cuisine:"lebanese",price:3,rating:4.7,local:false,hours:"Tue-Thu 5-10pm, Fri-Sat 5-11pm, Sun 10am-3pm",desc:"Fishtown. Gorgeous space. The mezze spread is unmatched."},
  {id:"f19",name:"Wawa (multiple locations)",lat:39.9510,lng:-75.1555,addr:"Various",cuisine:"convenience",price:1,rating:4.0,local:true,hours:"24/7",desc:"It's a Philly thing. Hoagies, coffee, snacks. Tourists need the experience."},
  {id:"f20",name:"Amy's Pastelillos",lat:39.9470,lng:-75.1520,addr:"Inside Reading Terminal Market",cuisine:"puerto-rican",price:1,rating:4.5,local:true,hours:"Mon-Sat 8am-6pm",desc:"Esquire's Best New Restaurants in America 2024. Puerto Rican comfort food."},
];

export const FOOD_PREMIUM = [
  // ─── FINE DINING & TASTING MENUS ───
  {id:"fp01",name:"Friday Saturday Sunday",lat:39.9498,lng:-75.1720,addr:"261 S 21st St",cuisine:"american",price:4,rating:4.9,local:false,hours:"Wed-Sat 5:30pm (tasting menu)",desc:"Michelin star. #16 North America by World's 50 Best. Oxtail beignets."},
  {id:"fp02",name:"Her Place Supper Club",lat:39.9510,lng:-75.1680,addr:"1740 Sansom St",cuisine:"american",price:4,rating:4.8,local:false,hours:"Thu-Sat evenings (reservation only)",desc:"Amanda Shulman's supper-club-style dining. Truffles, caviar, casual magic."},
  {id:"fp03",name:"Kalaya",lat:39.9695,lng:-75.1345,addr:"764 S Palmer St",cuisine:"thai",price:3,rating:4.8,local:false,hours:"Wed-Mon 5-10pm",desc:"James Beard Award. Authentic Thai that's hard to find outside Thailand."},
  {id:"fp04",name:"Vetri Cucina",lat:39.9494,lng:-75.1550,addr:"1312 Spruce St",cuisine:"italian",price:4,rating:4.7,local:false,hours:"Tue-Sat 5:30-10pm",desc:"Marc Vetri's flagship. Multi-course Italian. One of Philly's finest."},
  {id:"fp05",name:"Laurel",lat:39.9387,lng:-75.1597,addr:"1617 E Passyunk Ave",cuisine:"french",price:4,rating:4.7,local:false,hours:"Wed-Sat 5:30pm (prix fixe)",desc:"Intimate BYO on E Passyunk. French-influenced tasting menu. 22 seats."},
  {id:"fp06",name:"Little Water",lat:39.9505,lng:-75.1730,addr:"2033 Walnut St",cuisine:"seafood",price:3,rating:4.6,local:false,hours:"Tue-Sun 5-10pm",desc:"Inquirer Top 10 2025. Modern fish house. Swordfish Milanese in potato chips."},
  {id:"fp07",name:"Emmett",lat:39.9468,lng:-75.1632,addr:"1510 S 13th St",cuisine:"american",price:3,rating:4.5,local:false,hours:"Tue-Sat 5-10pm",desc:"PhillyMag 2025 standout. Quiet, customer-focused, increasingly acclaimed."},
  {id:"fp08",name:"Irwin's",lat:39.9552,lng:-75.1610,addr:"310 S Juniper St (rooftop)",cuisine:"italian",price:3,rating:4.6,local:false,hours:"Wed-Sun 5-10pm",desc:"Rooftop Italian in a converted schoolhouse. Best tiramisu. Resy pick."},
  // ─── NEIGHBORHOOD GEMS ───
  {id:"fp09",name:"Cantina La Martina",lat:39.9530,lng:-75.1730,addr:"1903 Callowhill St",cuisine:"mexican",price:2,rating:4.5,local:true,hours:"Wed-Mon 5-10pm",desc:"PhillyMag 50 Best. Chef Dionicio Jiménez. Personal Pueblo-to-Philly story."},
  {id:"fp10",name:"Tabachoy",lat:39.9420,lng:-75.1580,addr:"1024 S 10th St",cuisine:"filipino",price:2,rating:4.4,local:true,hours:"Tue-Sun 11am-9pm",desc:"Filipino comfort food in Bella Vista. Best of Philly 2024."},
  {id:"fp11",name:"Korea Taqueria",lat:39.9350,lng:-75.1600,addr:"1701 Tasker St",cuisine:"korean-mexican",price:1,rating:4.3,local:true,hours:"Tue-Sun 11am-8pm",desc:"Korean-Mexican fusion in Grays Ferry. Wild concept, amazing execution."},
  {id:"fp12",name:"Mawn",lat:39.9430,lng:-75.1570,addr:"Various pop-up locations",cuisine:"thai",price:3,rating:4.7,local:true,hours:"Varies (check social)",desc:"Inquirer pick. 'Noodle shop with no rules.' Toughest res in Bella Vista."},
  {id:"fp13",name:"Pietramala",lat:39.9680,lng:-75.1420,addr:"1007 N 2nd St",cuisine:"vegan",price:3,rating:4.5,local:true,hours:"Wed-Sun 5-10pm",desc:"Cutting-edge vegan BYOB. Carrots into Bolognese. Inquirer Top 10."},
  {id:"fp14",name:"El Chingón",lat:39.9375,lng:-75.1605,addr:"1524 E Passyunk Ave",cuisine:"mexican",price:2,rating:4.6,local:true,hours:"Tue-Sun 11am-10pm",desc:"Inquirer 2024: 'most thrilling Mexican kitchen.' All-day BYOB."},
  {id:"fp15",name:"Gilda",lat:39.9705,lng:-75.1335,addr:"1524 E Girard Ave",cuisine:"portuguese",price:2,rating:4.4,local:true,hours:"Mon-Sat 8am-9pm",desc:"Fishtown. Portuguese-inspired. Amazing sandwiches and fluffy doughnuts."},
  {id:"fp16",name:"Georgian Bread",lat:40.0530,lng:-75.0540,addr:"10865 Bustleton Ave",cuisine:"georgian",price:2,rating:4.5,local:true,hours:"Daily 10am-10pm",desc:"PhillyMag 50 Best. Khachapuri, khinkali, and the best bread in NE Philly."},
  {id:"fp17",name:"Ray's Cafe & Tea House",lat:39.9540,lng:-75.1640,addr:"141 N 9th St",cuisine:"chinese",price:1,rating:4.3,local:true,hours:"Mon-Sat 11am-9pm",desc:"Best of Philly. Chinatown tea and noodle spot. Understated excellence."},
  {id:"fp18",name:"Illata",lat:39.9512,lng:-75.1442,addr:"122 Chestnut St",cuisine:"italian",price:3,rating:4.6,local:false,hours:"Tue-Sun 5-10pm",desc:"Old City Italian. The 'citrus' salad that made PhillyMag's critic fall in love."},
  {id:"fp19",name:"Grace & Proper",lat:39.9505,lng:-75.1565,addr:"118 S 12th St",cuisine:"bar",price:2,rating:4.4,local:true,hours:"Mon-Sat 4pm-2am",desc:"Best Happy Hour in Philly (Best of Philly 2024). Everything $8 and under."},
  {id:"fp20",name:"Ambra",lat:39.9505,lng:-75.1550,addr:"1723 Walnut St",cuisine:"italian",price:3,rating:4.5,local:false,hours:"Thu-Sat (communal tasting)",desc:"Communal dining experience. Strangers become friends over Italian courses."},
  // ─── GLOBAL FLAVORS ───
  {id:"fp21",name:"Royal Sushi & Izakaya",lat:39.9520,lng:-75.1580,addr:"780 S 2nd St",cuisine:"japanese",price:3,rating:4.6,local:false,hours:"Mon-Sat 5-10pm",desc:"Inquirer's The 76. Elevated izakaya. Omakase available."},
  {id:"fp22",name:"White Yak",lat:39.9590,lng:-75.1700,addr:"1116 N 3rd St",cuisine:"tibetan",price:1,rating:4.4,local:true,hours:"Tue-Sun 11am-9pm",desc:"Inquirer pick. Tibetan momos in Northern Liberties."},
  {id:"fp23",name:"Tequilas Casa Mexicana",lat:39.9480,lng:-75.1628,addr:"1602 Locust St",cuisine:"mexican",price:2,rating:4.3,local:true,hours:"Daily 11am-11pm",desc:"Inquirer 2025. Ceviche and traditional Mexican in a Rittenhouse townhouse."},
  {id:"fp24",name:"Kampar",lat:39.9490,lng:-75.1610,addr:"1601 Spruce St",cuisine:"malaysian",price:2,rating:4.5,local:true,hours:"Wed-Mon 5-10pm",desc:"Malaysian cuisine. Resy staff favorite 2024. Remarkable flavors."},
  {id:"fp25",name:"La Baja",lat:40.0720,lng:-75.2120,addr:"Ambler, PA",cuisine:"mexican",price:3,rating:4.7,local:false,hours:"Wed-Sun 5-10pm",desc:"PhillyMag 2025: 'Chef Dionicio Jiménez's best cooking yet.' In the suburbs."},
  {id:"fp26",name:"Hardena",lat:39.9422,lng:-75.1565,addr:"1754 S Hicks St",cuisine:"indonesian",price:1,rating:4.5,local:true,hours:"Tue-Sat 11am-8pm",desc:"Indonesian home cooking in South Philly. Nasi campur is legendary."},
  {id:"fp27",name:"Pho 75",lat:39.9530,lng:-75.1635,addr:"1122 Washington Ave",cuisine:"vietnamese",price:1,rating:4.4,local:true,hours:"Daily 8am-8pm",desc:"Cash only, no frills, perfect pho. The line tells you everything."},
  {id:"fp28",name:"Dim Sum Garden",lat:39.9555,lng:-75.1572,addr:"1020 Race St",cuisine:"chinese",price:1,rating:4.3,local:true,hours:"Daily 10am-10pm",desc:"Chinatown soup dumplings. Tourist-friendly but locally respected."},
  // ─── E. PASSYUNK & SOUTH PHILLY ───
  {id:"fp29",name:"Fond",lat:39.9372,lng:-75.1600,addr:"1617 E Passyunk Ave",cuisine:"french",price:3,rating:4.5,local:false,hours:"Wed-Mon 5-10pm",desc:"French BYOB on the Ave. Seasonally driven. Perfect date spot."},
  {id:"fp30",name:"Le Virtù",lat:39.9370,lng:-75.1600,addr:"1927 E Passyunk Ave",cuisine:"italian",price:3,rating:4.5,local:false,hours:"Tue-Sun 5-10pm",desc:"Abruzzese Italian. Deep regional focus. BYO with incredible pastas."},
  {id:"fp31",name:"Bing Bing Dim Sum",lat:39.9375,lng:-75.1598,addr:"1648 E Passyunk Ave",cuisine:"chinese",price:2,rating:4.3,local:true,hours:"Tue-Sun 4-10pm",desc:"Creative dim sum + cocktails on E Passyunk. Fun atmosphere."},
  {id:"fp32",name:"Pho Street",lat:39.9410,lng:-75.1530,addr:"777 S Front St",cuisine:"vietnamese",price:1,rating:4.2,local:true,hours:"Daily 11am-9pm",desc:"No-fuss pho near the stadiums. Good pre-game fuel."},
  // ─── FISHTOWN & NORTHERN LIBERTIES ───
  {id:"fp33",name:"Wm. Mulherin's Sons",lat:39.9700,lng:-75.1340,addr:"1355 N Front St",cuisine:"italian",price:3,rating:4.5,local:false,hours:"Mon-Thu 5-10pm, Fri-Sat 5-11pm",desc:"Converted whiskey blending warehouse. Wood-fired Italian."},
  {id:"fp34",name:"Laser Wolf",lat:39.9700,lng:-75.1350,addr:"1301 N Howard St",cuisine:"israeli",price:2,rating:4.5,local:false,hours:"Sun-Thu 5-10pm, Fri-Sat 5-11pm",desc:"Rooftop Israeli grill from the Zahav team. Skewers and salatim."},
  {id:"fp35",name:"Kensington Quarters",lat:39.9730,lng:-75.1280,addr:"1310 Frankford Ave",cuisine:"american",price:2,rating:4.3,local:true,hours:"Tue-Sun 11am-10pm",desc:"Whole-animal butcher shop + restaurant. Farm-to-table for real."},
  {id:"fp36",name:"Martha",lat:39.9665,lng:-75.1370,addr:"2113 E York St",cuisine:"american",price:2,rating:4.4,local:true,hours:"Thu-Sun brunch & dinner",desc:"Kensington. Seasonal, personal cooking. Excellent brunch."},
  // ─── RITTENHOUSE & CENTER CITY ───
  {id:"fp37",name:"Andra Hem",lat:39.9498,lng:-75.1705,addr:"Rittenhouse area",cuisine:"cocktail-bar",price:3,rating:4.6,local:false,hours:"Tue-Sat 5pm-midnight",desc:"Food & Wine Top 15 Bars in America. Swedish speakeasy vibes."},
  {id:"fp38",name:"Parc",lat:39.9495,lng:-75.1715,addr:"227 S 18th St",cuisine:"french",price:3,rating:4.4,local:false,hours:"Daily 8am-11pm",desc:"Rittenhouse Square French brasserie. Prime people-watching patio."},
  {id:"fp39",name:"Barclay Prime",lat:39.9493,lng:-75.1720,addr:"237 S 18th St",cuisine:"steakhouse",price:4,rating:4.5,local:false,hours:"Mon-Sat 5-10pm",desc:"The $120 cheesesteak (wagyu, truffle, champagne). Or just get a steak."},
  {id:"fp40",name:"Harp & Crown",lat:39.9515,lng:-75.1590,addr:"1525 Sansom St",cuisine:"american",price:2,rating:4.3,local:false,hours:"Daily 11am-midnight",desc:"Massive underground bowling + restaurant. Impressive space."},
  // ─── UNIVERSITY CITY & WEST PHILLY ───
  {id:"fp41",name:"Banh Mi & Bottles",lat:39.9520,lng:-75.1950,addr:"4636 Woodland Ave",cuisine:"vietnamese",price:1,rating:4.3,local:true,hours:"Mon-Sat 10am-7pm",desc:"West Philly banh mi shop. Incredible value, huge sandwiches."},
  {id:"fp42",name:"Saad's Halal",lat:39.9560,lng:-75.1900,addr:"4500 Walnut St",cuisine:"middle-eastern",price:1,rating:4.2,local:true,hours:"Daily 10am-2am",desc:"University City late-night halal. Lamb over rice is the move."},
  {id:"fp43",name:"Renata's Kitchen",lat:39.9530,lng:-75.2000,addr:"4604 Woodland Ave",cuisine:"mexican",price:1,rating:4.4,local:true,hours:"Tue-Sun 9am-8pm",desc:"West Philly hidden gem. Authentic Mexican breakfast and lunch."},
  // ─── MANAYUNK & NW PHILLY ───
  {id:"fp44",name:"Bourbon Blue",lat:40.0265,lng:-75.2240,addr:"2 Rector St, Manayunk",cuisine:"cajun",price:2,rating:4.2,local:false,hours:"Wed-Sun 5-10pm",desc:"New Orleans-inspired on Manayunk Main Street. Jazz brunch weekends."},
  {id:"fp45",name:"Tio Flores",lat:40.0270,lng:-75.2250,addr:"4410 Main St, Manayunk",cuisine:"mexican",price:2,rating:4.3,local:true,hours:"Tue-Sun 11am-10pm",desc:"Modern Mexican on Main Street. Great outdoor seating in summer."},
  // ─── STADIUM AREA ───
  {id:"fp46",name:"Chickie's & Pete's",lat:39.9065,lng:-75.1690,addr:"1526 Packer Ave",cuisine:"american",price:2,rating:4.0,local:true,hours:"Daily 11am-2am",desc:"Stadium district icon. Crabfries are the signature. Pre-game HQ."},
  {id:"fp47",name:"Tony Luke's",lat:39.9120,lng:-75.1580,addr:"39 E Oregon Ave",cuisine:"cheesesteak",price:1,rating:4.3,local:true,hours:"Mon-Sat 6am-midnight",desc:"South Philly cheesesteak spot. The roast pork Italian is elite."},
  // ─── CHINATOWN ───
  {id:"fp48",name:"Nan Zhou Hand Drawn Noodles",lat:39.9555,lng:-75.1583,addr:"1022 Race St",cuisine:"chinese",price:1,rating:4.4,local:true,hours:"Daily 11am-10pm",desc:"Hand-pulled noodles made in front of you. Chinatown essential."},
  {id:"fp49",name:"Tom's Dim Sum",lat:39.9565,lng:-75.1570,addr:"59 N 11th St",cuisine:"chinese",price:1,rating:4.3,local:true,hours:"Thu-Tue 10am-8pm",desc:"No-frills Chinatown. The siu mai and har gow are perfect."},
  {id:"fp50",name:"Sang Kee Peking Duck House",lat:39.9553,lng:-75.1570,addr:"238 N 9th St",cuisine:"chinese",price:2,rating:4.4,local:true,hours:"Daily 11am-11pm",desc:"Chinatown institution. The Peking duck and wonton soup are legendary."},
  // ─── BREAKFAST & BRUNCH ───
  {id:"fp51",name:"Sabrina's Cafe",lat:39.9445,lng:-75.1580,addr:"910 Christian St",cuisine:"brunch",price:2,rating:4.3,local:true,hours:"Daily 8am-4pm",desc:"Best brunch in South Philly. Stuffed French toast. Expect a wait."},
  {id:"fp52",name:"Green Eggs Cafe",lat:39.9475,lng:-75.1615,addr:"719 S 4th St",cuisine:"brunch",price:2,rating:4.2,local:true,hours:"Daily 7:30am-3pm",desc:"Inventive breakfast. Build-your-own eggs benny. Cash only."},
  {id:"fp53",name:"Middle Child",lat:39.9470,lng:-75.1540,addr:"248 S 11th St",cuisine:"cafe",price:2,rating:4.4,local:true,hours:"Daily 8am-4pm",desc:"Modern deli-cafe. The PEC (pork, egg, cheese) is iconic."},
  {id:"fp54",name:"Beiler's Donuts",lat:39.9533,lng:-75.1592,addr:"Reading Terminal Market",cuisine:"bakery",price:1,rating:4.6,local:true,hours:"Tue-Sat 7am-5pm",desc:"Amish-made donuts at Reading Terminal. Apple fritter is the move."},
  // ─── PIZZA & ITALIAN ───
  {id:"fp55",name:"Angelo's Pizzeria",lat:39.9368,lng:-75.1598,addr:"736 S 9th St",cuisine:"pizza",price:1,rating:4.5,local:true,hours:"Mon-Sat 10am-6pm",desc:"South Philly. Thick square pan pizza. The works slice is essential."},
  {id:"fp56",name:"Santucci's Original Square Pizza",lat:39.9315,lng:-75.1530,addr:"901 S 10th St",cuisine:"pizza",price:1,rating:4.4,local:true,hours:"Tue-Sun 11am-9pm",desc:"Upside-down square pizza (cheese on bottom). South Philly legend."},
  {id:"fp57",name:"Fiorella",lat:39.9375,lng:-75.1605,addr:"817 Christian St",cuisine:"italian",price:2,rating:4.5,local:true,hours:"Wed-Sun 5-10pm",desc:"Tiny BYO Italian in South Philly. The pasta is handmade daily."},
  {id:"fp58",name:"Ralph's Italian Restaurant",lat:39.9420,lng:-75.1545,addr:"760 S 9th St",cuisine:"italian",price:2,rating:4.2,local:true,hours:"Sun-Thu 11:30am-9:30pm, Fri-Sat to 10:30pm",desc:"America's oldest Italian restaurant (1900). Red sauce classic."},
  // ─── SEAFOOD ───
  {id:"fp59",name:"Oyster House",lat:39.9480,lng:-75.1580,addr:"1516 Sansom St",cuisine:"seafood",price:3,rating:4.3,local:false,hours:"Mon-Sat 11:30am-10pm",desc:"Raw bar + cocktails. Daily oyster specials. Midtown Village."},
  {id:"fp60",name:"Luke's Lobster",lat:39.9510,lng:-75.1450,addr:"130 S 17th St",cuisine:"seafood",price:2,rating:4.2,local:false,hours:"Daily 11am-8pm",desc:"Maine-style lobster rolls in Center City. Quick and satisfying."},
];
