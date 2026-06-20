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
  {
    id: 'brazil_largest_samerica',
    flagId: 'br',
    answer: 0,
    note: 'Brazil is the largest country in South America by area.',
    content: {
      en: {
        question: 'What is the largest country in South America by area?',
        options: ['Brazil', 'Argentina', 'Peru', 'Colombia'],
        fact: 'Brazil covers almost half of South America and borders every country on the continent except Chile and Ecuador.',
      },
      fr: {
        question: "Quel est le plus grand pays d'Amerique du Sud par sa superficie ?",
        options: ['Bresil', 'Argentine', 'Perou', 'Colombie'],
        fact: "Le Bresil couvre presque la moitie de l'Amerique du Sud et touche tous les pays du continent sauf le Chili et l'Equateur.",
      },
      es: {
        question: 'Cual es el pais mas grande de America del Sur por superficie?',
        options: ['Brasil', 'Argentina', 'Peru', 'Colombia'],
        fact: 'Brasil ocupa casi la mitad de America del Sur y limita con todos los paises del continente salvo Chile y Ecuador.',
      },
      de: {
        question: 'Welches ist das flaechengroesste Land Suedamerikas?',
        options: ['Brasilien', 'Argentinien', 'Peru', 'Kolumbien'],
        fact: 'Brasilien bedeckt fast die Haelfte Suedamerikas und grenzt an jedes Land des Kontinents ausser Chile und Ecuador.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais da America do Sul em area?',
        options: ['Brasil', 'Argentina', 'Peru', 'Colombia'],
        fact: 'O Brasil ocupa quase metade da America do Sul e faz fronteira com todos os paises do continente, exceto Chile e Equador.',
      },
      zh: {
        question: '南美洲面积最大的国家是哪个？',
        options: ['巴西', '阿根廷', '秘鲁', '哥伦比亚'],
        fact: '巴西占据了南美洲近一半的面积，与除智利和厄瓜多尔之外的所有南美国家接壤。',
      },
    },
  },
  {
    id: 'china_largest_asia',
    flagId: 'cn',
    answer: 0,
    note: 'China is the largest country lying entirely within Asia.',
    content: {
      en: {
        question: 'What is the largest country located entirely in Asia?',
        options: ['China', 'India', 'Kazakhstan', 'Saudi Arabia'],
        fact: 'China is the largest country lying wholly within Asia, about 9.6 million square kilometres. Russia is bigger but spans Europe and Asia.',
      },
      fr: {
        question: 'Quel est le plus grand pays situe entierement en Asie ?',
        options: ['Chine', 'Inde', 'Kazakhstan', 'Arabie saoudite'],
        fact: "La Chine est le plus grand pays entierement situe en Asie, environ 9,6 millions de kilometres carres. La Russie est plus vaste mais s'etend sur l'Europe et l'Asie.",
      },
      es: {
        question: 'Cual es el pais mas grande situado enteramente en Asia?',
        options: ['China', 'India', 'Kazajistan', 'Arabia Saudita'],
        fact: 'China es el pais mas grande situado por completo en Asia, unos 9,6 millones de kilometros cuadrados. Rusia es mayor, pero abarca Europa y Asia.',
      },
      de: {
        question: 'Welches ist das groesste Land, das vollstaendig in Asien liegt?',
        options: ['China', 'Indien', 'Kasachstan', 'Saudi-Arabien'],
        fact: 'China ist das groesste vollstaendig in Asien liegende Land mit etwa 9,6 Millionen Quadratkilometern. Russland ist groesser, erstreckt sich aber ueber Europa und Asien.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais situado inteiramente na Asia?',
        options: ['China', 'India', 'Cazaquistao', 'Arabia Saudita'],
        fact: 'A China e o maior pais totalmente situado na Asia, cerca de 9,6 milhoes de quilometros quadrados. A Russia e maior, mas fica na Europa e na Asia.',
      },
      zh: {
        question: '完全位于亚洲境内、面积最大的国家是哪个？',
        options: ['中国', '印度', '哈萨克斯坦', '沙特阿拉伯'],
        fact: '中国是完全位于亚洲、面积最大的国家，约960万平方公里。俄罗斯更大，但横跨欧亚两洲。',
      },
    },
  },
  {
    id: 'ukraine_largest_europe',
    flagId: 'ua',
    answer: 0,
    note: 'Ukraine is the largest country lying entirely within Europe.',
    content: {
      en: {
        question: 'What is the largest country lying entirely within Europe?',
        options: ['Ukraine', 'France', 'Spain', 'Sweden'],
        fact: 'Ukraine is the largest country located completely within Europe. Russia is bigger but stretches across both Europe and Asia.',
      },
      fr: {
        question: 'Quel est le plus grand pays situe entierement en Europe ?',
        options: ['Ukraine', 'France', 'Espagne', 'Suede'],
        fact: "L'Ukraine est le plus grand pays entierement situe en Europe. La Russie est plus vaste mais s'etend sur l'Europe et l'Asie.",
      },
      es: {
        question: 'Cual es el pais mas grande situado enteramente en Europa?',
        options: ['Ucrania', 'Francia', 'Espana', 'Suecia'],
        fact: 'Ucrania es el pais mas grande situado por completo en Europa. Rusia es mayor, pero se extiende por Europa y Asia.',
      },
      de: {
        question: 'Welches ist das groesste Land, das vollstaendig in Europa liegt?',
        options: ['Ukraine', 'Frankreich', 'Spanien', 'Schweden'],
        fact: 'Die Ukraine ist das groesste vollstaendig in Europa liegende Land. Russland ist groesser, erstreckt sich aber ueber Europa und Asien.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais situado inteiramente na Europa?',
        options: ['Ucrania', 'Franca', 'Espanha', 'Suecia'],
        fact: 'A Ucrania e o maior pais totalmente situado na Europa. A Russia e maior, mas se estende pela Europa e pela Asia.',
      },
      zh: {
        question: '完全位于欧洲境内、面积最大的国家是哪个？',
        options: ['乌克兰', '法国', '西班牙', '瑞典'],
        fact: '乌克兰是完全位于欧洲、面积最大的国家。俄罗斯更大，但横跨欧亚两洲。',
      },
    },
  },
  {
    id: 'australia_continent_country',
    flagId: 'au',
    answer: 0,
    note: 'Australia is the only country that is also a continent.',
    content: {
      en: {
        question: 'Which country is also a continent of its own?',
        options: ['Australia', 'Russia', 'India', 'Brazil'],
        fact: 'Australia is the only country that is also a continent, sitting alone on its own tectonic plate in the Southern Hemisphere.',
      },
      fr: {
        question: 'Quel pays constitue aussi un continent a lui seul ?',
        options: ['Australie', 'Russie', 'Inde', 'Bresil'],
        fact: "L'Australie est le seul pays qui constitue aussi un continent a lui seul, sur sa propre plaque tectonique dans l'hemisphere sud.",
      },
      es: {
        question: 'Que pais es ademas un continente por si solo?',
        options: ['Australia', 'Rusia', 'India', 'Brasil'],
        fact: 'Australia es el unico pais que es a la vez un continente, sobre su propia placa tectonica en el hemisferio sur.',
      },
      de: {
        question: 'Welches Land ist zugleich ein eigener Kontinent?',
        options: ['Australien', 'Russland', 'Indien', 'Brasilien'],
        fact: 'Australien ist das einzige Land, das zugleich ein eigener Kontinent ist, auf seiner eigenen tektonischen Platte auf der Suedhalbkugel.',
      },
      'pt-BR': {
        question: 'Qual pais e tambem um continente inteiro?',
        options: ['Australia', 'Russia', 'India', 'Brasil'],
        fact: 'A Australia e o unico pais que tambem e um continente inteiro, sobre sua propria placa tectonica no hemisferio sul.',
      },
      zh: {
        question: '哪个国家本身就是一整块大陆？',
        options: ['澳大利亚', '俄罗斯', '印度', '巴西'],
        fact: '澳大利亚是唯一一个本身就是一整块大陆的国家，独占一块构造板块，位于南半球。',
      },
    },
  },
  {
    id: 'vatican_smallest',
    flagId: 'va',
    answer: 0,
    note: 'Vatican City is the smallest country in the world (~0.49 km2).',
    content: {
      en: {
        question: 'What is the smallest country in the world?',
        options: ['Vatican City', 'Monaco', 'Nauru', 'San Marino'],
        fact: 'Vatican City covers just 0.49 square kilometres, small enough to fit many times over inside a single large city park.',
      },
      fr: {
        question: 'Quel est le plus petit pays du monde ?',
        options: ['Vatican', 'Monaco', 'Nauru', 'Saint-Marin'],
        fact: 'Le Vatican ne couvre que 0,49 kilometre carre, assez petit pour tenir plusieurs fois dans un grand parc urbain.',
      },
      es: {
        question: 'Cual es el pais mas pequeno del mundo?',
        options: ['Ciudad del Vaticano', 'Monaco', 'Nauru', 'San Marino'],
        fact: 'La Ciudad del Vaticano abarca solo 0,49 kilometros cuadrados, lo bastante pequena para caber varias veces en un gran parque urbano.',
      },
      de: {
        question: 'Welches ist das kleinste Land der Welt?',
        options: ['Vatikanstadt', 'Monaco', 'Nauru', 'San Marino'],
        fact: 'Die Vatikanstadt umfasst nur 0,49 Quadratkilometer und wuerde mehrfach in einen grossen Stadtpark passen.',
      },
      'pt-BR': {
        question: 'Qual e o menor pais do mundo?',
        options: ['Vaticano', 'Monaco', 'Nauru', 'San Marino'],
        fact: 'O Vaticano ocupa apenas 0,49 quilometro quadrado, pequeno o bastante para caber varias vezes em um grande parque urbano.',
      },
      zh: {
        question: '世界上最小的国家是哪个？',
        options: ['梵蒂冈', '摩纳哥', '瑙鲁', '圣马力诺'],
        fact: '梵蒂冈面积仅0.49平方公里，小到可以在一座大型城市公园里放下好几个。',
      },
    },
  },
  {
    id: 'cuba_largest_caribbean',
    flagId: 'cu',
    answer: 0,
    note: 'Cuba is the largest country and island in the Caribbean.',
    content: {
      en: {
        question: 'What is the largest country in the Caribbean?',
        options: ['Cuba', 'Haiti', 'Dominican Republic', 'Jamaica'],
        fact: 'Cuba is the largest country and island in the Caribbean, stretching about 1,250 kilometres from end to end.',
      },
      fr: {
        question: 'Quel est le plus grand pays des Caraibes ?',
        options: ['Cuba', 'Haiti', 'Republique dominicaine', 'Jamaique'],
        fact: "Cuba est le plus grand pays et la plus grande ile des Caraibes, s'etirant sur environ 1 250 kilometres.",
      },
      es: {
        question: 'Cual es el pais mas grande del Caribe?',
        options: ['Cuba', 'Haiti', 'Republica Dominicana', 'Jamaica'],
        fact: 'Cuba es el pais y la isla mas grande del Caribe, con unos 1.250 kilometros de extremo a extremo.',
      },
      de: {
        question: 'Welches ist das groesste Land der Karibik?',
        options: ['Kuba', 'Haiti', 'Dominikanische Republik', 'Jamaika'],
        fact: 'Kuba ist das groesste Land und die groesste Insel der Karibik und erstreckt sich ueber etwa 1.250 Kilometer.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais do Caribe?',
        options: ['Cuba', 'Haiti', 'Republica Dominicana', 'Jamaica'],
        fact: 'Cuba e o maior pais e a maior ilha do Caribe, com cerca de 1.250 quilometros de ponta a ponta.',
      },
      zh: {
        question: '加勒比地区最大的国家是哪个？',
        options: ['古巴', '海地', '多米尼加共和国', '牙买加'],
        fact: '古巴是加勒比地区最大的国家和岛屿，全长约1250公里。',
      },
    },
  },
  {
    id: 'kazakhstan_largest_landlocked',
    flagId: 'kz',
    answer: 0,
    note: 'Kazakhstan is the largest landlocked country in the world.',
    content: {
      en: {
        question: 'What is the largest landlocked country in the world?',
        options: ['Kazakhstan', 'Mongolia', 'Chad', 'Bolivia'],
        fact: "Kazakhstan is the world's largest landlocked country, bigger than all of Western Europe, yet it touches no ocean.",
      },
      fr: {
        question: 'Quel est le plus grand pays sans acces a la mer ?',
        options: ['Kazakhstan', 'Mongolie', 'Tchad', 'Bolivie'],
        fact: "Le Kazakhstan est le plus grand pays enclave du monde, plus vaste que toute l'Europe de l'Ouest, sans le moindre acces a l'ocean.",
      },
      es: {
        question: 'Cual es el pais sin salida al mar mas grande del mundo?',
        options: ['Kazajistan', 'Mongolia', 'Chad', 'Bolivia'],
        fact: 'Kazajistan es el mayor pais sin litoral del mundo, mas grande que toda Europa Occidental, y no toca ningun oceano.',
      },
      de: {
        question: 'Welches ist das groesste Binnenland der Welt?',
        options: ['Kasachstan', 'Mongolei', 'Tschad', 'Bolivien'],
        fact: 'Kasachstan ist das groesste Binnenland der Welt, groesser als ganz Westeuropa, und hat dennoch keinen Zugang zum Meer.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais sem saida para o mar do mundo?',
        options: ['Cazaquistao', 'Mongolia', 'Chade', 'Bolivia'],
        fact: 'O Cazaquistao e o maior pais sem litoral do mundo, maior que toda a Europa Ocidental, e nao toca nenhum oceano.',
      },
      zh: {
        question: '世界上面积最大的内陆国家是哪个？',
        options: ['哈萨克斯坦', '蒙古', '乍得', '玻利维亚'],
        fact: '哈萨克斯坦是世界上面积最大的内陆国家，比整个西欧还大，却不临任何海洋。',
      },
    },
  },
  {
    id: 'indonesia_most_volcanoes',
    flagId: 'id',
    answer: 0,
    note: 'Indonesia has the most active volcanoes of any country.',
    content: {
      en: {
        question: 'Which country has the most active volcanoes?',
        options: ['Indonesia', 'Japan', 'United States', 'Chile'],
        fact: 'Indonesia has around 130 active volcanoes, more than any other country, because it sits along the Pacific Ring of Fire.',
      },
      fr: {
        question: 'Quel pays compte le plus de volcans actifs ?',
        options: ['Indonesie', 'Japon', 'Etats-Unis', 'Chili'],
        fact: "L'Indonesie compte environ 130 volcans actifs, plus que tout autre pays, car elle se trouve sur la ceinture de feu du Pacifique.",
      },
      es: {
        question: 'Que pais tiene la mayor cantidad de volcanes activos?',
        options: ['Indonesia', 'Japon', 'Estados Unidos', 'Chile'],
        fact: 'Indonesia tiene unos 130 volcanes activos, mas que cualquier otro pais, porque se encuentra en el Cinturon de Fuego del Pacifico.',
      },
      de: {
        question: 'Welches Land hat die meisten aktiven Vulkane?',
        options: ['Indonesien', 'Japan', 'Vereinigte Staaten', 'Chile'],
        fact: 'Indonesien hat rund 130 aktive Vulkane, mehr als jedes andere Land, weil es am Pazifischen Feuerring liegt.',
      },
      'pt-BR': {
        question: 'Qual pais tem o maior numero de vulcoes ativos?',
        options: ['Indonesia', 'Japao', 'Estados Unidos', 'Chile'],
        fact: 'A Indonesia tem cerca de 130 vulcoes ativos, mais que qualquer outro pais, por ficar no Circulo de Fogo do Pacifico.',
      },
      zh: {
        question: '哪个国家拥有最多的活火山？',
        options: ['印度尼西亚', '日本', '美国', '智利'],
        fact: '印度尼西亚约有130座活火山，数量居世界之首，因为它位于太平洋火环带上。',
      },
    },
  },
  {
    id: 'sweden_most_islands',
    flagId: 'se',
    answer: 0,
    note: 'Sweden has the most islands of any country (~267,000).',
    content: {
      en: {
        question: 'Which country has the most islands in the world?',
        options: ['Sweden', 'Indonesia', 'Canada', 'Philippines'],
        fact: 'Sweden has more than 260,000 islands, the most of any country, though only a small fraction are inhabited.',
      },
      fr: {
        question: "Quel pays possede le plus grand nombre d'iles au monde ?",
        options: ['Suede', 'Indonesie', 'Canada', 'Philippines'],
        fact: 'La Suede compte plus de 260 000 iles, le plus grand nombre au monde, mais seules quelques-unes sont habitees.',
      },
      es: {
        question: 'Que pais tiene la mayor cantidad de islas del mundo?',
        options: ['Suecia', 'Indonesia', 'Canada', 'Filipinas'],
        fact: 'Suecia tiene mas de 260.000 islas, mas que cualquier otro pais, aunque solo una pequena parte esta habitada.',
      },
      de: {
        question: 'Welches Land hat die meisten Inseln der Welt?',
        options: ['Schweden', 'Indonesien', 'Kanada', 'Philippinen'],
        fact: 'Schweden hat mehr als 260.000 Inseln, mehr als jedes andere Land, doch nur ein kleiner Teil ist bewohnt.',
      },
      'pt-BR': {
        question: 'Qual pais tem o maior numero de ilhas do mundo?',
        options: ['Suecia', 'Indonesia', 'Canada', 'Filipinas'],
        fact: 'A Suecia tem mais de 260.000 ilhas, mais que qualquer outro pais, embora so uma pequena parte seja habitada.',
      },
      zh: {
        question: '世界上岛屿最多的国家是哪个？',
        options: ['瑞典', '印度尼西亚', '加拿大', '菲律宾'],
        fact: '瑞典拥有超过26万座岛屿，数量居世界第一，但只有极少数有人居住。',
      },
    },
  },
  {
    id: 'africa_most_countries',
    answer: 0,
    note: 'Africa has 54 sovereign countries, the most of any continent.',
    content: {
      en: {
        question: 'Which continent is made up of the most countries?',
        options: ['Africa', 'Asia', 'Europe', 'The Americas'],
        fact: 'Africa is home to 54 sovereign countries, more than any other continent.',
      },
      fr: {
        question: 'Quel continent compte le plus grand nombre de pays ?',
        options: ["L'Afrique", "L'Asie", "L'Europe", 'Les Ameriques'],
        fact: "L'Afrique compte 54 pays souverains, plus que tout autre continent.",
      },
      es: {
        question: 'Que continente esta formado por la mayor cantidad de paises?',
        options: ['Africa', 'Asia', 'Europa', 'America'],
        fact: 'Africa alberga 54 paises soberanos, mas que cualquier otro continente.',
      },
      de: {
        question: 'Welcher Kontinent besteht aus den meisten Laendern?',
        options: ['Afrika', 'Asien', 'Europa', 'Amerika'],
        fact: 'Afrika umfasst 54 souveraene Staaten, mehr als jeder andere Kontinent.',
      },
      'pt-BR': {
        question: 'Qual continente e formado pelo maior numero de paises?',
        options: ['Africa', 'Asia', 'Europa', 'America'],
        fact: 'A Africa abriga 54 paises soberanos, mais do que qualquer outro continente.',
      },
      zh: {
        question: '由最多国家组成的大洲是哪个？',
        options: ['非洲', '亚洲', '欧洲', '美洲'],
        fact: '非洲共有54个主权国家，数量居各大洲之首。',
      },
    },
  },
  {
    id: 'kiribati_four_hemispheres',
    flagId: 'ki',
    answer: 0,
    note: 'Kiribati is the only country in all four hemispheres.',
    content: {
      en: {
        question: 'Which country lies in all four hemispheres at once?',
        options: ['Kiribati', 'Brazil', 'Indonesia', 'Ecuador'],
        fact: 'Kiribati is the only country to sit in all four hemispheres, straddling both the equator and the 180th meridian.',
      },
      fr: {
        question: 'Quel pays se trouve a la fois dans les quatre hemispheres ?',
        options: ['Kiribati', 'Bresil', 'Indonesie', 'Equateur'],
        fact: "Kiribati est le seul pays a se situer dans les quatre hemispheres, a cheval sur l'equateur et le 180e meridien.",
      },
      es: {
        question: 'Que pais se encuentra a la vez en los cuatro hemisferios?',
        options: ['Kiribati', 'Brasil', 'Indonesia', 'Ecuador'],
        fact: 'Kiribati es el unico pais situado en los cuatro hemisferios, sobre el ecuador y el meridiano 180.',
      },
      de: {
        question: 'Welches Land liegt zugleich in allen vier Hemisphaeren?',
        options: ['Kiribati', 'Brasilien', 'Indonesien', 'Ecuador'],
        fact: 'Kiribati ist das einzige Land in allen vier Hemisphaeren, am Aequator und am 180. Laengengrad zugleich.',
      },
      'pt-BR': {
        question: 'Qual pais fica ao mesmo tempo nos quatro hemisferios?',
        options: ['Kiribati', 'Brasil', 'Indonesia', 'Equador'],
        fact: 'Kiribati e o unico pais situado nos quatro hemisferios, sobre o equador e o meridiano 180.',
      },
      zh: {
        question: '哪个国家同时位于四个半球？',
        options: ['基里巴斯', '巴西', '印度尼西亚', '厄瓜多尔'],
        fact: '基里巴斯是唯一同时位于四个半球的国家，横跨赤道和180度经线。',
      },
    },
  },
  {
    id: 'saint_lucia_named_woman',
    flagId: 'lc',
    answer: 0,
    note: 'Saint Lucia is the only country named after a real woman.',
    content: {
      en: {
        question: 'Which is the only country named after a real woman?',
        options: ['Saint Lucia', 'Colombia', 'Bolivia', 'Mauritius'],
        fact: 'Saint Lucia is the only country named after a real woman, the martyr Saint Lucy of Syracuse.',
      },
      fr: {
        question: "Quel est le seul pays nomme d'apres une femme reelle ?",
        options: ['Sainte-Lucie', 'Colombie', 'Bolivie', 'Maurice'],
        fact: "Sainte-Lucie est le seul pays nomme d'apres une femme ayant reellement existe, la martyre sainte Lucie de Syracuse.",
      },
      es: {
        question: 'Cual es el unico pais que lleva el nombre de una mujer real?',
        options: ['Santa Lucia', 'Colombia', 'Bolivia', 'Mauricio'],
        fact: 'Santa Lucia es el unico pais que lleva el nombre de una mujer real, la martir santa Lucia de Siracusa.',
      },
      de: {
        question: 'Welches ist das einzige nach einer realen Frau benannte Land?',
        options: ['St. Lucia', 'Kolumbien', 'Bolivien', 'Mauritius'],
        fact: 'St. Lucia ist das einzige Land, das nach einer realen Frau benannt ist, der heiligen Maertyrerin Lucia von Syrakus.',
      },
      'pt-BR': {
        question: 'Qual e o unico pais que tem o nome de uma mulher real?',
        options: ['Santa Lucia', 'Colombia', 'Bolivia', 'Mauricio'],
        fact: 'Santa Lucia e o unico pais batizado em homenagem a uma mulher real, a martir Santa Luzia de Siracusa.',
      },
      zh: {
        question: '哪个国家是唯一以真实女性命名的国家？',
        options: ['圣卢西亚', '哥伦比亚', '玻利维亚', '毛里求斯'],
        fact: '圣卢西亚是唯一以真实女性命名的国家，得名于殉道者锡拉库扎的圣露西亚。',
      },
    },
  },
  {
    id: 'nauru_no_capital',
    flagId: 'nr',
    answer: 0,
    note: 'Nauru is the only country with no official capital city.',
    content: {
      en: {
        question: 'Which is the only country with no official capital city?',
        options: ['Nauru', 'Switzerland', 'Monaco', 'Tuvalu'],
        fact: 'Nauru is the only country without an official capital. Its government offices sit in the district of Yaren.',
      },
      fr: {
        question: 'Quel est le seul pays sans capitale officielle ?',
        options: ['Nauru', 'Suisse', 'Monaco', 'Tuvalu'],
        fact: 'Nauru est le seul pays sans capitale officielle. Les bureaux du gouvernement se trouvent dans le district de Yaren.',
      },
      es: {
        question: 'Cual es el unico pais sin capital oficial?',
        options: ['Nauru', 'Suiza', 'Monaco', 'Tuvalu'],
        fact: 'Nauru es el unico pais sin capital oficial. Las oficinas del gobierno estan en el distrito de Yaren.',
      },
      de: {
        question: 'Welches ist das einzige Land ohne offizielle Hauptstadt?',
        options: ['Nauru', 'Schweiz', 'Monaco', 'Tuvalu'],
        fact: 'Nauru ist das einzige Land ohne offizielle Hauptstadt. Die Regierungsbueros liegen im Distrikt Yaren.',
      },
      'pt-BR': {
        question: 'Qual e o unico pais sem capital oficial?',
        options: ['Nauru', 'Suica', 'Monaco', 'Tuvalu'],
        fact: 'Nauru e o unico pais sem capital oficial. Os orgaos do governo ficam no distrito de Yaren.',
      },
      zh: {
        question: '哪个国家是唯一没有官方首都的国家？',
        options: ['瑙鲁', '瑞士', '摩纳哥', '图瓦卢'],
        fact: '瑙鲁是唯一没有官方首都的国家，政府机构设在亚伦区。',
      },
    },
  },
  {
    id: 'bolivia_highest_capital',
    flagId: 'bo',
    answer: 0,
    note: 'La Paz, Bolivia is the highest capital city in the world (~3,640 m).',
    content: {
      en: {
        question: 'Which country has the highest capital city in the world?',
        options: ['Bolivia', 'Nepal', 'Ecuador', 'Peru'],
        fact: "Bolivia's seat of government, La Paz, sits about 3,640 metres above sea level, the highest capital in the world.",
      },
      fr: {
        question: 'Quel pays possede la capitale la plus haute du monde ?',
        options: ['Bolivie', 'Nepal', 'Equateur', 'Perou'],
        fact: "Le siege du gouvernement bolivien, La Paz, se trouve a environ 3 640 metres d'altitude, la capitale la plus haute du monde.",
      },
      es: {
        question: 'Que pais tiene la capital mas alta del mundo?',
        options: ['Bolivia', 'Nepal', 'Ecuador', 'Peru'],
        fact: 'La sede del gobierno de Bolivia, La Paz, esta a unos 3.640 metros de altitud, la capital mas alta del mundo.',
      },
      de: {
        question: 'Welches Land hat die hoechstgelegene Hauptstadt der Welt?',
        options: ['Bolivien', 'Nepal', 'Ecuador', 'Peru'],
        fact: 'Boliviens Regierungssitz La Paz liegt etwa 3.640 Meter ueber dem Meer, die hoechste Hauptstadt der Welt.',
      },
      'pt-BR': {
        question: 'Qual pais tem a capital mais alta do mundo?',
        options: ['Bolivia', 'Nepal', 'Equador', 'Peru'],
        fact: 'A sede do governo da Bolivia, La Paz, fica a cerca de 3.640 metros de altitude, a capital mais alta do mundo.',
      },
      zh: {
        question: '哪个国家拥有世界上海拔最高的首都？',
        options: ['玻利维亚', '尼泊尔', '厄瓜多尔', '秘鲁'],
        fact: '玻利维亚的政府所在地拉巴斯海拔约3640米，是世界上海拔最高的首都。',
      },
    },
  },
  {
    id: 'liechtenstein_double_landlocked',
    flagId: 'li',
    answer: 0,
    note: 'Liechtenstein and Uzbekistan are the only two doubly landlocked countries.',
    content: {
      en: {
        question: 'Which country is one of only two that are doubly landlocked?',
        options: ['Liechtenstein', 'Austria', 'Switzerland', 'Nepal'],
        fact: 'Liechtenstein is one of just two doubly landlocked countries, surrounded only by other landlocked countries. The other is Uzbekistan.',
      },
      fr: {
        question: "Quel pays est l'un des deux seuls a etre doublement enclaves ?",
        options: ['Liechtenstein', 'Autriche', 'Suisse', 'Nepal'],
        fact: "Le Liechtenstein est l'un des deux seuls pays doublement enclaves, entoure uniquement de pays sans acces a la mer. L'autre est l'Ouzbekistan.",
      },
      es: {
        question: 'Que pais es uno de los dos unicos doblemente sin litoral?',
        options: ['Liechtenstein', 'Austria', 'Suiza', 'Nepal'],
        fact: 'Liechtenstein es uno de los dos unicos paises doblemente sin litoral, rodeado solo por paises sin salida al mar. El otro es Uzbekistan.',
      },
      de: {
        question: 'Welches Land ist einer von nur zwei doppelten Binnenstaaten?',
        options: ['Liechtenstein', 'Oesterreich', 'Schweiz', 'Nepal'],
        fact: 'Liechtenstein ist einer von nur zwei doppelten Binnenstaaten, umgeben allein von Binnenlaendern. Der andere ist Usbekistan.',
      },
      'pt-BR': {
        question: 'Qual pais e um dos dois unicos duplamente sem litoral?',
        options: ['Liechtenstein', 'Austria', 'Suica', 'Nepal'],
        fact: 'Liechtenstein e um dos dois unicos paises duplamente sem litoral, cercado apenas por paises sem saida para o mar. O outro e o Uzbequistao.',
      },
      zh: {
        question: '哪个国家是仅有的两个双重内陆国之一？',
        options: ['列支敦士登', '奥地利', '瑞士', '尼泊尔'],
        fact: '列支敦士登是仅有的两个双重内陆国之一，四周都是内陆国家。另一个是乌兹别克斯坦。',
      },
    },
  },
  {
    id: 'caspian_largest_lake',
    answer: 0,
    note: 'The Caspian Sea is the largest lake in the world by area.',
    content: {
      en: {
        question: 'What is the largest lake in the world by area?',
        options: ['The Caspian Sea', 'Lake Superior', 'Lake Victoria', 'Lake Baikal'],
        fact: "Despite its name, the Caspian Sea is the world's largest lake, bordered by five countries and filled with salty water.",
      },
      fr: {
        question: 'Quel est le plus grand lac du monde par sa superficie ?',
        options: ['La mer Caspienne', 'Le lac Superieur', 'Le lac Victoria', 'Le lac Baikal'],
        fact: "Malgre son nom, la mer Caspienne est le plus grand lac du monde, bordee par cinq pays et remplie d'eau salee.",
      },
      es: {
        question: 'Cual es el lago mas grande del mundo por superficie?',
        options: ['El mar Caspio', 'El lago Superior', 'El lago Victoria', 'El lago Baikal'],
        fact: 'A pesar de su nombre, el mar Caspio es el lago mas grande del mundo, rodeado por cinco paises y de agua salada.',
      },
      de: {
        question: 'Welches ist der flaechengroesste See der Welt?',
        options: ['Das Kaspische Meer', 'Der Obere See', 'Der Victoriasee', 'Der Baikalsee'],
        fact: 'Trotz seines Namens ist das Kaspische Meer der groesste See der Welt, von fuenf Laendern umgeben und mit salzigem Wasser.',
      },
      'pt-BR': {
        question: 'Qual e o maior lago do mundo em area?',
        options: ['O mar Caspio', 'O lago Superior', 'O lago Vitoria', 'O lago Baikal'],
        fact: 'Apesar do nome, o mar Caspio e o maior lago do mundo, cercado por cinco paises e de agua salgada.',
      },
      zh: {
        question: '世界上面积最大的湖泊是哪个？',
        options: ['里海', '苏必利尔湖', '维多利亚湖', '贝加尔湖'],
        fact: '里海虽名为海，却是世界上面积最大的湖泊，被五个国家环绕，湖水为咸水。',
      },
    },
  },
  {
    id: 'chile_longest_country',
    flagId: 'cl',
    answer: 0,
    note: 'Chile is the world\'s longest country from north to south (~4,300 km).',
    content: {
      en: {
        question: "Which is the world's longest country from north to south?",
        options: ['Chile', 'Brazil', 'Russia', 'Norway'],
        fact: 'Chile stretches more than 4,300 kilometres down the Pacific coast, yet averages only about 180 kilometres wide.',
      },
      fr: {
        question: 'Quel est le pays le plus long du nord au sud ?',
        options: ['Chili', 'Bresil', 'Russie', 'Norvege'],
        fact: "Le Chili s'etire sur plus de 4 300 kilometres le long du Pacifique, pour une largeur moyenne d'environ 180 kilometres.",
      },
      es: {
        question: 'Cual es el pais mas largo de norte a sur?',
        options: ['Chile', 'Brasil', 'Rusia', 'Noruega'],
        fact: 'Chile se extiende mas de 4.300 kilometros por la costa del Pacifico, con una anchura media de solo unos 180 kilometros.',
      },
      de: {
        question: 'Welches ist das von Nord nach Sued laengste Land der Welt?',
        options: ['Chile', 'Brasilien', 'Russland', 'Norwegen'],
        fact: 'Chile erstreckt sich ueber mehr als 4.300 Kilometer entlang der Pazifikkueste, ist aber im Schnitt nur etwa 180 Kilometer breit.',
      },
      'pt-BR': {
        question: 'Qual e o pais mais longo de norte a sul?',
        options: ['Chile', 'Brasil', 'Russia', 'Noruega'],
        fact: 'O Chile se estende por mais de 4.300 quilometros ao longo do Pacifico, mas tem em media so cerca de 180 quilometros de largura.',
      },
      zh: {
        question: '世界上从北到南最长的国家是哪个？',
        options: ['智利', '巴西', '俄罗斯', '挪威'],
        fact: '智利沿太平洋海岸绵延4300多公里，平均宽度却只有约180公里。',
      },
    },
  },
  {
    id: 'denmark_oldest_flag',
    flagId: 'dk',
    answer: 0,
    note: 'Denmark has the oldest continuously used national flag (Dannebrog).',
    content: {
      en: {
        question: 'Which country has the oldest continuously used national flag?',
        options: ['Denmark', 'United Kingdom', 'Austria', 'Netherlands'],
        fact: "Denmark's red and white Dannebrog has been in use since the 13th century, the oldest national flag still flown today.",
      },
      fr: {
        question: 'Quel pays possede le plus ancien drapeau national encore utilise ?',
        options: ['Danemark', 'Royaume-Uni', 'Autriche', 'Pays-Bas'],
        fact: 'Le Dannebrog rouge et blanc du Danemark est utilise depuis le 13e siecle, le plus ancien drapeau national encore en usage.',
      },
      es: {
        question: 'Que pais tiene la bandera nacional en uso continuo mas antigua?',
        options: ['Dinamarca', 'Reino Unido', 'Austria', 'Paises Bajos'],
        fact: 'El Dannebrog rojo y blanco de Dinamarca se usa desde el siglo XIII, la bandera nacional mas antigua que aun ondea.',
      },
      de: {
        question: 'Welches Land hat die aelteste durchgehend genutzte Nationalflagge?',
        options: ['Daenemark', 'Vereinigtes Koenigreich', 'Oesterreich', 'Niederlande'],
        fact: 'Daenemarks rot-weisser Dannebrog ist seit dem 13. Jahrhundert in Gebrauch, die aelteste noch gefuehrte Nationalflagge.',
      },
      'pt-BR': {
        question: 'Qual pais tem a bandeira nacional em uso continuo mais antiga?',
        options: ['Dinamarca', 'Reino Unido', 'Austria', 'Paises Baixos'],
        fact: 'O Dannebrog vermelho e branco da Dinamarca e usado desde o seculo 13, a bandeira nacional mais antiga ainda hasteada.',
      },
      zh: {
        question: '哪个国家拥有持续使用至今、历史最悠久的国旗？',
        options: ['丹麦', '英国', '奥地利', '荷兰'],
        fact: '丹麦的红白「丹尼布洛」国旗自13世纪起一直沿用，是至今仍在使用的最古老国旗。',
      },
    },
  },
  {
    id: 'canada_us_longest_border',
    flagId: 'ca',
    answer: 0,
    note: 'The US-Canada border is the longest international land border (~8,900 km).',
    content: {
      en: {
        question: "The world's longest land border lies between the United States and which country?",
        options: ['Canada', 'Mexico', 'Russia', 'Brazil'],
        fact: 'The border between Canada and the United States runs about 8,900 kilometres, the longest international land border in the world.',
      },
      fr: {
        question: 'La plus longue frontiere terrestre du monde separe les Etats-Unis de quel pays ?',
        options: ['Canada', 'Mexique', 'Russie', 'Bresil'],
        fact: "La frontiere entre le Canada et les Etats-Unis s'etend sur environ 8 900 kilometres, la plus longue frontiere terrestre du monde.",
      },
      es: {
        question: 'La frontera terrestre mas larga del mundo esta entre Estados Unidos y que pais?',
        options: ['Canada', 'Mexico', 'Rusia', 'Brasil'],
        fact: 'La frontera entre Canada y Estados Unidos mide unos 8.900 kilometros, la frontera terrestre internacional mas larga del mundo.',
      },
      de: {
        question: 'Die laengste Landgrenze der Welt verlaeuft zwischen den USA und welchem Land?',
        options: ['Kanada', 'Mexiko', 'Russland', 'Brasilien'],
        fact: 'Die Grenze zwischen Kanada und den USA ist rund 8.900 Kilometer lang, die laengste internationale Landgrenze der Welt.',
      },
      'pt-BR': {
        question: 'A maior fronteira terrestre do mundo fica entre os Estados Unidos e qual pais?',
        options: ['Canada', 'Mexico', 'Russia', 'Brasil'],
        fact: 'A fronteira entre o Canada e os Estados Unidos tem cerca de 8.900 quilometros, a maior fronteira terrestre internacional do mundo.',
      },
      zh: {
        question: '世界上最长的陆地边界位于美国与哪个国家之间？',
        options: ['加拿大', '墨西哥', '俄罗斯', '巴西'],
        fact: '加拿大与美国之间的边界长约8900公里，是世界上最长的国际陆地边界。',
      },
    },
  },
  {
    id: 'san_marino_oldest_republic',
    flagId: 'sm',
    answer: 0,
    note: 'San Marino is the oldest surviving republic, founded in 301.',
    content: {
      en: {
        question: "Which is the world's oldest surviving republic?",
        options: ['San Marino', 'Greece', 'Iceland', 'Switzerland'],
        fact: "San Marino traces its founding to the year 301, making it the world's oldest surviving republic.",
      },
      fr: {
        question: 'Quelle est la plus ancienne republique encore existante au monde ?',
        options: ['Saint-Marin', 'Grece', 'Islande', 'Suisse'],
        fact: "Saint-Marin fait remonter sa fondation a l'an 301, ce qui en fait la plus ancienne republique encore existante.",
      },
      es: {
        question: 'Cual es la republica mas antigua que aun existe en el mundo?',
        options: ['San Marino', 'Grecia', 'Islandia', 'Suiza'],
        fact: 'San Marino remonta su fundacion al ano 301, lo que la convierte en la republica mas antigua que sigue existiendo.',
      },
      de: {
        question: 'Welches ist die aelteste noch bestehende Republik der Welt?',
        options: ['San Marino', 'Griechenland', 'Island', 'Schweiz'],
        fact: 'San Marino fuehrt seine Gruendung auf das Jahr 301 zurueck und ist damit die aelteste noch bestehende Republik der Welt.',
      },
      'pt-BR': {
        question: 'Qual e a republica mais antiga ainda existente no mundo?',
        options: ['San Marino', 'Grecia', 'Islandia', 'Suica'],
        fact: 'A fundacao de San Marino remonta ao ano 301, o que faz dela a republica mais antiga ainda existente no mundo.',
      },
      zh: {
        question: '世界上仍然存在的最古老的共和国是哪个？',
        options: ['圣马力诺', '希腊', '冰岛', '瑞士'],
        fact: '圣马力诺的建国可追溯到公元301年，是世界上仍然存续的最古老共和国。',
      },
    },
  },
  {
    id: 'saudi_no_rivers',
    flagId: 'sa',
    answer: 0,
    note: 'Saudi Arabia is the largest country with no permanent rivers.',
    content: {
      en: {
        question: 'What is the largest country with no permanent rivers?',
        options: ['Saudi Arabia', 'Egypt', 'Libya', 'Mongolia'],
        fact: 'Saudi Arabia is the largest country on Earth without a single permanent river, relying on aquifers and desalinated seawater.',
      },
      fr: {
        question: "Quel est le plus grand pays sans cours d'eau permanent ?",
        options: ['Arabie saoudite', 'Egypte', 'Libye', 'Mongolie'],
        fact: "L'Arabie saoudite est le plus grand pays du monde sans aucun cours d'eau permanent, dependant des nappes et de l'eau de mer dessalee.",
      },
      es: {
        question: 'Cual es el pais mas grande sin rios permanentes?',
        options: ['Arabia Saudita', 'Egipto', 'Libia', 'Mongolia'],
        fact: 'Arabia Saudita es el pais mas grande del mundo sin un solo rio permanente, y depende de acuiferos y agua de mar desalada.',
      },
      de: {
        question: 'Welches ist das groesste Land ohne dauerhafte Fluesse?',
        options: ['Saudi-Arabien', 'Aegypten', 'Libyen', 'Mongolei'],
        fact: 'Saudi-Arabien ist das groesste Land der Erde ohne einen einzigen staendigen Fluss und ist auf Grundwasser und entsalztes Meerwasser angewiesen.',
      },
      'pt-BR': {
        question: 'Qual e o maior pais sem rios permanentes?',
        options: ['Arabia Saudita', 'Egito', 'Libia', 'Mongolia'],
        fact: 'A Arabia Saudita e o maior pais do mundo sem nenhum rio permanente, dependendo de aquiferos e de agua do mar dessalinizada.',
      },
      zh: {
        question: '世界上没有常流河的最大国家是哪个？',
        options: ['沙特阿拉伯', '埃及', '利比亚', '蒙古'],
        fact: '沙特阿拉伯是世界上最大的没有一条常流河的国家，依靠地下含水层和海水淡化供水。',
      },
    },
  },
  {
    id: 'tanzania_kilimanjaro',
    flagId: 'tz',
    answer: 0,
    note: "Mount Kilimanjaro, Africa's highest peak, is in Tanzania.",
    content: {
      en: {
        question: "Mount Kilimanjaro, Africa's highest peak, rises in which country?",
        options: ['Tanzania', 'Kenya', 'Uganda', 'Ethiopia'],
        fact: 'Mount Kilimanjaro stands about 5,895 metres in Tanzania, the highest mountain in Africa and the tallest free-standing mountain on land.',
      },
      fr: {
        question: "Le Kilimandjaro, plus haut sommet d'Afrique, se dresse dans quel pays ?",
        options: ['Tanzanie', 'Kenya', 'Ouganda', 'Ethiopie'],
        fact: "Le Kilimandjaro culmine a environ 5 895 metres en Tanzanie, plus haute montagne d'Afrique et plus haute montagne isolee sur terre.",
      },
      es: {
        question: 'El Kilimanjaro, el pico mas alto de Africa, se eleva en que pais?',
        options: ['Tanzania', 'Kenia', 'Uganda', 'Etiopia'],
        fact: 'El Kilimanjaro alcanza unos 5.895 metros en Tanzania, la montana mas alta de Africa y la mayor montana aislada sobre tierra firme.',
      },
      de: {
        question: 'Der Kilimandscharo, Afrikas hoechster Gipfel, erhebt sich in welchem Land?',
        options: ['Tansania', 'Kenia', 'Uganda', 'Aethiopien'],
        fact: 'Der Kilimandscharo ragt in Tansania etwa 5.895 Meter empor, der hoechste Berg Afrikas und der hoechste freistehende Berg an Land.',
      },
      'pt-BR': {
        question: 'O Monte Kilimanjaro, o pico mais alto da Africa, fica em qual pais?',
        options: ['Tanzania', 'Quenia', 'Uganda', 'Etiopia'],
        fact: 'O Kilimanjaro atinge cerca de 5.895 metros na Tanzania, a montanha mais alta da Africa e a maior montanha isolada em terra firme.',
      },
      zh: {
        question: '非洲最高峰乞力马扎罗山位于哪个国家？',
        options: ['坦桑尼亚', '肯尼亚', '乌干达', '埃塞俄比亚'],
        fact: '乞力马扎罗山在坦桑尼亚境内，海拔约5895米，是非洲最高峰，也是陆地上最高的独立山峰。',
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
