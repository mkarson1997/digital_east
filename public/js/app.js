const dict = {
  ar: {
    navServices: 'الخدمات', navPortfolio: 'الأعمال', navTeam: 'الفريق', navBlog: 'المدونة', navContact: 'تواصل',
    tagline: 'وكالة تسويق وإعلان متقدمة', ctaStart: 'ابدأ مشروعك', ctaWork: 'شاهد أعمالنا', servicesTitle: 'الخدمات',
    portfolioTitle: 'البورتفوليو', portfolioDesc: 'دمج احترافي بين أعمال Abdulazizalsari و PR.',
    teamTitle: 'الفريق', blogTitle: 'المدونة', leadTitle: 'اطلب خدمة', leadDesc: 'ارسل طلبك وسيظهر في لوحة التحكم.',
    send: 'إرسال الطلب', contactInfo: 'معلومات التواصل', location: 'تركيا - قونيا', footerNote: 'هل أنت جاهز للانطلاق؟'
  },
  en: {
    navServices: 'Services', navPortfolio: 'Portfolio', navTeam: 'Team', navBlog: 'Blog', navContact: 'Contact',
    tagline: 'Advanced Marketing & Advertising Agency', ctaStart: 'Start Your Project', ctaWork: 'View Work', servicesTitle: 'Services',
    portfolioTitle: 'Portfolio', portfolioDesc: 'Merged showcase from both previous portfolios.',
    teamTitle: 'Team', blogTitle: 'Blog', leadTitle: 'Request Service', leadDesc: 'Submit your lead; it is stored in dashboard.',
    send: 'Send Request', contactInfo: 'Contact Info', location: 'Konya - Türkiye', footerNote: 'Ready for your next growth sprint?'
  },
  tr: {
    navServices: 'Hizmetler', navPortfolio: 'Portföy', navTeam: 'Ekip', navBlog: 'Blog', navContact: 'İletişim',
    tagline: 'Gelişmiş Pazarlama ve Reklam Ajansı', ctaStart: 'Projeni Başlat', ctaWork: 'İşlerimizi Gör', servicesTitle: 'Hizmetler',
    portfolioTitle: 'Portföy', portfolioDesc: 'İki eski portföyün profesyonel birleşimi.',
    teamTitle: 'Ekip', blogTitle: 'Blog', leadTitle: 'Hizmet Talebi', leadDesc: 'Talebin panele kaydedilir.',
    send: 'Gönder', contactInfo: 'İletişim', location: 'Konya - Türkiye', footerNote: 'Bir sonraki büyüme adımına hazır mısın?'
  }
};

const fallbackContent = {
  settings: {
    hero_title_ar: 'حلول تسويق وإعلان حديثة تنمّي العلامات التجارية',
    hero_title_en: 'Modern Marketing & Advertising That Scales Brands',
    hero_title_tr: 'Markaları Büyüten Modern Pazarlama ve Reklam Çözümleri',
    hero_subtitle_ar: 'نبني محركات نمو وهوية بصرية قوية وتجارب رقمية عالية التحويل.',
    hero_subtitle_en: 'We build growth engines, premium branding, and high-converting digital experiences.',
    hero_subtitle_tr: 'Büyüme motorları, güçlü marka kimliği ve yüksek dönüşüm sağlayan dijital deneyimler inşa ediyoruz.'
  },
  services: [
    {
      id: 'branding',
      icon: '🎯',
      title: { ar: 'الهوية والعلامة التجارية', en: 'Brand Strategy', tr: 'Marka Stratejisi' },
      desc: {
        ar: 'تصميم هوية كاملة متناسقة مع شخصية المشروع والسوق المستهدف.',
        en: 'Complete identity systems aligned with your business direction.',
        tr: 'Marka kimliğini hedef kitleye göre yapılandırırız.'
      }
    },
    {
      id: 'ads',
      icon: '📈',
      title: { ar: 'إعلانات الأداء', en: 'Performance Ads', tr: 'Performans Reklamları' },
      desc: {
        ar: 'حملات مدفوعة تعتمد على الأرقام والتحسين المستمر.',
        en: 'Data-driven paid campaigns optimized for ROI.',
        tr: 'ROI odaklı, veriyle optimize edilen reklam kampanyaları.'
      }
    },
    {
      id: 'web',
      icon: '💻',
      title: { ar: 'تصميم وبرمجة المواقع', en: 'Web Design & Development', tr: 'Web Tasarım ve Geliştirme' },
      desc: {
        ar: 'مواقع سريعة وحديثة متعددة اللغات ومتوافقة مع جميع الأجهزة.',
        en: 'Modern multilingual websites optimized for all devices.',
        tr: 'Tüm cihazlarda hızlı çalışan çok dilli modern web siteleri.'
      }
    }
  ],
  projects: [
    { title: 'Portfolio Case 1', category: 'Branding', source: 'Main Portfolio', description: 'Demo case study for static preview.', image_url: 'https://picsum.photos/seed/projA/800/500' },
    { title: 'Portfolio Case 2', category: 'Performance', source: 'PR Portfolio', description: 'Demo case study for static preview.', image_url: 'https://picsum.photos/seed/projB/800/500' }
  ],
  team: [
    { name: 'Omar Khaled', role: 'CEO & Strategy Lead', bio: 'Demo profile. Editable from dashboard.', image_url: 'https://picsum.photos/seed/teamx/400/400' },
    { name: 'Lina Yildiz', role: 'Operations Manager', bio: 'Demo profile. Editable from dashboard.', image_url: 'https://picsum.photos/seed/teamy/400/400' }
  ],
  posts: [
    { language: 'ar', title: 'دليل النمو الاستراتيجي في 2026', summary: 'خطة عملية لرفع التحويلات وبناء هوية قوية.' },
    { language: 'en', title: 'Future of Performance Marketing in 2026', summary: 'How agencies scale leads while keeping CAC healthy.' },
    { language: 'tr', title: '2026 Marka ve Büyüme Rehberi', summary: 'Ajanslar için sürdürülebilir dönüşüm stratejileri.' }
  ]
};

