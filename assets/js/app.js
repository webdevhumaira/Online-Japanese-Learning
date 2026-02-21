// ============================================================
// NihongoMaster — Main App JS (Clean Version)
// ============================================================

// ── Custom Cursor ──────────────────────────────────────────
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-border');

if (cursorDot && cursorOutline) {
    document.addEventListener('mousemove', function (e) {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top  = `${e.clientY}px`;
        cursorOutline.animate(
            { left: `${e.clientX}px`, top: `${e.clientY}px` },
            { duration: 500, fill: 'forwards' }
        );
    });

    document.querySelectorAll('a, button, .course-card, .feature-card, .quiz-option, .language-option')
        .forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width       = '60px';
                cursorOutline.style.height      = '60px';
                cursorOutline.style.borderColor = '#FFD166';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width       = '40px';
                cursorOutline.style.height      = '40px';
                cursorOutline.style.borderColor = '#FFD166';
            });
        });
}

// ── Scroll Progress Bar ────────────────────────────────────
window.addEventListener('scroll', () => {
    const scrollTop    = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct          = (scrollTop / scrollHeight) * 100;
    const bar = document.querySelector('.scroll-progress');
    if (bar) bar.style.width = pct + '%';
});

// ── Scroll-to-Top Button ───────────────────────────────────
const scrollToTopBtn = document.querySelector('.scroll-to-top');
if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('active', window.pageYOffset > 300);
    });
    scrollToTopBtn.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: 'smooth' })
    );
}

// ── Navbar Scroll Effect ───────────────────────────────────
window.addEventListener('scroll', () => {
    document.querySelector('.navbar')?.classList.toggle('navbar-scrolled', window.scrollY > 50);
});

// ── Smooth Scroll ──────────────────────────────────────────
document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#' || href.includes('Modal')) return;
    const target = document.querySelector(href);
    if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
});

// ── Language Switcher ──────────────────────────────────────
document.querySelectorAll('.language-option').forEach(opt => {
    opt.addEventListener('click', function () {
        document.querySelectorAll('.language-option').forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        const lang = this.dataset.lang;
        document.documentElement.setAttribute('data-lang', lang);
        const msgs = { bn: 'ভাষা বাংলাতে পরিবর্তন করা হয়েছে!', jp: '言語が日本語に変更されました！', en: 'Language changed to English!' };
        alert(msgs[lang] || msgs.en);
    });
});

// ── Enrollment Form ────────────────────────────────────────
document.getElementById('enrollmentForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    showToast('✅ Thank you! We will contact you shortly to schedule your free trial class.', 'success');
    this.reset();
});

// ── Japanese Background Elements ──────────────────────────
(function addJapaneseElements() {
    const elements = [
        { cls: 'sakura', text: '🌸', top: '15%',   left: '3%'   },
        { cls: 'sakura', text: '🌸', top: '25%',   right: '5%'  },
        { cls: 'kanji',  text: '語', top: '40%',   left: '2%'   },
        { cls: 'kanji',  text: '学', bottom: '30%', right: '3%' },
        { cls: 'torii',  text: '⛩️', bottom: '10%', left: '5%'  }
    ];
    ['hero-section', 'about-sensei', 'class-system'].forEach(cls => {
        const section = document.querySelector('.' + cls);
        if (!section) return;
        elements.forEach(el => {
            const div = document.createElement('div');
            div.className = 'japanese-bg-element ' + el.cls;
            div.textContent = el.text;
            div.style.cssText = 'position:absolute;opacity:0.1;z-index:1;font-size:' +
                (el.cls === 'sakura' ? '4rem' : '3rem') + ';';
            if (el.top)    div.style.top    = el.top;
            if (el.bottom) div.style.bottom = el.bottom;
            if (el.left)   div.style.left   = el.left;
            if (el.right)  div.style.right  = el.right;
            section.appendChild(div);
        });
    });
})();

