import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const versesPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/verses.json');
const verses = JSON.parse(fs.readFileSync(versesPath, 'utf8'));

const patches = {
  feliz_001: ['Salmos', 16, '11', 'Me mostrarás la senda de la vida: Hartura de alegrías hay con tu rostro; Deleites en tu diestra para siempre.'],
  feliz_011: ['Salmos', 32, '11', 'Alegraos en Jehová, y gozaos, justos: Y cantad con júbilo todos vosotros los rectos de corazón.'],
  feliz_012: ['Salmos', 30, '5', 'Porque un momento será su ira: Mas en su voluntad está la vida: Por la tarde durará el lloro, Y á la mañana alegría.'],
  feliz_014: ['Salmos', 126, '2', 'Entonces nuestra boca se llenará de risa, Y nuestra lengua de alabanza: Entonces dirán entre las gentes: Grandes cosas ha hecho Jehová con éstos.'],
  feliz_021: ['Salmos', 118, '24', 'Este es el día que hizo Jehová: Nos gozaremos y alegraremos en él.'],
  feliz_024: ['Nehemías', 8, '10', 'Luego les dijo: Id, comed grosuras, y bebed vino dulce, y enviad porciones á los que no tienen prevenido; porque día santo es á nuestro Señor: y no os entristezcáis, porque el gozo de Jehová es vuestra fortaleza.'],
  feliz_028: ['Salmos', 97, '12', 'Alegraos, justos, en Jehová: Y alabad la memoria de su santidad.'],
  feliz_032: ['Salmos', 33, '1', 'ALEGRAOS, justos, en Jehová: En los íntegros es hermosa la alabanza.'],
  agradecida_001: ['1 Tesalonicenses', 5, '18', 'Dad gracias en todo; porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.'],
  agradecida_004: ['Salmos', 107, '8', 'Alaben la misericordia de Jehová, Y sus maravillas para con los hijos de los hombres.'],
  agradecida_006: ['Salmos', 92, '1', 'Bueno es alabarte, oh Jehová, Y cantar salmos á tu nombre, oh Altísimo.'],
  agradecida_007: ['Salmos', 50, '14', 'Sacrifica á Dios alabanza, Y paga tus votos al Altísimo.'],
  agradecida_008: ['Salmos', 50, '23', 'El que sacrifica alabanza me honrará: Y al que ordenare su camino, le mostraré la salud de Dios.'],
  agradecida_014: ['Salmos', 69, '30', 'Alabaré yo el nombre de Dios con cántico, Ensalzarélo con alabanza.'],
  agradecida_018: ['Salmos', 9, '1', 'TE alabaré, oh Jehová, con todo mi corazón; Contaré todas tus maravillas.'],
  agradecida_019: ['Salmos', 7, '17', 'Alabaré yo á Jehová conforme á su justicia, Y cantaré al nombre de Jehová Altísimo.'],
  agradecida_021: ['Colosenses', 2, '7', 'Arraigados y sobreedificados en él, y confirmados en la fe, así como habéis aprendido, creciendo en ella con hacimiento de gracias.'],
  agradecida_043: ['Salmos', 103, '2', 'Bendice, alma mía, á Jehová, Y no olvides ninguno de sus beneficios.'],
  agradecida_045: ['Salmos', 136, '1', 'ALABAD á Jehová, porque es bueno; Porque para siempre es su misericordia.'],
  enfadada_006: ['Proverbios', 16, '32', 'Mejor es el que tardamente se aira, que el fuerte; Y el que se enseñorea de su espíritu, que el que toma una ciudad.'],
  enfadada_010: ['Santiago', 1, '19', 'Por esto, mis amados hermanos, todo hombre sea pronto para oír, tardío para hablar, tardío para airarse.'],
  enfadada_017: ['Santiago', 1, '20', 'Porque la ira del hombre no obra la justicia de Dios.'],
  enfadada_018: ['Proverbios', 14, '29', 'El que tarde se aira, es grande de entendimiento: Mas el corto de espíritu engrandece el desatino.'],
  enfadada_019: ['Proverbios', 19, '11', 'La cordura del hombre detiene su furor; Y su honra es disimular la ofensa.'],
  enfadada_021: ['Mateo', 5, '9', 'Bienaventurados los pacificadores: porque ellos serán llamados hijos de Dios.'],
  enfadada_027: ['Mateo', 5, '44', 'Mas yo os digo: Amad á vuestros enemigos, bendecid á los que os maldicen, haced bien á los que os aborrecen, y orad por los que os ultrajan y os persiguen.'],
  enfadada_028: ['Romanos', 12, '19', 'No os venguéis vosotros mismos, amados míos; antes dad lugar á la ira de Dios; porque escrito está: Mía es la venganza, yo pagaré, dice el Señor.'],
  enfadada_031: ['Romanos', 12, '21', 'No seas vencido de lo malo; mas vence con el bien el mal.'],
  enfadada_032: ['Gálatas', 5, '22', 'Mas el fruto del Espíritu es: caridad, gozo, paz, tolerancia, benignidad, bondad, fe,'],
  enfadada_033: ['Gálatas', 5, '23', 'Mansedumbre, templanza: contra tales cosas no hay ley.'],
  enfadada_036: ['Eclesiastés', 7, '9', 'No te precipites en tu espíritu á enojarte: porque la ira reposa en el seno de los necios.'],
  enfadada_037: ['Proverbios', 15, '4', 'La sana lengua es árbol de vida: Mas la perversidad en ella es quebrantamiento de espíritu.'],
  enfadada_038: ['Efesios', 6, '4', 'Y vosotros, padres, no provoquéis á ira á vuestros hijos; sino criadlos en disciplina y amonestación del Señor.'],
  enfadada_039: ['Mateo', 6, '14', 'Porque si perdonareis á los hombres sus ofensas, os perdonará también á vosotros vuestro Padre celestial.'],
  enfadada_040: ['Mateo', 6, '15', 'Mas si no perdonareis á los hombres sus ofensas, tampoco vuestro Padre os perdonará vuestras ofensas.'],
  enfadada_041: ['Lucas', 6, '37', 'No juzguéis, y no seréis juzgados: no condenéis, y no seréis condenados: perdonad, y seréis perdonados.'],
  enfadada_042: ['Proverbios', 17, '14', 'El que comienza la contienda es como quien suelta las aguas; Deja pues la contienda, antes que se embravezca.'],
  enfadada_044: ['Mateo', 18, '22', 'Jesús le dice: No te digo hasta siete, mas aun hasta setenta veces siete.'],
  ansiosa_009: ['Salmos', 56, '3', 'En el día que temiere, Yo en ti confiaré.'],
  ansiosa_010: ['Isaías', 41, '13', 'Porque yo Jehová soy tu Dios, que te asgo de tu mano derecha, y te digo: No temas, yo te ayudo.'],
  ansiosa_012: ['Juan', 14, '27', 'La paz os dejo, mi paz os doy: no os la doy yo como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.'],
  ansiosa_015: ['Salmos', 23, '4', 'Aunque ande en valle de sombra de muerte, No temeré mal alguno; porque tú estarás conmigo: Tu vara y tu cayado me infundirán aliento.'],
  ansiosa_017: ['Salmos', 37, '5', 'Encomienda á Jehová tu camino, Y espera en él; y él hará.'],
  ansiosa_024: ['Mateo', 6, '34', 'Así que, no os congojéis por el día de mañana; que el día de mañana traerá su fatiga: basta al día su afán.'],
  ansiosa_025: ['Salmos', 46, '10', 'Estad quietos, y conoced que yo soy Dios: Seré ensalzado entre las gentes; seré ensalzado en la tierra.'],
  ansiosa_026: ['Salmos', 46, '1', 'DIOS es nuestro amparo y fortaleza, Nuestro pronto auxilio en las tribulaciones.'],
  ansiosa_027: ['Salmos', 55, '22', 'Echa sobre Jehová tu carga, y él te sustentará: No dejará para siempre caído al justo.'],
  ansiosa_032: ['Isaías', 40, '31', 'Mas los que esperan á Jehová tendrán nuevas fuerzas; levantarán las alas como águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.'],
  ansiosa_033: ['Josué', 1, '9', 'Mira que te mando que te esfuerces, y seas valiente: no temas ni desmayes, porque Jehová tu Dios será contigo en donde quiera que fueres.'],
  ansiosa_035: ['2 Timoteo', 1, '7', 'Porque no nos ha dado Dios espíritu de temor, sino de fortaleza, y de amor, y de templanza.'],
  ansiosa_044: ['Isaías', 43, '1', 'Y ahora, así dice Jehová Creador tuyo, oh Jacob, y Formador tuyo, oh Israel: No temas, porque yo te redimí; te puse nombre, mío eres tú.'],
  ansiosa_045: ['Salmos', 27, '1', 'JEHOVA es mi luz y mi salvación: ¿de quién temeré? Jehová es la fortaleza de mi vida: ¿de quién he de atemorizarme?'],
  solitaria_001: ['Deuteronomio', 31, '6', 'Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos: porque Jehová tu Dios es el que va contigo: no te dejará, ni te desamparará.'],
  solitaria_002: ['Deuteronomio', 31, '8', 'Y Jehová va delante de ti: él será contigo, no te dejará, ni te desamparará; no temas, ni te intimides.'],
  solitaria_003: ['Isaías', 43, '2', 'Cuando pasares por las aguas, yo seré contigo; y por los ríos, no te anegarán. Cuando pasares por el fuego, no te quemarás, ni la llama arderá en ti.'],
  solitaria_006: ['Mateo', 28, '20', 'Enseñándoles que guarden todas las cosas que os he mandado: y he aquí, yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.'],
  solitaria_007: ['Hebreos', 13, '5', 'Sean las costumbres vuestras sin avaricia; contentos con lo que tenéis ahora; porque él dijo: No te desampararé, ni te dejaré.'],
  solitaria_011: ['Salmos', 27, '10', 'Aunque mi padre y mi madre me dejaran, Jehová me recogerá.'],
  solitaria_012: ['Salmos', 73, '23', 'Con todo, yo siempre estuve contigo: Tú me tomaste de la mano derecha.'],
  solitaria_013: ['Salmos', 139, '18', 'Si los cuento, multiplícanse más que la arena: Despierto, y aún estoy contigo.'],
  solitaria_014: ['Salmos', 23, '1', 'JEHOVA es mi pastor; nada me faltará.'],
  solitaria_017: ['Génesis', 28, '15', 'Y he aquí, yo soy contigo, y te guardaré por donde quiera que fueres, y te volveré á esta tierra; porque no te dejaré hasta que haya hecho lo que te he dicho.'],
  solitaria_018: ['Josué', 1, '5', 'Nadie te podrá hacer frente en todos los días de tu vida: como yo fui con Moisés, seré contigo; no te dejaré, ni te desampararé.'],
  solitaria_019: ['Isaías', 41, '17', 'Los afligidos y menesterosos buscan las aguas, que no hay; su lengua está seco de sed; yo Jehová los oiré, yo el Dios de Israel no los desampararé.'],
  solitaria_022: ['Salmos', 68, '6', 'Dios hace habitar en familia los solos; Saca á los aprisionados con alegría: Mas los rebeldes habitan en sequedad.'],
  solitaria_025: ['Salmos', 25, '16', 'Mírame, y ten misericordia de mí; Porque estoy solo y afligido.'],
  solitaria_026: ['Salmos', 142, '4', 'Miré á la mano derecha, y observé, mas no había quien me conociese; No tuve refugio, no había quien mirase por mi alma.'],
  solitaria_027: ['Isaías', 54, '10', 'Porque los montes se moverán, y los collados temblarán; mas no se apartará de ti mi misericordia, ni el pacto de mi paz se corromperá, dijo Jehová, el que tiene misericordia de ti.'],
  solitaria_028: ['Sofonías', 3, '17', 'Jehová está en medio de ti, poderoso, él salvará; se gozará sobre ti con alegría, callará de su amor, se regocijará sobre ti con cantar.'],
  solitaria_031: ['Salmos', 46, '7', 'Jehová de los ejércitos es con nosotros; Nuestro refugio es el Dios de Jacob. (Selah.)'],
  solitaria_032: ['Salmos', 121, '5', 'Jehová es tu guardador: Jehová es tu sombra á tu mano derecha.'],
  solitaria_033: ['Salmos', 121, '8', 'Jehová guardará tu salida y tu entrada, Desde ahora y para siempre.'],
  solitaria_034: ['Juan', 14, '18', 'No os dejaré huérfanos: vendré á vosotros.'],
  solitaria_035: ['Romanos', 8, '38', 'Por lo cual estoy cierto que ni la muerte, ni la vida, ni ángeles, ni principados, ni potestades, ni lo presente, ni lo por venir,'],
  solitaria_036: ['Romanos', 8, '39', 'Ni lo alto, ni lo bajo, ni ninguna criatura nos podrá apartar del amor de Dios, que es en Cristo Jesús Señor nuestro.'],
  solitaria_045: ['Isaías', 49, '15', '¿Olvidaráse la mujer de lo que parió, para dejar de compadecerse del hijo de su vientre? Aunque se olviden ellas, yo no me olvidaré de ti.'],
  triste_001: ['Salmos', 34, '18', 'Cercano está Jehová á los quebrantados de corazón; Y salva á los contritos de espíritu.'],
  triste_002: ['Salmos', 147, '3', 'El sana á los quebrantados de corazón, y liga sus heridas.'],
  triste_003: ['Isaías', 61, '1', 'EL espíritu de los Señores Jehová sobre mí, porque ungióme Jehová; hame enviado á predicar buenas nuevas á los abatidos, á vendar á los quebrantados de corazón, á publicar libertad á los cautivos, y á los presos abertura de la cárcel;'],
  triste_004: ['Apocalipsis', 21, '4', 'Y limpiará Dios toda lágrima de los ojos de ellos; y la muerte no será más; y no habrá más llanto, ni clamor, ni dolor: porque las primeras cosas son pasadas.'],
  triste_006: ['Salmos', 30, '11', 'Has tornado mi endecha en baile; Desataste mi saco, y ceñísteme de alegría.'],
  triste_008: ['Mateo', 5, '4', 'Bienaventurados los que lloran: porque ellos recibirán consolación.'],
  triste_009: ['Salmos', 56, '8', 'Mis huidas tú has contado: Pon mis lágrimas en tu redoma: ¿No están ellas en tu libro?'],
  triste_011: ['Salmos', 126, '5', 'Los que sembraron con lágrimas, con regocijo segarán.'],
  triste_012: ['Isaías', 40, '1', 'CONSOLAOS, consolaos, pueblo mío, dice vuestro Dios.'],
  triste_015: ['Isaías', 51, '12', 'Yo, yo soy vuestro consolador. ¿Quién eres tú para que tengas temor del hombre, que es mortal, y del hijo del hombre, que será hecho heno?'],
  triste_017: ['Salmos', 42, '11', '¿Por qué te abates, oh alma mía, Y por qué te conturbas en mí? Espera á Dios; porque aún he de alabarle, Salvación mía y Dios mío.'],
  triste_019: ['Salmos', 42, '5', '¿Por qué te abates, oh alma mía, Y gimes dentro de mí? Espera en Dios; porque aún le tengo de alabar Por las salud de su rostro.'],
  triste_020: ['2 Corintios', 1, '3', 'Bendito sea el Dios y Padre del Señor nuestro Jesucristo, el Padre de misericordias, y el Dios de toda consolación.'],
  triste_022: ['Salmos', 119, '28', 'Destílase mi alma de pesar: Confírmame según tu palabra.'],
  triste_026: ['Salmos', 73, '26', 'Mi carne y mi corazón desfallecen: Mas la roca de mi corazón y mi porción es Dios para siempre.'],
  triste_027: ['Salmos', 94, '19', 'En la multitud de mis pensamientos dentro de mí, Tus consolaciones alegraban mi alma.'],
  triste_028: ['Isaías', 66, '13', 'Como aquel á quien consuela su madre, así os consolaré yo á vosotros, y en Jerusalem tomaréis consuelo.'],
  triste_032: ['Salmos', 116, '8', 'Pues tú has librado mi alma de la muerte, Mis ojos de lágrimas, Y mis pies de resbalar.'],
  triste_034: ['Salmos', 126, '6', 'Irá andando y llorando el que lleva la preciosa simiente; Mas volverá á venir con regocijo, trayendo sus gavillas.'],
  triste_035: ['Isaías', 25, '8', 'Destruirá á la muerte para siempre; y enjugará el Señor Jehová la lágrima de todos los rostros; y quitará la afrenta de su pueblo de toda la tierra: porque Jehová lo ha determinado.'],
  triste_036: ['Salmos', 34, '19', 'Muchos son los males del justo; Mas de todos ellos le librará Jehová.'],
  triste_037: ['Nahum', 1, '7', 'Jehová es bueno, fortaleza en el día de la angustia; y conoce á los que en él confían.'],
  triste_038: ['Salmos', 9, '9', 'Y será Jehová refugio del pobre, Refugio para el tiempo de angustia.'],
  triste_039: ['Salmos', 31, '7', 'Me alegraré y me gozaré en tu misericordia; Porque has visto mi aflicción; Has conocido mi alma en las angustias:'],
  triste_040: ['Salmos', 55, '1', 'ESCUCHA, oh Dios, mi oración, Y no te escondas de mi ruego.'],
  triste_042: ['Isaías', 57, '15', 'Porque así dijo el Alto y Sublime, el que habita la eternidad, y cuyo nombre es el Santo: Yo habito en la altura y la santidad, y con el quebrantado y humilde de espíritu, para hacer vivir el espíritu de los humildes, y para vivificar el corazón de los quebrantados.'],
  triste_043: ['Salmos', 147, '6', 'Jehová ensalza á los humildes; Humilla hasta la tierra á los impíos.'],
  triste_044: ['Salmos', 10, '17', 'El deseo de los humildes oíste, oh Jehová: Tú dispones su corazón, y haces atento tu oído;'],
  triste_045: ['Salmos', 30, '2', 'Jehová Dios mío, A ti clamé, y me sanaste.'],
};

let changed = 0;
for (const verse of verses) {
  const patch = patches[verse.id];
  if (!patch) continue;
  const [book, chapter, verseNum, text] = patch;
  verse.book = book;
  verse.chapter = chapter;
  verse.verse = verseNum;
  verse.reference = `${book} ${chapter}:${verseNum}`;
  verse.text = text;
  verse.version = 'RVR1909';
  changed += 1;
}

fs.writeFileSync(versesPath, `${JSON.stringify(verses, null, 2)}\n`);
console.log(`Patched ${changed} verses`);
