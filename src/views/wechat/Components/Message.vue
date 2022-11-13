<template>
<div>
	<!-- <div style="width:100%; height:1px; background-color: transparent;"></div> -->
	<div style="font-size:10px; color:skyblue;" :class="{'message-right':this.type}">{{this.time}} <b>{{this.name}}</b></div>
	<div class="message-frame" :class="{'message-right':this.type,'border-color':this.type}">
		{{this.content}}
	</div>
</div>
</template>

<script>
	export default {
		name: "Message",
		props: ["name", "time", "content", "type"]
	}
</script>

<style scoped>
	.message-frame {
		width: 75%;
		height: 100%;
		/* border: 1px solid #000000; */
		margin: 2%;
		padding: 2%;
		/* float: left; */
		word-wrap: break-word;
		overflow: hidden;
		background-color: rgb(229,229,229);
		border-radius: 10px;
		/* position: relative; */
	}

	.message-right {
		text-align: right;
		margin-left:25%;
	}

	.border-color {
		/* border-color: red; */
		background-color: rgb(18,193,245);
		color: #FFFFFF;
	}
</style>
