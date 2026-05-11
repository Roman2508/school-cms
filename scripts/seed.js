'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

const SCHOOL_NAME = 'Коростишівська гімназія №1';
const ROOT_DIR = path.resolve(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT_DIR, 'public', 'uploads');
const GENERATED_ASSETS_DIR = path.join(ROOT_DIR, 'data', 'generated-seed-assets');

const LOCAL_MEDIA_FILES = {
  logo: 'logo_transparent_f72ca50c71.png',
  hero: 'hero_illustration_6a39267df3.png',
  about: 'school_photo_74e6da6c2d.jpg',
  campus: 'school_photo_9befc2c41a.jpg',
  assembly: 'Osnovna_foto_1_b7f307b53e_2d00b4d6c4.jpg',
  news1: 'IMG_2476_f700bc7c42_4717153e69.jpg',
  news2: 'IMG_4517_1_30007370ba_a4f3c2816d.jpg',
  news3: 'IMG_4520_1_892f8a73f9_1552ae8719.jpg',
  news4: 'IMG_4544_1_1_0865451f22_4d2301c38a.jpg',
  news5: 'IMG_4547_1_1_286a59b406_5222b09b54.jpg',
  news6: 'IMG_7225_b2d4bb97c1_18980ef7f0.jpg',
  news7: 'IMG_7232_f1a30c3ff9_96922a5f18.jpg',
  news8: 'IMG_7235_bc34bc02a0_ee8b6fddaa.jpg',
  lessons: 'kursi_ukr_mova_f24563ed75.png',
  building: 'zavantazhennya_24a36836b9.jpg',
  library: 'zavantazhennya_2_440bd56bec.jpg',
  classroom: 'zavantazhennya_1_e130dd060f.jpg',
  computerLab: 'Znimok_ekrana_12_eff9be094e_abe298d7b6.png',
};

const GENERATED_SVG_ASSETS = {
  'facebook-seed.svg': makeBadgeSvg('f', '#1877F2'),
  'instagram-seed.svg': makeBadgeSvg('ig', '#E1306C'),
  'youtube-seed.svg': makeBadgeSvg('yt', '#FF0000'),
  'location-seed.svg': makeSquareIconSvg('A', '#2E7D32'),
  'phone-seed.svg': makeSquareIconSvg('P', '#00897B'),
  'mail-seed.svg': makeSquareIconSvg('M', '#FB8C00'),
  'students-seed.svg': makeSquareIconSvg('S', '#5E35B1'),
  'teachers-seed.svg': makeSquareIconSvg('T', '#3949AB'),
  'awards-seed.svg': makeSquareIconSvg('W', '#F9A825'),
  'clubs-seed.svg': makeSquareIconSvg('C', '#6D4C41'),
};

const PUBLIC_PERMISSIONS = {
  global: ['find'],
  header: ['find'],
  footer: ['find'],
  homepage: ['find'],
  page: ['find', 'findOne'],
  'news-post': ['find', 'findOne'],
  'event-post': ['find', 'findOne'],
  'stuff-member': ['find', 'findOne'],
  category: ['find', 'findOne'],
};

function makeBadgeSvg(text, color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="64" fill="${color}"/>
  <text x="128" y="144" font-family="Arial, sans-serif" font-size="92" font-weight="700" text-anchor="middle" fill="#ffffff">${text}</text>
</svg>`;
}

function makeSquareIconSvg(text, color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect x="20" y="20" width="216" height="216" rx="48" fill="${color}" opacity="0.12"/>
  <rect x="44" y="44" width="168" height="168" rx="40" fill="${color}"/>
  <text x="128" y="150" font-family="Arial, sans-serif" font-size="88" font-weight="700" text-anchor="middle" fill="#ffffff">${text}</text>
</svg>`;
}

function textNode(text) {
  return { type: 'text', text };
}

function paragraph(text) {
  return {
    type: 'paragraph',
    children: [textNode(text)],
  };
}

function heading(level, text) {
  return {
    type: 'heading',
    level,
    children: [textNode(text)],
  };
}

function bulletList(items) {
  return {
    type: 'list',
    format: 'unordered',
    children: items.map((item) => ({
      type: 'list-item',
      children: [textNode(item)],
    })),
  };
}

function quote(text) {
  return {
    type: 'quote',
    children: [textNode(text)],
  };
}

function richTextBlock(blocks) {
  return {
    __component: 'shared.rich-text',
    body: blocks,
  };
}

function buttonLinkBlock(text, link, options = {}) {
  return {
    __component: 'shared.button-link',
    text,
    link,
    size: options.size ?? 'auto',
    align: options.align ?? 'left',
    variant: options.variant ?? 'default',
  };
}

function mediaBlock(file) {
  return {
    __component: 'shared.media',
    file,
  };
}

function accordionItem(title, blocks, defaultOpen = false) {
  return {
    title,
    body: blocks,
    default_open: defaultOpen,
  };
}

function accordionBlock(title, items, options = {}) {
  return {
    __component: 'shared.accordion',
    title,
    align: options.align ?? 'left',
    multiply_open: options.multiplyOpen ?? false,
    items,
  };
}

function getFileInfo(absolutePath, originalFileName) {
  const stats = fs.statSync(absolutePath);
  return {
    filepath: absolutePath,
    originalFileName,
    size: stats.size,
    mimetype: mime.lookup(originalFileName) || 'application/octet-stream',
  };
}

function ensureGeneratedAssets() {
  fs.ensureDirSync(GENERATED_ASSETS_DIR);

  for (const [fileName, content] of Object.entries(GENERATED_SVG_ASSETS)) {
    const absolutePath = path.join(GENERATED_ASSETS_DIR, fileName);
    if (!fs.existsSync(absolutePath)) {
      fs.writeFileSync(absolutePath, content, 'utf8');
    }
  }
}

