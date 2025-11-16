export function scanBanners() {
  // در محیط واقعی اینجا باید فایل‌های پوشه banners را اسکن کنیم
  // برای حالا یک لیست از بنرهای شناخته‌شده برمی‌گردانیم
  return [
    '3D Max سه بعدی سازی با.jpg',
    'access.png',
    'excel.png',
    'outlook.png',
    'power.png',
    'visio.png',
    'word.png',
    'ابزارهای هوش مصنوعی.jpg',
    'الگوریتم نویسی با هوش مصنوعی.jpg',
    'ایلاستریتور مقدماتی.jpg',
    'ایلاستریتور پیشرفته.jpg',
    'بازاریاب فروش.jpg',
    'بازی سازی با اسکرچ.jpg',
    'برنامه نویسی Java.jpg',
    'برنامه نویسی Python پیشرفته.jpg',
    'برنامه نویسی Python.jpg',
    'برنامه نویسی ارشد پیشرفته و کدزنی.jpg',
    'برنامه نویسی با Matlab.jpg',
    'برنامه نویسی وب مقدماتی.jpg',
    'بوت کمپ  PREMIERE.jpg',
    'بوت کمپ اختراعات.jpg',
    'بوت کمپ متاورس.jpg',
    'تایپ و تندزنی.jpg',
    'تدوین فیلم و صدا با SSP.jpg',
    'تصویر سازی و ساخت ویدیو.jpg',
    'تولید محتوا با موبایل و هوش مصنوعی.jpg',
    'تکنسین سخت افزار کامپیوتر.jpg',
    'حسابداری حقوق و دستمزد.jpg',
    'حسابداری عمومی مقدماتی.jpg',
    'حسابداری عمومی پیشرفته.jpg',
    'خلاقیت در صنعت تبلیغات.jpg',
    'داستان نویسی اسکرچ جونیور.jpg',
    'داشبورد مدیریت حرفه ای Power BI.jpg',
    'دوره Network+.jpg',
    'دوره اصول فنون مذاکره.jpg',
    'دوره جامع UI-UX.jpg',
    'دوره جامع اتوکد.jpg',
    'دوره جامع خلاقیت.jpg',
    'دوره جامع منابع انسانی.jpg',
    'دوره رباتیک مقدماتی.jpg',
    'دوره رباتیک پیشرفته.jpg',
    'دوره گرافیک دیزاین.jpg',
    'ساخت ربات و چت بات با هوش مصنوعی.jpg',
    'ساخت شبکه های خصوصی مجازی(vpn).jpg',
    'طراحی سایت فروشگاهی با برنامه نویسی.jpg',
    'طراحی سایت فروشگاهی با وردپرس.jpg',
    'طراحی فاکتور و حسابداری در Excel.jpg',
    'طراحی لوگو(تخصصی).jpg',
    'طراحی محصول و بسته بندی.jpg',
    'طراحی کتاب با  هوش مصنوعی.jpg',
    'عکاسی با موبایل و طراحی آلبوم محصول.jpg',
    'فتوشاپ مقدماتی.jpg',
    'فتوشاپ پیشرفته.jpg',
    'فروش بازاریابی.jpg',
    'لینوکس.jpg',
    'مدیر Seo.jpg',
    'مدیر تبلیغات و بازاریابی(کمپین تبلیغاتی).jpg',
    'مدیریت برند.jpg',
    'موشن پاور.jpg',
    'موشن گرافیک و طراح جلوه های ویژه.jpg',
    'نرم افزار حسابداری سپیدار.jpg',
    'نقاشی خلاقانه و پاسپارتو.jpg',
    'نویسندگی خلاق و کپی رایتینگ.jpg',
    'هوش تجاری با نرم افزار QlikView.jpg',
    'وبلاگ نویسی وبسایت.jpg',
    'ورد و اکسل مبتدی (خصوصی).jpg',
    'ورد و اکسل پیشرفته (خصوصی).jpg',
    'ویژه بازار کار.jpg',
    'کاربر icdl.jpg',
    'کارگاه کار افرینی.jpg',
    'کسب درآمد از یوتیوب.jpg',
    'کمپ جامع افترافکت.jpg',
    'کمپ جامع کورل.jpg',
    'کمپ گرافیک رایانه  Indesign.jpg'
  ]
}

export function findBannerForCourse(courseName, banners) {
  if (!courseName || !banners) return null
  
  // حذف پیشوندهای رایج برای تطابق بهتر
  const cleanName = courseName
    .replace(/^(دوره|کلاس|آموزش)\s*/i, '')
    .replace(/\s*(مقدماتی|پیشرفته|جامع|خصوصی)$/i, '')
    .trim()
  
  // جستجوی دقیق
  let match = banners.find(b => {
    const base = b.replace(/\.(jpg|jpeg|png|svg)$/i, '')
    return base === cleanName || base.includes(cleanName) || cleanName.includes(base)
  })
  
  if (match) return match
  
  // جستجوی نزدیک با حذف فاصله‌ها و نیم‌فاصله‌ها
  const normalized = cleanName.replace(/[\s\u200c]/g, '')
  match = banners.find(b => {
    const base = b.replace(/\.(jpg|jpeg|png|svg)$/i, '').replace(/[\s\u200c]/g, '')
    return base.includes(normalized) || normalized.includes(base)
  })
  
  return match || null
}

export function getBannerUrl(filename) {
  // در محیط واقعی اینجا باید URL صحیح تصویر را برگردانیم
  // برای حالا مسیر نسبی را برمی‌گردانیم
  return `/هزینه دوره ها/banners/${filename}`
}