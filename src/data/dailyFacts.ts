import { getLocale, type LocaleCode } from '../utils/i18n';

// ─── Fact of the Day ─────────────────────────────────────────
// A curated pool of accurate geography and flag trivia. One fact is
// surfaced per day, chosen deterministically from the date so every
// player sees the same fact on the same day (mirrors the daily challenge).
//
// Localized content lives inline here, following the same data-driven
// localization pattern as countryNames.ts rather than the typed t() locale
// files. Each locale must list its options in the SAME order so the
// locale-independent `answer` index stays correct.

export interface FactContent {
  /** The trivia question. */
  question: string;
  /** Exactly four answer options, kept in parallel order across locales. */
  options: string[];
  /** The interesting takeaway shown once the player has answered. */
  fact: string;
}

export interface DailyFact {
  id: string;
  /** Optional country code to show a flag alongside the question. */
  flagId?: string;
  /** Index (0-3) of the correct option. Locale-independent. */
  answer: number;
  /** Maintainer reference for the claim. Not shown to users. */
  note: string;
  content: Record<LocaleCode, FactContent>;
}

export const DAILY_FACTS: DailyFact[] = [
  {
    id: 'nepal_flag_shape',
    flagId: 'np',
    answer: 0,
    note: 'Nepal is the only non-rectangular national flag (two stacked pennants).',
    content: {
      en: {
        question: 'Which country has the only national flag that is not rectangular?',
        options: ['Nepal', 'Switzerland', 'Bhutan', 'Sri Lanka'],
        fact: "Nepal's flag is made of two stacked triangles, the only non-rectangular national flag in the world.",
      },
      fr: {
        question: "Quel pays possede le seul drapeau national qui n'est pas rectangulaire ?",
        options: ['Nepal', 'Suisse', 'Bhoutan', 'Sri Lanka'],
        fact: "Le drapeau du Nepal est forme de deux triangles superposes, le seul drapeau national non rectangulaire au monde.",
      },
      es: {
        question: 'Que pais tiene la unica bandera nacional que no es rectangular?',
        options: ['Nepal', 'Suiza', 'Butan', 'Sri Lanka'],
        fact: 'La bandera de Nepal esta formada por dos triangulos superpuestos, la unica bandera nacional no rectangular del mundo.',
      },
      de: {
        question: 'Welches Land hat die einzige Nationalflagge, die nicht rechteckig ist?',
        options: ['Nepal', 'Schweiz', 'Bhutan', 'Sri Lanka'],
        fact: 'Nepals Flagge besteht aus zwei uebereinander liegenden Dreiecken, die einzige nicht rechteckige Nationalflagge der Welt.',
      },
      'pt-BR': {
        question: 'Qual pais tem a unica bandeira nacional que nao e retangular?',
        options: ['Nepal', 'Suica', 'Butao', 'Sri Lanka'],
        fact: 'A bandeira do Nepal e formada por dois triangulos sobrepostos, a unica bandeira nacional nao retangular do mundo.',
      },
      zh: {
        question: '哪个国家拥有世界上唯一一面非矩形的国旗？',
        options: ['尼泊尔', '瑞士', '不丹', '斯里兰卡'],
        fact: '尼泊尔国旗由上下两个三角形组成，是世界上唯一一面非矩形的国旗。',
      },
    },
  },
  {
    id: 'canada_lakes',
    answer: 0,
    note: "Canada holds roughly 60% of the world's natural lakes.",
    content: {
      en: {
        question: 'Which country contains the most lakes in the world?',
        options: ['Canada', 'Russia', 'United States', 'Finland'],
        fact: 'Canada has more lakes than the rest of the world combined, holding roughly 60 percent of all natural lakes on Earth.',
      },
      fr: {
        question: 'Quel pays compte le plus de lacs au monde ?',
        options: ['Canada', 'Russie', 'Etats-Unis', 'Finlande'],
        fact: 'Le Canada possede plus de lacs que le reste du monde reuni, soit environ 60 pour cent de tous les lacs naturels de la planete.',
      },
      es: {
        question: 'Que pais tiene la mayor cantidad de lagos del mundo?',
        options: ['Canada', 'Rusia', 'Estados Unidos', 'Finlandia'],
        fact: 'Canada tiene mas lagos que el resto del mundo junto, alrededor del 60 por ciento de todos los lagos naturales del planeta.',
      },
      de: {
        question: 'Welches Land hat die meisten Seen der Welt?',
        options: ['Kanada', 'Russland', 'Vereinigte Staaten', 'Finnland'],
        fact: 'Kanada hat mehr Seen als der Rest der Welt zusammen, etwa 60 Prozent aller natuerlichen Seen der Erde.',
      },
      'pt-BR': {
        question: 'Qual pais tem o maior numero de lagos do mundo?',
        options: ['Canada', 'Russia', 'Estados Unidos', 'Finlandia'],
        fact: 'O Canada tem mais lagos do que o resto do mundo somado, cerca de 60 por cento de todos os lagos naturais do planeta.',
      },
      zh: {
        question: '世界上湖泊最多的国家是哪个？',
        options: ['加拿大', '俄罗斯', '美国', '芬兰'],
        fact: '加拿大的湖泊比世界其他地区加起来还多，约占地球上所有天然湖泊的60%。',
      },
    },
  },
  {
    id: 'largest_country',
    answer: 0,
    note: 'Russia is the largest country by area (~17 million km2).',
    content: {
      en: {
        question: 'What is the largest country in the world by land area?',
        options: ['Russia', 'Canada', 'China', 'United States'],
        fact: 'Russia covers about 17 million square kilometres and spans 11 time zones, nearly twice the size of Canada, the second largest.',
      },
      fr: {
        question: 'Quel est le plus grand pays du monde par sa superficie ?',
        options: ['Russie', 'Canada', 'Chine', 'Etats-Unis'],
        fact: "La Russie couvre environ 17 millions de kilometres carres et s'etend sur 11 fuseaux horaires, presque le double du Canada, le deuxieme plus grand.",
      },
      es: {
        question: 'Cual es el pais mas grande del mundo por superficie?',
        options: ['Rusia', 'Canada', 'China', 'Estados Unidos'],
        fact: 'Rusia abarca unos 17 millones de kilometros cuadrados y cruza 11 husos horarios, casi el doble que Canada, el segundo mas grande.',
      },
      de: {
        question: 'Welches ist das flaechengroesste Land der Welt?',
        options: ['Russland', 'Kanada', 'China', 'Vereinigte Staaten'],
        fact: 'Russland umfasst etwa 17 Millionen Quadratkilometer und erstreckt sich ueber 11 Zeitzonen, fast doppelt so gross wie Kanada, das zweitgroesste Land.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais do mundo em area?',
        options: ['Russia', 'Canada', 'China', 'Estados Unidos'],
        fact: 'A Russia cobre cerca de 17 milhoes de quilometros quadrados e cruza 11 fusos horarios, quase o dobro do Canada, o segundo maior.',
      },
      zh: {
        question: '世界上陆地面积最大的国家是哪个？',
        options: ['俄罗斯', '加拿大', '中国', '美国'],
        fact: '俄罗斯面积约1700万平方公里，横跨11个时区，几乎是第二大国家加拿大的两倍。',
      },
    },
  },
  {
    id: 'south_africa_capitals',
    flagId: 'za',
    answer: 0,
    note: 'South Africa has three capitals: Pretoria, Cape Town, Bloemfontein.',
    content: {
      en: {
        question: 'How many official capital cities does South Africa have?',
        options: ['Three', 'One', 'Two', 'Four'],
        fact: 'South Africa splits its government across three capitals: Pretoria (executive), Cape Town (legislative) and Bloemfontein (judicial).',
      },
      fr: {
        question: "Combien de capitales officielles compte l'Afrique du Sud ?",
        options: ['Trois', 'Une', 'Deux', 'Quatre'],
        fact: "L'Afrique du Sud repartit son gouvernement entre trois capitales : Pretoria (executif), Le Cap (legislatif) et Bloemfontein (judiciaire).",
      },
      es: {
        question: 'Cuantas capitales oficiales tiene Sudafrica?',
        options: ['Tres', 'Una', 'Dos', 'Cuatro'],
        fact: 'Sudafrica reparte su gobierno entre tres capitales: Pretoria (ejecutivo), Ciudad del Cabo (legislativo) y Bloemfontein (judicial).',
      },
      de: {
        question: 'Wie viele offizielle Hauptstaedte hat Suedafrika?',
        options: ['Drei', 'Eine', 'Zwei', 'Vier'],
        fact: 'Suedafrika verteilt seine Regierung auf drei Hauptstaedte: Pretoria (Exekutive), Kapstadt (Legislative) und Bloemfontein (Judikative).',
      },
      'pt-BR': {
        question: 'Quantas capitais oficiais a Africa do Sul tem?',
        options: ['Tres', 'Uma', 'Duas', 'Quatro'],
        fact: 'A Africa do Sul divide seu governo entre tres capitais: Pretoria (executivo), Cidade do Cabo (legislativo) e Bloemfontein (judiciario).',
      },
      zh: {
        question: '南非有几个官方首都？',
        options: ['三个', '一个', '两个', '四个'],
        fact: '南非将政府分设在三个首都：比勒陀利亚（行政）、开普敦（立法）和布隆方丹（司法）。',
      },
    },
  },
  {
    id: 'bhutan_dragon',
    flagId: 'bt',
    answer: 0,
    note: "Bhutan's flag features Druk, the thunder dragon.",
    content: {
      en: {
        question: "Which country's flag features a dragon?",
        options: ['Bhutan', 'Mongolia', 'Sri Lanka', 'Myanmar'],
        fact: "Bhutan's flag shows Druk, the thunder dragon. The country's name in its own language means Land of the Thunder Dragon.",
      },
      fr: {
        question: 'Le drapeau de quel pays represente un dragon ?',
        options: ['Bhoutan', 'Mongolie', 'Sri Lanka', 'Birmanie'],
        fact: "Le drapeau du Bhoutan montre Druk, le dragon du tonnerre. Le nom du pays dans sa propre langue signifie Pays du Dragon-Tonnerre.",
      },
      es: {
        question: 'La bandera de que pais muestra un dragon?',
        options: ['Butan', 'Mongolia', 'Sri Lanka', 'Myanmar'],
        fact: 'La bandera de Butan muestra a Druk, el dragon del trueno. El nombre del pais en su propio idioma significa Tierra del Dragon del Trueno.',
      },
      de: {
        question: 'Auf der Flagge welches Landes ist ein Drache zu sehen?',
        options: ['Bhutan', 'Mongolei', 'Sri Lanka', 'Myanmar'],
        fact: 'Bhutans Flagge zeigt Druk, den Donnerdrachen. Der Name des Landes bedeutet in der Landessprache Land des Donnerdrachen.',
      },
      'pt-BR': {
        question: 'A bandeira de qual pais mostra um dragao?',
        options: ['Butao', 'Mongolia', 'Sri Lanka', 'Myanmar'],
        fact: 'A bandeira do Butao mostra Druk, o dragao do trovao. O nome do pais no idioma local significa Terra do Dragao do Trovao.',
      },
      zh: {
        question: '哪个国家的国旗上有一条龙？',
        options: ['不丹', '蒙古', '斯里兰卡', '缅甸'],
        fact: '不丹国旗上是雷龙「druk」。该国在本国语言中的名称意为「雷龙之地」。',
      },
    },
  },
  {
    id: 'angel_falls',
    flagId: 've',
    answer: 0,
    note: "Angel Falls in Venezuela is the world's tallest waterfall (979 m).",
    content: {
      en: {
        question: "Which country is home to Angel Falls, the world's tallest waterfall?",
        options: ['Venezuela', 'Brazil', 'Colombia', 'Guyana'],
        fact: 'Angel Falls drops 979 metres in Venezuela, so high that much of the water evaporates into mist before reaching the ground.',
      },
      fr: {
        question: 'Quel pays abrite le Salto Angel, la plus haute cascade du monde ?',
        options: ['Venezuela', 'Bresil', 'Colombie', 'Guyana'],
        fact: "Le Salto Angel chute de 979 metres au Venezuela, si haut qu'une grande partie de l'eau se transforme en brume avant d'atteindre le sol.",
      },
      es: {
        question: 'En que pais esta el Salto Angel, la cascada mas alta del mundo?',
        options: ['Venezuela', 'Brasil', 'Colombia', 'Guyana'],
        fact: 'El Salto Angel cae 979 metros en Venezuela, tan alto que gran parte del agua se convierte en neblina antes de llegar al suelo.',
      },
      de: {
        question: 'In welchem Land liegt der Angel-Wasserfall, der hoechste Wasserfall der Welt?',
        options: ['Venezuela', 'Brasilien', 'Kolumbien', 'Guyana'],
        fact: 'Der Angel-Wasserfall stuerzt in Venezuela 979 Meter in die Tiefe, so hoch, dass ein Grossteil des Wassers vor dem Aufprall zu Nebel verdunstet.',
      },
      'pt-BR': {
        question: 'Em qual pais fica o Salto Angel, a cachoeira mais alta do mundo?',
        options: ['Venezuela', 'Brasil', 'Colombia', 'Guiana'],
        fact: 'O Salto Angel despenca 979 metros na Venezuela, tao alto que boa parte da agua vira nevoa antes de chegar ao chao.',
      },
      zh: {
        question: '世界上最高的瀑布安赫尔瀑布位于哪个国家？',
        options: ['委内瑞拉', '巴西', '哥伦比亚', '圭亚那'],
        fact: '安赫尔瀑布在委内瑞拉落差达979米，因为太高，大部分水流在落地前就化为水雾。',
      },
    },
  },
  {
    id: 'everest_border',
    answer: 0,
    note: 'Everest summit is on the Nepal-China (Tibet) border.',
    content: {
      en: {
        question: 'Mount Everest sits on the border between Nepal and which other country?',
        options: ['China', 'India', 'Bhutan', 'Pakistan'],
        fact: 'The summit of Everest marks the border between Nepal and China (Tibet). It rises about 8,849 metres above sea level.',
      },
      fr: {
        question: "Le mont Everest se trouve a la frontiere entre le Nepal et quel autre pays ?",
        options: ['Chine', 'Inde', 'Bhoutan', 'Pakistan'],
        fact: "Le sommet de l'Everest marque la frontiere entre le Nepal et la Chine (Tibet). Il culmine a environ 8 849 metres.",
      },
      es: {
        question: 'El monte Everest se encuentra en la frontera entre Nepal y que otro pais?',
        options: ['China', 'India', 'Butan', 'Pakistan'],
        fact: 'La cima del Everest marca la frontera entre Nepal y China (Tibet). Se eleva unos 8.849 metros sobre el nivel del mar.',
      },
      de: {
        question: 'Der Mount Everest liegt an der Grenze zwischen Nepal und welchem anderen Land?',
        options: ['China', 'Indien', 'Bhutan', 'Pakistan'],
        fact: 'Der Gipfel des Everest markiert die Grenze zwischen Nepal und China (Tibet). Er ragt etwa 8.849 Meter ueber den Meeresspiegel.',
      },
      'pt-BR': {
        question: 'O monte Everest fica na fronteira entre o Nepal e qual outro pais?',
        options: ['China', 'India', 'Butao', 'Paquistao'],
        fact: 'O cume do Everest marca a fronteira entre o Nepal e a China (Tibete). Ele se eleva cerca de 8.849 metros acima do nivel do mar.',
      },
      zh: {
        question: '珠穆朗玛峰位于尼泊尔与哪个国家的边界上？',
        options: ['中国', '印度', '不丹', '巴基斯坦'],
        fact: '珠峰峰顶是尼泊尔与中国（西藏）的边界，海拔约8849米。',
      },
    },
  },
  {
    id: 'longest_coastline',
    answer: 0,
    note: "Canada has the world's longest coastline (~202,000 km).",
    content: {
      en: {
        question: 'Which country has the longest coastline in the world?',
        options: ['Canada', 'Indonesia', 'Russia', 'Australia'],
        fact: "Canada's coastline stretches over 200,000 kilometres, longer than all other countries combined, thanks to its vast Arctic islands.",
      },
      fr: {
        question: 'Quel pays possede le plus long littoral du monde ?',
        options: ['Canada', 'Indonesie', 'Russie', 'Australie'],
        fact: "Le littoral du Canada s'etend sur plus de 200 000 kilometres, plus que tous les autres pays reunis, grace a ses vastes iles arctiques.",
      },
      es: {
        question: 'Que pais tiene la costa mas larga del mundo?',
        options: ['Canada', 'Indonesia', 'Rusia', 'Australia'],
        fact: 'La costa de Canada supera los 200.000 kilometros, mas que la de todos los demas paises juntos, gracias a sus enormes islas articas.',
      },
      de: {
        question: 'Welches Land hat die laengste Kuestenlinie der Welt?',
        options: ['Kanada', 'Indonesien', 'Russland', 'Australien'],
        fact: 'Kanadas Kueste erstreckt sich ueber 200.000 Kilometer, laenger als die aller anderen Laender zusammen, dank seiner riesigen arktischen Inseln.',
      },
      'pt-BR': {
        question: 'Qual pais tem o litoral mais longo do mundo?',
        options: ['Canada', 'Indonesia', 'Russia', 'Australia'],
        fact: 'O litoral do Canada passa de 200.000 quilometros, mais do que o de todos os outros paises somados, gracas as suas vastas ilhas articas.',
      },
      zh: {
        question: '世界上海岸线最长的国家是哪个？',
        options: ['加拿大', '印度尼西亚', '俄罗斯', '澳大利亚'],
        fact: '加拿大海岸线超过20万公里，比其他所有国家加起来还长，这得益于其广阔的北极群岛。',
      },
    },
  },
  {
    id: 'largest_africa',
    flagId: 'dz',
    answer: 0,
    note: 'Algeria became the largest African country in 2011 after Sudan split.',
    content: {
      en: {
        question: 'What is the largest country in Africa by area?',
        options: ['Algeria', 'Sudan', 'DR Congo', 'Libya'],
        fact: "Algeria became Africa's largest country in 2011 after Sudan split. More than four fifths of it lies within the Sahara Desert.",
      },
      fr: {
        question: "Quel est le plus grand pays d'Afrique par sa superficie ?",
        options: ['Algerie', 'Soudan', 'RD Congo', 'Libye'],
        fact: "L'Algerie est devenue le plus grand pays d'Afrique en 2011, apres la partition du Soudan. Plus des quatre cinquiemes de son territoire se trouvent dans le Sahara.",
      },
      es: {
        question: 'Cual es el pais mas grande de Africa por superficie?',
        options: ['Argelia', 'Sudan', 'RD del Congo', 'Libia'],
        fact: 'Argelia se convirtio en el pais mas grande de Africa en 2011, tras la division de Sudan. Mas de cuatro quintas partes de su territorio estan en el Sahara.',
      },
      de: {
        question: 'Welches ist das flaechengroesste Land Afrikas?',
        options: ['Algerien', 'Sudan', 'DR Kongo', 'Libyen'],
        fact: 'Algerien wurde 2011 nach der Teilung des Sudan zum groessten Land Afrikas. Mehr als vier Fuenftel davon liegen in der Sahara.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais da Africa em area?',
        options: ['Argelia', 'Sudao', 'RD Congo', 'Libia'],
        fact: 'A Argelia tornou-se o maior pais da Africa em 2011, apos a divisao do Sudao. Mais de quatro quintos dela ficam no deserto do Saara.',
      },
      zh: {
        question: '非洲面积最大的国家是哪个？',
        options: ['阿尔及利亚', '苏丹', '刚果（金）', '利比亚'],
        fact: '2011年苏丹分裂后，阿尔及利亚成为非洲面积最大的国家。其五分之四以上的国土位于撒哈拉沙漠。',
      },
    },
  },
  {
    id: 'indonesia_monaco',
    flagId: 'id',
    answer: 0,
    note: "Indonesia's flag is near-identical to Monaco's (red over white).",
    content: {
      en: {
        question: "Indonesia's red and white flag is almost identical to which country's flag?",
        options: ['Monaco', 'Poland', 'Japan', 'Austria'],
        fact: 'Indonesia and Monaco both fly a red bar over a white bar. The flags differ only slightly in their proportions.',
      },
      fr: {
        question: "Le drapeau rouge et blanc de l'Indonesie est presque identique a celui de quel pays ?",
        options: ['Monaco', 'Pologne', 'Japon', 'Autriche'],
        fact: "L'Indonesie et Monaco arborent tous deux une bande rouge sur une bande blanche. Les drapeaux ne different que legerement par leurs proportions.",
      },
      es: {
        question: 'La bandera roja y blanca de Indonesia es casi identica a la de que pais?',
        options: ['Monaco', 'Polonia', 'Japon', 'Austria'],
        fact: 'Indonesia y Monaco lucen una franja roja sobre una franja blanca. Las banderas solo difieren ligeramente en sus proporciones.',
      },
      de: {
        question: 'Indonesiens rot-weisse Flagge ist fast identisch mit der Flagge welches Landes?',
        options: ['Monaco', 'Polen', 'Japan', 'Oesterreich'],
        fact: 'Indonesien und Monaco fuehren beide einen roten Streifen ueber einem weissen Streifen. Die Flaggen unterscheiden sich nur geringfuegig in den Proportionen.',
      },
      'pt-BR': {
        question: 'A bandeira vermelha e branca da Indonesia e quase identica a de qual pais?',
        options: ['Monaco', 'Polonia', 'Japao', 'Austria'],
        fact: 'Indonesia e Monaco exibem uma faixa vermelha sobre uma faixa branca. As bandeiras diferem apenas ligeiramente nas proporcoes.',
      },
      zh: {
        question: '印度尼西亚的红白国旗与哪个国家的国旗几乎一模一样？',
        options: ['摩纳哥', '波兰', '日本', '奥地利'],
        fact: '印度尼西亚和摩纳哥的国旗都是上红下白，两者仅在比例上略有差别。',
      },
    },
  },
  {
    id: 'argentina_silver',
    flagId: 'ar',
    answer: 0,
    note: 'Argentina derives from argentum, Latin for silver.',
    content: {
      en: {
        question: "Which country's name comes from the Latin word for silver?",
        options: ['Argentina', 'Chile', 'Bolivia', 'Peru'],
        fact: 'Argentina takes its name from argentum, Latin for silver, after early explorers hoped to find precious metals there.',
      },
      fr: {
        question: 'Le nom de quel pays vient du mot latin signifiant argent ?',
        options: ['Argentine', 'Chili', 'Bolivie', 'Perou'],
        fact: "L'Argentine tire son nom d'argentum, le mot latin pour argent, les premiers explorateurs esperant y trouver des metaux precieux.",
      },
      es: {
        question: 'El nombre de que pais proviene de la palabra latina para plata?',
        options: ['Argentina', 'Chile', 'Bolivia', 'Peru'],
        fact: 'Argentina debe su nombre a argentum, plata en latin, porque los primeros exploradores esperaban hallar alli metales preciosos.',
      },
      de: {
        question: 'Der Name welches Landes stammt vom lateinischen Wort fuer Silber?',
        options: ['Argentinien', 'Chile', 'Bolivien', 'Peru'],
        fact: 'Argentinien hat seinen Namen von argentum, lateinisch fuer Silber, weil fruehe Entdecker dort Edelmetalle zu finden hofften.',
      },
      'pt-BR': {
        question: 'O nome de qual pais vem da palavra latina para prata?',
        options: ['Argentina', 'Chile', 'Bolivia', 'Peru'],
        fact: 'A Argentina deve o nome a argentum, prata em latim, pois os primeiros exploradores esperavam encontrar metais preciosos ali.',
      },
      zh: {
        question: '哪个国家的名字源自拉丁语中「白银」一词？',
        options: ['阿根廷', '智利', '玻利维亚', '秘鲁'],
        fact: '阿根廷的名字来自拉丁语 argentum（白银），因为早期探险者希望在那里找到贵金属。',
      },
    },
  },
  {
    id: 'cambodia_building',
    flagId: 'kh',
    answer: 0,
    note: "Cambodia's flag (Angkor Wat) is the only one to depict a building.",
    content: {
      en: {
        question: "Which country's flag is the only one to feature a building?",
        options: ['Cambodia', 'Thailand', 'Laos', 'Vietnam'],
        fact: "Cambodia's flag shows the temple of Angkor Wat, the only national flag in the world to depict a building.",
      },
      fr: {
        question: 'Le drapeau de quel pays est le seul a representer un batiment ?',
        options: ['Cambodge', 'Thailande', 'Laos', 'Vietnam'],
        fact: "Le drapeau du Cambodge montre le temple d'Angkor Vat, le seul drapeau national au monde a representer un batiment.",
      },
      es: {
        question: 'La bandera de que pais es la unica que muestra un edificio?',
        options: ['Camboya', 'Tailandia', 'Laos', 'Vietnam'],
        fact: 'La bandera de Camboya muestra el templo de Angkor Wat, la unica bandera nacional del mundo que representa un edificio.',
      },
      de: {
        question: 'Die Flagge welches Landes ist die einzige, die ein Gebaeude zeigt?',
        options: ['Kambodscha', 'Thailand', 'Laos', 'Vietnam'],
        fact: 'Kambodschas Flagge zeigt den Tempel Angkor Wat, die einzige Nationalflagge der Welt, die ein Gebaeude abbildet.',
      },
      'pt-BR': {
        question: 'A bandeira de qual pais e a unica que mostra um edificio?',
        options: ['Camboja', 'Tailandia', 'Laos', 'Vietna'],
        fact: 'A bandeira do Camboja mostra o templo de Angkor Wat, a unica bandeira nacional do mundo a retratar um edificio.',
      },
      zh: {
        question: '哪个国家的国旗是世界上唯一一面绘有建筑物的国旗？',
        options: ['柬埔寨', '泰国', '老挝', '越南'],
        fact: '柬埔寨国旗上是吴哥窟寺庙，是世界上唯一一面绘有建筑物的国旗。',
      },
    },
  },
  {
    id: 'france_timezones',
    flagId: 'fr',
    answer: 0,
    note: 'France spans 12 time zones, the most of any country (overseas territories).',
    content: {
      en: {
        question: 'Which country spans the most time zones?',
        options: ['France', 'Russia', 'United States', 'China'],
        fact: 'France stretches across 12 time zones, more than any other country, because of its overseas territories around the globe.',
      },
      fr: {
        question: "Quel pays s'etend sur le plus grand nombre de fuseaux horaires ?",
        options: ['France', 'Russie', 'Etats-Unis', 'Chine'],
        fact: "La France couvre 12 fuseaux horaires, plus que tout autre pays, grace a ses territoires d'outre-mer repartis sur la planete.",
      },
      es: {
        question: 'Que pais abarca la mayor cantidad de husos horarios?',
        options: ['Francia', 'Rusia', 'Estados Unidos', 'China'],
        fact: 'Francia abarca 12 husos horarios, mas que cualquier otro pais, debido a sus territorios de ultramar repartidos por el mundo.',
      },
      de: {
        question: 'Welches Land erstreckt sich ueber die meisten Zeitzonen?',
        options: ['Frankreich', 'Russland', 'Vereinigte Staaten', 'China'],
        fact: 'Frankreich erstreckt sich ueber 12 Zeitzonen, mehr als jedes andere Land, dank seiner Ueberseegebiete rund um den Globus.',
      },
      'pt-BR': {
        question: 'Qual pais abrange o maior numero de fusos horarios?',
        options: ['Franca', 'Russia', 'Estados Unidos', 'China'],
        fact: 'A Franca abrange 12 fusos horarios, mais do que qualquer outro pais, por causa de seus territorios ultramarinos pelo mundo.',
      },
      zh: {
        question: '哪个国家横跨的时区最多？',
        options: ['法国', '俄罗斯', '美国', '中国'],
        fact: '由于遍布全球的海外领地，法国横跨12个时区，比任何其他国家都多。',
      },
    },
  },
  {
    id: 'ethiopia_uncolonized',
    flagId: 'et',
    answer: 0,
    note: 'Ethiopia was never colonized; won the Battle of Adwa in 1896.',
    content: {
      en: {
        question: 'Which African country was never colonized by a European power?',
        options: ['Ethiopia', 'Kenya', 'Ghana', 'Senegal'],
        fact: 'Ethiopia kept its independence through the colonial era, famously defeating an invading army at the Battle of Adwa in 1896.',
      },
      fr: {
        question: "Quel pays africain n'a jamais ete colonise par une puissance europeenne ?",
        options: ['Ethiopie', 'Kenya', 'Ghana', 'Senegal'],
        fact: "L'Ethiopie a conserve son independance durant l'ere coloniale, repoussant notamment une armee d'invasion a la bataille d'Adoua en 1896.",
      },
      es: {
        question: 'Que pais africano nunca fue colonizado por una potencia europea?',
        options: ['Etiopia', 'Kenia', 'Ghana', 'Senegal'],
        fact: 'Etiopia mantuvo su independencia durante la era colonial y derroto a un ejercito invasor en la batalla de Adua en 1896.',
      },
      de: {
        question: 'Welches afrikanische Land wurde nie von einer europaeischen Macht kolonisiert?',
        options: ['Aethiopien', 'Kenia', 'Ghana', 'Senegal'],
        fact: 'Aethiopien bewahrte seine Unabhaengigkeit durch die Kolonialzeit und besiegte 1896 in der Schlacht von Adua eine Invasionsarmee.',
      },
      'pt-BR': {
        question: 'Qual pais africano nunca foi colonizado por uma potencia europeia?',
        options: ['Etiopia', 'Quenia', 'Gana', 'Senegal'],
        fact: 'A Etiopia manteve sua independencia durante a era colonial e derrotou um exercito invasor na Batalha de Adwa, em 1896.',
      },
      zh: {
        question: '哪个非洲国家从未被欧洲列强殖民？',
        options: ['埃塞俄比亚', '肯尼亚', '加纳', '塞内加尔'],
        fact: '埃塞俄比亚在殖民时代始终保持独立，并在1896年的阿杜瓦战役中击败了入侵的军队。',
      },
    },
  },
  {
    id: 'ecuador_equator',
    flagId: 'ec',
    answer: 0,
    note: 'Ecuador is Spanish for equator; the line passes through the country.',
    content: {
      en: {
        question: 'Which country is named after the imaginary line that runs through it?',
        options: ['Ecuador', 'Panama', 'Colombia', 'Peru'],
        fact: 'Ecuador is Spanish for equator. The line of zero latitude passes right through the country, near its capital Quito.',
      },
      fr: {
        question: 'Quel pays porte le nom de la ligne imaginaire qui le traverse ?',
        options: ['Equateur', 'Panama', 'Colombie', 'Perou'],
        fact: "Ecuador signifie equateur en espagnol. La ligne de latitude zero traverse le pays, pres de sa capitale Quito.",
      },
      es: {
        question: 'Que pais lleva el nombre de la linea imaginaria que lo cruza?',
        options: ['Ecuador', 'Panama', 'Colombia', 'Peru'],
        fact: 'Ecuador significa la linea del ecuador. La latitud cero atraviesa el pais, cerca de su capital, Quito.',
      },
      de: {
        question: 'Welches Land ist nach der gedachten Linie benannt, die durch es verlaeuft?',
        options: ['Ecuador', 'Panama', 'Kolumbien', 'Peru'],
        fact: 'Ecuador ist das spanische Wort fuer Aequator. Die Linie des Nullbreitengrads verlaeuft mitten durch das Land, nahe der Hauptstadt Quito.',
      },
      'pt-BR': {
        question: 'Qual pais recebe o nome da linha imaginaria que o atravessa?',
        options: ['Equador', 'Panama', 'Colombia', 'Peru'],
        fact: 'Equador e a palavra para a linha do equador. A latitude zero corta o pais, perto da capital, Quito.',
      },
      zh: {
        question: '哪个国家以穿过它的那条假想线命名？',
        options: ['厄瓜多尔', '巴拿马', '哥伦比亚', '秘鲁'],
        fact: '厄瓜多尔（Ecuador）在西班牙语中意为「赤道」。零纬度线正好穿过该国，靠近首都基多。',
      },
    },
  },
  {
    id: 'istanbul_two_continents',
    flagId: 'tr',
    answer: 0,
    note: 'Istanbul (Turkey) straddles Europe and Asia across the Bosphorus.',
    content: {
      en: {
        question: 'Istanbul is the only major city that sits on two continents. In which country is it?',
        options: ['Turkey', 'Greece', 'Egypt', 'Russia'],
        fact: 'Istanbul straddles the Bosphorus strait, with one side in Europe and the other in Asia, the only major city to span two continents.',
      },
      fr: {
        question: 'Istanbul est la seule grande ville a cheval sur deux continents. Dans quel pays se trouve-t-elle ?',
        options: ['Turquie', 'Grece', 'Egypte', 'Russie'],
        fact: "Istanbul enjambe le detroit du Bosphore, avec un cote en Europe et l'autre en Asie, la seule grande ville repartie sur deux continents.",
      },
      es: {
        question: 'Estambul es la unica gran ciudad situada en dos continentes. En que pais esta?',
        options: ['Turquia', 'Grecia', 'Egipto', 'Rusia'],
        fact: 'Estambul se extiende a ambos lados del estrecho del Bosforo, con un lado en Europa y otro en Asia, la unica gran ciudad en dos continentes.',
      },
      de: {
        question: 'Istanbul ist die einzige Grossstadt auf zwei Kontinenten. In welchem Land liegt sie?',
        options: ['Tuerkei', 'Griechenland', 'Aegypten', 'Russland'],
        fact: 'Istanbul liegt beiderseits des Bosporus, eine Seite in Europa, die andere in Asien, die einzige Grossstadt auf zwei Kontinenten.',
      },
      'pt-BR': {
        question: 'Istambul e a unica grande cidade situada em dois continentes. Em que pais ela fica?',
        options: ['Turquia', 'Grecia', 'Egito', 'Russia'],
        fact: 'Istambul fica nas duas margens do estreito de Bosforo, um lado na Europa e outro na Asia, a unica grande cidade em dois continentes.',
      },
      zh: {
        question: '伊斯坦布尔是唯一横跨两大洲的大城市，它位于哪个国家？',
        options: ['土耳其', '希腊', '埃及', '俄罗斯'],
        fact: '伊斯坦布尔横跨博斯普鲁斯海峡，一侧在欧洲，一侧在亚洲，是唯一横跨两大洲的大城市。',
      },
    },
  },
  {
    id: 'largest_desert',
    answer: 0,
    note: 'Antarctica is the largest desert (defined by low precipitation).',
    content: {
      en: {
        question: 'What is the largest desert in the world?',
        options: ['Antarctica', 'The Sahara', 'The Arabian Desert', 'The Gobi'],
        fact: 'A desert is defined by how little rain it gets, not by heat. Antarctica is the largest, a frozen desert bigger than the Sahara.',
      },
      fr: {
        question: 'Quel est le plus grand desert du monde ?',
        options: ["L'Antarctique", 'Le Sahara', "Le desert d'Arabie", 'Le Gobi'],
        fact: "Un desert se definit par sa faible pluviometrie, pas par la chaleur. L'Antarctique est le plus grand, un desert glace plus vaste que le Sahara.",
      },
      es: {
        question: 'Cual es el desierto mas grande del mundo?',
        options: ['La Antartida', 'El Sahara', 'El desierto de Arabia', 'El Gobi'],
        fact: 'Un desierto se define por la escasez de lluvia, no por el calor. La Antartida es el mayor, un desierto helado mas grande que el Sahara.',
      },
      de: {
        question: 'Welches ist die groesste Wueste der Welt?',
        options: ['Die Antarktis', 'Die Sahara', 'Die Arabische Wueste', 'Die Gobi'],
        fact: 'Eine Wueste wird durch geringe Niederschlaege definiert, nicht durch Hitze. Die Antarktis ist die groesste, eine Eiswueste, groesser als die Sahara.',
      },
      'pt-BR': {
        question: 'Qual e o maior deserto do mundo?',
        options: ['A Antartida', 'O Saara', 'O deserto da Arabia', 'O Gobi'],
        fact: 'Um deserto e definido pela pouca chuva, nao pelo calor. A Antartida e o maior, um deserto gelado maior que o Saara.',
      },
      zh: {
        question: '世界上最大的沙漠是哪个？',
        options: ['南极洲', '撒哈拉沙漠', '阿拉伯沙漠', '戈壁沙漠'],
        fact: '沙漠是按降水量极少来定义的，而非炎热。南极洲是最大的沙漠，这片冰封荒漠比撒哈拉还大。',
      },
    },
  },
  {
    id: 'sudan_pyramids',
    flagId: 'sd',
    answer: 0,
    note: 'Sudan has ~200 pyramids, more than Egypt (Kingdom of Kush).',
    content: {
      en: {
        question: 'Which country has the most ancient pyramids?',
        options: ['Sudan', 'Egypt', 'Mexico', 'Peru'],
        fact: 'Sudan has around 200 ancient pyramids, far more than Egypt. They were built by the Kingdom of Kush along the Nile.',
      },
      fr: {
        question: 'Quel pays compte le plus de pyramides antiques ?',
        options: ['Soudan', 'Egypte', 'Mexique', 'Perou'],
        fact: 'Le Soudan compte environ 200 pyramides antiques, bien plus que l Egypte. Elles ont ete construites par le royaume de Koush le long du Nil.',
      },
      es: {
        question: 'Que pais tiene la mayor cantidad de piramides antiguas?',
        options: ['Sudan', 'Egipto', 'Mexico', 'Peru'],
        fact: 'Sudan tiene unas 200 piramides antiguas, muchas mas que Egipto. Las construyo el reino de Kush a lo largo del Nilo.',
      },
      de: {
        question: 'Welches Land hat die meisten antiken Pyramiden?',
        options: ['Sudan', 'Aegypten', 'Mexiko', 'Peru'],
        fact: 'Der Sudan hat rund 200 antike Pyramiden, weit mehr als Aegypten. Sie wurden vom Koenigreich Kusch entlang des Nils errichtet.',
      },
      'pt-BR': {
        question: 'Qual pais tem o maior numero de piramides antigas?',
        options: ['Sudao', 'Egito', 'Mexico', 'Peru'],
        fact: 'O Sudao tem cerca de 200 piramides antigas, muito mais que o Egito. Elas foram erguidas pelo Reino de Cuxe ao longo do Nilo.',
      },
      zh: {
        question: '哪个国家拥有最多的古代金字塔？',
        options: ['苏丹', '埃及', '墨西哥', '秘鲁'],
        fact: '苏丹拥有约200座古代金字塔，远多于埃及。它们由库施王国沿尼罗河修建。',
      },
    },
  },
  {
    id: 'brazil_motto',
    flagId: 'br',
    answer: 0,
    note: "Brazil's flag motto 'Ordem e Progresso' = Order and Progress (positivism).",
    content: {
      en: {
        question: "Brazil's flag carries the motto 'Ordem e Progresso.' What does it mean?",
        options: ['Order and Progress', 'Peace and Work', 'Unity and Faith', 'Liberty and Justice'],
        fact: "The green banner on Brazil's flag reads Order and Progress, a phrase inspired by the philosophy of positivism.",
      },
      fr: {
        question: "Le drapeau du Bresil porte la devise Ordem e Progresso. Que signifie-t-elle ?",
        options: ['Ordre et Progres', 'Paix et Travail', 'Unite et Foi', 'Liberte et Justice'],
        fact: "Le bandeau vert du drapeau bresilien indique Ordre et Progres, une formule inspiree de la philosophie du positivisme.",
      },
      es: {
        question: 'La bandera de Brasil lleva el lema Ordem e Progresso. Que significa?',
        options: ['Orden y Progreso', 'Paz y Trabajo', 'Unidad y Fe', 'Libertad y Justicia'],
        fact: 'La banda verde de la bandera brasilena dice Orden y Progreso, una frase inspirada en la filosofia del positivismo.',
      },
      de: {
        question: 'Brasiliens Flagge traegt den Wahlspruch Ordem e Progresso. Was bedeutet er?',
        options: ['Ordnung und Fortschritt', 'Frieden und Arbeit', 'Einheit und Glaube', 'Freiheit und Gerechtigkeit'],
        fact: 'Das gruene Band auf Brasiliens Flagge bedeutet Ordnung und Fortschritt, ein vom Positivismus inspirierter Leitspruch.',
      },
      'pt-BR': {
        question: "A faixa da bandeira do Brasil traz o lema 'Ordem e Progresso'. Em qual filosofia ele foi inspirado?",
        options: ['No positivismo', 'No iluminismo', 'No romantismo', 'No socialismo'],
        fact: 'A faixa verde da bandeira brasileira diz Ordem e Progresso, um lema inspirado na filosofia positivista de Auguste Comte.',
      },
      zh: {
        question: '巴西国旗上写着格言「Ordem e Progresso」，它是什么意思？',
        options: ['秩序与进步', '和平与劳动', '团结与信仰', '自由与正义'],
        fact: '巴西国旗上的绿色绶带写着「秩序与进步」，这句话源自实证主义哲学。',
      },
    },
  },
  {
    id: 'largest_island',
    answer: 0,
    note: 'Greenland is the largest island (Australia counts as a continent).',
    content: {
      en: {
        question: 'What is the largest island in the world?',
        options: ['Greenland', 'New Guinea', 'Borneo', 'Madagascar'],
        fact: 'Greenland is the largest island on Earth. Australia is bigger but counts as a continent rather than an island.',
      },
      fr: {
        question: 'Quelle est la plus grande ile du monde ?',
        options: ['Le Groenland', 'La Nouvelle-Guinee', 'Borneo', 'Madagascar'],
        fact: "Le Groenland est la plus grande ile du monde. L'Australie est plus vaste mais est consideree comme un continent.",
      },
      es: {
        question: 'Cual es la isla mas grande del mundo?',
        options: ['Groenlandia', 'Nueva Guinea', 'Borneo', 'Madagascar'],
        fact: 'Groenlandia es la isla mas grande del mundo. Australia es mayor, pero se considera un continente.',
      },
      de: {
        question: 'Welches ist die groesste Insel der Welt?',
        options: ['Groenland', 'Neuguinea', 'Borneo', 'Madagaskar'],
        fact: 'Groenland ist die groesste Insel der Welt. Australien ist groesser, gilt aber als Kontinent.',
      },
      'pt-BR': {
        question: 'Qual e a maior ilha do mundo?',
        options: ['Groenlandia', 'Nova Guine', 'Borneu', 'Madagascar'],
        fact: 'A Groenlandia e a maior ilha do mundo. A Australia e maior, mas e considerada um continente.',
      },
      zh: {
        question: '世界上最大的岛屿是哪个？',
        options: ['格陵兰', '新几内亚', '婆罗洲', '马达加斯加'],
        fact: '格陵兰是世界上最大的岛屿。澳大利亚更大，但被视为一个大陆。',
      },
    },
  },
];

// Returns a numeric seed from a date string like "2026-06-19".
function dateSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash + dateStr.charCodeAt(i)) | 0;
  }
  return hash;
}

function todayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/** The fact for a given day. Deterministic: same date -> same fact for everyone. */
export function getFactForDate(dateStr?: string): DailyFact {
  const date = dateStr || todayDateString();
  const idx = Math.abs(dateSeed(date)) % DAILY_FACTS.length;
  return DAILY_FACTS[idx];
}

/** Localized content for a fact, falling back to English. */
export function getFactContent(fact: DailyFact, locale?: LocaleCode): FactContent {
  const loc = locale || getLocale();
  return fact.content[loc] ?? fact.content.en;
}