function resolveAssetPath(fileName) {
  const uploadedPath = path.join(UPLOADS_DIR, fileName);
  if (fs.existsSync(uploadedPath)) {
    return uploadedPath;
  }

  const generatedPath = path.join(GENERATED_ASSETS_DIR, fileName);
  if (fs.existsSync(generatedPath)) {
    return generatedPath;
  }

  throw new Error(`Seed asset was not found: ${fileName}`);
}

async function uploadFile(fileInfo, displayName) {
  return strapi.plugin('upload').service('upload').upload({
    files: fileInfo,
    data: {
      fileInfo: {
        alternativeText: displayName,
        caption: displayName,
        name: displayName,
      },
    },
  });
}

async function ensureUploadedAsset(fileName) {
  const fileBaseName = path.parse(fileName).name;
  const existingFile = await strapi.query('plugin::upload.file').findOne({
    where: { name: fileBaseName },
  });

  if (existingFile) {
    return existingFile;
  }

  const absolutePath = resolveAssetPath(fileName);
  const [uploadedFile] = await uploadFile(getFileInfo(absolutePath, fileName), fileBaseName);
  return uploadedFile;
}

async function ensureUploadedAssets(fileNames) {
  const files = [];

  for (const fileName of fileNames) {
    files.push(await ensureUploadedAsset(fileName));
  }

  return files;
}

async function ensurePublicPermissions() {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    throw new Error('Public role was not found');
  }

  for (const [controller, actions] of Object.entries(PUBLIC_PERMISSIONS)) {
    for (const action of actions) {
      const permissionAction = `api::${controller}.${controller}.${action}`;
      const existingPermission = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({
          where: {
            role: publicRole.id,
            action: permissionAction,
          },
        });

      if (!existingPermission) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            role: publicRole.id,
            action: permissionAction,
          },
        });
      }
    }
  }
}

async function findFirstDocument(uid, params = {}) {
  return strapi.documents(uid).findFirst(params);
}

async function publishDocument(uid, documentId) {
  try {
    await strapi.documents(uid).publish({ documentId });
  } catch (error) {
    const message = String(error?.message || '');
    if (!message.includes('published')) {
      throw error;
    }
  }
}

async function upsertSingleType(uid, data) {
  const existing = await findFirstDocument(uid);

  if (existing) {
    return strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
    });
  }

  return strapi.documents(uid).create({ data });
}

async function upsertCollectionType(uid, filters, data, { publish = false } = {}) {
  const existing = await findFirstDocument(uid, { filters });

  if (existing) {
    const updated = await strapi.documents(uid).update({
      documentId: existing.documentId,
      data,
    });

    if (publish) {
      await publishDocument(uid, updated.documentId);
    }

    return updated;
  }

  const created = await strapi.documents(uid).create({ data });

  if (publish) {
    await publishDocument(uid, created.documentId);
  }

  return created;
}

function getNewsBody(title, highlights) {
  return [
    heading(2, title),
    paragraph(
      'Команда гімназії продовжує розвивати безпечне, сучасне та дружнє середовище для учнів, батьків і педагогів.'
    ),
    bulletList(highlights),
    quote('Разом ми будуємо школу, у якій хочеться вчитися, працювати й повертатися.'),
  ];
}

function getTeacherBio(role, focusPoints) {
  return [
    heading(3, role),
    paragraph(
      'Працює над тим, щоб учні отримували не лише сильні знання, а й відчували підтримку, довіру та простір для розвитку.'
    ),
    bulletList(focusPoints),
  ];
}

function getPageBody(title, paragraphs, listItems = []) {
  const blocks = [heading(2, title), ...paragraphs.map(paragraph)];
  if (listItems.length > 0) {
    blocks.push(bulletList(listItems));
  }
  return blocks;
}

async function seedGlobalContent(assets) {
  await upsertSingleType('api::global.global', {
    siteName: SCHOOL_NAME,
    siteDescription:
      'Офіційний сайт Коростишівської гімназії №1: новини, події, педагогічний склад, освітні програми та інформація для батьків.',
    favicon: assets.logo,
    defaultSeo: {
      metaTitle: `${SCHOOL_NAME} | Офіційний сайт`,
      metaDescription:
        'Сучасна гімназія з акцентом на якісну освіту, цифрові навички, партнерство з батьками та активне шкільне життя.',
      shareImage: assets.campus,
    },
  });

  await upsertSingleType('api::header.header', {
    title: SCHOOL_NAME,
    subtitle: 'Навчаємо з повагою, розвиваємо з довірою',
    logo: assets.logo,
    announcement_bar_text:
      'Триває набір учнів до 1-х та 5-х класів на 2026/2027 навчальний рік.',
    navigation: [
      {
        title: 'Про гімназію',
        link: '/pro-gimnaziyu',
        submenu: [
          { text: 'Історія', link: '/istoriya' },
          { text: 'Місія та цінності', link: '/misiya-ta-cinnosti' },
          { text: 'Структура', link: '/struktura' },
        ],
      },
      {
        title: 'Освітній процес',
        link: '/osvitnij-proces',
        submenu: [
          { text: 'Початкова школа', link: '/pochatkova-shkola' },
          { text: 'Базова школа', link: '/bazova-shkola' },
          { text: 'Гуртки та секції', link: '/gurtki-ta-sekciyi' },
        ],
      },
      { title: 'Новини', link: '/news' },
      { title: 'Події', link: '/events' },
      { title: 'Педагогічний склад', link: '/teachers' },
      { title: 'Вступникам', link: '/vstupnykam' },
    ],
    social: [
      { link: 'https://facebook.com/kor-gymnasium-1', icon: assets.facebook },
      { link: 'https://instagram.com/kor.gymnasium.1', icon: assets.instagram },
      { link: 'https://youtube.com/@kor-gymnasium-1', icon: assets.youtube },
    ],
  });

  await upsertSingleType('api::footer.footer', {
    title: SCHOOL_NAME,
    subtitle:
      'Комунальний заклад загальної середньої освіти, відкритий до співпраці з батьками, громадою та майбутніми учнями.',
    logo: assets.logo,
    contacts: {
      heading: 'Контакти',
      items: [
        {
          label: 'Адреса',
          value: 'вул. Героїв Небесної Сотні, 18, м. Коростишів, Житомирська область',
          icon: assets.location,
        },
        {
          label: 'Телефон',
          value: '+380 (4147) 5-12-34',
          icon: assets.phone,
        },
        {
          label: 'Email',
          value: 'office@gymnasium1-kor.school.ua',
          icon: assets.mail,
        },
      ],
    },
    nav_columns: [
      {
        heading: 'Школа',
        items: [
          { text: 'Про гімназію', link: '/pro-gimnaziyu' },
          { text: 'Історія', link: '/istoriya' },
          { text: 'Структура', link: '/struktura' },
        ],
      },
      {
        heading: 'Освітній процес',
        items: [
          { text: 'Початкова школа', link: '/pochatkova-shkola' },
          { text: 'Базова школа', link: '/bazova-shkola' },
          { text: 'Гуртки та секції', link: '/gurtki-ta-sekciyi' },
        ],
      },
      {
        heading: 'Актуальне',
        items: [
          { text: 'Новини', link: '/news' },
          { text: 'Події', link: '/events' },
          { text: 'Вступникам', link: '/vstupnykam' },
        ],
      },
    ],
    copyright: `© 2026 ${SCHOOL_NAME}. Усі права захищено.`,
  });
}

