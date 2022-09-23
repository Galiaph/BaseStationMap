<template>
  <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Base stations</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Operators
            </a>
            <ul class="dropdown-menu">
              <li v-for="item in operators" :key="item.id" :data="item">
                <a @click.prevent="select(item.id-1)" class="dropdown-item" href="#">{{ item.operator_name }}
                  <svg v-show="!item.change" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left float-end mt-1" viewBox="0 0 16 16">
                    <path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
                  </svg>
                  <svg v-show="item.change" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill float-end mt-1" viewBox="0 0 16 16">
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
                  </svg>
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
                  <div class="form-check">
                    <input @click="select_st(item.id, '2g')" class="form-check-input" type="checkbox" id="flexCheckDefault" :checked="item.standart2G">
                    <label for="standart2G" class="form-check-label">
                      2G
                    </label>
                  </div>
                </li>
                <li class="ms-2">
                  <div class="form-check">
                    <input @click="select_st(item.id, '3g')" class="form-check-input" type="checkbox" id="flexCheckDefault" :checked="item.standart3G">
                    <label for="standart3G" class="form-check-label">
                      3G
                    </label>
                  </div>
                </li>
                <li class="ms-2">
                  <div class="form-check">
                    <input @click="select_st(item.id, '4g')" class="form-check-input" type="checkbox" id="flexCheckDefault" :checked="item.standart4G">
                    <label for="standart4G" class="form-check-label">
                      4G
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
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
    }),
    props: {
      operators: Object
    },
    methods: {
      select: function (id) {
        this.$emit('selected', id)
      },
      select_st: function (id, st) {
        this.$emit('selected_st', {'id': id, 'st': st})
      }
    }
    // created: {
    // },
    // mounted: async function () {
    // }
}
</script>

<style>
</style>