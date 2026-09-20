// Injected on Wishket portfolio add page — registers items from window.__WISHKET_ITEMS__
window.wishketRegisterItems = async (items) => {
  const skipTitles = ['mimmua! Shopify', '브랜드 웹 쇼핑몰'];
  const ADD = '/partners/p/bluefoxdev/portfolio/update/add/';

  const pickSkill = (stack) => {
    const known = ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'];
    for (const k of stack) if (known.includes(k)) return k;
    return 'React';
  };
  const parsePeriod = (p) => {
    if (p.includes('–')) {
      const [a, b] = p.split('–');
      return { start: a.trim().slice(0, 4) + '01', end: b.trim().slice(0, 4) + '09' };
    }
    const y = p.trim().slice(0, 4);
    return { start: y + '01', end: y === '2026' ? '202609' : y + '12' };
  };
  const setM = (name, d6) => {
    const el = document.querySelector(`input[name="${name}"]`);
    const formatted = d6.slice(0, 6).replace(/(\d{4})(\d{2})/, '$1.$2.');
    el.value = formatted;
    jQuery(el).val(formatted).trigger('input').trigger('change').trigger('blur');
  };

  async function fillAndSubmit(item) {
    validatePlusFormData(false);
    const { start, end } = parsePeriod(item.period);
    document.querySelector('[name=title]').value = item.title;
    document.getElementById('category_develop').checked = true;
    document.querySelectorAll('input[name=subcategory]').forEach((el) => (el.checked = false));
    ['field_web', 'field_android', 'field_ios', 'field_pc', 'field_embedded', 'field_etc'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.checked = false;
    });
    const fieldEl = document.getElementById('field_' + item.field);
    if (fieldEl) {
      fieldEl.checked = true;
      fieldEl.click();
    }
    document.querySelectorAll('input[name=field_subcategory]').forEach((el) => (el.checked = false));
    const cat = document.querySelector(`input[name=field_subcategory][value="${item.cat}"]`);
    if (cat) {
      cat.checked = true;
      cat.click();
    }
    const rep = document.querySelector('[name=represent_field_subcategory]');
    if (rep) rep.value = item.cat;
    setM('date_started', start);
    setM('date_ended', end);
    document.querySelector('[name=participation_rate]').value = '100';
    document.querySelector('[name=role]').value = '풀스택 개발·운영';
    const body = `${item.summary}\n\n기획·설계·개발·배포·운영을 End-to-End로 수행했습니다.\n주요 기술: ${item.stack.join(', ')}.`;
    document.querySelectorAll('textarea[name=description]').forEach((el) => {
      el.value = body;
      jQuery(el).trigger('input').trigger('change');
    });
    document.querySelectorAll('.plus-form-wrapper .error').forEach((el) => el.classList.remove('error'));
    validatePlusFormData(false);
    const skillName = pickSkill(item.stack);
    const si = document.querySelector('.stack-search-typing-input');
    si.value = skillName;
    si.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 500));
    document.querySelector(`.stack-selector[data-tag-name="${skillName}"]`)?.click();
    await new Promise((r) => setTimeout(r, 300));
    const ok = validationForm('portfolio-form');
    if (!ok) return { ok: false, title: item.title, errors: document.querySelectorAll('.portfolio-add-view .error').length };
    const btn = [...document.querySelectorAll('button.btn-submit')].find((b) => b.textContent.trim() === '등록');
    btn?.click();
    await new Promise((r) => setTimeout(r, 5500));
    return { ok: location.pathname.includes('/portfolio/update/') && !location.pathname.includes('/add/'), title: item.title, url: location.href };
  }

  const results = [];
  for (const item of items) {
    if (skipTitles.some((s) => item.title.includes(s))) {
      results.push({ skipped: true, title: item.title });
      continue;
    }
    if (!location.pathname.endsWith('/add/')) {
      location.href = ADD;
      await new Promise((resolve) => {
        const t = setInterval(() => {
          if (location.pathname.endsWith('/add/')) {
            clearInterval(t);
            resolve();
          }
        }, 250);
      });
      await new Promise((r) => setTimeout(r, 700));
    }
    results.push(await fillAndSubmit(item));
  }
  return results;
};

(async () => {
  const items = window.__WISHKET_ITEMS__ || [];
  if (items.length) return window.wishketRegisterItems(items);
})();
