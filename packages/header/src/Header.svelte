<svelte:options tag="marvel-header" />

<script lang="ts">
  import { createEventDispatcher, afterUpdate, onMount } from 'svelte';
  import 'marvel-navigation';
  export let details = null;
  export let total = null;
  export let offset = null;

  const dispatch = createEventDispatcher();
  let navigation;
  let query = '';

  afterUpdate(() => {
    navigation.$set({ details, total, offset });
	});

  onMount(() => {
    navigation.$on('onPageChange', event => dispatch('onPageChange', { offset: event.detail.offset }));
  });

	const onSubmit = e => {
    dispatch('onSubmit', {
      query
    });
		e.preventDefault();
	};

	const onChange = e => {
    query = e.target.value
    dispatch('onChange', {
      query
    });
  };
</script>

<header>
	<h1>MARVEL</h1>
	<form class="search" on:submit={onSubmit}>
	  <input type="text" on:input={onChange} value={query} />
	  <input type="submit" value="🔎" />
	</form>
	<marvel-navigation bind:this={navigation} />
</header>

<style>
  * {
    box-sizing: border-box;
  }
  :host {
    position: sticky;
  top: 0;
  z-index: 1;
  flex: 0 0 auto;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
  }
	header {
		display: grid;
		align-items: center;
		grid-template-columns: 1fr 1fr 1fr;
		padding: 1rem;
		background-color: rgba(255,255,255,0.8);
  }

  h1 {
    justify-self: start;
    height: calc(2.5rem / 1.3);
    margin: 0;
    font-size: 1.3rem;
    letter-spacing: -0.2rem;
    color: #fff;
    background: #EC1D24;
    padding: 0.05rem 0.3rem;
    display: inline-block;
    text-align: center;
    transform: scaleY(1.3);
    line-height: calc(2.5rem / 1.3);
  }

  .search {
		flex: 0 1 20rem;
		position: relative;
		margin: 0 0.5rem;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    font-size: 1rem;
    border: none;
    background-color: transparent;
    outline: none;
  }

  [type=text] {
    width: 100%;
    padding: 0.5rem 3rem 0.5rem 1.25rem;
    border: 1px solid #ccc;
    border-radius: 1.25rem;
    height: 2.5rem;
    border: 0;
    background-color: #eee;
    transition: box-shadow linear 0.2s;
  }

  [type=text]:focus {
    box-shadow: inset 0 0 0 4px #ddd;
  }

  [type=submit] {
    position: absolute;
    top: 1px;
    right: 1px;
    width: calc(2.5rem - 2px);
    height: calc(2.5rem - 2px);
    cursor: pointer;
    border-radius: 50%;
    transition: background-color linear 0.2s;
  }

  [type=submit]:focus {
    background-color: #ddd;
  }
		
  marvel-navigation {
    justify-self: end;
  }
</style>