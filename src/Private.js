import React, { Component } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header.js"
import {Footer} from "./components/Footer.js"

export default class Private extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
    <div className="page-layout">
        <Header currentRole={this.props.currentRole}/>
        <div className="container f-v-gap-5 f-gap-5 u-mt-10">
              <h2 className="h2 u-text-center">Пропозиція укласти договір про надання і послуг письмового перекладу (публічна оферта)</h2>
              <p>Предметом цієї публічної оферти є правовідносини, що виникають у зв’язку з реєстрацією особи в Сервісі TEXTRA, замовленням та отриманням особою послуг письмового перекладу з використанням Сервісу TEXTRA.</p>
              <p>
              Представник адресує дану публічну оферту – пропозицію укласти договір про надання послуг письмового перекладу (далі - Договір) особам, які бажають мати доступ до Сервісу TEXTRA, замовляти та отримувати послуги письмового перекладу за допомогою Сервісу TEXTRA
              </p>
              <p>Договір є публічним та, згідно зі статтями 633, 641, 644 Цивільного кодексу України, його умови однакові для всіх юридичних та/або фізичних осіб.
              </p>
              <p>Акцепт публічної оферти здійснюється особою шляхом проходження реєстрації в Сервісі TEXTRA на СайтіTEXTRA у встановленому порядку, уважного ознайомлення з Договоромта залишення відмітки про ознайомлення та згоду з усіма умовами Договору, що пропонується під реєстраційною формою на Сайті TEXTRA.</p>
              <p>Здійснення особою вказаних вище дій вважається, відповідно до статті 642 Цивільного кодексу України, прийняттям особою умов Договору (повним і беззастережним акцептом публічної оферти), засвідчує факт укладання Договору, а також засвідчує згоду особи сумлінно користуватись правами та належним чином виконувати обов’язки, що виникають у зв’язку з укладенням та виконанням Договору.</p>
              <p>Публічна оферта починає діяти з моменту розміщення на Сайті TEXTRA за адресою <span className="u-text-font__bold">www.textra.io</span> і діє до моменту відзиву або зміни публічної оферти.</p>

              <h2 className="h2 text-header">Визначення термінів: </h2>
              <p>Сервіс TEXTRA – сервіс онлайнперекладів з української мови на іноземні мови, з іноземних мов на українську мову (далі - Сервіс).</p>
              <p>Представник – особа,що є адміністратором та/або власником Сервісу TEXTRA і має право та повноваження на укладення та виконання цього Договору.</p>
              <p>Сайт TEXTRA– Офіційний веб-сайт Сервісу TEXTRA - інформаційний ресурс мережі Інтернет за адресою  <span className="u-text-font__bold">www.textra.io</span></p>

              <h2 className="h2 u-text-center">Договір про надання послуг письмового перекладу (публічна оферта)</h2>
              <p>Представник, що іменується далі «Виконавець», з однієї сторони та будь-яка інша особа, яка здійснила акцепт (прийняття) умовцього Договору, що іменується далі «Замовник», з другої сторони, що надалі разом іменуються як Сторони, уклали цей Договір про нижченаведене:</p>
              <ol>
                <li><span className="h3 doc__header u-text-center">Предмет Договору</span>
                  <ol>
                    <li> <p>На підставі цього Договору Виконавець надає Замовнику, а Замовник приймає та оплачує Виконавцю згідно встановлених Виконавцем тарифів, послуги письмового перекладу з української мови на іноземні мови, з іноземних мов на українську мову відповідно до замовлень, наданих Замовником (далі - Послуги). Список мов, що підтримуються, розміщений на Сайті TEXTRA.</p></li>
                    <li> <p>Тарифи на Послуги доступні для ознайомлення на Сайті TEXTRA за адресою: <a href="http://textra.io/dashboard/create.">http://textra.io/dashboard/create.</a> </p></li>
                    <li> <p>Замовлення Послуг, надання та оплата Послуг здійснюється Сторонами в порядку, встановленому відповідно до цього Договору та за допомогою Сервісу.</p></li>
                    <li><p> Сервіс є інтелектуальною власністю, правова охорона якої встановлюється законодавством України, чинними міжнародними договорами України. Виконавець гарантує наявність у нього прав та повноважень, необхідних для укладення та виконанняцього Договору.</p></li>
                  </ol>
                </li>
                <li><span className="h2 doc__header u-text-center">Права та обов'язки сторін</span>
                  <ol>
                    <li> <span className="h3 u-text-font__italic">Виконавець зобов’язаний:</span>
                      <ul>
                        <li><p>дотримуватися умов даного Договору;</p></li>
                        <li><p> надавати Послуги якісно, силами кваліфікованих перекладачів;</p></li> 
                        <li><p> надавати Замовнику консультації, що стосуються користування Сервісом, надання Послуг протягом робочого часу, визначеного розкладом роботи служби підтримки Виконавця;</p></li>
                        <li><p> зберігати сувору конфіденційність інформації Замовника, отриманої від нього при реєстрації в Сервісі, а також змісту текстів, наданих для перекладу, особистих повідомлень електронної пошти за винятком випадків, передбачених чинним законодавством України та цим Договором.</p></li>
                      </ul>
                    </li>
                    <li> <span className="h3 u-text-font__italic">Замовник зобов’язаний:</span>
                      <ul>
                        <li><p>виконувати умови цього Договору;</p></li>
                        <li><p>надавати достовірні особисті (персональні) дані та іншу інформацію, необхідну для виконання цього Договору;</p></li> 
                        <li><p> оплачувати Послуги відповідно до тарифів, встановлених Замовником. </p></li>
                        <li><p>самостійно знайомитися з інформацією про правила користування Сервісом, умови надання Послуг і тарифи наСайті TEXTRA;</p></li>
                        <li><p>забезпечувати конфіденційність свого логіна і пароля;</p></li>
                        <li><p>при зверненні до служби підтримки Виконавця використовувати контактну електронну адресу (адресу, вказану при реєстрації в Сервісі) і повідомляти свій логін, ім'я та прізвище, а також при необхідності використовувати інші запропоновані Виконавцем варіанти підтвердження своїх прав доступу;</p></li>
                        <li><p>самостійно знайомитися з інформацією про правила користування Сервісом, умови надання Послуг і тарифи наСайті TEXTRA;</p></li>
                        <li><p>надати згоду Виконавцю на обробку та використання своїх персональних даних відповідно до Закону України «Про захист персональних даних».</p></li>
                      </ul>
                    </li>
                    <li> <span className="h3 u-text-font__italic">Виконавець має право:</span>
                      <ul>
                        <li><p>змінити склад, порядок, умови надання Послуг та ціни (тарифи) на надання Послуг шляхом розміщення інформації на Сайті TEXTRA. У випадку зміни ціни(тарифів) раніше внесена Замовником оплата за новими цінами (тарифами) не перераховується;</p></li>
                        <li><p>змінювати умови цього Договору шляхом розміщення на Сайті TEXTRA зміненого тексту Договору;</p></li> 
                        <li><p> припинити надавати Послуги у разі відсутності оплати або недостатності грошових коштів на особистому рахунку Замовника у Сервісі для оплати замовлених Послуг; </p></li>
                        <li><p>розкривати відомості про Замовника виключно у випадках, передбачених законодавством України та/або цим Договором;</p></li>
                        <li><p>призупинити (тимчасово або повністю) надання Послуг Замовнику у випадках порушення ним обов'язків, описаних в п.2.2 Договору, а також у таких випадках:</p>
                          <ul>
                            <li><p>якщо Виконавець вважає, що будь-які дії, вчинені Замовником через Послуги, надані Замовнику згідно даного Договору, завдають або можуть завдати шкоди Виконавцю, іншим користувачам Сервісу; </p></li>
                            <li><p>в разі пошкодження чи намагання пошкодити засоби захисту Сервісу; </p></li>
                            <li><p>при публікації та передачі Замовником через мережу Інтернет будь-якої інформації, яка паплюжить Виконавця чи скоєння дій, що перешкоджають нормальній роботі Виконавця;</p></li>
                          </ul>
                        </li>
                        <li><p>заблокувати доступ до Сервісу з певної IP-адреси у випадках: перевищення кількості запитів з IP-адреси за певний проміжок часу, надсилання запитів, які не передбачені цим Договором, дій з Сервісом, що можуть призвести до наслідків, передбачених розділом XVI Кримінального кодексу України «Злочини у сфері використання електронно-обчислювальних машин (комп'ютерів), систем та комп'ютерних мереж і мереж електрозв'язку».</p></li>
                      </ul>
                    </li>
                    <li> <span className="h3 u-text-font__italic">Замовник має право:</span>
                      <ul>
                        <li><p>вимагати від Виконавця належного надання Послуг відповідно до умов цього Договору;</p></li>
                        <li><p>разі виникнення зауважень щодо якості Послуг повідомляти про них Виконавця;</p></li> 
                        <li><p>в односторонньому порядку відмовитися від Послуг Виконавця.</p></li>
                        <li><p>інші права, передбачені Договором та/або законом.</p></li>
                      </ul>
                    </li>
                  </ol>
                </li>
                <li><span className="h3 doc__header u-text-center">Порядок надання та оплати Послуг</span>
                  <ol>
                    <li><p>При користуванні Сервісом вперше:</p>
                      <ol>
                        <li><p> Замовник самостійно здійснює реєстрацію в Сервісі на Сайті TEXTRA в розділі «Реєстрація» з використанням логіну та пароля.</p></li>
                        <li><p> По закінченню реєстрації в Сервісі Замовник отримує власний аккаунт (особистий кабінет) в Сервісі та особистий рахунок, який може поповнювати способами, передбаченими Сервісом.На дату початку дії публічної оферти поповнювати особистий рахунок (оплачувати) Послуги Замовник може за допомогою платіжного сервісу <span className="u-text-font__bold">«liqpay»</span>.</p></li>
                      </ol>
                    </li>
                    <li><p>Вартість Послуг за цим Договором визначається відповідно до діючих тарифів і умов оплати, які вказані в Договорі та/або опубліковані на Сайті TEXTRA. Ціни на Послуги вказуються в національній валюті України.</p></li>
                    <li><p>Замовник надсилає замовлення на переклад тексту та текст, що потребує перекладу, за допомогою форми у особистому кабінеті, зробивши відмітку (поставивши галочку) на кнопці «отправить». Замовлення на переклад тексту приймає до роботи один з перекладачів, зі списку перекладачів, який відображається в особистому кабінеті Замовника. Замовник матиме можливість вибору перекладача з числа тих вільних перекладачів, хто здійснював переклад текстів Замовника за допомогою Сервісу раніше. Орієнтовні строки здійснення перекладу щодо кожного замовленого перекладу відображаються у особистому кабінеті Замовника.
                    Послуги надаються за умови внесення оплати в розмірі 100% від вартості замовлених Послуг. 
                    Датою початку надання Послуги Виконавцем є дата списання грошових коштів з особистого рахунку Замовника. При цьому Сервіс автоматично списує з особистого рахунку Замовника грошові кошти, сума яких дорівнює вартості послуг перекладу такого тексту. Комісія за переказ грошових коштів сплачується відповідно до правил та тарифів платіжного сервісу <span className="u-text-font__bold">«liqpay»</span> та/або правил і тарифів відповідних банківських установ, що здійснюють переказ коштів.
                    </p></li>
                    <li><p>Замовник отримує підтвердження (рахунок) про оплату Послугза допомогоюплатіжного сервісу <span className="u-text-font__bold">«liqpay»</span>.</p></li>
                    <li><p>Замовник отримує перекладтексту у особистому кабінеті в Сервісі.</p></li>
                    <li><p>В разі відсутності зауважень до зробленого перекладу протягом 1 (однієї) доби з дати здійснення перекладу Послуги вважаються прийнятими Замовником.</p></li>
                    <li><p>Інформація про стан особистого рахунку Замовника у Сервісі доступна для перегляду у особистому кабінеті Замовника. </p></li>
                    <li><p>Виконавець має право в будь-який час в односторонньому порядку змінювати тарифи. Датою вступу в силу нових цін чи тарифів є дата їх публікації на Сайті TEXTRA. У випадку зміни тарифів раніше внесена Замовником оплата (аванс) за новими цінами не перераховується.</p></li>
                    <li><p>Замовник самостійно несе відповідальність за правильність здійснених ним платежів.</p></li>
                  </ol>
                  </li>
                  <li><span className="h3 doc__header u-text-center">Політика конфіденційності </span>
                    <ol>
                      <li>
                        <p>Згідно Закону України «Про захист персональних даних», заповнюючи дані реєстраційної форми (замовлення) та проставляючи відмітку про ознайомлення з даною Політикою конфіденційності та обробки персональних даних (далі – Політика конфіденційності), Замовник дає згоду на обробку своїх персональних даних з метою забезпечення реалізації цивільно-правових та/або господарсько-правових відносин при наданні та отриманні Послуг.
                        Замовник також погоджується з тим, що Виконавець має право надавати доступ та передавати персональні дані Замовника третім особам без будь-яких додаткових повідомлень, виключно, якщо при цьому не змінюється мета їх обробки та лише у випадках, передбачених даною Політикою конфіденційності та/або законодавством України.
                        <span className="doc__indentation">
                        Сервіс цінує право Замовника на особисте життя та нерозголошення персональних даних Замовника. Ця Політика конфіденційності – правила, якими користується Виконавець, всі співробітники Сервісу, та регламентує збір і використання персональних даних, які можуть бути запитані/отримані при реєстрації в Сервісі та використанні Сервісу, призамовленні, отриманні та оплаті Послуг.</span>
                        <span className="doc__indentation">
                        Обсяг персональних даних
                        При здійсненні реєстрації в Сервісі, замовленні та оплаті Послуг Замовник надає для обробки свої персональні дані – зокрема, ім’я, адреси, номера телефону, e-mail, банківські дані тощо.</span>
                        <span className="doc__indentation">
                        Такі дані Виконавець отримує лише від осіб, які надають їх свідомо та з власного бажання.</span>
                        <span className="doc__indentation">
                        Для того, щоб зробити замовлення Послуг, Замовник повинен уважно ознайомитися зісвоїми правами та обов’язками щодо обробки персональних даних, які зазначені в ст. 8 Закону України «Про захист персональних даних», уважно ознайомитися з даною Політикою конфіденційності, а також висловити свою повну згоду з їх умовами.</span>
                        <span className="doc__indentation">
                        Мета збору персональних даних
                        Персональні дані – відомості чи сукупність відомостей про фізичну особу, яка ідентифікована або може бути конкретно ідентифікована.
                        Виконавець може обробляти персональні дані Замовника для наступних цілей. При цьому одночасно можуть застосовуватися одна або кілька цілей:</span>
                        
                        <span className="doc__indentation__left">Отримання замовлення. Виконавець може використовувати персональні дані Замовникадля отримання замовлення на надання Послуг, для обробки запитів Замовника, або для інших цілей, які можуть існувати для досягнення кінцевої мети – задовольнити інтереси Замовника, якісно та вчасно надавати Замовнику Послуги,а також для запобігання та розслідування випадків шахрайства та інших зловживань.</span>
                        
                        <span className="doc__indentation__left">
                        Спілкування з Замовником. Виконавець може використовувати персональні дані Замовника для зв’язку з Замовником, наприклад повідомити Замовника про зміниуроботі Сервісу або надіслати Замовнику важливі повідомлення та інші подібні повідомлення, що стосуються замовлення, що було зроблено та зв’язатися з Замовником в цілях, пов’язаних з обслуговуванням споживача/клієнта.
                        </span>
                        Виконавець діє відповідно до цієї Політики конфіденційності та на підставі чинного законодавства України.
                        Виконавець має право зберігати Персональні дані стільки, скільки необхідно для реалізації мети, що зазначена у даній Політиці, або у строки, встановлені чинним законодавством України або до моменту видалення Замовником цих даних.
                        <span className="doc__indentation">
                        Передача персональних даних третім особам.
                        Виконавець не продає, не передаєта не розголошує персональні дані, які отримав наСайті TEXTRA, третім сторонам без попередньої згоди Замовника,крім випадків, передбачених Договором та/або законодавством України. Виконавець розкриває персональні дані лише у випадках, визначених чинним законодавством України, а також:
                        у випадку запобігання злочину або завдання шкоди Виконавцю або третім особам;
                        третім особам, що надають Виконавцю технічну підтримку та послуги (в тому числі з інтернет-еквайрингу), за допомогою яких Замовник отримує (оплачує) замовлені Послуги. Власником персональних даних є ФОП «Ященко Сергій Олександрович (ІНН 3099314370)».
                        </span>
                        </p>
                      </li>
                      <li><p>Збереження конфіденційності щодо текстів Замовника, наданих Виконавцю для перекладу та перекладів таких тестів.
                      Виконавець зобов’язується не передавати будь-яким третім особам тексти, надані йому Замовником для здійснення перекладу, крім випадків, передбачених Договором та/або законодавством України.                      
                      </p></li>
                      <li><p>Виконавець зобов’язується дотримувати сувору конфіденційність відносно всієї та будь – якої інформації, отриманої від Замовника крім випадків, передбачених Договором та/або законодавством, і приймати всі розумні заходи для попередження несанкціонованого використання або розкриття такої інформації згідно з цим Договором.</p></li>
                      <li><p>Сторони не несуть відповідальності за порушення конфіденційності, яке відбулося:</p>
                        <ul>
                          <li><p>внаслідок настання форс-мажорних обставин</p></li>
                          <li><p>внаслідок порушення конфіденційності за вимогою державних органів згідно чинного законодавства.</p>
                          </li>
                        </ul>
                      </li>
                    </ol>
                  </li>
                  <li><span className="h3 doc__header u-text-center">Відповідальність Сторін</span>
                    <ol>
                      <li><p>Сторони даного Договору несуть відповідальність за предметом і умовами Договору згідноз Договором та чинним законодавством України.</p></li>
                      <li><p>Виконавець не несе відповідальності за: </p>
                          <ul>
                            <li><p>прямі або непрямі збитки, втрачену вигоду або моральну шкоду Замовника, пов’язані із використанням або неможливістю користуватися Послугою; </p></li>
                            <li><p>погіршення якості Послуг, перебої у роботі, що виникли внаслідок причин, що знаходяться поза межами контролю Виконавця.</p></li>
                          </ul>
                      </li>
                      <li><p>Замовник повністю відповідальний за збереження свого логіна і пароля і за збитки, які можуть виникнути через несанкціоноване його використання. За фактом крадіжки логіна і пароля з вини третіх осіб Замовник має право направити на адресу Виконавця заяву про зміну логіна і пароля. Виконавець не несе відповідальність за дії третіх осіб, які спричинили крадіжку.</p></li>
                      <li><p>У разі неможливості вирішення спору шляхом переговорів та в досудовому порядку, спір може бути передано для вирішення у судовому порядку.</p></li>
                      <li><p>Розмір відповідальності, не врегульований даним Договором, регулюється діючим законодавством України.</p></li>
                    </ol>
                  </li>
                  <li><span className="h3 doc__header u-text-center">Момент вступу в силу Договору. Термін дії. Порядок зміни та розірвання.</span>
                    <ol>
                      <li><p>Договір набуває чинності з моменту проходженняЗамовником реєстрації в Сервісі TEXTRA на Сайті TEXTRA у встановленому порядку, уважного ознайомлення з Договором та залишення відмітки про ознайомлення та згоду з усіма умовами Договору, що пропонується під реєстраційною формою на Сайті TEXTRA, та діє до моменту його розірвання.</p></li>
                      <li><p>Сторони мають право розірвати даний Договір в односторонньому порядку з будь-яких підстав, повідомивши одна одну про розірвання Договору шляхом надіслання відповідного повідомлення на електронну пошту. При розірванні Договору з ініціативи Виконавця, Виконавець повертає Замовнику кошти, що залишились на особистому рахунку Замовника, за відрахуванням витрат (комісії) за переказ коштів, що встановлені платіжними сервісом та/або банківською установою, що здійснює переказ коштів. При  розірванні Договору Виконавець має право видалити обліковий запис Замовника у Сервісі.</p></li>
                      <li><p>Внесення змін (доповнень) у даний Договір, зміну порядку, обсягу та умов надання Послуг, проводиться Виконавцем в односторонньому порядку. Усі зміни (доповнення), внесені Виконавцем у даний Договір, набувають чинності й стають обов’язковими для Замовника з моменту їхньої публікації наСайті TEXTRA. У випадку незгоди Замовника зі змінами, внесеними в цей Договір, Замовник має право розірвати його у порядку, встановленому цим Договором. Всі додатки, зміни й доповнення до даного Договору є його невід’ємною частиною.</p></li>
                    </ol>
                  </li>
                  <li>
                    <span className="h3 f f-align-2-2 u-text-font__bold">Реквізити Виконавця</span>
                    <span className="h3 f f-align-2-2 u-text-font__bold">Ященко Сергій Олександрович</span>
                    <span className="h3 f f-align-2-2 u-text-font__bold">ІНН 3099314370</span>
                  </li>
              </ol>            
          </div>
        <Footer/>
    </div>)
  }
}
