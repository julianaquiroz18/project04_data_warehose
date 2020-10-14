$('.input-group-append').on('hide.bs.dropdown', function(event) {
    console.log(event)
    return !document.querySelector('.input-group-append').contains(event.clickEvent.target);
    //return false;
});

const interestRange = document.querySelector('.interest-range');
interestRange.addEventListener('mousemove', updateSelect)
const interestSelect = document.getElementById('interest-select');
interestSelect.addEventListener('change', updateRange)

function updateSelect() {
    const newValue = interestRange.value;
    interestSelect.value = newValue;
}

function updateRange() {
    const newValue = interestSelect.value;
    interestRange.value = newValue;
}