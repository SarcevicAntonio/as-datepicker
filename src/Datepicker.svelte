<script lang="ts">
  import { clickOutside } from "./clickOutside.js";
  import dayjs from "dayjs";

  let date = dayjs();
  export let value: string;
  $: value = date.format("YYYY-MM-DD");

  let viewDate: dayjs.Dayjs;
  $: viewDate = date.clone();

  let days = [];
  let pads = 0;
  $: {
    days = [];
    for (let i = 1; i <= viewDate.daysInMonth(); i++) {
      days.push(i);
    }
    days = days;
    pads = viewDate.startOf("month").day() - 1;
    if (pads === -1) pads = 6;
    console.log(pads);
  }

  let open = false;

  function toggleOpen() {
    open = !open;
  }

  function add1View(unit: dayjs.OpUnitType) {
    viewDate = viewDate.add(1, unit);
  }

  function subtract1View(unit: dayjs.OpUnitType) {
    viewDate = viewDate.subtract(1, unit);
  }

  function setDay(day: number) {
    date = viewDate.date(day);
    toggleOpen();
  }

  function setToday() {
    date = dayjs();
    toggleOpen();
  }
</script>

<div class="container">
  <input type="text" bind:value />
  <button class="opener" on:click={toggleOpen}> 📅 </button>
  {#if open}
    <div class="picker" use:clickOutside on:clickedOutisde={toggleOpen}>
      <div class="flx-rw-c">
        <button on:click={() => subtract1View("year")}>◀</button>
        <span>{viewDate.year()}</span>
        <button on:click={() => add1View("year")}>▶</button>
      </div>
      <div class="flx-rw-c">
        <button on:click={() => subtract1View("month")}>◀</button>
        <span>{viewDate.month() + 1}</span>
        <button on:click={() => add1View("month")}>▶</button>
      </div>
      <button on:click={setToday}>today</button>
      <div class="month-grid">
        {#each Array(pads) as _}
          <div class="pad" />
        {/each}
        {#each days as day}
          <button on:click={() => setDay(day)}>{day}</button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  :root {
    --font: 400 16px Roboto, sans-serif;
  }
  .container {
    font: var(--font);
    font-size: 16px;
    position: relative;
  }
  .picker {
    position: absolute;
    background-color: white;
    top: 42px;
    bottom: 0;
    padding: 8px;
    height: fit-content;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
  }
  .flx-rw-c {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .month-grid {
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
  }
  input {
    font: var(--font);
    height: 32px;
    border: 1px solid black;
    border-radius: 0;
    padding-left: 8px;
  }
  button {
    font: var(--font);
    height: 36px;
    min-width: 36px;
    border: 1px solid black;
    border-radius: 0;
    margin: 4px;
  }
  .opener {
    background-color: transparent;
    border: none;
    margin: -41px;
  }
</style>
