$(document).ready(function () {
    $("[for='pseudonym_session_unique_id']").text("User Name");
    $("[for='pseudonym_session_unique_id_forgot']").text("User Name");
    $('#footer-links').hide();
    $('#footer-epilogue').hide();
    $('.ic-Login-footer__logo-link').attr('href','https://internationalschooling.org');
    $('.ic-Login-footer__logo-link').attr('aria-label','International Schooling');
    $('.ic-Login-footer__logo-link').attr('target','_blank');
    $('.ic-Login-header__logo').attr
    if(window.location.pathname.match(/^\/courses\/\d+/) && ENV.current_user_roles.indexOf('admin') < 0) {
        $('.settings').hide();
    }
    if( ENV.current_user_roles.indexOf('admin') < 0) {
        $('#global_nav_conversations_link').hide();
    }
});