<script lang="ts">
  import dayjs from "dayjs";
  import { clickOutside } from "./clickOutside.js";

  let date = dayjs();

  export let value: string;
  $: value = date.format("YYYY-MM-DD"); // standard type="date" value format, runs everytime date changes

  let days = []; // days in month for view
  let pads = 0;
  $: {
    days = [];
    for (let i = 1; i <= date.daysInMonth(); i++) {
      days.push(i);
    }
    days = days; // trigger svelte change detecion

    // calculate number of padding items needed for month
    pads = date.startOf("month").day() - 1;
    if (pads === -1) pads = 6;
    console.log(pads);
  }

  let open = false;

  function toggleOpen() {
    open = !open;
  }

  function add1(unit: dayjs.OpUnitType) {
    date = date.add(1, unit);
  }

  function subtract1(unit: dayjs.OpUnitType) {
    date = date.subtract(1, unit);
  }

  function setDay(day: number) {
    date = date.date(day);
    toggleOpen();
  }

  function setToday() {
    date = dayjs();
  }
</script>

<div class="container">
  <label>
    <span>
      <slot />
    </span>
    <input type="text" bind:value />
  </label>
  <button class="opener" on:click={toggleOpen}> 📅 </button>
  {#if open}
    <div class="picker" use:clickOutside on:clickedOutisde={toggleOpen}>
      <div class="flx-rw-c">
        <button on:click={() => subtract1("year")}>◀</button>
        <span>{date.year()}</span>
        <button on:click={() => add1("year")}>▶</button>
      </div>
      <div class="flx-rw-c">
        <button on:click={() => subtract1("month")}>◀</button>
        <span>{date.month() + 1}</span>
        <button on:click={() => add1("month")}>▶</button>
      </div>
      <div class="month-grid">
        {#each Array(pads) as _}
          <div class="pad" />
        {/each}
        {#each days as day}
          <button on:click={() => setDay(day)}>{day}</button>
        {/each}
      </div>
      <button on:click={setToday}>today</button>
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
