$(document).ready(function () {

    // Вызываем функцию для получения курс валют
    (function () {
        self = this;

        $.get({
            url: 'https://www.cbr-xml-daily.ru/daily_json.js'
        })
        .then(function (reponse) {
            var rate = JSON.parse(reponse);
            renderRate(rate);
        })
        .catch(function (error) {
            console.error(error.message);
        });
    })();

    function difference (current, previous) {
        if (current > previous) return ' ▲';
        if (current < previous) return ' ▼';
        return '';
    }

    function renderRate (rate) {
        $('#list').append('<h5>' + rate.Valute.USD.Name +': ' + rate.Valute.USD.Value + ' ' + difference(rate.Valute.USD.Value, rate.Valute.USD.Previous) + '</h5>'); 
        $('#list').append('<h5>' + rate.Valute.EUR.Name +': ' + rate.Valute.EUR.Value + ' ' + difference(rate.Valute.EUR.Value, rate.Valute.EUR.Previous) + '</h5>');       
    }
    
});