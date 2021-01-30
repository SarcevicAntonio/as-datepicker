<script>
  import Datepicker from "./Datepicker.svelte";
  let value;
</script>

<Datepicker bind:value />
<br />
value: {value}
