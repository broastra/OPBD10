$(document).ready(function() {
    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top - 70
        }, 800);
    });

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('scrolled');
        } else {
            $('#header').removeClass('scrolled');
        }
    });


    function checkScroll() {
        $('.fade-in').each(function() {
            var elementTop = $(this).offset().top;
            var windowBottom = $(window).scrollTop() + $(window).height();

            if (elementTop < windowBottom - 50) {
                $(this).addClass('visible');
            }
        });
    }


    $('.skill-level, .portfolio-item, .about-content > *').addClass('fade-in');

    $(window).scroll(checkScroll);
    checkScroll();


    function animateSkills() {
        $('.skill-level').each(function() {
            var level = $(this).data('level');
            $(this).css('width', level + '%');
        });
    }


    function checkSkills() {
        var skillsSection = $('#skills');
        var sectionTop = skillsSection.offset().top;
        var windowBottom = $(window).scrollTop() + $(window).height();

        if (sectionTop < windowBottom - 100) {
            animateSkills();
            $(window).off('scroll', checkSkills);
        }
    }

    $(window).scroll(checkSkills);
    checkSkills();


    $('#contact-form').on('submit', function(e) {
        e.preventDefault();

        var name = $('#name').val();
        var email = $('#email').val();
        var message = $('#message').val();
        var isValid = true;

        // Сброс предыдущих ошибок
        $('.error').remove();
        $('.form-group input, .form-group textarea').removeClass('error-border');

        // Валидация имени
        if (name.trim() === '') {
            $('#name').after('<div class="error">Пожалуйста, введите ваше имя</div>');
            $('#name').addClass('error-border');
            isValid = false;
        }

        // Валидация email
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            $('#email').after('<div class="error">Пожалуйста, введите корректный email</div>');
            $('#email').addClass('error-border');
            isValid = false;
        }

        // Валидация сообщения
        if (message.trim() === '') {
            $('#message').after('<div class="error">Пожалуйста, введите сообщение</div>');
            $('#message').addClass('error-border');
            isValid = false;
        }

        if (isValid) {
            // Имитация отправки формы
            alert('Сообщение отправлено! Спасибо за ваше сообщение.');
            $('#contact-form')[0].reset();
        }
    });


    $('.hamburger').on('click', function() {
        $('.nav-menu').toggleClass('active');
        $(this).toggleClass('active');
    });


    $('.nav-link').on('click', function() {
        $('.nav-menu').removeClass('active');
        $('.hamburger').removeClass('active');
    });
});


$('<style>.error { color: #e74c3c; font-size: 0.9rem; margin-top: 5px; } .error-border { border-color: #e74c3c !important; }</style>').appendTo('head');