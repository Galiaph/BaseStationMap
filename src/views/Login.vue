<template>
<section class="h-100">
		<div class="container h-100">
			<div class="row justify-content-sm-center h-100">
				<div class="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
					<div class="text-center my-5">
						<img :src="require('@/assets/logo.jpg')" alt="logo" width="100">
					</div>
					<div class="card shadow-lg">
						<div class="card-body p-5">
							<h1 class="fs-4 card-title fw-bold mb-4 text-center">Карта покрытия</h1>
							<form method="POST" class="needs-validation" novalidate="" autocomplete="off" @submit.prevent="login">
								<div class="mb-3">
									<label class="mb-2 text-muted" for="email">Login</label>
									<input v-model="username" type="text" class="form-control" id="nameInput" autofocus required>
								</div>
								<div class="mb-3">
									<div class="mb-2 w-100">
										<label class="text-muted" for="password">Password</label>
									</div>
									<input type="password" class="form-control" v-model="password" id="passInput" required>
								</div>

								<div class="d-flex align-items-center">
									<button type="submit" class="btn btn-primary ms-auto">
										Login
									</button>
								</div>
							</form>
						</div>
						<div class="card-footer py-3 border-0">
							<div class="text-center">
								Нет аккаунта? <a href="mailto:galiaph@gmail.com" class="text-dark">Тогда тебе ко мне :)</a>
							</div>
						</div>
					</div>
					<div class="text-center mt-5 text-muted">
						Copyright &copy; 2022
					</div>
				</div>
			</div>
		</div>
	</section>
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

      if (!username) {
        document.getElementById('nameInput').focus()
        // this.error = 'Введите логин'
        return
      }

      if (!password) {
        document.getElementById('passInput').focus()
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

<style>
</style>
