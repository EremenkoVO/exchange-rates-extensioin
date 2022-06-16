<template v-cloak>
  <div id="app">
    <div style="width: 500px;">
      <select v-model="valute">
        <option v-for="rate in listRates" :key="rate.ID" :value="rate.CharCode">
          {{rate.Name}}
        </option>
      </select>

      <div class="body-btn">
        <button @click="addRate">
          Добавить
        </button>
        <button @click="editRates">
          {{ !isEdit ? 'Ред. список' : 'Сохранить'}}
        </button>
      </div>

      <div class="rates" v-if="isSelectedRates">
        <div class="rate" v-for="rate in selectedRates" :key="rate.ID">
          <span>{{ getItemRate(rate, 'Name')}}</span>
          <span v-if="!isEdit" v-html="getArrowRate(rate)"></span>
          <span v-if="isEdit" class="delete" @click="deleteRate(rate)">Удалить</span>
        </div>
      </div>

      <div class="rates-empty" v-else>
        Нет валют для отслеживания
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    listRates: null,
    valute: null,
    selectedRates: [],
    isEdit: false,
  }),
  computed: {
    isSelectedRates() {
      return this.selectedRates.length > 0;
    },
  },
  created() {
    this.getRates();
  },
  methods: {
    // Получение валют
    getRates() {
      const URL = 'https://www.cbr-xml-daily.ru/daily_json.js';
      fetch(URL)
        .then(async (res) => {
          let list = await res.json();
          this.listRates = list.Valute;
        })
        .then(() => {
          let savedRates = JSON.parse(localStorage.getItem('rates'));
          if (savedRates) this.selectedRates = savedRates;
        });
    },

    // Получаем значение поля
    getItemRate(rate, field) {
      return this.listRates[rate][field];
    },

    // 
    getArrowRate(rate) {
      let html;

      let previous = this.listRates[rate].Previous;
      let value = this.listRates[rate].Value;

      html = previous > value ? `<span style="color: #eb5757">${value} ▼</span>` : `<span style="color: #7bffb2">${value} ▲</span>`
      
      return html
    },

    // Режим редактирования списка
    editRates() {
      this.isEdit = !this.isEdit
    },

    // Удаление списка
    deleteRate(rate) {
      let listRates = this.selectedRates.filter((value) => {
        return value != rate;
      });

      this.selectedRates = listRates;
      localStorage.setItem('rates', JSON.stringify(this.selectedRates));
    },

    // Добавление валюты в список
    addRate() {
      if (this.selectedRates.includes(this.valute)) return;

      this.selectedRates.push(this.valute);
      localStorage.setItem('rates', JSON.stringify(this.selectedRates));
      this.valute = '';
    }
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');

v-cloak {
  display: none;
}

#app {
  max-width: 530px;
  min-width: 510px;
  min-height: 400px;
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: scroll;
}

body {
  background-color: #161730;
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
  max-width: 530px;
  min-width: 510px;
  min-height: 400px;
  max-height: 600px;
  overflow-y: auto;
}

input, select, option, button {
  font-family: 'Montserrat', Arial, Helvetica, sans-serif;
}

select {
  background: url(search-icon.svg) no-repeat scroll 7px 7px;
  padding: 10px 12px 10px 30px;
  border: 2px solid transparent;
  border-radius: 10px;
  width: 500px;
  color: #212246;
  background-color: #838C9E;
  transition: 250ms;
  margin-bottom: 15px;
}

select:focus {
  border: 2px solid white
}

*,*:focus,*:hover{
  outline:none;
}

.rates-empty {
  color: white;
  display: flex;
  height: 300px;
  align-content: center;
  align-items: center;
  justify-content: center;
}

.rates {
  display: flex;
  flex-direction: column;
  transition: 250ms;
}

.rates > .rate {
  display: flex;
  justify-content: space-between;
  background: #212246;
  border-radius: 10px;
  padding: 10px 12px;
  width: 476px;
  color: white;
  margin-bottom: 15px;
  transition: 250ms;
}

.body-btn {
  width: 500px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.body-btn > button {
  width: 240px;
  border-radius: 10px;
  padding: 10px 20px;
  border: 1px solid #212246;
  background-color: #212246;
  color: white;
  cursor: pointer;
  transition: 250ms;
}

.body-btn > button:active {
  border: 1px solid #080913;
  background-color: #080913;
}

.body-btn > button:hover {
  border: 1px solid #33346c;
  background-color: #33346c;
}

.delete {
  color: #eb5757;
  padding: 0px;
  cursor: pointer;
}
</style>
