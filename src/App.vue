<template v-cloak>
  <div id="app">
    <div class="form-control">
      <select class="select-control" v-model="valute">
        <option
          v-for="valute in listRates"
          :key="valute.ID"
          :value="valute.CharCode"
        >
          {{ valute.Name }}
        </option>
      </select>
      <button class="btn btn-primary br-l" @click="addRate(valute)">
        Добавить
      </button>
    </div>
    <div>
      <div class="list">
        <span>Выбранные валюты: </span>
        <button v-if="!isEdit" class="btn btn-primary" @click="goEdit">
          Редактировать
        </button>
        <button v-else class="btn btn-primary" @click="stopEdit">
          Закончить
        </button>
      </div>

      <div v-if="isSelectedRates" class="container-rates">
        <div v-for="rate in selectedRates" :key="rate" class="rate">
          <div>{{ getItemRate(rate, 'Name') }}</div>
          <div v-if="!isEdit">
            {{ getItemRate(rate, 'Value') }} {{ getArrow(rate) }}
          </div>
          <div v-else-if="isEdit">
            <button class="btn btn-delete" @click="deleteRate(rate)">X</button>
          </div>
        </div>
      </div>
      <div v-else class="center">Нет выбранных отслеживаемых валют</div>
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
    /**
     * Получение валют
     */
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

    /**
     * Добавить валюту
     */
    addRate(rate) {
      console.log(this.selectedRates.includes(rate));

      if (this.selectedRates.includes(rate)) return;

      this.selectedRates.push(rate);
      localStorage.setItem('rates', JSON.stringify(this.selectedRates));
      this.valute = '';
    },

    deleteRate(rate) {
      let listRates = this.selectedRates.filter((value) => {
        return value != rate;
      });

      this.selectedRates = listRates;
      localStorage.setItem('rates', JSON.stringify(this.selectedRates));
    },

    getItemRate(rate, field) {
      return this.listRates[rate][field];
    },

    getArrow(rate) {
      let current = this.listRates[rate].Value;
      let previous = this.listRates[rate].Previous;

      if (current < previous) {
        return '↓';
      } else {
        return '↑';
      }
    },

    goEdit() {
      this.isEdit = true;
    },

    stopEdit() {
      this.isEdit = false;
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400&display=swap');

v-cloak {
  display: none;
}

body {
  font-family: 'Ubuntu', Arial, Helvetica, sans-serif;
  width: 415px;
  height: 300px;
}

div {
  margin: 5px;
}

.list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.form-control {
  display: flex;
}

.select-control {
  font-family: 'Ubuntu', Arial, Helvetica, sans-serif;
  padding: 5px;
  border-radius: 5px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}

.btn {
  font-family: 'Ubuntu', Arial, Helvetica, sans-serif;
  border: 1px solid black;
  background: none;
  border-radius: 5px;
}

.btn-primary {
  color: #fff;
  background: #4285f4;
  border: 1px solid #4285f4;
  cursor: pointer;
}

.btn-delete {
  color: #f15642;
  cursor: pointer;
}

.br-l {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.container-rates {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: stretch;
  align-items: baseline;
}

.rate {
  width: 385px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  flex-wrap: nowrap;
}
</style>