// ── Quiz System ────────────────────────────────────────────
var quizQuestions = [
    { question: "What is the Japanese word for 'hello'?",
      options: ["さようなら (Sayōnara)", "こんにちは (Konnichiwa)", "ありがとう (Arigatō)", "おはよう (Ohayō)"],
      correct: "b" },
    { question: "Which of these is NOT a Japanese writing system?",
      options: ["Hiragana", "Katakana", "Kanji", "Hangul"],
      correct: "d" },
    { question: "What does 'ありがとう' mean in English?",
      options: ["Hello", "Goodbye", "Thank you", "Excuse me"],
      correct: "c" },
    { question: "How do you say 'I' in Japanese?",
      options: ["あなた (Anata)", "彼 (Kare)", "私 (Watashi)", "彼女 (Kanojo)"],
      correct: "c" },
    { question: "What is the Japanese word for 'book'?",
      options: ["本 (Hon)", "紙 (Kami)", "鉛筆 (Enpitsu)", "机 (Tsukue)"],
      correct: "a" }
];

var currentQuestion = 0, userAnswers = [], quizTimerInterval, timeLeft = 300;

function updateTimerDisplay() {
    var m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    var el = document.getElementById('quizTimer');
    if (el) el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function startTimer() {
    updateTimerDisplay();
    quizTimerInterval = setInterval(function () {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) { clearInterval(quizTimerInterval); finishQuiz(); }
    }, 1000);
}

function loadQuestion() {
    var q  = quizQuestions[currentQuestion];
    var qt = document.getElementById('questionText');
    var qc = document.getElementById('questionCounter');
    if (qt) qt.textContent = q.question;
    if (qc) qc.textContent = 'Question ' + (currentQuestion + 1) + ' of ' + quizQuestions.length;

    var opts = document.querySelectorAll('.quiz-option');
    opts.forEach(function (opt, i) {
        opt.textContent = String.fromCharCode(65 + i) + ') ' + q.options[i];
        opt.classList.remove('selected');
        opt.setAttribute('data-answer', String.fromCharCode(97 + i));
    });

    var nxt = document.getElementById('nextQuestionBtn');
    if (nxt) {
        nxt.disabled    = true;
        nxt.textContent = currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question';
    }
}

function finishQuiz() {
    clearInterval(quizTimerInterval);
    var score = 0;
    for (var i = 0; i < quizQuestions.length; i++) {
        if (userAnswers[i] === quizQuestions[i].correct) score++;
    }
    var qContent = document.getElementById('quizContent');
    var qResults = document.getElementById('quizResults');
    if (qContent) qContent.style.display = 'none';
    if (qResults) qResults.style.display = 'block';
    var fs = document.getElementById('finalScore');
    if (fs) fs.textContent = score + '/' + quizQuestions.length;
    var rs = document.getElementById('resultStatus');
    if (rs) {
        if      (score >= 4) { rs.textContent = 'Passed! Excellent work!';             rs.style.color = '#28a745'; }
        else if (score >= 3) { rs.textContent = 'Good! Keep practicing.';              rs.style.color = '#ffc107'; }
        else                 { rs.textContent = 'Needs improvement. Review the basics.'; rs.style.color = '#E63946'; }
    }
}

var startBtn = document.getElementById('startQuizBtn');
if (startBtn) {
    startBtn.addEventListener('click', function () {
        var qc = document.getElementById('quizContainer');
        if (qc) qc.style.display = 'block';
        this.style.display = 'none';
        startTimer();
        loadQuestion();
    });
}

document.addEventListener('click', function (e) {
    if (!e.target.classList.contains('quiz-option')) return;
    document.querySelectorAll('.quiz-option').forEach(function (o) { o.classList.remove('selected'); });
    e.target.classList.add('selected');
    var nxt = document.getElementById('nextQuestionBtn');
    if (nxt) nxt.disabled = false;
    userAnswers[currentQuestion] = e.target.getAttribute('data-answer');
});

var nxtBtn = document.getElementById('nextQuestionBtn');
if (nxtBtn) {
    nxtBtn.addEventListener('click', function () {
        if (currentQuestion < quizQuestions.length - 1) { currentQuestion++; loadQuestion(); }
        else finishQuiz();
    });
}