async function seedCategories() {
  const categories = [
    { name: 'Оголошення', slug: 'announcements' },
    { name: 'Досягнення', slug: 'achievements' },
    { name: 'Освітній процес', slug: 'education-process' },
    { name: 'Шкільне життя', slug: 'school-life' },
  ];

  const result = {};

  for (const category of categories) {
    result[category.slug] = await upsertCollectionType(
      'api::category.category',
      { slug: { $eq: category.slug } },
      category
    );
  }

  return result;
}

async function seedStaff(assets) {
  const staffItems = [
    {
      name: 'Олена Миколаївна Шевчук',
      slug: 'olena-shevchuk',
      role: 'Директорка гімназії',
      email: 'director@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-30',
      photo: assets.campus,
      weight: 100,
      bio: getTeacherBio('Директорка гімназії', [
        'Стратегічний розвиток закладу та команда вчителів',
        'Партнерство з батьками та громадою міста',
        'Упровадження сучасних освітніх практик',
      ]),
    },
    {
      name: 'Сергій Іванович Мельник',
      slug: 'sergii-melnyk',
      role: 'Заступник директора з навчальної роботи',
      email: 'deputy@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-31',
      photo: assets.assembly,
      weight: 95,
      bio: getTeacherBio('Заступник директора', [
        'Організація розкладу та навчального навантаження',
        'Супровід внутрішньої системи якості освіти',
        'Координація предметних методичних об’єднань',
      ]),
    },
    {
      name: 'Ірина Василівна Коваль',
      slug: 'iryna-koval',
      role: 'Практична психологиня',
      email: 'psychologist@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-32',
      photo: assets.library,
      weight: 90,
      bio: getTeacherBio('Практична психологиня', [
        'Підтримка адаптації учнів 1-х і 5-х класів',
        'Психологічні консультації для родин',
        'Профілактика емоційного вигорання та булінгу',
      ]),
    },
    {
      name: 'Марія Петрівна Онищук',
      slug: 'mariia-onyshchuk',
      role: 'Педагог-організатор',
      email: 'organizer@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-33',
      photo: assets.news2,
      weight: 85,
      bio: getTeacherBio('Педагог-організатор', [
        'Учнівське самоврядування та волонтерські ініціативи',
        'Свята, тематичні дні та благодійні ярмарки',
        'Підтримка позакласних проєктів і клубів',
      ]),
    },
    {
      name: 'Наталія Володимирівна Бондар',
      slug: 'nataliia-bondar',
      role: 'Учителька української мови та літератури',
      email: 'ukrlit@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-34',
      photo: assets.lessons,
      weight: 80,
      bio: getTeacherBio('Учителька української мови та літератури', [
        'Підготовка до олімпіад і мовних конкурсів',
        'Розвиток читацької культури та медіаграмотності',
        'Проєктні роботи й шкільний дебатний клуб',
      ]),
    },
    {
      name: 'Андрій Олегович Ткачук',
      slug: 'andrii-tkachuk',
      role: 'Учитель інформатики',
      email: 'it@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-35',
      photo: assets.computerLab,
      weight: 78,
      bio: getTeacherBio('Учитель інформатики', [
        'Основи програмування та цифрової безпеки',
        'Підготовка до STEM-конкурсів та хакатонів',
        'Супровід шкільного медіацентру',
      ]),
    },
    {
      name: 'Світлана Анатоліївна Гуменюк',
      slug: 'svitlana-humeniuk',
      role: 'Учителька початкових класів',
      email: 'primary@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-36',
      photo: assets.news7,
      weight: 76,
      bio: getTeacherBio('Учителька початкових класів', [
        'Адаптація першокласників до шкільного середовища',
        'Інтегровані уроки та формувальне оцінювання',
        'Тісна співпраця з батьками молодших школярів',
      ]),
    },
    {
      name: 'Дмитро Романович Лисенко',
      slug: 'dmytro-lysenko',
      role: 'Учитель фізичної культури',
      email: 'sport@gymnasium1-kor.school.ua',
      phone: '+380 (67) 100-20-37',
      photo: assets.news8,
      weight: 72,
      bio: getTeacherBio('Учитель фізичної культури', [
        'Шкільні спортивні турніри та секції',
        'Підготовка команд до районних змагань',
        'Популяризація активного способу життя',
      ]),
    },
  ];

  const staffBySlug = {};

  for (const item of staffItems) {
    const entry = await upsertCollectionType(
      'api::stuff-member.stuff-member',
      { slug: { $eq: item.slug } },
      item,
      { publish: true }
    );

    staffBySlug[item.slug] = entry;
  }

  return staffBySlug;
}

