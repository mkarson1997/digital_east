(() => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  async function boot() {
    // 1) includes (لا تخلي فشل fetch يوقف كل شي)
    const includes = Array.from(document.querySelectorAll("[data-include]"));
    if (includes.length) {
      await Promise.all(
        includes.map(async (el) => {
          const url = el.getAttribute("data-include");
          if (!url) return;
          try {
            const res = await fetch(url, { cache: "no-cache" });
            if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
            el.outerHTML = await res.text();
          } catch (err) {
            console.warn("Include failed:", url, err);
            // لا تعمل return ولا throw — خليه يكمل
          }
        })
      );
    }

    initUI();
    initSlidersState(); // يجهز حالة السلايدر (index)
  }

  function initUI() {
    // Mobile nav
    const btn = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (btn && nav) btn.addEventListener("click", () => nav.classList.toggle("open"));

    // Reveal on scroll
    const els = Array.from(document.querySelectorAll(".reveal"));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("show")),
        { threshold: 0.12 }
      );
      els.forEach((el) => io.observe(el));
    } else {
      els.forEach((el) => el.classList.add("show"));
    }

    // Filters
    const filters = Array.from(document.querySelectorAll("[data-filter]"));
    const items = Array.from(document.querySelectorAll("[data-item]"));
    if (filters.length && items.length) {
      filters.forEach((f) =>
        f.addEventListener("click", () => {
          filters.forEach((x) => x.classList.remove("active"));
          f.classList.add("active");
          const key = f.getAttribute("data-filter");
          items.forEach((it) => {
            const tags = (it.getAttribute("data-tags") || "").split(",").map((s) => s.trim());
            it.style.display = key === "all" || tags.includes(key) ? "" : "none";
          });
        })
      );
    }
  }

  // حضّر كل سلايدر (index + dots) مرة واحدة
  function initSlidersState() {
    document.querySelectorAll("[data-slider]").forEach((root) => {
      root.dataset.index = root.dataset.index || "0";

      const track = root.querySelector(".slides");
      if (!track) return;

      const imgs = Array.from(track.querySelectorAll("img"));
      const dotsWrap = root.querySelector(".dots");

      if (dotsWrap && imgs.length) {
        dotsWrap.innerHTML = imgs
          .map(
            (_, i) =>
              `<button type="button" class="dot ${i === 0 ? "active" : ""}" data-dot="${i}" aria-label="شريحة ${i + 1}"></button>`
          )
          .join("");
      }

      // أول تحديث
      updateSlider(root);
    });
  }

  // Event delegation: كليك على الأسهم أو النقاط يشتغل حتى لو الـ HTML انحقن لاحقاً
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".slide-btn, .dot");
    if (!btn) return;

    const slider = btn.closest("[data-slider]");
    if (!slider) return;

    e.preventDefault();

    const track = slider.querySelector(".slides");
    const imgs = track ? Array.from(track.querySelectorAll("img")) : [];
    if (!track || imgs.length === 0) return;

    let index = Number(slider.dataset.index || "0");

    if (btn.classList.contains("prev")) index -= 1;
    else if (btn.classList.contains("next")) index += 1;
    else if (btn.classList.contains("dot")) index = Number(btn.dataset.dot || "0");

    // لفّ
    index = (index + imgs.length) % imgs.length;
    slider.dataset.index = String(index);

    updateSlider(slider);
  });

  // Swipe (delegation)
  let startX = 0;
  let dx = 0;
  let activeSlider = null;

  document.addEventListener("pointerdown", (e) => {
    const slider = e.target.closest("[data-slider]");
    if (!slider) return;
    activeSlider = slider;
    startX = e.clientX;
    dx = 0;
  });

  document.addEventListener("pointermove", (e) => {
    if (!activeSlider) return;
    dx = e.clientX - startX;
  });

  document.addEventListener("pointerup", () => {
    if (!activeSlider) return;

    const track = activeSlider.querySelector(".slides");
    const imgs = track ? Array.from(track.querySelectorAll("img")) : [];
    if (!track || imgs.length === 0) {
      activeSlider = null;
      return;
    }

    const threshold = 40;
    let index = Number(activeSlider.dataset.index || "0");

    if (dx > threshold) index -= 1;
    else if (dx < -threshold) index += 1;

    index = (index + imgs.length) % imgs.length;
    activeSlider.dataset.index = String(index);

    updateSlider(activeSlider);

    activeSlider = null;
    dx = 0;
  });

  function updateSlider(slider) {
    const track = slider.querySelector(".slides");
    const imgs = track ? Array.from(track.querySelectorAll("img")) : [];
    if (!track || imgs.length === 0) return;

    const index = Number(slider.dataset.index || "0");
    track.style.transform = `translateX(${-index * 100}%)`;

    const dots = Array.from(slider.querySelectorAll(".dot"));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }
})();


// Counter Animation للأرقام
document.querySelectorAll('.counter').forEach(el => {
  const target = parseFloat(el.getAttribute('data-target'));
  let count = 0;
  const increment = target / 80; // سرعة العد
  const isPercentage = el.textContent.includes('%') || target < 10;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const interval = setInterval(() => {
        count += increment;
        if (isPercentage) {
          el.textContent = count >= target ? target.toFixed(1) + 'x' : count.toFixed(1);
        } else {
          el.textContent = Math.ceil(count) + (el.textContent.includes('+') ? '+' : '');
        }
        if (count >= target) {
          clearInterval(interval);
          if (!isPercentage && !el.textContent.includes('+')) {
            el.textContent = target;
          }
        }
      }, 25);
      observer.disconnect();
    }
  }, { threshold: 0.6 });

  observer.observe(el);
});


document.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelectorAll('.filter');
    const items = document.querySelectorAll('.portfolio-card');

    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        // إزالة active من الكل
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const filterValue = filter.getAttribute('data-filter');

        items.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-tags').includes(filterValue)) {
            item.style.display = 'block';
            item.classList.add('reveal'); // إعادة التأثير إذا حابب
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });