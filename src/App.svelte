<script>
  import Datepicker from "./Datepicker.svelte";
  let value;
</script>

<Datepicker bind:value>
  label
</Datepicker>
<br />

<label>
  label
  <input type="date" bind:value>
</label>
<br>
value: {value}