async function seedHomepage(assets, staffBySlug) {
  const contactPeople = [
    staffBySlug['olena-shevchuk'],
    staffBySlug['sergii-melnyk'],
    staffBySlug['iryna-koval'],
    staffBySlug['mariia-onyshchuk'],
  ].filter(Boolean);

  await upsertSingleType('api::homepage.homepage', {
    Hero: {
      title: `${SCHOOL_NAME} [простір росту, знань і довіри]`,
      subtitle:
        'Поєднуємо сильну академічну підготовку, безпечне середовище та активне шкільне життя для учнів 1-9 класів.',
      image: assets.hero,
      buttons: [
        { text: 'Переглянути новини', link: '/news', button_type: 'primary' },
        { text: 'Зв’язатися з нами', link: '#contacts', button_type: 'outline' },
      ],
      stats: [
        { value: '520+', text: 'учнів', align: 'left', image: assets.students },
        { value: '42', text: 'педагоги', align: 'center', image: assets.teachers },
        { value: '18', text: 'гуртків', align: 'right', image: assets.clubs },
      ],
      bottom_button_text: 'Дізнайтесь більше',
    },
    About: {
      title: 'Гімназія, де навчання має сенс',
      body:
        'Коростишівська гімназія №1 працює як відкрита та сучасна школа для дітей, які хочуть вчитися із зацікавленням.\nМи поєднуємо академічну вимогливість, людяну атмосферу та багато можливостей для розвитку в навчанні, спорті й творчості.\nКоманда закладу підтримує партнерство з батьками та містом, щоб школа була важливим центром громади.',
      advantages: [
        { text: 'Сильні предметні команди та сучасні підходи до навчання' },
        { text: 'Безпечне середовище та психологічна підтримка учнів' },
        { text: 'Активне шкільне життя: клуби, проєкти, конкурси та події' },
      ],
      image: assets.about,
      image_title: 'Школа, у якій помічають кожного',
      image_text: 'Підтримуємо ініціативу, діалог і відповідальність.',
    },
    Stats: {
      title: 'Гімназія в цифрах',
      items: [
        { value: '520+', text: 'учнів навчаються щороку', align: 'center', image: assets.students },
        { value: '42', text: 'педагогічні працівники', align: 'center', image: assets.teachers },
        { value: '93%', text: 'учнів залучені до позакласної діяльності', align: 'center', image: assets.clubs },
        { value: '28', text: 'перемог у конкурсах та олімпіадах за рік', align: 'center', image: assets.awards },
      ],
    },
    News: {
      title: 'Останні новини',
      subtitle: 'Події, досягнення та важливі оголошення зі шкільного життя.',
      all_link_label: 'Усі новини',
      limit: 3,
    },
    Events: {
      title: 'Найближчі події',
      subtitle: 'Занотуйте важливі дати та долучайтеся до життя гімназії.',
      all_link_label: 'Усі події',
      limit: 4,
    },
    Contacts: {
      title: 'Завітайте або напишіть нам',
      subtitle:
        'Ми відкриті до діалогу з батьками, майбутніми учнями, випускниками та партнерами школи.',
      contact_persons: {
        connect: contactPeople.map((person) => ({ id: person.id })),
      },
      info_title: 'Як нас знайти',
      info_items: [
        {
          label: 'Адреса',
          value: 'вул. Героїв Небесної Сотні, 18\nм. Коростишів, Житомирська область',
          icon: assets.location,
        },
        {
          label: 'Телефон приймальні',
          value: '+380 (4147) 5-12-34',
          icon: assets.phone,
        },
        {
          label: 'Email',
          value: 'office@gymnasium1-kor.school.ua',
          icon: assets.mail,
        },
      ],
      map_embed_url:
        'https://www.google.com/maps?q=Коростишів&z=14&output=embed',
    },
  });
}

