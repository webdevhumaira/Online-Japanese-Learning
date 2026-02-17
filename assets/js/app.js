$(document).ready(function () {
    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-border');

    document.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // cursorOutline.style.left = `${posX}px`;
        // cursorOutline.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .course-card, .feature-card, .quiz-option, .language-option');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = '#FFD166';
        });

        element.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = '#FFD166';
        });
    });

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        document.querySelector('.scroll-progress').style.width = scrollPercentage + '%';
    });

    // Scroll to Top Button
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Language Switcher
    $('.language-option').click(function () {
        const lang = $(this).data('lang');

        // Update active class
        $('.language-option').removeClass('active');
        $(this).addClass('active');

        // Update HTML lang attribute
        $('html').attr('data-lang', lang);

        // In a real implementation, this would load translations
        // For demo, we'll just show an alert
        if (lang === 'bn') {
            alert('ভাষা বাংলাতে পরিবর্তন করা হয়েছে!');
        } else if (lang === 'jp') {
            alert('言語が日本語に変更されました！');
        } else {
            alert('Language changed to English!');
        }
    });

    // Quiz System
    const quizQuestions = [
        {
            question: "What is the Japanese word for 'hello'?",
            options: [
                "さようなら (Sayōnara)",
                "こんにちは (Konnichiwa)",
                "ありがとう (Arigatō)",
                "おはよう (Ohayō)"
            ],
            correct: "b"
        },
        {
            question: "Which of these is NOT a Japanese writing system?",
            options: [
                "Hiragana",
                "Katakana",
                "Kanji",
                "Hangul"
            ],
            correct: "d"
        },
        {
            question: "What does 'ありがとう' mean in English?",
            options: [
                "Hello",
                "Goodbye",
                "Thank you",
                "Excuse me"
            ],
            correct: "c"
        },
        {
            question: "How do you say 'I' in Japanese?",
            options: [
                "あなた (Anata)",
                "彼 (Kare)",
                "私 (Watashi)",
                "彼女 (Kanojo)"
            ],
            correct: "c"
        },
        {
            question: "What is the Japanese word for 'book'?",
            options: [
                "本 (Hon)",
                "紙 (Kami)",
                "鉛筆 (Enpitsu)",
                "机 (Tsukue)"
            ],
            correct: "a"
        }
    ];

    let currentQuestion = 0;
    let userAnswers = [];
    let quizTimer;
    let timeLeft = 300; // 5 minutes in seconds

    $('#startQuizBtn').click(function () {
        $('#quizContainer').slideDown();
        $(this).hide();
        startTimer();
        loadQuestion();
    });

    function startTimer() {
        updateTimerDisplay();
        quizTimer = setInterval(function () {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(quizTimer);
                finishQuiz();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        $('#quizTimer').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }

    function loadQuestion() {
        const question = quizQuestions[currentQuestion];
        $('#questionText').text(question.question);
        $('#questionCounter').text(`Question ${currentQuestion + 1} of ${quizQuestions.length}`);

        const options = $('.quiz-option');
        options.each(function (index) {
            $(this).text(String.fromCharCode(65 + index) + ') ' + question.options[index]);
            $(this).removeClass('selected');
            $(this).attr('data-answer', String.fromCharCode(97 + index));
        });

        // Hide next button until an option is selected
        $('#nextQuestionBtn').prop('disabled', true);

        // Reset button text for last question
        if (currentQuestion === quizQuestions.length - 1) {
            $('#nextQuestionBtn').text('Finish Quiz');
        } else {
            $('#nextQuestionBtn').text('Next Question');
        }
    }

    // Select quiz option
    $(document).on('click', '.quiz-option', function () {
        $('.quiz-option').removeClass('selected');
        $(this).addClass('selected');
        $('#nextQuestionBtn').prop('disabled', false);

        // Store user's answer
        userAnswers[currentQuestion] = $(this).data('answer');
    });

    // Next question button
    $('#nextQuestionBtn').click(function () {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            finishQuiz();
        }
    });

    function finishQuiz() {
        clearInterval(quizTimer);

        // Calculate score
        let score = 0;
        for (let i = 0; i < quizQuestions.length; i++) {
            if (userAnswers[i] === quizQuestions[i].correct) {
                score++;
            }
        }

        // Display results
        $('#quizContent').hide();
        $('#quizResults').show();
        $('#finalScore').text(`${score}/${quizQuestions.length}`);

        if (score >= 4) {
            $('#resultStatus').text('Passed! Excellent work!').css('color', '#28a745');
        } else if (score >= 3) {
            $('#resultStatus').text('Good! Keep practicing.').css('color', '#ffc107');
        } else {
            $('#resultStatus').text('Needs improvement. Review the basics.').css('color', '#E63946');
        }
    }

    // Quiz buttons
    $('#retryQuizBtn').click(function () {
        currentQuestion = 0;
        userAnswers = [];
        timeLeft = 300;
        $('#quizResults').hide();
        $('#quizContent').show();
        startTimer();
        loadQuestion();
    });

    $('#closeQuizBtn').click(function () {
        $('#quizContainer').slideUp();
        $('#startQuizBtn').show();
        currentQuestion = 0;
        userAnswers = [];
        timeLeft = 300;
        $('#quizResults').hide();
        $('#quizContent').show();
        clearInterval(quizTimer);
    });

    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();

        const target = $(this).attr('href');
        if (target === '#') return;

        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 800);
    });

    // Navbar scroll effect
    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });

    // Enrollment form submission
    $('#enrollmentForm').submit(function (e) {
        e.preventDefault();
        alert('Thank you for registering! We will contact you shortly to schedule your free trial class.');
        this.reset();
    });

    // Add Japanese background elements dynamically
    function addJapaneseElements() {
        const elements = [
            { class: 'sakura', text: '🌸', top: '15%', left: '3%' },
            { class: 'sakura', text: '🌸', top: '25%', right: '5%' },
            { class: 'kanji', text: '語', top: '40%', left: '2%' },
            { class: 'kanji', text: '学', bottom: '30%', right: '3%' },
            { class: 'torii', text: '⛩️', bottom: '10%', left: '5%' }
        ];

        const sections = ['hero-section', 'about-sensei', 'class-system'];

        sections.forEach(sectionClass => {
            const section = document.querySelector(`.${sectionClass}`);
            if (section) {
                elements.forEach(el => {
                    const element = document.createElement('div');
                    element.className = `japanese-bg-element ${el.class}`;
                    element.textContent = el.text;
                    element.style.position = 'absolute';
                    element.style.opacity = '0.1';
                    element.style.zIndex = '1';
                    element.style.fontSize = el.class === 'sakura' ? '4rem' : '3rem';

                    if (el.top) element.style.top = el.top;
                    if (el.bottom) element.style.bottom = el.bottom;
                    if (el.left) element.style.left = el.left;
                    if (el.right) element.style.right = el.right;

                    section.appendChild(element);
                });
            }
        });
    }

    // Call the function to add elements
    addJapaneseElements();

    // Initialize with scroll check
    $(window).trigger('scroll');
});