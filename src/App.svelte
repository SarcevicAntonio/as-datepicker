<script>
  import Datepicker from "./Datepicker.svelte";
  let value = "2000-01-01";
</script>

<Datepicker bind:value>label</Datepicker>
<br />

<!-- Comparison to <input type="date"> -->
<label>
  label
  <input type="date" bind:value />
</label>
<br />
value: {value}