var retryBtn = document.getElementById('retryQuizBtn');
if (retryBtn) {
    retryBtn.addEventListener('click', function () {
        currentQuestion = 0; userAnswers = []; timeLeft = 300;
        var qResults = document.getElementById('quizResults');
        var qContent = document.getElementById('quizContent');
        if (qResults) qResults.style.display = 'none';
        if (qContent) qContent.style.display = 'block';
        startTimer(); loadQuestion();
    });
}

var closeQBtn = document.getElementById('closeQuizBtn');
if (closeQBtn) {
    closeQBtn.addEventListener('click', function () {
        var qc  = document.getElementById('quizContainer');
        var sb  = document.getElementById('startQuizBtn');
        var qr  = document.getElementById('quizResults');
        var qco = document.getElementById('quizContent');
        if (qc)  qc.style.display  = 'none';
        if (sb)  sb.style.display  = 'block';
        if (qr)  qr.style.display  = 'none';
        if (qco) qco.style.display = 'block';
        currentQuestion = 0; userAnswers = []; timeLeft = 300;
        clearInterval(quizTimerInterval);
    });
}

// ── Toast Helper ───────────────────────────────────────────
function showToast(msg, type) {
    var colors = { success: '#06D6A0', error: '#E63946', info: '#1A2B3C' };
    var bg = colors[type] || colors.info;
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;top:80px;right:24px;background:' + bg + ';' +
        'color:white;padding:14px 20px;border-radius:12px;z-index:99999;font-size:0.88rem;' +
        'box-shadow:0 8px 24px rgba(0,0,0,0.2);max-width:320px;line-height:1.5;' +
        'animation:slideInRight 0.3s ease;';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(function () {
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity    = '0';
        toast.style.transform  = 'translateX(30px)';
        setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
}

// ── Password Toggle ────────────────────────────────────────
function togglePassword(inputId, toggleEl) {
    var input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type       = 'text';
        toggleEl.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        input.type       = 'password';
        toggleEl.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// ── Auth Role Config ───────────────────────────────────────
var roleConfig = {
    student: { icon: 'fas fa-graduation-cap',    bg: 'linear-gradient(155deg,#E63946,#7d0000)' },
    teacher: { icon: 'fas fa-chalkboard-teacher', bg: 'linear-gradient(155deg,#2D6A4F,#0d3320)' },
    admin:   { icon: 'fas fa-user-shield',        bg: 'linear-gradient(155deg,#7209B7,#3a0060)' }
};

// Update login panel when role picked from dropdown
document.querySelectorAll('[data-bs-target="#loginModal"][data-role]').forEach(function (link) {
    link.addEventListener('click', function () {
        var role    = this.getAttribute('data-role');
        var display = role.charAt(0).toUpperCase() + role.slice(1);
        var sr      = document.getElementById('selectedRole');
        var badge   = document.getElementById('loginRoleBadge');
        var iconEl  = document.getElementById('loginRoleIcon');
        var panel   = document.getElementById('loginPanelLeft');
        if (sr)    sr.textContent    = display;
        if (badge) badge.textContent = display;
        if (iconEl && roleConfig[role]) iconEl.innerHTML = '<i class="' + roleConfig[role].icon + '"></i>';
        if (panel  && roleConfig[role]) panel.style.background = roleConfig[role].bg;
    });
});

// ── Signup Role Tabs ───────────────────────────────────────
document.querySelectorAll('.auth-role-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.auth-role-tab').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        var role = this.dataset.role;
        var sel  = document.getElementById('signupRole');
        if (sel) sel.value = role;
        document.getElementById('studentFields').style.display = role === 'student' ? 'block' : 'none';
        document.getElementById('teacherFields').style.display = role === 'teacher' ? 'block' : 'none';
        document.getElementById('adminFields').style.display   = role === 'admin'   ? 'block' : 'none';
    });
});

