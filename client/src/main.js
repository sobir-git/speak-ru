import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: "Speak Russian"
	}
});

export default app;