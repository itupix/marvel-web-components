<svelte:options tag="marvel-navigation" />

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let details = null;
  export let total = null;
  export let offset = null;

  const dispatch = createEventDispatcher();

  $: isFirst = offset?.value === 0;
  $: numberOfPages = Math.ceil(total?.value / 20);
  $: currentPage = offset?.value / 20 + 1;
  $: isLast = numberOfPages === currentPage;
  $: isVisible = numberOfPages > 1 && !details?.value;

  const decrement = () => dispatch('onPageChange', { offset: offset.value - 20});
  const increment = () => dispatch('onPageChange', { offset: offset.value + 20});
</script>

<nav>
  {#if isVisible }
    <span>{currentPage} / {numberOfPages}</span>
    <button on:click={decrement} disabled={isFirst}>❮</button>
    <button on:click={increment} disabled={isLast}>❯</button>
  {/if}
</nav>

<style>
  * {
    box-sizing: border-box;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 12rem;
  }

  nav > * {
    animation: fadeIn 0.3s;
  }
  
  span {
    margin-right: 1rem;
    font-size: 0.8rem;
  }

  button {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0;
    padding: 0;
    cursor: pointer;
    border-radius: 50%;
    border: 0;
    outline: none;
    background-color: #eee;
    transition:
      background-color linear 0.2s;
  }

  button:not(:last-child) {
    margin-right: 0.5rem;
  }

  button:hover,
  button:focus {
    background-color: #ddd;
  }

  button:disabled {
    pointer-events: none;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
</style>