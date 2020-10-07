$('.input-group-append').on('hide.bs.dropdown', function(event) {
    console.log(event)
    return !document.querySelector('.input-group-append').contains(event.clickEvent.target);
    //return false;
});