async function seedNews(categories, assets) {
  const newsPosts = [
    {
      title: 'Гімназія відкрила STEM-лабораторію для учнів 5-9 класів',
      slug: 'stem-laboratory-opening',
      date: '2026-05-06',
      category: categories['education-process'],
      main_photo: assets.computerLab,
      photos: [assets.computerLab, assets.news6, assets.news7],
      body: getNewsBody('Нове навчальне середовище', [
        'Облаштовано 12 сучасних робочих місць',
        'Запущено модулі з робототехніки та 3D-моделювання',
        'Перші інтегровані заняття стартують уже цього місяця',
      ]),
    },
    {
      title: 'Команда гімназії перемогла у міському турнірі з волейболу',
      slug: 'volleyball-city-tournament-win',
      date: '2026-04-28',
      category: categories.achievements,
      main_photo: assets.news8,
      photos: [assets.news8, assets.news2],
      body: getNewsBody('Спортивна перемога', [
        'Збірна показала сильну командну гру у фіналі',
        'Кращим гравцем визнано учня 9-Б класу',
        'Тренерську підтримку забезпечив учитель фізкультури',
      ]),
    },
    {
      title: 'Оприлюднено графік співбесід для майбутніх першокласників',
      slug: 'first-grade-interview-schedule',
      date: '2026-04-21',
      category: categories.announcements,
      main_photo: assets.classroom,
      photos: [assets.classroom],
      body: getNewsBody('Набір до 1 класу', [
        'Співбесіди відбуватимуться у дві хвилі протягом травня',
        'Для запису потрібно заповнити електронну форму',
        'Консультації проводить адміністрація та психологиня',
      ]),
    },
    {
      title: 'Учні 8-х класів презентували дослідницькі мініпроєкти з історії міста',
      slug: 'city-history-student-projects',
      date: '2026-03-30',
      category: categories['school-life'],
      main_photo: assets.news3,
      photos: [assets.news3, assets.news4],
      body: getNewsBody('Навчання через дослідження', [
        'Школярі працювали з архівними матеріалами та спогадами мешканців',
        'Презентації поєднали історію, медіа та краєзнавство',
        'Найкращі роботи буде представлено на міському форумі',
      ]),
    },
    {
      title: 'У гімназії стартував тиждень української мови та читання',
      slug: 'ukrainian-language-week',
      date: '2026-03-12',
      category: categories['education-process'],
      main_photo: assets.lessons,
      photos: [assets.lessons, assets.news1],
      body: getNewsBody('Мова як простір спільності', [
        'Заплановано диктант єдності, читацький марафон і дебати',
        'Учні 5-9 класів підготували тематичні постери та буклети',
        'Бібліотека презентувала нову добірку сучасної української літератури',
      ]),
    },
    {
      title: 'Батьківська зустріч щодо адаптації учнів 5-х класів пройшла в інтерактивному форматі',
      slug: 'fifth-grade-parent-meeting',
      date: '2026-02-24',
      category: categories.announcements,
      main_photo: assets.news5,
      photos: [assets.news5],
      body: getNewsBody('Підтримка під час переходу до базової школи', [
        'Психологиня поділилася інструментами м’якої адаптації',
        'Класні керівники окреслили академічні очікування',
        'Батьки отримали добірку рекомендацій для домашньої підтримки',
      ]),
    },
    {
      title: 'Шкільний медіацентр випустив перший подкаст про цифрову безпеку',
      slug: 'school-podcast-digital-safety',
      date: '2026-02-10',
      category: categories['school-life'],
      main_photo: assets.computerLab,
      photos: [assets.computerLab, assets.news6],
      body: getNewsBody('Голос учнів про важливе', [
        'Подкаст записали учні 8-9 класів разом з учителем інформатики',
        'Перший випуск присвячено приватності в соцмережах',
        'Наступні серії стосуватимуться медіаграмотності та ШІ',
      ]),
    },
    {
      title: 'Гімназія отримала відзнаку за волонтерський ярмарок',
      slug: 'volunteer-fair-award',
      date: '2026-01-27',
      category: categories.achievements,
      main_photo: assets.news2,
      photos: [assets.news2, assets.news4],
      body: getNewsBody('Відзначення громади', [
        'Під час ярмарку вдалося зібрати кошти на потреби військових',
        'До організації долучилися класи, батьки та випускники',
        'Відзнаку вручено за системну громадянську активність учнів',
      ]),
    },
    {
      title: 'Розпочато серію консультацій для дев’ятикласників щодо профорієнтації',
      slug: 'career-guidance-for-ninth-graders',
      date: '2025-12-15',
      category: categories['education-process'],
      main_photo: assets.library,
      photos: [assets.library],
      body: getNewsBody('Осмислений вибір майбутнього', [
        'Учні проходять діагностичні опитування та індивідуальні консультації',
        'Заплановано зустрічі з представниками коледжів та ліцеїв',
        'Родини отримають поради щодо освітніх траєкторій після 9 класу',
      ]),
    },
    {
      title: 'У гімназії оновили простір бібліотеки та читальної зали',
      slug: 'library-space-renovation',
      date: '2025-11-20',
      category: categories['school-life'],
      main_photo: assets.library,
      photos: [assets.library, assets.about],
      body: getNewsBody('Нове місце для читання і тиші', [
        'З’явилися мобільні полиці та м’які зони для групової роботи',
        'Фонд поповнено сучасною українською літературою',
        'Простір відкритий для читацьких клубів та тихих занять після уроків',
      ]),
    },
    {
      title: 'Учениця 7-А класу виборола призове місце на обласній олімпіаді',
      slug: 'regional-olympiad-prize',
      date: '2025-10-08',
      category: categories.achievements,
      main_photo: assets.news1,
      photos: [assets.news1, assets.news7],
      body: getNewsBody('Предметна олімпіада', [
        'Учениця гідно представила школу на обласному етапі',
        'Підготовку супроводжувала команда вчителів-філологів',
        'Досягнення стало результатом системної роботи протягом року',
      ]),
    },
    {
      title: 'Оновлено правила безпечної поведінки та маршрути евакуації',
      slug: 'updated-safety-rules',
      date: '2025-09-02',
      category: categories.announcements,
      main_photo: assets.building,
      photos: [assets.building],
      body: getNewsBody('Безпека як щоденна практика', [
        'Проведено повторні інструктажі для класів і працівників',
        'На поверхах розміщено оновлені схеми евакуації',
        'Протягом вересня відбудуться тренувальні відпрацювання',
      ]),
    },
  ];

  for (const post of newsPosts) {
    await upsertCollectionType(
      'api::news-post.news-post',
      { slug: { $eq: post.slug } },
      {
        title: post.title,
        slug: post.slug,
        date: post.date,
        category: { connect: [{ id: post.category.id }] },
        body: post.body,
        main_photo: post.main_photo,
        photos: post.photos,
      },
      { publish: true }
    );
  }
}