let content;
let currentLang = localStorage.getItem('lang') || 'ar';

function t(key) {
  return (dict[currentLang] && dict[currentLang][key]) || key;
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.getElementById('heroTitle').textContent = content.settings[`hero_title_${currentLang}`] || content.settings.hero_title_en;
  document.getElementById('heroSubtitle').textContent = content.settings[`hero_subtitle_${currentLang}`] || content.settings.hero_subtitle_en;
}

function renderServices() {
  const wrap = document.getElementById('servicesGrid');
  wrap.innerHTML = content.services
    .map((srv) => `<article class="card-item"><p>${srv.icon}</p><h3>${srv.title[currentLang]}</h3><p>${srv.desc[currentLang]}</p></article>`)
    .join('');
}

function renderProjects() {
  const wrap = document.getElementById('projectsGrid');
  wrap.innerHTML = content.projects
    .map((p) => `<article class="project-card"><img src="${p.image_url}" alt="${p.title}"/><h3>${p.title}</h3><p>${p.category} • ${p.source}</p><p>${p.description}</p></article>`)
    .join('');
}

function renderTeam() {
  const wrap = document.getElementById('teamGrid');
  wrap.innerHTML = content.team
    .map((m) => `<article class="team-card"><img src="${m.image_url}" alt="${m.name}"/><h3>${m.name}</h3><p>${m.role}</p><p>${m.bio}</p></article>`)
    .join('');
}

function renderPosts() {
  const wrap = document.getElementById('postsGrid');
  const posts = content.posts.filter((p) => p.language === currentLang).slice(0, 3);
  wrap.innerHTML = posts.map((p) => `<article class="post-card"><h3>${p.title}</h3><p>${p.summary}</p></article>`).join('');
}

async function init() {
  try {
    const res = await fetch('/api/public/content');
    if (!res.ok) throw new Error('Public API not available');
    content = await res.json();
  } catch (_e) {
    content = fallbackContent;
  }

  const res = await fetch('/api/public/content');
  content = await res.json();
  document.getElementById('langSwitcher').value = currentLang;
  renderServices();
  renderProjects();
  renderTeam();
  renderPosts();
  applyI18n();
}

window.addEventListener('DOMContentLoaded', () => {
  init();
  document.getElementById('langSwitcher').addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('lang', currentLang);
    renderServices();
    renderPosts();
    applyI18n();
  });

  document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());

    try {
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      document.getElementById('leadResult').textContent = result.success ? '✅ Sent successfully' : `❌ ${result.error}`;
      if (result.success) e.target.reset();
    } catch (_e) {
      document.getElementById('leadResult').textContent = '⚠️ Live API is unavailable in static preview mode.';
    }
    const res = await fetch('/api/public/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    document.getElementById('leadResult').textContent = result.success ? '✅ Sent successfully' : `❌ ${result.error}`;
    if (result.success) e.target.reset();
  });
});
