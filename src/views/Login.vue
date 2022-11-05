<template>
  <div class="login" id="login-box">
    <div id="login-box-header">
      <p>Карта покрытия</p>
    </div><!-- end of login-box-header -->
    <div id="login-box-body">
      <form name="main-login-form" @submit.prevent="login">
        <div class="tex">
          <label>Имя пользователя</label>
          <input v-model="username" type="text" autofocus="1" />
        </div>
        <div class="tex">
          <label>Пароль</label>
          <input v-model="password" type="password"/>
        </div>
        <div class="formsubmit">
          <input type="submit"/>
        </div>
      </form>
    </div><!-- end of login-box-body -->
    <div id="login-box-footer">
      <p>
        <span class="message">Авторизуйтесь, пожалуйста</span>
        <br/>
      </p>
    </div><!-- end of login-box-footer -->
  </div><!-- end of login-box -->
</template>

<script>

export default {
  // eslint-disable-next-line
  name: 'Login',
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    login: async function () {
      const username = this.username
      const password = this.password

      console.log(username + ' ' + password)
      if (!username) {
        // this.error = 'Введите логин'
        return
      }

      if (!password) {
        // this.error = 'Введите пароль'
        return
      }

      // if (this.error) {
      //   this.error = ''
      // }

      try {
        await this.$store.dispatch('login', {
          username,
          password
        })
        this.$router.push('/')
      } catch (err) {
        this.$store.commit('auth_error')
      }
    }
  }
}
</script>

<style scoped>
body {
  margin: 8px;
}

p {
  margin-top: 16px;
  margin-bottom: 16px;
}

div#login-box {
  margin: 10% 25%;
  border: 1px solid #7298c3;
  padding: 0 2%;
  color: #31608E;
}
div#login-box-header {
  padding: 0 2%;
  font-weight: bold;
  font-family: Verdana,Arial,sans-serif;
  font-size: 16px;
  border-bottom: 1px solid #7298c3;
  text-align: center;
}
div#login-box-footer {
  padding: 0 2%;
  font-family: Verdana,Arial,sans-serif;
  font-size: 12px;
  border-top: 1px solid #7298c3;
  text-align: center;
}
div#login-box-body {
  padding: 1% 2% 1% 2%;
  font-family: Verdana,Arial,sans-serif;
  font-size: 12px;
}
div#login-box-body div {
  height: 28px;
}
.tex label {
  display: block;
  float: left;
  width: 35%;
  text-align: right;
  padding-right: 1%;
}
.formsubmit {
  margin-left: 35%;
  /* padding-left: 1%; */
  text-align: left;
}

input {
  padding: 1px 2px;
}

.formsubmit input {
  padding: 1px 6px;
}
</style>