async function seedEvents() {
  const events = [
    {
      title: 'День відкритих дверей для майбутніх п’ятикласників',
      slug: 'open-day-for-fifth-graders',
      date: '2026-05-20T15:00:00.000Z',
      end_date: '2026-05-20T17:00:00.000Z',
      location: 'Актова зала',
      body: getNewsBody('Знайомство з гімназією', [
        'Презентація освітніх можливостей та гуртків',
        'Екскурсія кабінетами і STEM-простором',
        'Зустріч із педагогами та адміністрацією',
      ]),
    },
    {
      title: 'Психологічний тренінг для батьків “Підтримка під час іспитів”',
      slug: 'parent-training-exam-support',
      date: '2026-05-27T14:30:00.000Z',
      end_date: '2026-05-27T16:00:00.000Z',
      location: 'Кабінет психолога',
      body: getNewsBody('Поради для родин', [
        'Як знизити тривожність у дітей напередодні контрольних',
        'Як говорити про оцінки без тиску',
        'Які щоденні звички підтримують стійкість дитини',
      ]),
    },
    {
      title: 'Благодійний ярмарок учнівського самоврядування',
      slug: 'charity-fair',
      date: '2026-06-03T09:00:00.000Z',
      end_date: '2026-06-03T13:00:00.000Z',
      location: 'Шкільне подвір’я',
      body: getNewsBody('Подія для всієї громади', [
        'Продаж виробів, випічки та сувенірів учнівських команд',
        'Музична програма та виставка творчих робіт',
        'Усі зібрані кошти будуть спрямовані на шкільні ініціативи',
      ]),
    },
    {
      title: 'Фестиваль шкільних проєктів “Ідея змінює місто”',
      slug: 'school-project-festival',
      date: '2026-06-12T10:00:00.000Z',
      end_date: '2026-06-12T12:30:00.000Z',
      location: 'Медіацентр',
      body: getNewsBody('Презентація учнівських ідей', [
        'Команди представлять соціальні, екологічні та цифрові проєкти',
        'До журі долучаться батьки та партнери громади',
        'Найкращі ідеї отримають менторську підтримку',
      ]),
    },
    {
      title: 'Зустріч випускників та вчителів',
      slug: 'alumni-meeting',
      date: '2026-03-18T16:00:00.000Z',
      end_date: '2026-03-18T18:00:00.000Z',
      location: 'Актова зала',
      body: getNewsBody('Традиційна подія', [
        'Живі історії випускників про навчання й професійний шлях',
        'Фотовиставка та екскурсія оновленими просторами гімназії',
        'Неформальна розмова поколінь у стінах школи',
      ]),
    },
    {
      title: 'Міський етап олімпіади з математики',
      slug: 'city-math-olympiad',
      date: '2026-02-14T08:30:00.000Z',
      end_date: '2026-02-14T13:00:00.000Z',
      location: 'Кабінети 21-24',
      body: getNewsBody('Інтелектуальне змагання', [
        'Учасники змагатимуться в індивідуальному форматі',
        'Команда школи проходитиме заключний тренувальний інтенсив',
        'Результати буде оголошено того ж тижня',
      ]),
    },
    {
      title: 'Зимовий турнір з футзалу',
      slug: 'winter-futsal-tournament',
      date: '2026-01-22T11:00:00.000Z',
      end_date: '2026-01-22T14:00:00.000Z',
      location: 'Спортивна зала',
      body: getNewsBody('Спорт і командний дух', [
        'Участь беруть збірні 7-9 класів',
        'Передбачено окремий конкурс для вболівальників',
        'Переможці представлятимуть школу на районних змаганнях',
      ]),
    },
    {
      title: 'Різдвяний концерт та ярмарок',
      slug: 'christmas-concert-and-fair',
      date: '2025-12-19T15:00:00.000Z',
      end_date: '2025-12-19T18:00:00.000Z',
      location: 'Актова зала',
      body: getNewsBody('Святкова подія', [
        'Концертна програма від класів та вокальних гуртів',
        'Благодійний ярмарок на підтримку шкільних потреб',
        'Сімейний формат для батьків і друзів школи',
      ]),
    },
    {
      title: 'Осінній День здоров’я',
      slug: 'autumn-health-day',
      date: '2025-10-03T09:00:00.000Z',
      end_date: '2025-10-03T12:00:00.000Z',
      location: 'Стадіон та подвір’я',
      body: getNewsBody('Активності на свіжому повітрі', [
        'Естафети, командні ігри та рухливі станції',
        'Окремі активності для молодших і старших класів',
        'Мета події — популяризація здорового способу життя',
      ]),
    },
    {
      title: 'Вереснева посвята першокласників у школярі',
      slug: 'first-graders-initiation',
      date: '2025-09-12T10:00:00.000Z',
      end_date: '2025-09-12T11:30:00.000Z',
      location: 'Шкільне подвір’я',
      body: getNewsBody('Теплий старт шкільного шляху', [
        'Святковий сценарій від педагогів та старшокласників',
        'Подарунки для нових учнів від гімназійної спільноти',
        'Неформальне знайомство родин із класними керівниками',
      ]),
    },
  ];

  for (const event of events) {
    await upsertCollectionType(
      'api::event-post.event-post',
      { slug: { $eq: event.slug } },
      event,
      { publish: true }
    );
  }
}

