<svelte:options tag="marvel-character" />

<script>
  import { createEventDispatcher } from 'svelte';
  export let character;

  const dispatch = createEventDispatcher();

  $: src = `${character?.thumbnail.path}/standard_medium.${character?.thumbnail.extension}`;
  const displayDetails = () => dispatch('click', { character });
</script>

{#if character}
  <button class="character" on:click={displayDetails}>
    <img class="avatar" src={src} alt={character.name}/>
    <span class="name">{character.name}</span>
  </button>
{/if}

<style>
  .character {
    display: inline-flex;
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    outline: none;
    border: 0;
    border-radius: 1rem;
    background-color: transparent;
    transition: background-color linear 0.2s;
  }

  .character:focus {
    background-color: #ddd;
  }

  .character:hover .avatar { transform: scale(1.1)}

  .avatar {
    width: 6.75rem;
    height: 6.75rem;
    margin-bottom: 0.5rem;
    border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 0 15px #ccc;
    transition: transform linear 0.2s;
  }

  .name {
    font-weight: 100;
    font-size: 0.8rem;
  }
</style>