<script>
  import Datepicker from "./Datepicker.svelte";
  let value;
</script>

{value}

<Datepicker bind:value />
<br />
<input type="date" bind:value/>