async function seedPages(assets) {
  const pages = [
    {
      title: 'Про гімназію',
      slug: 'pro-gimnaziyu',
      subtitle: 'Хто ми, як працюємо і що цінуємо у щоденній шкільній практиці.',
      background_image: assets.campus,
      layout: 'col-8-4',
      reverse_cols_on_mobile: false,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Школа, яка тримає баланс між вимогливістю й підтримкою',
            [
              'Коростишівська гімназія №1 є закладом, де освітній процес будується навколо поваги до дитини, сильної предметної підготовки та відкритого діалогу.',
              'Ми розвиваємо академічні, соціальні та цифрові компетентності, щоб учні були готові до навчання, співпраці та відповідального вибору.',
            ],
            [
              'Партнерство з батьками та громадою',
              'Сучасні методики і проєктне навчання',
              'Шкільне середовище без зайвого формалізму',
            ]
          )
        ),
        accordionBlock('Часті запитання', [
          accordionItem(
            'Які класи навчаються в гімназії?',
            [paragraph('У закладі навчаються учні 1-9 класів, з окремими освітніми акцентами для початкової та базової школи.')],
            true
          ),
          accordionItem(
            'Чи є гуртки після уроків?',
            [paragraph('Так, учні можуть відвідувати спортивні секції, творчі студії, мовний клуб, медіацентр та STEM-гуртки.')],
            false
          ),
        ]),
      ],
      right_col_blocks: [
        mediaBlock(assets.about),
        buttonLinkBlock('Переглянути новини школи', '/news', {
          variant: 'outline',
          size: 'full',
        }),
      ],
    },
    {
      title: 'Історія',
      slug: 'istoriya',
      subtitle: 'Короткий погляд на шлях розвитку закладу та його роль у громаді.',
      background_image: assets.assembly,
      layout: 'col-12',
      reverse_cols_on_mobile: false,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Від традиції до сучасності',
            [
              'Гімназія розвивалася разом із містом і завжди залишалася місцем, де вчителі та родини будували довіру навколо освіти.',
              'Сьогодні заклад поєднує сильні педагогічні традиції з новими підходами до навчання, цифровими інструментами та сучасною комунікацією.',
            ]
          )
        ),
        mediaBlock(assets.assembly),
      ],
    },
    {
      title: 'Місія та цінності',
      slug: 'misiya-ta-cinnosti',
      subtitle: 'Принципи, на яких ґрунтується наше навчальне та виховне середовище.',
      background_image: assets.hero,
      layout: 'col-6-6',
      reverse_cols_on_mobile: true,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Наша місія',
            [
              'Створювати школу, у якій дитина зростає в безпечному середовищі, навчається мислити самостійно та відчуває відповідальність за себе й спільноту.',
            ]
          )
        ),
        accordionBlock('Наші цінності', [
          accordionItem('Повага', [paragraph('Ми будуємо комунікацію без приниження, з увагою до гідності кожного учня та дорослого.')], true),
          accordionItem('Відповідальність', [paragraph('Домовленості, правила і спільні рішення мають вагу для всієї шкільної спільноти.')]),
          accordionItem('Розвиток', [paragraph('Навчання триває не лише на уроці, а й у проєктах, діалозі, рефлексії та практиці.')]),
        ]),
      ],
      right_col_blocks: [
        mediaBlock(assets.hero),
      ],
    },
    {
      title: 'Структура',
      slug: 'struktura',
      subtitle: 'Як організована робота гімназії та хто відповідає за ключові напрямки.',
      background_image: assets.building,
      layout: 'col-9-3',
      reverse_cols_on_mobile: false,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Організаційна структура',
            [
              'Управління закладом забезпечують директорка, адміністративна команда, педагогічна рада, класні керівники та спеціалісти служби підтримки.',
              'Кожен напрямок має зрозумілу відповідальність: навчальна робота, виховні ініціативи, психологічний супровід, цифровий розвиток та комунікація з батьками.',
            ],
            [
              'Адміністрація',
              'Предметні методичні об’єднання',
              'Класні керівники',
              'Психологічна служба',
            ]
          )
        ),
      ],
      right_col_blocks: [
        buttonLinkBlock('Перейти до педагогічного складу', '/teachers', {
          variant: 'secondary',
          size: 'full',
        }),
      ],
    },
    {
      title: 'Освітній процес',
      slug: 'osvitnij-proces',
      subtitle: 'Підходи до навчання, оцінювання та розвитку учнів протягом року.',
      background_image: assets.classroom,
      layout: 'col-6-6',
      reverse_cols_on_mobile: false,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Як ми навчаємо',
            [
              'Освітній процес поєднує традиційну предметну основу, міжпредметні зв’язки, практичні кейси та роботу в командах.',
              'Вчителі використовують формувальне оцінювання, щоб учні розуміли свій прогрес і бачили конкретні кроки для зростання.',
            ],
            [
              'Компетентнісний підхід',
              'Проєктна діяльність',
              'Цифрові інструменти та медіаграмотність',
            ]
          )
        ),
      ],
      right_col_blocks: [
        mediaBlock(assets.classroom),
        buttonLinkBlock('Переглянути шкільні події', '/events', {
          variant: 'outline',
          size: 'full',
        }),
      ],
    },
    {
      title: 'Початкова школа',
      slug: 'pochatkova-shkola',
      subtitle: 'Плавний старт навчання, адаптація та розвиток базових навичок.',
      background_image: assets.news7,
      layout: 'col-12',
      reverse_cols_on_mobile: false,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Перші кроки в навчанні',
            [
              'Початкова школа фокусується на адаптації, читацькій грамотності, розвитку мовлення, емоційній стійкості та позитивному досвіді навчання.',
              'У центрі уваги — ритм дитини, підтримка родини та послідовне формування навчальної самостійності.',
            ]
          )
        ),
      ],
    },
    {
      title: 'Базова школа',
      slug: 'bazova-shkola',
      subtitle: 'Поглиблення знань, відповідальність та підготовка до вибору майбутньої траєкторії.',
      background_image: assets.news6,
      layout: 'col-8-4',
      reverse_cols_on_mobile: false,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Навчання у 5-9 класах',
            [
              'Базова школа допомагає учням перейти від загальної адаптації до усвідомленого навчання, командної роботи та професійного самовизначення.',
              'Саме тут особливо важливими стають проєкти, предметні конкурси, ініціативність та навички роботи з інформацією.',
            ]
          )
        ),
      ],
      right_col_blocks: [
        mediaBlock(assets.news6),
      ],
    },
    {
      title: 'Гуртки та секції',
      slug: 'gurtki-ta-sekciyi',
      subtitle: 'Позакласні можливості для спорту, творчості, медіа та технологій.',
      background_image: assets.news8,
      layout: 'col-9-3',
      reverse_cols_on_mobile: true,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Розвиток після уроків',
            [
              'Позакласна діяльність у гімназії допомагає учням відкривати інтереси, пробувати нові ролі та вчитися взаємодії в командах.',
            ],
            [
              'Волейбол і футзал',
              'Медіацентр та подкаст-студія',
              'Мовний клуб',
              'Театральна студія',
              'STEM-гурток',
            ]
          )
        ),
      ],
      right_col_blocks: [
        buttonLinkBlock('Поставити запитання адміністрації', '#contacts', {
          variant: 'link',
          size: 'full',
          align: 'center',
        }),
      ],
    },
    {
      title: 'Вступникам',
      slug: 'vstupnykam',
      subtitle: 'Що потрібно знати родинам, які планують навчання дитини в нашій гімназії.',
      background_image: assets.campus,
      layout: 'col-8-4',
      reverse_cols_on_mobile: false,
      left_col_blocks: [
        richTextBlock(
          getPageBody(
            'Як долучитися до спільноти гімназії',
            [
              'Для вступу до 1-х та 5-х класів школа проводить попереднє знайомство з родинами, консультації та інформує про етапи подачі документів.',
              'Ми прагнемо зробити цей процес спокійним і зрозумілим, тому надаємо супровід на кожному кроці.',
            ],
            [
              'Подати заяву до приймальні або електронною поштою',
              'Уточнити перелік документів у адміністрації',
              'Відвідати День відкритих дверей або індивідуальну зустріч',
            ]
          )
        ),
        buttonLinkBlock('Написати листа до приймальні', 'mailto:office@gymnasium1-kor.school.ua', {
          variant: 'default',
          size: 'auto',
        }),
      ],
      right_col_blocks: [
        accordionBlock('Що підготувати батькам', [
          accordionItem('Для попередньої консультації', [paragraph('Підготуйте коротку інформацію про дитину, її інтереси та очікування від навчання в гімназії.')], true),
          accordionItem('Для подачі документів', [paragraph('Адміністрація надасть актуальний перелік документів та терміни прийому під час консультації.')]),
        ]),
      ],
    },
  ];

  for (const page of pages) {
    await upsertCollectionType(
      'api::page.page',
      { slug: { $eq: page.slug } },
      page,
      { publish: true }
    );
  }
}

