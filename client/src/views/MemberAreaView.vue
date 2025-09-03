
<script setup>
import { ref } from 'vue';
import TabNav from "@/components/MemberArea/widgets/TabNav.vue";
import Tab from "@/components/MemberArea/widgets/Tab.vue";

const selected = ref('Home');

function setSelected(tab) {
  selected.value = tab;
}
</script>

<template>
  <div id="app">
  	<TabNav :tabs="['Home','Settings','Profile']":selected="selected" @selected="setSelected">
        <Tab :isSelected="selected === 'Home' ">
        	<h1>Put Home Content Here</h1>
        </Tab>
        <Tab :isSelected="selected === 'Settings' ">
        	<h1>Put Settings Content Here</h1>
        </Tab>
        <Tab :isSelected="selected === 'Profile' ">
        	<h1>Put Profile Content Here</h1>
        </Tab>
  	</TabNav>

  </div>

</template>
<style >
	#app {
       display: flex;
       flex-direction: row;
       justify-content: center;

	}
</style>


