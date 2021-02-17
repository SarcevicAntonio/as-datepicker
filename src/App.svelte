<script>
  import Datepicker from "./Datepicker.svelte";
  let value;
</script>

<Datepicker bind:value>
  label
</Datepicker>
<br />

<!-- Comparison to <input type="date"> -->
<label>
  label
  <input type="date" bind:value>
</label>
<br>
value: {value}