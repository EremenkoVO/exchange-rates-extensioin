(function (){
    // Вызываем функцию для получения курс валют
    (function () {
        var rate = null;
        self = this;

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                renderRate(this.responseText);
            }
        });

        xhr.open("GET", "https://www.cbr-xml-daily.ru/daily_json.js");
        xhr.send();
    })();

    /**
     * @param {*} current 
     * @param {*} previous 
     */
    function difference (current, previous) {
        if (current > previous) return ' ▲';
        if (current < previous) return ' ▼';
        return '';
    }

    /**
     * Отображение данных
     * @param {*} rate 
     */
    function renderRate (rate) {
        rate = JSON.parse(rate);
        var div = document.createElement('div');
        div.className = 'valute';
        div.innerHTML = `<h3>${rate.Valute.USD.Name}: ${
      rate.Valute.USD.Value
    } ${difference(rate.Valute.USD.Value, rate.Valute.USD.Previous)} </h3> 
                        <h3>${rate.Valute.EUR.Name}: ${
      rate.Valute.EUR.Value
    } ${difference(rate.Valute.EUR.Value, rate.Valute.EUR.Previous)}</h3>`;

    document.body.append(div);

        document.body.append(div);     
    }
}());
