(function(root){
'use strict';
const translations={
  "h01": {
    "q": "Vad beskriver f′(a)?",
    "a": [
      "Den momentana förändringshastigheten för f vid x = a",
      "Medelvärdet av f fram till x = a",
      "Det största värdet på f",
      "Arean under f från 0 till a"
    ],
    "why": "Derivatan i en punkt är funktionens momentana förändringshastighet där. Geometriskt är den tangentens lutning."
  },
  "h02": {
    "q": "En graf har tid på den horisontella axeln och tillryggalagd sträcka på den vertikala axeln. Vad beskriver grafens lutning?",
    "a": [
      "Återstående sträcka",
      "Fart",
      "Hastighet med riktning",
      "Acceleration"
    ],
    "why": "Lutningen anger förändringen i tillryggalagd sträcka per tidsenhet, alltså farten. I en läge–tid-graf anger lutningen i stället hastigheten med tecken för riktningen."
  },
  "h03": {
    "q": "Vilket skrivsätt betyder ”gränsvärdet av f(x) då x går mot 3”?",
    "a": [
      "f′(3)",
      "∫ f(x) dx",
      "limₓ→₃ f(x)",
      "f(3)²"
    ],
    "why": "Uttrycket limₓ→₃ f(x) beskriver vilket värde f(x) närmar sig när x närmar sig 3."
  },
  "h04": {
    "q": "Vad är den viktigaste skillnaden mellan genomsnittlig och momentan förändringshastighet?",
    "a": [
      "Den genomsnittliga gäller ett intervall; den momentana gäller en viss tidpunkt",
      "Bara den genomsnittliga kan vara negativ",
      "Den momentana använder aldrig en derivata",
      "De har alltid samma värde"
    ],
    "why": "Genomsnittlig förändringshastighet jämför två punkter i ett intervall. Momentan förändringshastighet är gränsvärdet av sådana förändringskvoter i en punkt."
  },
  "h05": {
    "q": "Geometriskt motsvarar en genomsnittlig förändringshastighet lutningen hos …",
    "a": [
      "en tangent",
      "en sekant genom två punkter på grafen",
      "y-axeln",
      "en vertikal asymptot"
    ],
    "why": "En sekant går genom två punkter på grafen. Dess lutning mäter förändringen över intervallet mellan punkterna."
  },
  "h06": {
    "q": "Vilken variabel brukar vara den oberoende variabeln i y = f(x)?",
    "a": [
      "y",
      "f",
      "x",
      "lutningen"
    ],
    "why": "Den oberoende variabeln x är indata. Funktionen ger motsvarande funktionsvärde y."
  },
  "h07": {
    "q": "Vilket uttryck betecknar derivatan av f som en ny funktion?",
    "a": [
      "f(x + 1)",
      "f′(x)",
      "lim f(x)",
      "∫₀ˣ f(t)dt"
    ],
    "why": "Beteckningen f′(x) står för derivatafunktionen, som anger den momentana förändringshastigheten för varje x där derivatan finns."
  },
  "h08": {
    "q": "Måste x vara lika med a när x går mot a i ett gränsvärde?",
    "a": [
      "Ja, alltid",
      "Bara om f är linjär",
      "Nej; gränsvärdet handlar om värden godtyckligt nära a",
      "Bara för ensidiga gränsvärden"
    ],
    "why": "Ett gränsvärde beskriver beteendet nära a. x kan närma sig a utan att vara lika med a."
  },
  "h09": {
    "q": "Om f′(x) är positiv i hela ett intervall, vad måste f göra där?",
    "a": [
      "Avta",
      "Vara konstant",
      "Växa",
      "Skära x-axeln"
    ],
    "why": "Positiv derivata betyder att grafens lutning är positiv, så funktionen växer i intervallet."
  },
  "h10": {
    "q": "Om f′(x) = 0 i hela ett intervall, vad gäller för f där?",
    "a": [
      "Den är konstant",
      "Den är alltid positiv",
      "Den har en vertikal tangent",
      "Den är konkav uppåt"
    ],
    "why": "Derivatan noll i hela intervallet betyder att lutningen är noll överallt där. Funktionen är därför konstant."
  },
  "h11": {
    "q": "En tangent beskrivs bäst som en linje som …",
    "a": [
      "alltid skär grafen två gånger",
      "har samma lokala riktning som kurvan i en punkt",
      "alltid är horisontell",
      "aldrig möter kurvan igen"
    ],
    "why": "Tangenten har samma momentana riktning som kurvan i tangeringspunkten."
  },
  "h12": {
    "q": "Om f′(x) är negativ i ett helt intervall, vad gör f där?",
    "a": [
      "Växer",
      "Avtar",
      "Är konstant",
      "Byter riktning i varje punkt"
    ],
    "why": "Negativ derivata betyder att grafen har negativ lutning i hela intervallet. Funktionsvärdena avtar därför."
  },
  "h13": {
    "q": "Om sträcka mäts i meter och tid i sekunder, vilken enhet har derivatan av sträckan med avseende på tiden?",
    "a": [
      "meter",
      "sekunder",
      "meter per sekund",
      "kvadratmeter"
    ],
    "why": "Derivatans enhet är den beroende variabelns enhet delad med den oberoende variabelns enhet, här meter per sekund."
  },
  "h14": {
    "q": "Vad säger en horisontell tangent om punkten?",
    "a": [
      "Derivatan är noll",
      "Funktionsvärdet är noll",
      "Andraderivatan är noll",
      "Funktionen är diskontinuerlig"
    ],
    "why": "En horisontell linje har lutningen noll. Derivatan i en punkt med horisontell tangent är därför noll."
  },
  "h15": {
    "q": "Om g(x) = 5f(x) + 3, hur förhåller sig lutningarna för g till lutningarna för f?",
    "a": [
      "De är tre enheter större",
      "De är fem gånger så stora",
      "De är åtta gånger så stora",
      "De är oförändrade"
    ],
    "why": "Multiplikation med fem multiplicerar alla lutningar med fem. Att addera tre flyttar grafen vertikalt utan att ändra lutningarna."
  },
  "h16": {
    "q": "Vad beskriver s′(t) om s(t) är en lägesfunktion?",
    "a": [
      "Läget igen",
      "Hastigheten",
      "Accelerationen",
      "Alltid den tillryggalagda sträckan"
    ],
    "why": "Lägets momentana förändringshastighet med avseende på tiden är hastigheten."
  },
  "h17": {
    "q": "Om f är kontinuerlig vid c och f′ byter tecken från positiv till negativ där, vad visar förstaderivatatestet?",
    "a": [
      "En lokal maximipunkt vid c",
      "En lokal minimipunkt vid c",
      "En vertikal asymptot vid c",
      "Ingen lokal extrempunkt vid c"
    ],
    "why": "Funktionen växer före c och avtar efter c. Därför har den en lokal maximipunkt vid c."
  },
  "h18": {
    "q": "Vad är en kritisk punkt för f?",
    "a": [
      "En punkt (c,f(c)) där f′(c)=0 eller f′(c) inte finns",
      "Varje punkt där f(c)=0",
      "En punkt där f″(c)>0",
      "Bara grafens högsta punkt"
    ],
    "why": "En kritisk punkt ligger på grafen vid ett värde i definitionsmängden där derivatan är noll eller inte finns."
  },
  "h19": {
    "q": "Om f är kontinuerlig vid c och f′ byter tecken från negativ till positiv där, vad visar förstaderivatatestet?",
    "a": [
      "En lokal maximipunkt vid c",
      "En lokal minimipunkt vid c",
      "En vertikal asymptot vid c",
      "Ingen lokal extrempunkt vid c"
    ],
    "why": "Funktionen avtar före c och växer efter c. Därför har den en lokal minimipunkt vid c."
  },
  "h20": {
    "q": "Garanterar f′(c) = 0 i sig ett lokalt maximum eller minimum vid c?",
    "a": [
      "Ja, alltid",
      "Bara ett maximum",
      "Nej; grafen kan fortsätta åt samma håll",
      "Bara när f(c)=0"
    ],
    "why": "Derivatan noll gör bara punkten till en kandidat. En terrasspunkt kan ha f′(c)=0 utan att vara en extrempunkt."
  },
  "h21": {
    "q": "Vad är syftet med förstaderivatatestet?",
    "a": [
      "Att hitta arean under en graf",
      "Att klassificera kritiska punkter med hjälp av teckenbyten hos f′",
      "Att bevisa kontinuitet",
      "Att enbart hitta vertikala asymptoter"
    ],
    "why": "Testet undersöker om f byter mellan att växa och avta på de två sidorna om en kritisk punkt."
  },
  "h22": {
    "q": "Vad skiljer ett globalt maximum från ett lokalt maximum?",
    "a": [
      "Ett globalt maximum är störst i hela definitionsmängden eller intervallet",
      "Ett globalt maximum måste ligga vid noll",
      "Ett lokalt maximum är aldrig en kritisk punkt",
      "Det finns ingen skillnad"
    ],
    "why": "Ett lokalt maximum jämförs med närliggande värden. Ett globalt maximum är minst lika stort som alla tillåtna funktionsvärden."
  },
  "h23": {
    "q": "Varför kan en ändpunkt vara en global extrempunkt utan att derivatan är noll?",
    "a": [
      "En ändpunkt har bara en sida inom intervallet",
      "Ändpunkter ingår aldrig i intervallet",
      "Alla derivator i ändpunkter är oändliga",
      "Funktionen måste vara diskontinuerlig"
    ],
    "why": "Det vanliga derivatavillkoret gäller inre extrempunkter. Vid en ändpunkt görs jämförelsen bara från den sida som ligger i intervallet."
  },
  "h24": {
    "q": "En graf har en horisontell tangent men fortsätter att växa på båda sidor. Vad kan man dra för slutsats enbart av detta?",
    "a": [
      "Punkten är en lokal maximipunkt",
      "Punkten är en lokal minimipunkt",
      "Punkten är stationär men ingen lokal extrempunkt",
      "Punkten är en inflexionspunkt"
    ],
    "why": "Derivatan är noll men funktionen fortsätter att växa, så punkten är ingen lokal extrempunkt. För en inflexionspunkt krävs dessutom att konkaviteten ändras."
  },
  "h25": {
    "q": "Vilket påstående om deriverbarhet och kontinuitet är korrekt?",
    "a": [
      "Varje kontinuerlig funktion är deriverbar",
      "Varje deriverbar funktion är kontinuerlig",
      "Begreppen saknar samband",
      "En diskontinuerlig funktion kan alltid deriveras"
    ],
    "why": "Deriverbarhet medför kontinuitet. Det omvända gäller inte: en kontinuerlig graf kan ha ett skarpt hörn."
  },
  "h26": {
    "q": "Varför är |x| inte deriverbar vid x = 0?",
    "a": [
      "Den är diskontinuerlig där",
      "Dess värde är noll där",
      "Lutningarna från vänster och höger är olika",
      "Den har en horisontell tangent"
    ],
    "why": "Lutningen från vänster är −1 och från höger 1. Därför finns ingen entydig derivata vid 0."
  },
  "h27": {
    "q": "Om limₓ→a f(x) finns, vad måste gälla?",
    "a": [
      "f(a) måste finnas",
      "f(a) måste vara lika med gränsvärdet",
      "Gränsvärdena från vänster och höger är lika",
      "f måste vara deriverbar vid a"
    ],
    "why": "Ett tvåsidigt gränsvärde finns när gränsvärdena från båda sidor finns och är lika."
  },
  "h28": {
    "q": "Vilket samband krävs för att f ska vara kontinuerlig vid x = a?",
    "a": [
      "f′(a)=0",
      "limₓ→a f(x)=f(a)",
      "f(a)>0",
      "Gränsvärdet från vänster måste vara noll"
    ],
    "why": "Kontinuitet vid a kräver att funktionsvärdet och gränsvärdet finns och att de är lika."
  },
  "h29": {
    "q": "En graf har ett hål vid x = a men närmar sig samma höjd från båda sidor. Vad kan gälla?",
    "a": [
      "Det tvåsidiga gränsvärdet finns trots att funktionen inte är kontinuerlig",
      "Det tvåsidiga gränsvärdet kan inte finnas",
      "Funktionen måste vara deriverbar",
      "Gränsvärdet måste vara oändligt"
    ],
    "why": "Ett saknat eller felplacerat funktionsvärde hindrar inte grafen runt punkten från att närma sig ett gemensamt gränsvärde."
  },
  "h30": {
    "q": "Varför saknas ett tvåsidigt gränsvärde vid en språngdiskontinuitet?",
    "a": [
      "Funktionen är begränsad",
      "Gränsvärdena från vänster och höger är olika",
      "Grafen har en tangent",
      "Funktionsvärdet är positivt"
    ],
    "why": "De två riktningarna ger olika gränsvärden. Därför finns inget gemensamt tvåsidigt gränsvärde."
  },
  "h31": {
    "q": "Vilken egenskap kan göra en kontinuerlig graf icke-deriverbar?",
    "a": [
      "En mjuk vändpunkt",
      "Ett skarpt hörn",
      "Ett positivt y-värde",
      "Att grafen skär x-axeln"
    ],
    "why": "Ett skarpt hörn kan vara kontinuerligt men ha olika lutningar från vänster och höger."
  },
  "h32": {
    "q": "Hur kan man vanligtvis ta bort en hävbar diskontinuitet?",
    "a": [
      "Genom att sätta funktionsvärdet i hålet lika med gränsvärdet",
      "Genom att derivera två gånger",
      "Genom att ta bort hela intervallet",
      "Genom att lägga till en vertikal asymptot"
    ],
    "why": "Om det saknade eller avvikande funktionsvärdet sätts lika med gränsvärdet, stämmer värdet överens med beteendet runt punkten."
  },
  "h33": {
    "q": "Om f″(x)>0 i hela ett intervall, hur är grafen böjd där?",
    "a": [
      "Konkav nedåt",
      "Konkav uppåt",
      "Den måste avta",
      "Den måste skära x-axeln"
    ],
    "why": "Positiv andraderivata betyder att lutningarna växer i intervallet. Grafen är därför konkav uppåt."
  },
  "h34": {
    "q": "Vilken förändring kännetecknar en inflexionspunkt?",
    "a": [
      "f byter tecken",
      "f′ blir noll",
      "Konkaviteten ändras",
      "Grafen når en ändpunkt"
    ],
    "why": "I en inflexionspunkt ändrar grafen konkavitet, och funktionen är kontinuerlig där."
  },
  "h35": {
    "q": "Om f′(x)<0 och f″(x)>0 i hela ett intervall, är grafen till f …",
    "a": [
      "växande och konkav uppåt",
      "avtagande och konkav uppåt",
      "avtagande och konkav nedåt",
      "växande och konkav nedåt"
    ],
    "why": "Negativ förstaderivata gör att f avtar. Positiv andraderivata gör att grafen är konkav uppåt."
  },
  "h36": {
    "q": "Om f″(x) < 0 i hela ett intervall, vad händer med lutningarna för f?",
    "a": [
      "De växer",
      "De avtar",
      "De är alla noll",
      "De är alla positiva"
    ],
    "why": "Negativ andraderivata betyder att förstaderivatan avtar. Tangenternas lutningar blir alltså mindre."
  },
  "h37": {
    "q": "Kan en funktion ha f′(x)>0 och f″(x)<0 i samma intervall?",
    "a": [
      "Nej, aldrig",
      "Ja; funktionen växer medan dess positiva lutningar blir mindre",
      "Bara om den är diskontinuerlig",
      "Bara i en enstaka punkt"
    ],
    "why": "Positiv förstaderivata gör att funktionen växer. Negativ andraderivata gör samtidigt att lutningarna avtar."
  },
  "h38": {
    "q": "Vad beskriver en lägesfunktions andraderivata med avseende på tiden?",
    "a": [
      "sträcka",
      "hastighet",
      "acceleration",
      "medelläge"
    ],
    "why": "Lägets förstaderivata är hastigheten. Derivatan av hastigheten är accelerationen."
  },
  "h39": {
    "q": "Varför räcker inte f″(c) = 0 för att visa att c är en inflexionspunkt?",
    "a": [
      "Funktionsvärdet måste också vara noll",
      "Konkaviteten måste faktiskt ändras vid c",
      "Förstaderivatan får inte finnas",
      "Inflexionspunkter finns bara i ändpunkter"
    ],
    "why": "Andraderivatan noll ger bara en kandidat. En inflexionspunkt kräver ett verkligt byte av konkavitet."
  },
  "h40": {
    "q": "Var ligger en tangent vanligtvis i förhållande till en kurva som är konkav uppåt?",
    "a": [
      "Ovanför kurvan",
      "Under kurvan",
      "Alltid på x-axeln",
      "Alltid vertikalt genom kurvan"
    ],
    "why": "För en deriverbar funktion som är konkav uppåt ligger grafen lokalt ovanför sina tangentlinjer."
  },
  "h41": {
    "q": "Vad garanteras för en kontinuerlig funktion på ett slutet intervall [a,b]?",
    "a": [
      "Exakt ett nollställe",
      "Ett globalt maximum och ett globalt minimum",
      "En derivata överallt",
      "Lika funktionsvärden i ändpunkterna"
    ],
    "why": "Satsen om största och minsta värde garanterar båda globala extremvärdena för en kontinuerlig funktion på ett slutet, begränsat intervall."
  },
  "h42": {
    "q": "Vilken beskrivning stämmer för exponentialfunktionen f(x)=aˣ med a>1?",
    "a": [
      "Den växer och är alltid positiv",
      "Den avtar och är alltid negativ",
      "Den har en vertikal asymptot vid x=0",
      "Den antar ett globalt maximum"
    ],
    "why": "En exponentialfunktion med bas större än ett växer när x ökar. Dess värden är alltid positiva."
  },
  "h43": {
    "q": "Vad står k för i linjens ekvation y = kx + m?",
    "a": [
      "Linjens lutning",
      "Skärningen med y-axeln",
      "Skärningen med x-axeln",
      "Linjens längd"
    ],
    "why": "Koefficienten k anger förändringen i y när x ökar med en enhet. Den är därför linjens lutning."
  },
  "h44": {
    "q": "Vilken logaritmlag skriver om log(ab) korrekt när a>0 och b>0?",
    "a": [
      "log(a)+log(b)",
      "log(a)log(b)",
      "log(a+b)",
      "log(a)−log(b)"
    ],
    "why": "Logaritmen av en produkt är summan av logaritmerna av de positiva faktorerna."
  },
  "h45": {
    "q": "Varför kan logaritmisk derivering vara användbar för en komplicerad produkt?",
    "a": [
      "Den gör om produkter till summor före deriveringen",
      "Den gör varje derivata lika med ett",
      "Den tar bort begränsningar i definitionsmängden",
      "Den gör om produkten till en integral"
    ],
    "why": "Logaritmlagar gör om produkter till summor och exponenter till faktorer, vilket ofta förenklar deriveringen."
  },
  "h46": {
    "q": "Varför kräver satsen om största och minsta värde ett slutet, begränsat intervall?",
    "a": [
      "När ändpunkterna ingår kan extremvärden inte enbart närmas vid en utesluten intervallkant",
      "En kontinuerlig funktion på ett öppet intervall är alltid konstant",
      "Varje ändpunkt måste vara en kritisk punkt",
      "Ett begränsat intervall gör varje derivata noll"
    ],
    "why": "Att ändpunkterna ingår förhindrar att ett extremvärde bara närmas vid en utesluten ändpunkt. Begränsningen förhindrar också att intervallet sträcker sig oändligt långt."
  },
  "h47": {
    "q": "Två icke-vertikala linjer är parallella. Vad måste gälla i deras ekvationer y = kx + m?",
    "a": [
      "De har samma k-värde",
      "De har samma m-värde",
      "Båda m-värdena är noll",
      "Deras lutningar har produkten −1"
    ],
    "why": "Parallella icke-vertikala linjer har samma lutning, men deras skärningar med y-axeln kan vara olika."
  },
  "h48": {
    "q": "När är cosinussatsen särskilt användbar för att hitta en sida i en triangel?",
    "a": [
      "När två sidor och den mellanliggande vinkeln är kända",
      "Bara för rätvinkliga trianglar",
      "När alla vinklar men ingen sida är kända",
      "Bara när två sidor är lika långa"
    ],
    "why": "Cosinussatsen kopplar direkt ihop den okända sidan med två kända sidor och vinkeln mellan dem."
  },
  "h49": {
    "q": "Vad beskriver en bestämd integral ∫ₐᵇ f(x) dx geometriskt?",
    "a": [
      "Bara arean ovanför x-axeln",
      "Nettoarean med tecken mellan grafen och x-axeln",
      "Lutningen vid x = b",
      "Det största värdet på f"
    ],
    "why": "Områden ovanför x-axeln bidrar positivt och områden nedanför bidrar negativt. Resultatet är en nettoarea med tecken."
  },
  "h50": {
    "q": "Om a<b och en integrerbar funktion f är negativ på hela [a,b], är ∫ₐᵇ f(x) dx …",
    "a": [
      "positiv",
      "negativ",
      "alltid noll",
      "odefinierad"
    ],
    "why": "Alla areabidrag ligger nedanför x-axeln över ett intervall med positiv längd. Integralen är därför negativ."
  },
  "h51": {
    "q": "Vad händer om man byter plats på integrationsgränserna i en bestämd integral?",
    "a": [
      "Ingenting",
      "Resultatet kvadreras",
      "Resultatet byter tecken",
      "Integralen blir noll"
    ],
    "why": "När integrationsgränserna byter plats vänds riktningen på summeringen. Den nya integralen är den ursprungliga med omvänt tecken."
  },
  "h52": {
    "q": "Kan ∫ₐᵇ f(x)dx vara noll även om f inte är noll överallt i intervallet?",
    "a": [
      "Nej",
      "Ja; positiva och negativa areabidrag kan ta ut varandra",
      "Bara om a=b",
      "Bara om f är diskontinuerlig"
    ],
    "why": "En bestämd integral mäter nettoarea med tecken. Lika stora positiva och negativa bidrag kan därför ta ut varandra."
  },
  "h53": {
    "q": "Hur hittar man den totala geometriska arean när grafen skär x-axeln?",
    "a": [
      "Man bortser från området nedanför axeln",
      "Man tar absolutbeloppen av de separata områdenas integraler",
      "Man vänder alla integrationsgränser",
      "Man deriverar funktionen först"
    ],
    "why": "Geometrisk area räknar varje område positivt. Dela därför upp vid teckenbyten och gör negativa integralbidrag positiva."
  },
  "h54": {
    "q": "Vad gäller om integrationsintervallet från a till b delas vid c?",
    "a": [
      "De två delintegralerna summeras till den ursprungliga integralen",
      "Delintegralerna måste ta ut varandra",
      "Varje delintegral är lika med den ursprungliga",
      "Integralen blir odefinierad"
    ],
    "why": "Bestämda integraler är additiva: integralen från a till c plus integralen från c till b är lika med integralen från a till b."
  },
  "h55": {
    "q": "Om f är ett flöde i liter per minut, vilken enhet har ∫ₐᵇ f(t)dt när t mäts i minuter?",
    "a": [
      "Liter per minut",
      "Minuter per liter",
      "Liter",
      "Kvadratliter"
    ],
    "why": "När ett flöde integreras över tiden summeras volymen. Resultatet mäts därför i liter."
  },
  "h56": {
    "q": "Om f(x) ≥ 0 på [a,b], hur förhåller sig nettoarean med tecken till den geometriska arean?",
    "a": [
      "De är lika",
      "De har motsatta tecken",
      "Nettoarean är alltid noll",
      "Ingen jämförelse är möjlig"
    ],
    "why": "När grafen inte ligger nedanför x-axeln är alla areabidrag icke-negativa. De två areabegreppen ger då samma resultat."
  },
  "h57": {
    "q": "Vad står m för i linjens ekvation y = kx + m?",
    "a": [
      "Skärningen med y-axeln",
      "Lutningen",
      "Skärningen med x-axeln",
      "Definitionsmängden"
    ],
    "why": "När x=0 blir y=m. Därför anger m höjden där linjen skär y-axeln."
  },
  "h58": {
    "q": "Vilket samband gäller mellan lutningarna för två icke-vertikala, vinkelräta linjer?",
    "a": [
      "Deras produkt är −1",
      "Lutningarna är lika",
      "Deras summa är alltid noll",
      "Båda lutningarna måste vara positiva"
    ],
    "why": "Vinkelräta icke-vertikala linjer har lutningar som är varandras negativa inverser. Produkten blir därför −1."
  },
  "h59": {
    "q": "En primitiv funktion till f är en funktion F som uppfyller …",
    "a": [
      "F(x) = f(x)²",
      "F′(x) = f(x)",
      "F″(x) = 0",
      "F(x) är alltid positiv"
    ],
    "why": "Att hitta en primitiv funktion är att gå baklänges från derivatan: F är en primitiv funktion till f precis när F′ = f."
  },
  "h60": {
    "q": "En sida och dess motstående vinkel i en triangel är kända. En annan vinkel är också känd och dess motstående sida söks. Vilken sats kan användas direkt?",
    "a": [
      "Sinussatsen",
      "Cosinussatsen",
      "Enbart Pythagoras sats",
      "Mittpunktsformeln"
    ],
    "why": "Sinussatsen kopplar ihop sidor med deras motstående vinklar. Det kända paret och den andra vinkeln bestämmer den sökta sidan."
  },
  "h61": {
    "q": "Varför innehåller obestämda integraler ”+ C”?",
    "a": [
      "Varje funktion är periodisk",
      "Olika primitiva funktioner kan skilja sig åt med en konstant",
      "Derivatan av C är ett",
      "C står för den övre integrationsgränsen"
    ],
    "why": "Konstanter försvinner vid derivering. En hel familj av funktioner med olika konstanttermer har därför samma derivata."
  },
  "h62": {
    "q": "För x²+px+q=0 är pq-formeln x=−p/2 ± √((p/2)²−q). Vilket uttryck är diskriminanten i pq-formeln?",
    "a": [
      "(p/2)²−q",
      "−p/2",
      "p²−q",
      "(p/2)²+q"
    ],
    "why": "I pq-formeln kallas uttrycket under rottecknet diskriminanten. Dess tecken avgör antalet reella lösningar."
  },
  "h63": {
    "q": "Varför är kvadratkomplettering användbar för en andragradsfunktion?",
    "a": [
      "Den visar parabelns vertexform",
      "Den gör varje andragradsfunktion linjär",
      "Den tar bort koefficienten framför x²",
      "Den ger derivatan direkt"
    ],
    "why": "Den kvadratkompletterade formen gör parabelns extrempunkt och horisontella förskjutning tydliga."
  },
  "h64": {
    "q": "Vilken formel ger en triangels area med två sidor a och b och deras mellanliggande vinkel C?",
    "a": [
      "ab sin(C)/2",
      "ab cos(C)",
      "a+b+C",
      "a²+b²"
    ],
    "why": "Höjden mot den ena sidan är den andra sidan multiplicerad med sin(C). Arean blir därför ab sin(C)/2."
  },
  "h65": {
    "q": "Varför undersöker man ändpunkter tillsammans med kritiska punkter i ett optimeringsproblem?",
    "a": [
      "Derivator fungerar aldrig i inre punkter",
      "Ett globalt optimum kan ligga i en ändpunkt",
      "Ändpunkterna ger alltid maximum",
      "Kritiska punkters funktionsvärden kan inte beräknas"
    ],
    "why": "På ett slutet intervall kan det största eller minsta värdet finnas antingen i en kritisk punkt eller i en ändpunkt."
  },
  "h66": {
    "q": "En deriverbar funktion har f′(x)>0 överallt i ett intervall. Vilken slutsats är starkast?",
    "a": [
      "Den har inget globalt maximum på något intervall",
      "Den antar varje funktionsvärde högst en gång i intervallet",
      "Den är konkav uppåt",
      "Dess värdemängd är alla reella tal"
    ],
    "why": "Positiv derivata gör funktionen strängt växande i intervallet. Två olika x-värden kan därför inte ge samma funktionsvärde där."
  },
  "h67": {
    "q": "När volymen av en låda ska maximeras med en bestämd mängd material, vad beskriver bivillkoret?",
    "a": [
      "Storheten som ska maximeras",
      "Det fasta samband som måtten måste uppfylla",
      "Derivatan av volymen",
      "Enbart det slutliga svaret"
    ],
    "why": "Bivillkoret beskriver begränsningen och gör det möjligt att koppla ihop variablerna innan målfunktionen optimeras."
  },
  "h68": {
    "q": "Två likformiga figurer har längdskalan 3. Vilken är areaskalan?",
    "a": [
      "9",
      "3",
      "6",
      "27"
    ],
    "why": "Areor ändras med kvadraten på längdskalan. Längdskalan 3 ger alltså areaskalan 3²=9."
  },
  "h69": {
    "q": "En parabel är nedåtvänd. Vilken typ av extremvärde har den i sin vertex?",
    "a": [
      "Ett globalt maximum",
      "Ett globalt minimum",
      "Inget extremvärde",
      "En vertikal asymptot"
    ],
    "why": "Alla andra punkter på en nedåtvänd parabel ligger lägre än vertex. Därför är värdet där ett globalt maximum."
  },
  "h70": {
    "q": "Vad måste kontrolleras efter att man hittat en kritisk punkt i ett praktiskt optimeringsproblem?",
    "a": [
      "Att punkten ligger i den tillåtna definitionsmängden och ger det sökta optimumet",
      "Att dess x-värde alltid är noll",
      "Att de ursprungliga enheterna försvinner",
      "Att derivatan är noll i varje ändpunkt"
    ],
    "why": "En algebraiskt funnen kandidat kan vara otillåten eller ge fel sorts extremvärde. Kontrollera därför definitionsmängden och jämför kandidaterna."
  },
  "h71": {
    "q": "Varför ska fysiska begränsningar ingå i definitionsmängden i ett optimeringsproblem?",
    "a": [
      "De utesluter omöjliga kandidater, till exempel negativa längder",
      "De tvingar derivatan att vara positiv",
      "De gör varje funktion kontinuerlig",
      "De tar bort alla ändpunkter"
    ],
    "why": "Modellen ska bara tillåta värden som är meningsfulla i situationen, till exempel positiva mått och tillgänglig mängd material."
  },
  "h72": {
    "q": "En kontinuerlig funktion på ett slutet intervall har en kandidat vars värde är mindre än värdena i alla andra inre kritiska punkter och i båda ändpunkterna. Vad ger kandidaten?",
    "a": [
      "Det globala maximumet",
      "Det globala minimumet",
      "Nödvändigtvis en inflexionspunkt",
      "Ingen möjlig extrempunkt"
    ],
    "why": "För en kontinuerlig funktion på ett slutet intervall hittar man globala extremvärden genom att jämföra värdena i alla inre kritiska punkter och ändpunkterna."
  },
  "h73": {
    "q": "En funktion har f′(c) = 0 och f″(c) < 0. Vad visar andraderivatatestet?",
    "a": [
      "En lokal minimipunkt vid c",
      "En lokal maximipunkt vid c",
      "En inflexionspunkt vid c",
      "Ingen slutsats eftersom f′(c)=0"
    ],
    "why": "Den horisontella tangenten och den negativa andraderivatan ger en lokal maximipunkt vid c."
  },
  "h74": {
    "q": "När ger andraderivatatestet inget besked vid en kritisk punkt c?",
    "a": [
      "När f″(c) > 0",
      "När f″(c) < 0",
      "När f″(c) = 0",
      "När f(c) = 0"
    ],
    "why": "När f″(c)=0 kan punkten vara en maximipunkt, en minimipunkt eller ingetdera. Då behövs en annan undersökning."
  },
  "h75": {
    "q": "Om f′ växer omedelbart före c och avtar omedelbart efter c, hur ändras konkaviteten för f?",
    "a": [
      "Från konkav nedåt till konkav uppåt",
      "Från konkav uppåt till konkav nedåt",
      "f måste ha en lokal maximipunkt vid c",
      "f måste ha en lokal minimipunkt vid c"
    ],
    "why": "Växande derivata betyder konkav uppåt och avtagande derivata betyder konkav nedåt. Förändringen i f′ beskriver hur f böjer sig, inte nödvändigtvis ett extremvärde för f."
  },
  "h76": {
    "q": "I en kritisk punkt c är f″(c)>0. Vilken egenskap hos grafen stöder testets slutsats?",
    "a": [
      "Grafen böjer uppåt vid en horisontell tangent",
      "Grafen korsar en vertikal asymptot",
      "Grafen böjer nedåt",
      "Funktionen är odefinierad"
    ],
    "why": "När grafen böjer uppåt vid en horisontell tangent stöder det slutsatsen att punkten är en lokal minimipunkt."
  },
  "h77": {
    "q": "Vilket exempel visar varför f″(c)=0 inte avgör typen av kritisk punkt?",
    "a": [
      "En stationär punkt kan vara en extrempunkt eller en terrasspunkt",
      "Varje sådan punkt är odefinierad",
      "Förstaderivatan måste vara positiv",
      "Grafen måste vara en rät linje"
    ],
    "why": "Olika grafers former kan ha både första- och andraderivatan noll i en punkt. Därför behövs teckeninformation eller ett annat test."
  },
  "h78": {
    "q": "Hur beskrivs f om f′ är positiv och avtagande?",
    "a": [
      "Växande och konkav nedåt",
      "Växande och konkav uppåt",
      "Avtagande och konkav nedåt",
      "Avtagande och konkav uppåt"
    ],
    "why": "Positiv f′ gör att f växer. Avtagande f′ betyder att lutningarna blir mindre, så grafen är konkav nedåt."
  },
  "h79": {
    "q": "Anta att f″ byter tecken från negativ till positiv vid c. Hur ändras f:s graf?",
    "a": [
      "Från konkav nedåt till konkav uppåt",
      "Från växande till avtagande",
      "Från positiv till negativ",
      "Från kontinuerlig till diskontinuerlig"
    ],
    "why": "Andraderivatans tecken bestämmer konkaviteten. Detta teckenbyte ger därför en ändring från konkav nedåt till konkav uppåt."
  },
  "h80": {
    "q": "Om hastigheten är positiv och accelerationen negativ, vilket påstående stämmer?",
    "a": [
      "Föremålet rör sig i positiv riktning och saktar ned",
      "Föremålet rör sig i negativ riktning och ökar farten",
      "Föremålet står stilla",
      "Läget måste vara negativt"
    ],
    "why": "Positiv hastighet anger rörelse i positiv riktning. Acceleration med motsatt tecken minskar farten."
  },
  "h81": {
    "q": "Hur många radianer motsvarar ett halvt varv?",
    "a": [
      "π",
      "2π",
      "π/2",
      "1"
    ],
    "why": "Ett helt varv motsvarar 2π radianer. Ett halvt varv motsvarar därför π radianer."
  },
  "h82": {
    "q": "Varför kan en graf korsa en horisontell asymptot?",
    "a": [
      "En asymptot beskriver beteendet långt bort, inte en barriär",
      "Horisontella asymptoter är räknefel",
      "Bara vertikala asymptoter kan inte korsas",
      "Derivatan måste vara noll där"
    ],
    "why": "En horisontell asymptot beskriver vad som händer när x går mot oändligheten åt något håll. Den hindrar inte korsningar vid ändliga x-värden."
  },
  "h83": {
    "q": "Om f′ är växande i ett intervall, vilket påstående följer?",
    "a": [
      "f är växande",
      "f är konkav uppåt",
      "f är positiv",
      "f har ett minimum"
    ],
    "why": "En växande förstaderivata betyder att lutningarna för f växer. Det är precis vad konkav uppåt innebär."
  },
  "h84": {
    "q": "Vad beskriver cos(θ) på enhetscirkeln?",
    "a": [
      "Punktens x-koordinat",
      "Punktens y-koordinat",
      "Bara båglängden",
      "Radiens lutning"
    ],
    "why": "Punkten vid vinkeln θ på enhetscirkeln har koordinaterna (cos(θ), sin(θ))."
  },
  "h85": {
    "q": "Vad innebär limₓ→a f(x)=∞ geometriskt?",
    "a": [
      "En horisontell tangent",
      "Obegränsad tillväxt nära den vertikala linjen x=a",
      "Ett hävbart hål",
      "Ett globalt maximum vid a"
    ],
    "why": "Funktionsvärdena växer obegränsat när x närmar sig a. Det är det typiska beteendet vid en vertikal asymptot."
  },
  "h86": {
    "q": "Vad säger en horisontell asymptot y=L om f?",
    "a": [
      "f(x) närmar sig L när x går mot positiv eller negativ oändlighet",
      "f(x) är aldrig lika med L",
      "L är det globala maximumet",
      "f′(x)=0 överallt"
    ],
    "why": "En horisontell asymptot beskriver ett gränsvärde när x går mot positiv eller negativ oändlighet. Den är ingen global barriär."
  },
  "h87": {
    "q": "Vad motsvarar tan(θ)·cos(θ) för en spetsig vinkel θ i en rätvinklig triangel?",
    "a": [
      "Motstående katet delad med närliggande katet",
      "Närliggande katet delad med hypotenusan",
      "Motstående katet delad med hypotenusan",
      "Hypotenusan delad med motstående katet"
    ],
    "why": "Tangens är motstående genom närliggande katet och cosinus är närliggande katet genom hypotenusan. Produkten blir motstående katet genom hypotenusan."
  },
  "h88": {
    "q": "Hur ser grafen till linjen y=m ut?",
    "a": [
      "En horisontell linje",
      "En vertikal linje",
      "En parabel",
      "En linje genom origo med lutningen m"
    ],
    "why": "y-värdet är samma för alla x. Grafen är därför en horisontell linje."
  },
  "h89": {
    "q": "Anta att f′(x)>0 och f″(x)<0 i hela ett intervall. Vad gäller för tangenternas lutningar?",
    "a": [
      "De är positiva och växande",
      "De är positiva och avtagande",
      "De är negativa och växande",
      "De är negativa och avtagande"
    ],
    "why": "Positiv förstaderivata ger positiva lutningar. Negativ andraderivata betyder att lutningarna avtar."
  },
  "h90": {
    "q": "Anta att f′(x)>0 för alla x och att f(x) närmar sig den horisontella asymptoten y=L när x går mot oändligheten. Var måste grafen ligga?",
    "a": [
      "Under y=L medan den närmar sig linjen",
      "Ovanför y=L medan den rör sig bort från linjen",
      "Omväxlande ovanför och nedanför y=L",
      "Exakt på y=L för alla x"
    ],
    "why": "Eftersom f är strängt växande men närmar sig det ändliga värdet L måste värdena ligga under L och växa mot det."
  },
  "h91": {
    "q": "En kontinuerlig funktion har en lokal maximipunkt i det inre av [a,b]. Kan en ändpunkt ändå ge det globala maximumet?",
    "a": [
      "Nej, ett lokalt maximum är alltid globalt",
      "Ja; ändpunkternas värden måste också jämföras",
      "Bara om funktionen är diskontinuerlig",
      "Bara när värdet i den kritiska punkten är noll"
    ],
    "why": "Ett lokalt maximum jämförs bara med närliggande värden. En ändpunkt kan ha ett större värde."
  },
  "h92": {
    "q": "Grafen till f′ ligger under x-axeln och stiger mot den. Vad säger det om f?",
    "a": [
      "f avtar och är konkav uppåt",
      "f växer och är konkav uppåt",
      "f avtar och är konkav nedåt",
      "f är konstant"
    ],
    "why": "Negativa värden på f′ gör att f avtar. Att derivatans graf stiger betyder att f′ växer och att f är konkav uppåt."
  },
  "h93": {
    "q": "För x²+px+q=0 innehåller pq-formeln diskriminanten (p/2)²−q. Vad händer när detta uttryck är noll?",
    "a": [
      "Ekvationen har en reell dubbelrot",
      "Ekvationen har två olika reella lösningar",
      "Ekvationen saknar reella lösningar",
      "Varje reellt tal är en lösning"
    ],
    "why": "När uttrycket under rottecknet är noll ger plus- och minusfallen samma reella lösning x=−p/2."
  },
  "h94": {
    "q": "Anta att f′ förblir positiv medan f går från konkav uppåt till konkav nedåt. Vad händer med lutningarna?",
    "a": [
      "De växer först och avtar sedan, men förblir positiva",
      "De är konstanta",
      "De byter tecken från negativa till positiva",
      "De blir odefinierade"
    ],
    "why": "Bytet av konkavitet ändrar om lutningarna växer eller avtar. Villkoret f′>0 gör att de hela tiden är positiva."
  },
  "h95": {
    "q": "Om f är kontinuerlig vid c och f′ byter tecken från negativ till positiv där, vad följer?",
    "a": [
      "f har en lokal minimipunkt vid c",
      "f har en lokal maximipunkt vid c",
      "f måste ha en inflexionspunkt vid c",
      "f måste vara noll vid c"
    ],
    "why": "Teckenbytet visar att f avtar före c och växer efter c. Förstaderivatatestet ger därför en lokal minimipunkt."
  },
  "h96": {
    "q": "Vilken sida hör ihop med vinkeln A i sinussatsen?",
    "a": [
      "Sidan mittemot A",
      "Sidan till vänster om A",
      "Alltid den längsta sidan",
      "Bara sidan mittemot den minsta vinkeln"
    ],
    "why": "Sinussatsen parar ihop varje vinkel med sidan som ligger mittemot den."
  },
  "u01": {
    "q": "Vad innebär deriverbarhet i en punkt utöver kontinuitet?",
    "a": [
      "Funktionen har en god lokal linjär approximation",
      "Funktionen har en invers överallt",
      "Andraderivatan finns",
      "Funktionen är analytisk"
    ],
    "why": "Deriverbarhet innebär att felet i tangentlinjens approximation är litet jämfört med förändringen i x när denna går mot noll."
  },
  "u02": {
    "q": "Vad bestämmer två begynnelsevillkor normalt för en linjär differentialekvation av andra ordningen?",
    "a": [
      "En bestämd lösning ur lösningsfamiljen med två parametrar",
      "Ekvationens ordning",
      "Om varje lösning är konstant",
      "Bara den karakteristiska ekvationen"
    ],
    "why": "Den allmänna lösningen till en differentialekvation av andra ordningen innehåller två godtyckliga konstanter. Två lämpliga begynnelsevillkor bestämmer dessa konstanter."
  },
  "u03": {
    "q": "Varför kallas derivering en linjär operation?",
    "a": [
      "Den gör varje funktion till en rät linje",
      "Den bevarar summor och konstanta faktorer",
      "Den bevarar produkter utan extra termer",
      "Den bevarar sammansättningar utan extra faktorer"
    ],
    "why": "För konstanter a och b är derivatan av af+bg lika med af′+bg′. Detta är precis vad linearitet innebär."
  },
  "u04": {
    "q": "Vilket villkor krävs för att en funktion ska ha en invers på hela sin definitionsmängd?",
    "a": [
      "Den måste vara injektiv, alltså anta varje värde högst en gång",
      "Den måste vara kontinuerlig",
      "Den måste vara positiv",
      "Dess derivata måste vara skild från noll överallt"
    ],
    "why": "Varje funktionsvärde måste komma från ett enda x-värde. Annars skulle inversen tilldela flera värden till samma indata."
  },
  "u05": {
    "q": "En derivata finns i en inre punkt. Vad följer automatiskt där?",
    "a": [
      "Kontinuitet",
      "Ett lokalt extremvärde",
      "En lutning skild från noll",
      "Att andraderivatan finns"
    ],
    "why": "Deriverbarhet medför kontinuitet men garanterar varken extremvärden eller högre derivator."
  },
  "u06": {
    "q": "Om f har en invers och f′(a)≠0, vad ger inversens derivata vid f(a)?",
    "a": [
      "Det inverterade värdet 1/f′(a)",
      "Värdet f′(a) självt",
      "Det negativa värdet −f′(a)",
      "Andraderivatan f″(a)"
    ],
    "why": "Inversen vänder på den lokala skalningen hos f. Dess derivata i motsvarande punkt är därför 1/f′(a)."
  },
  "u07": {
    "q": "Vad är medelvärdessatsens centrala slutsats?",
    "a": [
      "Någon tangentlutning är lika med intervallets sekantlutning",
      "Varje kontinuerlig funktion har ett nollställe",
      "Ändpunkterna har samma funktionsvärde",
      "Varje derivata har en invers"
    ],
    "why": "Under satsens förutsättningar är den momentana förändringshastigheten i någon inre punkt lika med den genomsnittliga förändringshastigheten över intervallet."
  },
  "u08": {
    "q": "Rolles sats är ett specialfall av medelvärdessatsen där …",
    "a": [
      "funktionsvärdena i ändpunkterna är lika",
      "funktionen är udda",
      "andraderivatan är noll",
      "intervallet är obegränsat"
    ],
    "why": "Lika värden i ändpunkterna gör sekantlutningen noll. Rolles sats garanterar därför en horisontell tangent i någon inre punkt."
  },
  "u09": {
    "q": "Om A(x)=∫₀ˣ f(t)dt och f är kontinuerlig, vad ger analysens huvudsats för A′(x)?",
    "a": [
      "f(x)",
      "f′(x)",
      "A(x)f(x)",
      "A(x)"
    ],
    "why": "När integralfunktionen deriveras får man integrandens värde vid den rörliga övre integrationsgränsen."
  },
  "u10": {
    "q": "Varför anger medelvärdessatsen villkor om både kontinuitet och deriverbarhet?",
    "a": [
      "Kontinuitet i ändpunkterna och tangentlutningar i det inre behövs",
      "De är likvärdiga villkor",
      "De garanterar att funktionen är positiv",
      "De tvingar ändpunktsvärdena att vara lika"
    ],
    "why": "Kontinuitet krävs på det slutna intervallet. Deriverbarhet krävs i intervallets inre så att tangentlutningarna finns där."
  },
  "u11": {
    "q": "Om F′=f, hur beräknar analysens huvudsats ∫ₐᵇ f(x)dx?",
    "a": [
      "F(b)−F(a)",
      "F(a)+F(b)",
      "F′(b)−F′(a)",
      "F(b)/F(a)"
    ],
    "why": "En bestämd integral av en kontinuerlig funktion är lika med förändringen i en primitiv funktion mellan ändpunkterna."
  },
  "u12": {
    "q": "En kontinuerlig funktion på ett kompakt intervall antar sitt största och minsta värde. Vilken sats säger detta?",
    "a": [
      "Satsen om största och minsta värde",
      "Medelvärdessatsen",
      "Taylors sats",
      "Inversa funktionssatsen"
    ],
    "why": "Satsen om största och minsta värde garanterar att en kontinuerlig funktion på ett slutet, begränsat intervall faktiskt antar båda extremvärdena."
  },
  "u13": {
    "q": "När kan l’Hôpitals regel vara tillämplig?",
    "a": [
      "För lämpliga former av typen 0/0 eller ∞/∞ med nödvändiga deriverbarhetsvillkor",
      "För alla gränsvärden av kvoter",
      "Bara när båda derivatorna är noll",
      "Så snart täljaren är begränsad"
    ],
    "why": "Regeln gäller under särskilda förutsättningar för obestämda kvotformer. Den får inte användas automatiskt på varje bråk."
  },
  "u14": {
    "q": "Varför kallas 0·∞ en obestämd form?",
    "a": [
      "Olika förändringstakter kan ge olika gränsvärden",
      "Värdet är alltid noll",
      "Värdet är alltid oändligt",
      "Uttrycket är aldrig definierat nära gränspunkten"
    ],
    "why": "Den ena faktorn går mot noll medan den andra växer obegränsat. Deras relativa förändringstakter avgör resultatet."
  },
  "u15": {
    "q": "En liten förändring Δx görs nära x=a. Vilket uttryck ger den linjära approximationen av förändringen i f?",
    "a": [
      "f′(a)Δx",
      "f(a)Δx",
      "f′(a)/Δx",
      "f(a)+Δx"
    ],
    "why": "Derivatan är den lokala förändringen i funktionsvärdet per enhetsändring i x. Multiplikation med Δx ger uppskattningen Δf ≈ f′(a)Δx."
  },
  "u16": {
    "q": "Varför kräver approximationen sin(x) ≈ x nära noll att x mäts i radianer?",
    "a": [
      "I radianer är derivatan av sin(x) vid noll lika med 1",
      "Sinus är bara definierad för vinklar i radianer",
      "Grader gör sin(0) skild från noll",
      "Approximationen är exakt för alla vinklar i radianer"
    ],
    "why": "Med radianmått är tangenten till sin(x) vid noll linjen y=x. Med grader innehåller lutningen faktorn π/180."
  },
  "u17": {
    "q": "Vad är instängningssatsens huvudsakliga användning?",
    "a": [
      "Att bestämma ett gränsvärde genom att stänga in funktionen mellan två funktioner med samma gränsvärde",
      "Att bevisa att en funktion är deriverbar",
      "Att integrera en produkt",
      "Att hitta alla extremvärden"
    ],
    "why": "När den övre och den undre begränsningen går mot samma värde måste den instängda funktionen också gå mot detta värde."
  },
  "u18": {
    "q": "Varför kan en Taylorutveckling hjälpa till att bestämma ett svårt gränsvärde?",
    "a": [
      "Den visar de första termerna som inte tar ut varandra",
      "Den gör varje funktion till ett polynom överallt",
      "Den tar bort behovet av konvergens",
      "Den bevisar att nämnaren är skild från noll"
    ],
    "why": "Lokala utvecklingar visar vilka potenser som dominerar när de första termerna tar ut varandra."
  },
  "u19": {
    "q": "Vad bestämmer koefficienten framför (x−a)ⁿ i en Taylorserie?",
    "a": [
      "Den n:te derivatan vid a delad med n!",
      "Förstaderivatan vid x",
      "Integralen över hela definitionsmängden",
      "Det största funktionsvärdet"
    ],
    "why": "Taylorkoefficienterna bestäms av derivatorna i utvecklingspunkten: f⁽ⁿ⁾(a)/n!."
  },
  "u20": {
    "q": "Vad bör kontrolleras innan ett Taylorpolynom används för att uppskatta ett funktionsvärde?",
    "a": [
      "Att punkten ligger tillräckligt nära utvecklingspunkten och att felet är acceptabelt",
      "Att polynomet är lika med funktionen överallt",
      "Att alla högre derivator är noll",
      "Att funktionen är ett polynom"
    ],
    "why": "Ett Taylorpolynom är en lokal approximation. Användbarheten beror på avståndet till utvecklingspunkten och storleken på de försummade termerna."
  },
  "u21": {
    "q": "Vad beskriver konvergensradien?",
    "a": [
      "Hur långt från centrum en potensserie konvergerar",
      "Den största koefficienten",
      "Felet i centrum",
      "Den beskrivna funktionens period"
    ],
    "why": "Innanför konvergensradien konvergerar potensserien absolut och utanför divergerar den. Ändpunkterna måste undersökas separat."
  },
  "u22": {
    "q": "Vilken information ger resttermen i Taylors formel?",
    "a": [
      "En gräns för eller ett uttryck för approximationsfelet",
      "Den exakta konvergensradien i alla fall",
      "Bara konstanttermen",
      "Alla nollställens lägen"
    ],
    "why": "Resttermen beskriver det som återstår när funktionen approximeras med ett Taylorpolynom av en viss grad."
  },
  "u23": {
    "q": "Vilken extra information innehåller en Taylorapproximation av grad två jämfört med en linjär approximation?",
    "a": [
      "Andraderivatan i utvecklingspunkten",
      "Exakta funktionsvärden i hela intervallet",
      "Integralen över hela definitionsmängden",
      "Läget för varje extrempunkt"
    ],
    "why": "Andragradstermen f″(a)(x−a)²/2 tar hänsyn till böjningen som tangentlinjens approximation missar."
  },
  "u24": {
    "q": "Varför är linjärisering en Taylorapproximation av första graden?",
    "a": [
      "Den behåller konstanttermen och förstagradstermen",
      "Den använder funktionens första nollställe",
      "Den integrerar längs en linje",
      "Den antar att funktionen är linjär överallt"
    ],
    "why": "Linjärisering behåller precis termerna av grad noll och ett i den lokala Taylorutvecklingen."
  },
  "u25": {
    "q": "Vad gör ett variabelbyte i en integral, principiellt?",
    "a": [
      "Det byter variabel så att kedjeregeln kan användas baklänges",
      "Det använder produktregeln direkt",
      "Det gör alltid en generaliserad integral vanlig",
      "Det deriverar bara integrationsgränserna"
    ],
    "why": "Ett variabelbyte samlar en inre funktion och dess differential. Det motsvarar kedjeregeln baklänges."
  },
  "u26": {
    "q": "Från vilken deriveringsregel härleds partiell integration?",
    "a": [
      "Produktregeln",
      "Kvotregeln",
      "Regeln för inversens derivata",
      "Medelvärdessatsen"
    ],
    "why": "Om produktregeln skrivs om och integreras får man formeln för partiell integration."
  },
  "u27": {
    "q": "När är partialbråksuppdelning naturligt användbar?",
    "a": [
      "För rationella funktioner efter eventuell polynomdivision och faktorisering av nämnaren",
      "För varje kvot genom att integrera täljare och nämnare var för sig",
      "Bara när täljarens grad är högre än nämnarens",
      "Bara när nämnaren saknar reella nollställen"
    ],
    "why": "Efter polynomdivision vid behov kan ett äkta rationellt uttryck delas upp i enklare bråk utifrån nämnarens faktorer."
  },
  "u28": {
    "q": "Vad ska hända med gränserna när man gör ett variabelbyte direkt i en bestämd integral?",
    "a": [
      "De ska omvandlas till värden för den nya variabeln",
      "De måste alltid byta plats",
      "De ska tas bort",
      "De blir derivator"
    ],
    "why": "Ett konsekvent variabelbyte innebär att även integrationsgränserna uttrycks med den nya variabeln."
  },
  "u29": {
    "q": "Varför är integralen av en udda funktion över [−a,a] noll, om funktionen är integrerbar där?",
    "a": [
      "Symmetriska positiva och negativa bidrag tar ut varandra",
      "Varje udda funktion är noll",
      "Udda funktioner saknar primitiva funktioner",
      "Intervallets längd är noll"
    ],
    "why": "När integralen finns gör den udda symmetrin att bidraget från ena sidan är det motsatta till bidraget från den andra."
  },
  "u30": {
    "q": "Vad kopplar ihop en integrand med derivatan av dess integralfunktion?",
    "a": [
      "Analysens huvudsats",
      "Kvottestet",
      "Implicita funktionssatsen",
      "Greens sats"
    ],
    "why": "Analysens huvudsats säger att derivatan av integralfunktionen är den kontinuerliga integranden."
  },
  "u31": {
    "q": "Vad gör en integral generaliserad?",
    "a": [
      "Ett oändligt intervall eller en obegränsad integrand",
      "En negativ integrand",
      "Att primitiv funktion inte kan uttryckas med elementära funktioner",
      "Variabla integrationsgränser"
    ],
    "why": "Generaliserade integraler definieras med gränsvärden när intervallet är oändligt eller integranden blir obegränsad."
  },
  "u32": {
    "q": "För vilka p konvergerar integralen från 1 till ∞ av 1/xᵖ?",
    "a": [
      "p>1",
      "p≥0",
      "p<1",
      "Alla reella p"
    ],
    "why": "p-integralen på [1,∞) konvergerar precis när exponenten p är större än ett."
  },
  "u33": {
    "q": "Vad använder jämförelsekriteriet för att visa konvergens?",
    "a": [
      "En känd konvergent övre begränsning för en icke-negativ integrand",
      "Enbart en exakt primitiv funktion",
      "Växlande tecken",
      "Ett Taylorpolynom kring noll"
    ],
    "why": "Om en icke-negativ funktion från någon punkt är högst lika stor som en jämförelsefunktion med konvergent integral, konvergerar även dess integral."
  },
  "u34": {
    "q": "Varför måste en generaliserad integral med en inre singularitet delas upp?",
    "a": [
      "Varje sida om singulariteten kräver ett eget konvergent gränsvärde",
      "De två sidorna tar alltid ut varandra",
      "Analysens huvudsats förbjuder inre punkter",
      "Bara ena sidan kan integreras"
    ],
    "why": "Konvergens krävs på båda sidor var för sig. Bidrag får inte bara ta ut varandra över en punkt där integranden är odefinierad."
  },
  "u35": {
    "q": "Vad medför absolutkonvergens för en generaliserad integral?",
    "a": [
      "Att den ursprungliga integralen konvergerar",
      "Att den ursprungliga integralen divergerar",
      "Att integranden är positiv",
      "Att den primitiva funktionen är begränsad överallt"
    ],
    "why": "Om integralen av absolutbeloppet konvergerar, konvergerar även integralen med de ursprungliga tecknen."
  },
  "u36": {
    "q": "Kan en generaliserad integral konvergera även om integranden inte går monotont mot noll?",
    "a": [
      "Ja; monotonicitet krävs inte i allmänhet",
      "Nej; monotonicitet krävs alltid",
      "Bara på ändliga intervall",
      "Bara för positiva integrander"
    ],
    "why": "Oscillation och utjämning mellan positiva och negativa bidrag kan ge konvergens utan monoton avtagning. Villkoren måste kontrolleras i varje fall."
  },
  "u37": {
    "q": "Vilket nödvändigt villkor måste vara uppfyllt för att en talserie ska konvergera?",
    "a": [
      "Termerna måste gå mot noll",
      "Termerna måste vara positiva",
      "Delsummorna måste vara monotona",
      "Kvoten mellan successiva termer måste gå mot noll"
    ],
    "why": "Om de enskilda termerna inte går mot noll kan delsummorna inte närma sig ett ändligt gränsvärde."
  },
  "u38": {
    "q": "När konvergerar en geometrisk serie med kvoten r?",
    "a": [
      "När absolutbeloppet av r är mindre än 1",
      "När r>1",
      "När r är ett heltal",
      "Så snart r är positivt"
    ],
    "why": "Potenserna av r avtar tillräckligt snabbt mot noll precis när absolutbeloppet av r är mindre än ett."
  },
  "u39": {
    "q": "Vad jämför kvottestet i första hand?",
    "a": [
      "Storleken på successiva termer",
      "En serie med dess derivata",
      "Positiva och negativa delsummor",
      "Den första termen med den sista"
    ],
    "why": "Gränsvärdet av absolutbeloppet av aₙ₊₁/aₙ visar geometriliknande avtagning eller tillväxt."
  },
  "u40": {
    "q": "Vilket ytterligare villkor krävs, utöver avtagande termbelopp, i kriteriet för alternerande serier?",
    "a": [
      "Termbeloppen går mot noll",
      "Termerna är deriverbara",
      "Serien börjar med en positiv term",
      "Kvoten är exakt ett"
    ],
    "why": "Växlande tecken räcker inte. De avtagande termbeloppen måste också gå mot noll."
  },
  "u41": {
    "q": "Varför måste ändpunkterna undersökas separat för en potensserie?",
    "a": [
      "Kvottestet ger vanligtvis inget besked där",
      "Konvergens inuti intervallet garanterar konvergens i båda ändpunkterna",
      "Divergens utanför intervallet utesluter båda ändpunkterna",
      "Serien beter sig alltid likadant i båda ändpunkterna"
    ],
    "why": "Vid konvergensradien ger kvot- eller rottestet ofta värdet ett, vilket inte avgör konvergensen."
  },
  "u42": {
    "q": "Vad är betingad konvergens?",
    "a": [
      "Serien konvergerar men serien av absolutbeloppen divergerar",
      "Serien konvergerar absolut",
      "Termerna går inte mot noll",
      "Summan beror enbart på den första termen"
    ],
    "why": "Betingad konvergens bygger på att positiva och negativa bidrag delvis tar ut varandra. Konvergensen försvinner om alla termer ersätts med sina absolutbelopp."
  },
  "u43": {
    "q": "Varför uppstår en faktor y′ när uttryck som beror på y deriveras med avseende på x?",
    "a": [
      "Därför att y betraktas som en funktion av x och kedjeregeln används",
      "Därför att y hålls konstant",
      "Därför att varje y-term integreras först",
      "Därför att y′ alltid är ett"
    ],
    "why": "Vid implicit derivering beror y på x. Kedjeregeln ger därför faktorn dy/dx när en funktion av y deriveras."
  },
  "u44": {
    "q": "Vad är huvudsyftet med implicit derivering?",
    "a": [
      "Att hitta lutningar när y inte enkelt kan lösas ut",
      "Att göra varje kurva till en linje",
      "Att ta bort alla variabler utom konstanter",
      "Att beräkna bestämda integraler"
    ],
    "why": "Metoden ger derivatan direkt ur ett samband mellan x och y utan att man först behöver lösa ut y."
  },
  "u45": {
    "q": "Varför deriveras alla föränderliga storheter med avseende på tiden i ett problem om kopplade förändringshastigheter?",
    "a": [
      "Hastigheterna i sambandet måste avse samma oberoende variabel",
      "Alla storheter har samma numeriska förändringshastighet",
      "Insättning av ögonblicksvärden före derivering bevarar alltid alla hastighetstermer",
      "Derivering med avseende på tiden gör alla hastigheter positiva"
    ],
    "why": "När det gemensamma sambandet deriveras med avseende på tiden kopplas storheternas samtidiga förändringshastigheter ihop."
  },
  "u46": {
    "q": "Vilken geometrisk idé ligger bakom Newtons metod?",
    "a": [
      "Att använda en tangent för att uppskatta ett närliggande nollställe",
      "Att använda en sekantarea för att hitta ett maximum",
      "Att ersätta grafen med en horisontell linje",
      "Att spegla grafen i y-axeln"
    ],
    "why": "Varje Newtonsteg använder tangentlinjens skärning med x-axeln som nästa uppskattning av nollstället."
  },
  "u47": {
    "q": "När är logaritmisk derivering särskilt användbar?",
    "a": [
      "För produkter, kvoter eller potenser med variabel exponent",
      "Bara när uttrycket redan innehåller en logaritm",
      "När den vanliga potensregeln gäller, men aldrig för variabla exponenter",
      "Bara när funktionen är en produkt av konstanter"
    ],
    "why": "Logaritmer gör om produkter till summor och exponenter till faktorer. Det förenklar derivering av komplicerade uttryck."
  },
  "u48": {
    "q": "Varför kan numerisk derivering förstärka mätbrus?",
    "a": [
      "Den delar små skillnader mellan mätvärden med ett litet steg i den oberoende variabeln",
      "Den jämnar ut alla fel till noll",
      "Den använder aldrig närliggande värden",
      "Den ersätter data med exakta formler"
    ],
    "why": "Små mätfel kan bli stora i förhållande till de små skillnader som används för att uppskatta derivatan."
  },
  "u49": {
    "q": "Vad innebär f″(c)>0 vid en kritisk punkt c när andraderivatatestet är tillämpligt?",
    "a": [
      "Ett lokalt minimum",
      "Ett lokalt maximum",
      "En vertikal asymptot",
      "Ingen möjlig slutsats"
    ],
    "why": "Positiv andraderivata vid den stationära punkten ger enligt andraderivatatestet ett lokalt minimum."
  },
  "u50": {
    "q": "Vilka kandidater måste jämföras när man söker ett globalt extremvärde på ett slutet intervall?",
    "a": [
      "Inre kritiska punkter och båda ändpunkterna",
      "Bara punkter där f är noll",
      "Bara mittpunkten",
      "Bara punkter där f″ är noll"
    ],
    "why": "Metoden för slutna intervall jämför funktionsvärdena i alla inre kritiska punkter och i ändpunkterna."
  },
  "u51": {
    "q": "Varför måste ett fysiskt optimeringsproblem ha en tillåten definitionsmängd?",
    "a": [
      "För att utesluta omöjliga värden, till exempel negativa längder",
      "För att behålla varje algebraiskt funnen kritisk punkt som giltig kandidat",
      "För att garantera att varje kritisk punkt är en maximipunkt",
      "För att kunna bortse från ändpunkter"
    ],
    "why": "Definitionsmängden uttrycker de fysiska begränsningarna så att de matematiska kandidaterna är meningsfulla i det ursprungliga problemet."
  },
  "u52": {
    "q": "Var är en tangentlinjeapproximation vanligtvis mest noggrann?",
    "a": [
      "Nära tangeringspunkten",
      "Lika noggrann i alla punkter",
      "Bara vid ett nollställe",
      "Långt från tangeringspunkten"
    ],
    "why": "Linjärisering är lokal. De försummade termerna av högre ordning är små nära utvecklingspunkten."
  },
  "u53": {
    "q": "Varför kan Newtons metod misslyckas nära en punkt där f′ är nära noll?",
    "a": [
      "Tangentsteget kan bli mycket stort",
      "Metoden blir omedelbart exakt",
      "Grafen måste vara diskontinuerlig",
      "Nollstället försvinner"
    ],
    "why": "Newtons formel dividerar med f′. En mycket liten derivata kan därför ge ett instabilt och alltför stort steg."
  },
  "u54": {
    "q": "Vad innebär en negativ derivata av en uppmätt storhet i en teknisk modell?",
    "a": [
      "Storheten minskar vid det ögonblicket",
      "Storheten själv måste vara negativ",
      "Modellen saknar enheter",
      "Storheten har ett minimum"
    ],
    "why": "Derivatan beskriver förändringens riktning och takt. Ett negativt värde betyder att storheten minskar just då."
  },
  "u55": {
    "q": "Vad gör en vanlig differentialekvation separabel?",
    "a": [
      "Den kan skrivas om så att varje variabel med sin differential står på var sin sida",
      "Den har konstanta koefficienter",
      "Den är alltid av andra ordningen",
      "Dess lösning är ett polynom"
    ],
    "why": "Variabelseparation skiljer ett uttryck i den beroende variabeln från ett uttryck i den oberoende variabeln före integrationen."
  },
  "u56": {
    "q": "Vad är syftet med en integrerande faktor för en linjär differentialekvation av första ordningen?",
    "a": [
      "Att göra vänsterledet till derivatan av en produkt",
      "Att ta bort begynnelsevillkoret",
      "Att alltid göra ekvationen separabel",
      "Att hitta karakteristiska rötter"
    ],
    "why": "Multiplikation med den integrerande faktorn gör att vänsterledet kan skrivas som derivatan av en produkt."
  },
  "u57": {
    "q": "Vad är en jämviktslösning till en autonom differentialekvation?",
    "a": [
      "En konstant lösning där förändringshastigheten är noll",
      "Bara en periodisk lösning",
      "En lösning med begynnelsevärdet noll",
      "Varje linjär lösning"
    ],
    "why": "Vid jämvikt är högerledet noll och den beroende variabeln förblir konstant."
  },
  "u58": {
    "q": "För y′=g(y) är g(y)>0 strax under en jämvikt och g(y)<0 strax över den. Hur rör sig närliggande lösningar?",
    "a": [
      "Mot jämvikten när tiden ökar",
      "Bort från jämvikten på båda sidor",
      "Uppåt på båda sidor",
      "Nedåt på båda sidor"
    ],
    "why": "Under jämvikten gör den positiva derivatan att y växer. Ovanför gör den negativa derivatan att y avtar. Båda riktningarna pekar mot jämvikten."
  },
  "u59": {
    "q": "Vad måste kontrolleras när y′=y(1−y) separeras genom division med y(1−y)?",
    "a": [
      "De konstanta lösningarna y=0 och y=1, som divisionen utesluter",
      "Bara om tiden är positiv",
      "Om varje lösning är linjär",
      "Bara lösningen y=1/2"
    ],
    "why": "Divisionen förutsätter y(1−y)≠0. De uteslutna värdena y=0 och y=1 löser båda den ursprungliga ekvationen och måste undersökas separat."
  },
  "u60": {
    "q": "När gäller superpositionsprincipen för lösningar till differentialekvationer?",
    "a": [
      "För homogena linjära ekvationer",
      "För alla icke-linjära ekvationer",
      "Bara för separabla ekvationer",
      "Bara när begynnelsevärdena är noll"
    ],
    "why": "Linearitet och homogenitet gör att linjärkombinationer av lösningar också är lösningar."
  },
  "u61": {
    "q": "Om v(t) är hastigheten för ett föremål som rör sig längs en linje, hur fås den totala tillryggalagda sträckan på [a,b]?",
    "a": [
      "Integrera absolutbeloppet av v(t) från a till b",
      "Integrera v(t) och ta sedan absolutbeloppet i alla fall",
      "Subtrahera v(a) från v(b)",
      "Integrera v′(t) från a till b"
    ],
    "why": "Total sträcka räknar all rörelse positivt, även i negativ riktning. Integralen av hastigheten utan absolutbelopp ger förflyttningen med tecken."
  },
  "u62": {
    "q": "En tank har inflödet rᵢₙ(t) och utflödet rₒᵤₜ(t). Vad ger volymförändringen under ett tidsintervall?",
    "a": [
      "Integralen av inflödet minus utflödet",
      "Integralen av inflödet plus utflödet",
      "Skillnaden mellan inflödena vid intervallets ändpunkter",
      "Integralen av nettoflödets absolutbelopp"
    ],
    "why": "Volymens förändringshastighet är nettoflödet rᵢₙ−rₒᵤₜ. Integralen av nettoflödet ger volymförändringen, som kan vara positiv eller negativ."
  },
  "u63": {
    "q": "Hur beräknas medelvärdet av en kontinuerlig funktion f på [a,b], där a<b?",
    "a": [
      "Dela ∫ₐᵇ f(x)dx med b−a",
      "Använd (f(a)+f(b))/2 i alla fall",
      "Dela f(b)−f(a) med b−a",
      "Beräkna enbart funktionens värde i mittpunkten i alla fall"
    ],
    "why": "Funktionens medelvärde är integralen delad med intervallets längd: (1/(b−a))∫ₐᵇ f(x)dx. Det är något annat än genomsnittlig förändringshastighet."
  },
  "u64": {
    "q": "Hur förhåller sig trapetsregelns uppskattning till den exakta integralen för en kontinuerlig funktion som är konkav uppåt?",
    "a": [
      "Den överskattar integralen",
      "Den underskattar integralen",
      "Den är exakt för varje sådan funktion",
      "Enbart tecknet på f avgör felet"
    ],
    "why": "För en graf som är konkav uppåt ligger varje sekantsegment på eller ovanför grafen. Trapetserna ger därför ett värde som är minst lika stort som integralen."
  },
  "u65": {
    "q": "Vad använder ett steg i Eulers metod för y′=f(t,y)?",
    "a": [
      "Den aktuella lutningen för att uppskatta nästa y-värde",
      "Den exakta integralen av f över hela intervallet",
      "Enbart lutningen vid den okända slutliga lösningen",
      "Andraderivatan i stället för förstaderivatan"
    ],
    "why": "Eulers metod tar ett kort steg längs tangenten: nästa y-värde uppskattas som nuvarande y plus steglängden gånger den aktuella lutningen."
  },
  "u66": {
    "q": "En numerisk approximation ändras mycket lite när steglängden halveras. Vilken slutsats är rimlig?",
    "a": [
      "Det tyder på god noggrannhet, men är ingen garanti",
      "Approximationen måste nu vara exakt",
      "Avrundningsfelet har försvunnit",
      "Den bakomliggande matematiska modellen måste vara korrekt"
    ],
    "why": "Att jämföra steglängder är en användbar kontroll. Överensstämmelse bevisar inte exakthet eller att modellen är korrekt. Avrundningsfel och andra fel kan fortfarande spela roll."
  },
  "u67": {
    "q": "Om f är kontinuerlig, A(x)=∫₀ˣ f(t)dt och f byter tecken från positiv till negativ vid c, vad händer med A vid c?",
    "a": [
      "A har ett lokalt maximum",
      "A har ett lokalt minimum",
      "A blir diskontinuerlig",
      "A måste vara noll"
    ],
    "why": "Analysens huvudsats ger A′=f. Därför går A från att växa till att avta när f byter tecken från positiv till negativ."
  },
  "u68": {
    "q": "Om f är kontinuerlig, positiv och avtagande, vad gäller för A(x)=∫₀ˣ f(t)dt?",
    "a": [
      "A växer och är konkav nedåt",
      "A avtar och är konkav nedåt",
      "A växer och är konkav uppåt",
      "A är konstant"
    ],
    "why": "Eftersom A′=f har integralfunktionen positiva men avtagande lutningar. Därför växer A och är konkav nedåt."
  },
  "u69": {
    "q": "Varför avgör testet med horisontella linjer om en funktion har en invers?",
    "a": [
      "Det kontrollerar att varje funktionsvärde kommer från högst ett x-värde",
      "Det kontrollerar att alla tangenter är horisontella",
      "Det hittar alla vertikala asymptoter",
      "Det bevisar att derivatan är kontinuerlig"
    ],
    "why": "Två skärningar med samma horisontella linje innebär att två x-värden har samma funktionsvärde. Då skulle inversen inte vara en funktion."
  },
  "u70": {
    "q": "Anta att f är injektiv på ett intervall som innehåller a och att f′(a)=0. Vad kan hända med inversens graf i motsvarande punkt?",
    "a": [
      "Den kan ha en vertikal tangent eller sakna derivata",
      "Dess tangent måste också vara horisontell",
      "Den blir konstant överallt",
      "Den måste skära x-axeln"
    ],
    "why": "Spegling av en horisontell tangent i linjen y=x kan ge en vertikal tangent till inversens graf. Den vanliga formeln 1/f′(a) ger ingen ändlig derivata när f′(a)=0."
  },
  "u71": {
    "q": "Vilken egenskap hos en tillräckligt många gånger deriverbar funktion styr i stor utsträckning trapetsregelns fel?",
    "a": [
      "Andraderivatans storlek i intervallet",
      "Bara funktionens värde vid noll",
      "Om funktionen är udda",
      "Bara förstaderivatans tecken"
    ],
    "why": "Trapetsregeln ersätter grafen med räta linjesegment. Feluppskattningen beror på andraderivatans absolutbelopp."
  },
  "u72": {
    "q": "För y′=−ky med k>0 och y(0)>0, hur beter sig y på lång sikt?",
    "a": [
      "Den avtar mot noll utan att nå noll på ändlig tid",
      "Den avtar linjärt och når noll på ändlig tid",
      "Den växer exponentiellt",
      "Den blir negativ efter att ha passerat noll"
    ],
    "why": "Lösningen y(t)=y(0)e^(−kt) förblir positiv och avtar mot noll. Minskningstakten blir mindre när storheten blir mindre."
  }
};
if(typeof module==='object'&&module.exports)module.exports=translations;
root.CalculusMillionaireSwedish=translations;
})(typeof globalThis!=='undefined'?globalThis:this);