async function seedSchoolWebsite() {
  console.log(`Seeding content for ${SCHOOL_NAME}...`);

  ensureGeneratedAssets();
  await ensurePublicPermissions();

  const [
    logo,
    hero,
    about,
    campus,
    assembly,
    lessons,
    building,
    library,
    classroom,
    computerLab,
    news1,
    news2,
    news3,
    news4,
    news5,
    news6,
    news7,
    news8,
    facebook,
    instagram,
    youtube,
    location,
    phone,
    mail,
    students,
    teachers,
    awards,
    clubs,
  ] = await ensureUploadedAssets([
    LOCAL_MEDIA_FILES.logo,
    LOCAL_MEDIA_FILES.hero,
    LOCAL_MEDIA_FILES.about,
    LOCAL_MEDIA_FILES.campus,
    LOCAL_MEDIA_FILES.assembly,
    LOCAL_MEDIA_FILES.lessons,
    LOCAL_MEDIA_FILES.building,
    LOCAL_MEDIA_FILES.library,
    LOCAL_MEDIA_FILES.classroom,
    LOCAL_MEDIA_FILES.computerLab,
    LOCAL_MEDIA_FILES.news1,
    LOCAL_MEDIA_FILES.news2,
    LOCAL_MEDIA_FILES.news3,
    LOCAL_MEDIA_FILES.news4,
    LOCAL_MEDIA_FILES.news5,
    LOCAL_MEDIA_FILES.news6,
    LOCAL_MEDIA_FILES.news7,
    LOCAL_MEDIA_FILES.news8,
    'facebook-seed.svg',
    'instagram-seed.svg',
    'youtube-seed.svg',
    'location-seed.svg',
    'phone-seed.svg',
    'mail-seed.svg',
    'students-seed.svg',
    'teachers-seed.svg',
    'awards-seed.svg',
    'clubs-seed.svg',
  ]);

  const assets = {
    logo,
    hero,
    about,
    campus,
    assembly,
    lessons,
    building,
    library,
    classroom,
    computerLab,
    news1,
    news2,
    news3,
    news4,
    news5,
    news6,
    news7,
    news8,
    facebook,
    instagram,
    youtube,
    location,
    phone,
    mail,
    students,
    teachers,
    awards,
    clubs,
  };

  await seedGlobalContent(assets);
  const categories = await seedCategories();
  const staffBySlug = await seedStaff(assets);
  await seedHomepage(assets, staffBySlug);
  await seedNews(categories, assets);
  await seedEvents();
  await seedPages(assets);

  console.log(`Seed for ${SCHOOL_NAME} completed.`);
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  try {
    await seedSchoolWebsite();
  } finally {
    await app.destroy();
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Seed failed.');
  console.error(error);
  process.exit(1);
});