// ── Login Form Submission ──────────────────────────────────
var loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email    = document.getElementById('loginEmail').value.trim();
        var password = document.getElementById('loginPassword').value;
        var roleText = document.getElementById('selectedRole');
        var roleRaw  = roleText ? roleText.textContent.trim().toLowerCase() : 'student';

        var creds = {
            student: { email: 'student@example.com', pass: 'student123' },
            teacher: { email: 'teacher@example.com', pass: 'teacher123' },
            admin:   { email: 'admin@example.com',   pass: 'admin123'   }
        };

        var valid = creds[roleRaw] && email === creds[roleRaw].email && password === creds[roleRaw].pass;

        if (valid) {
            var modalEl = document.getElementById('loginModal');
            var modal   = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
            setTimeout(function () { showDashboard(roleRaw, email); }, 350);
        } else {
            // Shake animation on inputs
            document.querySelectorAll('#loginForm .auth-input').forEach(function (inp) {
                inp.style.borderColor = '#E63946';
                inp.style.animation   = 'shake 0.5s ease';
                setTimeout(function () { inp.style.borderColor = ''; inp.style.animation = ''; }, 600);
            });
            // Error message
            var err = document.getElementById('loginError');
            if (!err) {
                err    = document.createElement('div');
                err.id = 'loginError';
                err.style.cssText = 'color:#E63946;font-size:0.82rem;text-align:center;margin-top:10px;';
                loginForm.appendChild(err);
            }
            err.textContent = '❌ Invalid credentials — check the demo credentials below.';
            setTimeout(function () { err.textContent = ''; }, 3500);
        }
    });
}

// ── Signup Form Submission ─────────────────────────────────
var signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var password  = document.getElementById('signupPassword').value;
        var confirm   = document.getElementById('confirmPassword').value;
        var firstName = document.getElementById('firstName').value;
        var lastName  = document.getElementById('lastName').value;

        if (password !== confirm) { showToast('❌ Passwords do not match!', 'error'); return; }
        if (password.length < 8)  { showToast('❌ Password must be at least 8 characters.', 'error'); return; }

        var modalEl = document.getElementById('signupModal');
        var modal   = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        signupForm.reset();

        // Reset role tabs back to Student
        document.querySelectorAll('.auth-role-tab').forEach(function (t, i) {
            t.classList.toggle('active', i === 0);
        });
        document.getElementById('studentFields').style.display = 'block';
        document.getElementById('teacherFields').style.display = 'none';
        document.getElementById('adminFields').style.display   = 'none';

        showToast('✅ Account created! Welcome <strong>' + firstName + ' ' + lastName +
            '</strong>. Check your email for verification.', 'success');
    });
}

// ── Dashboard ──────────────────────────────────────────────
function showDashboard(role, email) {
    var overlay = document.getElementById('dashboardOverlay');
    if (!overlay) return;

    // Hide all dashboards
    ['studentDashboard', 'teacherDashboard', 'adminDashboard'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Format display name from email
    var name = email.split('@')[0]
        .replace(/[._]/g, ' ')
        .split(' ')
        .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
        .join(' ');

    var dashMap = { student: 'studentDashboard', teacher: 'teacherDashboard', admin: 'adminDashboard' };
    var dashEl  = document.getElementById(dashMap[role]);
    if (!dashEl) return;
    dashEl.style.display = 'flex';

    // Set avatar initial & name
    var avatarEl = dashEl.querySelector('.dashboard-avatar');
    var nameEl   = dashEl.querySelectorAll('.dashboard-nav-right span')[0];
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    if (nameEl)   nameEl.textContent   = name;

    // Logout
    var logoutBtn = dashEl.querySelector('.dashboard-logout-btn');
    if (logoutBtn) {
        // Remove old listeners by cloning
        var newBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newBtn, logoutBtn);
        newBtn.addEventListener('click', function () {
            overlay.style.display        = 'none';
            document.body.style.overflow = '';
            updateNavbarForLoggedIn(role, email);
        });
    }

    // Sidebar active state
    dashEl.querySelectorAll('.sidebar-item').forEach(function (item) {
        item.addEventListener('click', function (ev) {
            ev.preventDefault();
            dashEl.querySelectorAll('.sidebar-item').forEach(function (i) { i.classList.remove('active'); });
            this.classList.add('active');
        });
    });
}

