<svelte:options tag="marvel-loader" />

<script>
  export let centered;
</script>

<div class={`loader ${centered ? 'loader--centered' : ''}`}>
  Chargement ...
</div>

<style>
  .loader {
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    font-size: 0.5rem;
    animation: fadeIn 0.3s;
  }

  .loader:before,
  .loader:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 -5px 0 -1px #EC1D24;
    animation: rotate 1s infinite;
  }

  .loader:before {
    box-shadow: 0 -5px 0 -1px #EC1D24;
  }

  .loader:after {
    box-shadow: 0 5px 0 -1px #EC1D24;
  }

  .loader:not(.loader--centered) {
    position: relative;
  }

  .loader--centered {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotateZ(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>