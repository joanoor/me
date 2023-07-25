<template>
  <div @click="handleThemeToggle(value)">
    <input type="checkbox" class="checkbox" id="checkbox" v-model="value">
    <label for="checkbox" class="checkbox-label">
      <font-awesome-icon class="fa-moon" icon="fa-solid fa-moon" />
      <font-awesome-icon class="fa-sun" icon="fa-solid fa-sun" />
      <span class="ball"></span>
    </label>
  </div>
</template>

<script setup lang="ts">
const value = ref(false)
const colorMode = useColorMode()

const handleThemeToggle = (value: boolean) => {
  if (value) {
    colorMode.preference = 'light'
  } else {
    colorMode.preference = 'dark'
  }
}




</script>

<style scoped lang="scss">
.checkbox {
  opacity: 0;
  position: absolute;
}

.checkbox-label {
  background-color: #111;
  box-sizing: border-box;
  width: 50px;
  height: 26px;
  border-radius: 50px;
  position: relative;
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fa-moon {
  color: #f1c40f;
}

.fa-sun {
  color: #f39c12;
}

.checkbox-label .ball {
  background-color: #fff;
  width: 22px;
  height: 22px;
  position: absolute;
  left: 2px;
  top: 2px;
  border-radius: 50%;
  transition: transform 0.2s linear;
}

.checkbox:checked+.checkbox-label .ball {
  transform: translateX(24px);
}
</style>

<style lang="scss">

html{
  body{
    transition: background 0.2s linear;
  }
}

html.dark-mode{
  body{
    background-color: #292c35 /* #9b59b6 */
  }
}

</style>