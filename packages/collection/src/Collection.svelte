<svelte:options tag="marvel-collection" />

<script>
  export let collection = [];
</script>

<ul>
  {#each collection as { title, src }}
    <li key={title}>
      <img src={src} alt={title}/>
      {title}
    </li>
  {:else}
    <p class="tab-content__message">Cette collection est vide.</p>
  {/each}
</ul>

<style>
  ul {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 100px 100px 100px 100px 100px 100px 100px 100px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    font-size: 0.6rem;    
  }

  img {
    width: 100px;
    height: 150px;
    margin-bottom: 0.5rem;
  }

  p {
    margin-top: 2rem;
    text-align: center;
  }
</style>