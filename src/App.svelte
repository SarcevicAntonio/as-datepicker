<script>
  import Datepicker from "./Datepicker.svelte";
  let value;
</script>

<Datepicker bind:value>
  hello
</Datepicker>
<br />
<input type="date" bind:value>
<br>
value: {value}