// ── Navbar Logged-In State ─────────────────────────────────
function updateNavbarForLoggedIn(role, email) {
    var navbarNav = document.querySelector('#navbarNav .navbar-nav.ms-auto');
    if (!navbarNav) return;

    var existingDropdown = document.querySelector('.nav-item.dropdown');
    if (existingDropdown) existingDropdown.remove();

    var display   = role.charAt(0).toUpperCase() + role.slice(1);
    var roleIcons = { student: 'fa-graduation-cap', teacher: 'fa-chalkboard-teacher', admin: 'fa-user-shield' };
    var ic        = roleIcons[role] || 'fa-user-circle';

    var li = document.createElement('li');
    li.className = 'nav-item dropdown';
    li.innerHTML =
        '<a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"' +
        ' data-bs-toggle="dropdown" aria-expanded="false">' +
        '<i class="fas ' + ic + ' me-1"></i> ' + display + '</a>' +
        '<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">' +
        '<li><h6 class="dropdown-header">' + email + '</h6></li>' +
        '<li><a class="dropdown-item" href="#" id="openDashboardBtn"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>' +
        '<li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Profile</a></li>' +
        '<li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Settings</a></li>' +
        '<li><hr class="dropdown-divider"></li>' +
        '<li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>' +
        '</ul>';
    navbarNav.appendChild(li);

    var openBtn  = document.getElementById('openDashboardBtn');
    var logoutEl = document.getElementById('logoutBtn');
    if (openBtn)  openBtn.addEventListener('click',  function (e) { e.preventDefault(); showDashboard(role, email); });
    if (logoutEl) logoutEl.addEventListener('click', function (e) { e.preventDefault(); location.reload(); });
}

// ── 3D Card Tilt ───────────────────────────────────────────
function apply3DTilt(selector, intensity) {
    document.querySelectorAll(selector).forEach(function (card) {
        // Add shine overlay if not already present
        if (!card.querySelector('.card-3d-shine')) {
            var shine = document.createElement('div');
            shine.className = 'card-3d-shine';
            shine.style.cssText =
                'position:absolute;top:0;left:0;right:0;bottom:0;border-radius:inherit;' +
                'pointer-events:none;z-index:5;opacity:0;transition:opacity 0.3s;';
            // Ensure card has position
            if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
            card.appendChild(shine);
        }

        card.addEventListener('mouseenter', function () {
            this.style.transition = 'transform 0.08s linear, box-shadow 0.3s ease';
        });

        card.addEventListener('mousemove', function (e) {
            var rect = this.getBoundingClientRect();
            var x    = e.clientX - rect.left;
            var y    = e.clientY - rect.top;
            var cx   = rect.width  / 2;
            var cy   = rect.height / 2;
            var rX   = ((y - cy) / cy) * -intensity;
            var rY   = ((x - cx) / cx) *  intensity;

            this.style.transform =
                'perspective(1000px) rotateX(' + rX + 'deg) rotateY(' + rY + 'deg) scale3d(1.04,1.04,1.04)';

            var shine = this.querySelector('.card-3d-shine');
            if (shine) {
                var deg = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
                shine.style.background =
                    'linear-gradient(' + deg + 'deg,rgba(255,255,255,0.18) 0%,transparent 60%)';
                shine.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', function () {
            this.style.transition =
                'transform 0.55s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease';
            this.style.transform =
                'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            var shine = this.querySelector('.card-3d-shine');
            if (shine) shine.style.opacity = '0';
        });
    });
}

// Run tilt after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
} else {
    initTilt();
}

function initTilt() {
    apply3DTilt('.course-card',     12);
    apply3DTilt('.feature-card',    10);
    apply3DTilt('.exam-level-card',  8);
    apply3DTilt('.feedback-card',    6);
}

// ── Inject CSS Keyframes ───────────────────────────────────
(function () {
    var style = document.createElement('style');
    style.textContent =
        '@keyframes shake {' +
            '0%,100%{transform:translateX(0)}' +
            '20%{transform:translateX(-7px)}' +
            '40%{transform:translateX(7px)}' +
            '60%{transform:translateX(-4px)}' +
            '80%{transform:translateX(4px)}' +
        '}' +
        '@keyframes slideInRight {' +
            'from{opacity:0;transform:translateX(30px)}' +
            'to{opacity:1;transform:translateX(0)}' +
        '}';
    document.head.appendChild(style);
})();