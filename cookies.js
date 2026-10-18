(() => {
    'use strict';

    const STORAGE_KEY = 'sc_cookie_consent';
    const VERSION = 1;
    const CATEGORIES = ['preferences', 'analytics', 'marketing'];

    const privacyUrl =
        (document.currentScript &&
            document.currentScript.dataset.privacyUrl) || '';

    /* translations */

    const DICT = {
        en: {
            title: 'We use cookies',
            text: 'We use cookies to make the site work, remember your settings and understand how it’s used. You choose what to allow.',
            privacy: 'Privacy policy',
            acceptAll: 'Accept all',
            rejectAll: 'Only necessary',
            customize: 'Customize',
            prefsTitle: 'Cookie settings',
            prefsText: 'Pick which cookies you’re happy with. You can change this anytime.',
            save: 'Save choices',
            close: 'Close',
            always: 'Always on',
            necessary: 'Necessary',
            necessaryDesc: 'Needed for the site to work (security, remembering this choice).',
            preferences: 'Preferences',
            preferencesDesc: 'Remember your language and light/dark mode.',
            analytics: 'Analytics',
            analyticsDesc: 'Anonymous statistics that show us which pages people visit.',
            marketing: 'Marketing',
            marketingDesc: 'Embedded content and ads from other services (maps, social, video).',
            reopen: 'Cookie settings'
        },

        mk: {
            title: 'Користиме колачиња',
            text: 'Користиме колачиња за да работи сајтот, да ги запомниме вашите поставки и да разбереме како се користи. Вие избирате што дозволувате.',
            privacy: 'Политика за приватност',
            acceptAll: 'Прифати ги сите',
            rejectAll: 'Само неопходни',
            customize: 'Прилагоди',
            prefsTitle: 'Поставки за колачиња',
            prefsText: 'Изберете кои колачиња ги прифаќате. Можете да го промените изборот во секое време.',
            save: 'Зачувај избор',
            close: 'Затвори',
            always: 'Секогаш активни',
            necessary: 'Неопходни',
            necessaryDesc: 'Потребни за сајтот да работи (безбедност, паметење на овој избор).',
            preferences: 'Поставки',
            preferencesDesc: 'Го паметат вашиот јазик и светлиот/темниот режим.',
            analytics: 'Аналитика',
            analyticsDesc: 'Анонимна статистика која покажува кои страници се посетуваат.',
            marketing: 'Маркетинг',
            marketingDesc: 'Вградена содржина и реклами од други услуги (мапи, социјални мрежи, видео).',
            reopen: 'Поставки за колачиња'
        }
    };

    /* safe storage */

    const memory = {};

    const store = {
        get(k) {
            try {
                return localStorage.getItem(k);
            } catch (_) {
                return memory[k] ?? null;
            }
        },

        set(k, v) {
            try {
                localStorage.setItem(k, v);
            } catch (_) {
                memory[k] = v;
            }
        }
    };

    /* language */

    function detectLang() {
        // active button
        const activeButton = document.querySelector(
            '.lang-button.active[data-lang]'
        );

        if (activeButton) {
            const activeLang = activeButton.dataset.lang
                .toLowerCase()
                .slice(0, 2);

            if (DICT[activeLang]) {
                return activeLang;
            }
        }

        // saved lang
        for (const key of [
            'lang',
            'language',
            'siteLang',
            'sc_lang',
            'preferredLang'
        ]) {
            const value = (store.get(key) || '')
                .toLowerCase()
                .slice(0, 2);

            if (DICT[value]) {
                return value;
            }
        }

        // html lang
        const htmlLang = (
            document.documentElement.lang || ''
        ).toLowerCase().slice(0, 2);

        if (DICT[htmlLang]) {
            return htmlLang;
        }

        // default
        return 'en';
    }

    let lang = detectLang();

    const t = (key) =>
        (DICT[lang] && DICT[lang][key]) ||
        DICT.en[key] ||
        key;

    /* consent state */

    function readConsent() {
        try {
            const value = store.get(STORAGE_KEY);

            if (!value) {
                return null;
            }

            const consentData = JSON.parse(value);

            return consentData &&
            consentData.v === VERSION
                ? consentData
                : null;

        } catch (_) {
            return null;
        }
    }

    let consent = readConsent();

    const listeners = [];
    const activated = new Set();

    const has = (category) =>
        category === 'necessary' ||
        !!(consent && consent[category]);

    function saveConsent(choices) {
        const previousConsent = consent;

        consent = {
            v: VERSION,
            ts: new Date().toISOString(),
            necessary: true
        };

        CATEGORIES.forEach((category) => {
            consent[category] = !!choices[category];
        });

        store.set(STORAGE_KEY, JSON.stringify(consent));

        // reload if revoked
        const revoked = CATEGORIES.some(
            (category) =>
                previousConsent &&
                previousConsent[category] &&
                !consent[category] &&
                activated.has(category)
        );

        if (revoked) {
            location.reload();
            return;
        }

        applyConsent();
    }

    function applyConsent() {
        // approved scripts
        document.querySelectorAll(
            'script[type="text/plain"][data-cookie-category]'
        ).forEach((oldScript) => {
            const category = oldScript.dataset.cookieCategory;

            if (!has(category) || oldScript.dataset.ckDone) {
                return;
            }

            const script = document.createElement('script');

            [...oldScript.attributes].forEach((attribute) => {
                if (
                    attribute.name !== 'type' &&
                    attribute.name !== 'data-cookie-category'
                ) {
                    script.setAttribute(
                        attribute.name,
                        attribute.value
                    );
                }
            });

            script.text = oldScript.text;
            oldScript.dataset.ckDone = '1';
            oldScript.after(script);

            activated.add(category);
        });

        // approved iframes
        document.querySelectorAll(
            'iframe[data-cookie-category][data-src]'
        ).forEach((iframe) => {
            if (
                has(iframe.dataset.cookieCategory) &&
                !iframe.src
            ) {
                iframe.src = iframe.dataset.src;

                activated.add(
                    iframe.dataset.cookieCategory
                );
            }
        });

        document.dispatchEvent(
            new CustomEvent('cookieconsent:change', {
                detail: { ...consent }
            })
        );

        listeners.forEach((callback) => {
            try {
                callback({ ...consent });
            } catch (error) {
                console.error(error);
            }
        });
    }

    /* ui */

    const COOKIE_ICON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-5-5z"/>' +
        '<circle cx="8.5" cy="11" r="1" fill="currentColor"/>' +
        '<circle cx="12" cy="16" r="1" fill="currentColor"/>' +
        '<circle cx="15.5" cy="13" r="1" fill="currentColor"/>' +
        '</svg>';

    let root;
    let banner;
    let modal;
    let dialog;
    let fab;
    let lastFocus;

    function row(category) {
        return `
            <label class="ck-row">
                <span class="ck-row-text">
                    <strong data-ck="${category}"></strong>
                    <small data-ck="${category}Desc"></small>
                </span>

                <span class="ck-toggle">
                    <input
                        type="checkbox"
                        class="ck-switch"
                        data-cat="${category}"
                    >
                    <span class="ck-slider"></span>
                </span>
            </label>
        `;
    }

    function build() {
        root = document.createElement('div');
        root.className = 'ck-root';

        root.innerHTML = `
            <div
                class="ck-banner"
                role="region"
                aria-labelledby="ck-title"
                hidden
            >
                <div class="ck-banner-head">
                    ${COOKIE_ICON}
                    <h2
                        class="ck-title"
                        id="ck-title"
                        data-ck="title"
                    ></h2>
                </div>

                <p class="ck-text">
                    <span data-ck="text"></span>
                    ${
            privacyUrl
                ? ` <a href="${privacyUrl}" data-ck="privacy"></a>`
                : ''
        }
                </p>

                <div class="ck-actions">
                    <button
                        type="button"
                        class="ck-btn ck-btn--primary"
                        data-act="accept"
                        data-ck="acceptAll"
                    ></button>

                    <button
                        type="button"
                        class="ck-btn"
                        data-act="reject"
                        data-ck="rejectAll"
                    ></button>

                    <button
                        type="button"
                        class="ck-btn ck-btn--ghost"
                        data-act="customize"
                        data-ck="customize"
                    ></button>
                </div>
            </div>

            <div class="ck-modal" hidden>
                <div
                    class="ck-backdrop"
                    data-act="close"
                ></div>

                <div
                    class="ck-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ck-m-title"
                    tabindex="-1"
                >
                    <div class="ck-dialog-head">
                        <div>
                            <h2
                                class="ck-title"
                                id="ck-m-title"
                                data-ck="prefsTitle"
                            ></h2>

                            <p
                                class="ck-text"
                                style="margin:6px 0 0"
                                data-ck="prefsText"
                            ></p>
                        </div>

                        <button
                            type="button"
                            class="ck-close"
                            data-act="close"
                            data-ck-label="close"
                        >&times;</button>
                    </div>

                    <div class="ck-list">
                        <div class="ck-row ck-row--locked">
                            <span class="ck-row-text">
                                <strong data-ck="necessary"></strong>
                                <small data-ck="necessaryDesc"></small>
                            </span>

                            <span
                                class="ck-always"
                                data-ck="always"
                            ></span>
                        </div>

                        ${CATEGORIES.map(row).join('')}
                    </div>

                    <div class="ck-actions">
                        <button
                            type="button"
                            class="ck-btn"
                            data-act="reject"
                            data-ck="rejectAll"
                        ></button>

                        <button
                            type="button"
                            class="ck-btn"
                            data-act="accept"
                            data-ck="acceptAll"
                        ></button>

                        <button
                            type="button"
                            class="ck-btn ck-btn--primary"
                            data-act="save"
                            data-ck="save"
                        ></button>
                    </div>
                </div>
            </div>

            <button
                type="button"
                class="ck-fab"
                data-act="customize"
                data-ck-label="reopen"
                hidden
            >${COOKIE_ICON}</button>
        `;

        document.body.appendChild(root);

        banner = root.querySelector('.ck-banner');
        modal = root.querySelector('.ck-modal');
        dialog = root.querySelector('.ck-dialog');
        fab = root.querySelector('.ck-fab');

        root.addEventListener('click', onClick);
        document.addEventListener('keydown', onKey);

        translate();
    }

    function translate() {
        if (!root) {
            return;
        }

        root.querySelectorAll('[data-ck]').forEach((element) => {
            element.textContent = t(element.dataset.ck);
        });

        root.querySelectorAll('[data-ck-label]').forEach((element) => {
            const text = t(element.dataset.ckLabel);

            element.setAttribute('aria-label', text);
            element.setAttribute('title', text);
        });
    }

    function syncToggles() {
        modal.querySelectorAll('.ck-switch').forEach((input) => {
            input.checked = has(input.dataset.cat);
        });
    }

    function readToggles() {
        const choices = {};

        modal.querySelectorAll('.ck-switch').forEach((input) => {
            choices[input.dataset.cat] = input.checked;
        });

        return choices;
    }

    const all = (value) =>
        Object.fromEntries(
            CATEGORIES.map((category) => [category, value])
        );

    function decide(choices) {
        saveConsent(choices);

        banner.hidden = true;
        closeModal();
        fab.hidden = false;
    }

    function openModal() {
        if (!modal || !banner || !dialog) {
            return;
        }

        lastFocus = document.activeElement;

        syncToggles();

        banner.hidden = true;
        modal.hidden = false;

        dialog.focus();
    }

    function closeModal() {
        if (!modal || modal.hidden) {
            return;
        }

        modal.hidden = true;

        if (!consent) {
            banner.hidden = false;
        }

        if (lastFocus && lastFocus.focus) {
            lastFocus.focus();
        }
    }

    function onClick(event) {
        const button = event.target.closest('[data-act]');

        if (!button) {
            return;
        }

        switch (button.dataset.act) {
            case 'accept':
                decide(all(true));
                break;

            case 'reject':
                decide(all(false));
                break;

            case 'save':
                decide(readToggles());
                break;

            case 'customize':
                openModal();
                break;

            case 'close':
                closeModal();
                break;
        }
    }

    function onKey(event) {
        if (!modal || modal.hidden) {
            return;
        }

        if (event.key === 'Escape') {
            closeModal();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const focusable = [
            ...dialog.querySelectorAll(
                'button, input, a[href]'
            )
        ].filter((element) => !element.disabled);

        if (!focusable.length) {
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (
            event.shiftKey &&
            (
                document.activeElement === first ||
                document.activeElement === dialog
            )
        ) {
            event.preventDefault();
            last.focus();

        } else if (
            !event.shiftKey &&
            document.activeElement === last
        ) {
            event.preventDefault();
            first.focus();
        }
    }

    /* language synchronization */

    function setLang(next) {
        next = String(next || '')
            .toLowerCase()
            .slice(0, 2);

        if (!DICT[next]) {
            return;
        }

        if (next === lang) {
            return;
        }

        lang = next;

        // update texts only
        translate();
    }

    // en / mk buttons
    document.addEventListener('click', (event) => {
        const button = event.target.closest(
            '.lang-button[data-lang]'
        );

        if (button) {
            setLang(button.dataset.lang);
        }
    });

    // html lang changes
    new MutationObserver(() => {
        const htmlLang = (
            document.documentElement.lang || ''
        ).toLowerCase().slice(0, 2);

        if (DICT[htmlLang]) {
            setLang(htmlLang);
        }
    }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });

    // other tabs
    window.addEventListener('storage', () => {
        setLang(detectLang());
    });

    // custom languagechange event
    document.addEventListener('languagechange', (event) => {
        const next = event.detail &&
            (event.detail.lang || event.detail);

        if (next) {
            setLang(next);
        } else {
            setLang(detectLang());
        }
    });

    /* cookie helpers */

    function setCookie(
        name,
        value,
        days = 365,
        category = 'necessary'
    ) {
        if (!has(category)) {
            return false;
        }

        const expires = new Date(
            Date.now() + days * 864e5
        ).toUTCString();

        document.cookie =
            `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ` +
            `expires=${expires}; path=/; SameSite=Lax` +
            (location.protocol === 'https:' ? '; Secure' : '');

        return true;
    }

    function getCookie(name) {
        const escapedName = encodeURIComponent(name).replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );

        const match = document.cookie.match(
            new RegExp(
                '(?:^|; )' + escapedName + '=([^;]*)'
            )
        );

        return match ? decodeURIComponent(match[1]) : null;
    }

    function deleteCookie(name) {
        document.cookie =
            `${encodeURIComponent(name)}=; ` +
            'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }

    /* initialization */

    function init() {
        // run once
        if (root) {
            return;
        }

        build();

        // footer links reopen settings
        document.addEventListener('click', (event) => {
            const link = event.target.closest(
                '[data-cookie-settings]'
            );

            if (link) {
                event.preventDefault();
                openModal();
            }
        });

        if (consent) {
            // already chose, show fab
            fab.hidden = false;
            applyConsent();
        } else {
            // no choice yet, show banner
            banner.hidden = false;
        }
    }

    /* public api */

    window.SipCookies = {
        open: () => {
            if (root) {
                openModal();
            } else {
                init();
            }
        },

        has,

        get: () => consent ? { ...consent } : null,

        onChange: (callback) => {
            listeners.push(callback);

            if (consent) {
                callback({ ...consent });
            }
        },

        setLang,

        set: setCookie,

        getCookie,

        deleteCookie,

        reset: () => {
            store.set(STORAGE_KEY, '');
            location.reload();
        }
    };

    // run when ready
    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            init
        );
    } else {
        init();
    }

})();