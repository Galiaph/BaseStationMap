<template>
  <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;">
    <div class="container-fluid">
      <span class="navbar-brand">Карта сети</span>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Мобильные
            </a>
            <ul class="dropdown-menu">
              <li v-for="item in operators" :key="item.id" :data="item">
                <a @click.prevent="select(item.id-1)" class="dropdown-item" style="padding: 3px;" href="#">
                  <svg v-show="!item.change" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left mb-1" viewBox="0 0 16 16">
                    <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                  </svg>
                  <svg v-show="item.change" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill mb-1" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                  </svg>
                  {{ item.operator_name }}
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown" v-for="item in operators" :key="item.id" :data="item">
            <div v-if="item.change">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {{ item.operator_name }}
              </a>
              <ul class="dropdown-menu">
                <li class="ms-2">
                  <a @click.prevent="select_st(item.id, '2g')" class="dropdown-item" style="padding: 3px;" href="#">
                    <svg v-show="!item.standart2G" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left mb-1" viewBox="0 0 16 16">
                      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                    </svg>
                    <svg v-show="item.standart2G" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill mb-1" viewBox="0 0 16 16">
                      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg>
                    2G
                  </a>
                </li>
                <li class="ms-2">
                  <a @click.prevent="select_st(item.id, '3g')" class="dropdown-item" style="padding: 3px;" href="#">
                    <svg v-show="!item.standart3G" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left mb-1" viewBox="0 0 16 16">
                      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                    </svg>
                    <svg v-show="item.standart3G" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill mb-1" viewBox="0 0 16 16">
                      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg>
                    3G
                  </a>
                </li>
                <li class="ms-2">
                  <a @click.prevent="select_st(item.id, '4g')" class="dropdown-item" style="padding: 3px;" href="#">
                    <svg v-show="!item.standart4G" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left mb-1" viewBox="0 0 16 16">
                      <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                    </svg>
                    <svg v-show="item.standart4G" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill mb-1" viewBox="0 0 16 16">
                      <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                    </svg>
                    4G
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Проводные
            </a>
            <ul class="dropdown-menu">
              <li v-for="item in providers" :key="item.id" :data="item">
                <a @click.prevent="select_p(item.id-1)" class="dropdown-item" style="padding: 3px;" href="#">
                  <svg v-show="!item.change" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left mb-1" viewBox="0 0 16 16">
                    <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                  </svg>
                  <svg v-show="item.change" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill mb-1" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                  </svg>
                  {{ item.provider_name }}
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item dropdown" v-show="lines.length">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Линии
            </a>
            <ul class="dropdown-menu">
              <li v-for="item in lines" :key="item" :data="item">
                <a @click.prevent="select_ln(item.markerId)" class="dropdown-item" style="padding: 3px;" href="#">
                  <!-- <svg v-show="!item.change" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left float-end mt-1" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                  </svg> -->
                  <svg v-show="item.selected" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill mb-1" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                  </svg>
                  {{ item.properties.hintContent }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div class="form-check right">
          <input class="form-check-input" type="checkbox" value="false" id="flexCheckDefault" @click="lineChange">
          <label class="form-check-label" for="flexCheckDefault">
            Магистрали
          </label>
        </div>
        <form class="d-flex" role="search" @submit.prevent="search">
          <input ref="searchinput" class="form-control me-2 dropdown-toggle" type="search" placeholder="поиск по базам" aria-label="Search" v-model="searchText" autocomplete="off" aria-expanded="false" @keyup="find" @focus="searchKey(true)" @blur="searchKey(false)">
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="mkdocs-search-query" ref="searchlist">
            <a v-for="item in searchItem" :key="item" class="dropdown-item" @click="searchClick(item)" href="#">{{ item.bs_name }}</a>
          </div>
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  // eslint-disable-next-line
    name: 'Headers',
    data: () => ({
      searchText: '',
      searchItem: [{bs_name: 'No results found'}],
      line: false
    }),
    props: {
      baseStations: Array,
      operators: Object,
      providers: Object,
      lines: Object,
    },
    computed: {
    },
    methods: {
      lineChange: function() {
        this.line = !this.line
        this.$emit('selected_line', this.line)
      },
      select: function (id) {
        this.$emit('selected', id)
      },
      select_p: function (id) {
        this.$emit('selected_p', id)
      },
      select_st: function (id, st) {
        this.$emit('selected_st', {'id': id, 'st': st})
      },
      select_ln: function (id) {
        this.$emit('selected_ln', id)
      },
      search: function () {
        this.$emit('searchBase', this.searchText)
      },
      searchKey: async function(state) {
        if (state) {
          let search = this.$refs.searchlist
          let rect = this.$refs.searchinput.getBoundingClientRect()       
          search.style = 'top: ' + (rect.top + 40) +'px;'
          search.classList.add('show')
        } else {
          await setTimeout(() => {
            this.$refs.searchlist.classList.remove('show')
          }, 100)
        }
      },
      find: function() {
        if (this.searchText.length != 0) {
          this.searchItem = this.baseStations.filter(item => {
            return item.bs_name.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())
          }).slice(0, 5)
        } else {
          this.searchItem = [{bs_name: 'No results found'}]
        }
      },
      searchClick: function(item) {
        if (item.bs_name === 'No results found') return

        this.searchText = item.bs_name
        this.search()
      }
    }
}
</script>

<style>
.form-check,.right {
  padding-right: 10px;
}

.dropdown-menu {
  max-height: 100px;
  overflow-y: scroll;
}
</style>