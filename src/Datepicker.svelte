<svelte:options tag="as-datepicker" />

<script lang="ts">
  import dayjs from "dayjs";
  import { clickOutside } from "./clickOutside.ts";
  import { createPopperActions } from 'svelte-popperjs';

  const [popperRef, popperContent] = createPopperActions();
  const popperOptions = {};

  // picker open state
  let open = false;
  function toggleOpen() {
    open = !open;
  }

  // internal date
  let date = dayjs();
  // external value
  export let value: string;
  $: value = date.format("YYYY-MM-DD"); // standard type="date" value format, runs everytime date changes

  // clickable days in month
  let days = [];
  $: {
    days = [];
    for (let i = 1; i <= date.daysInMonth(); i++) {
      days = [...days, i];
    }
  }

  // padding items needed for month
  let pads = 0;
  $: {
    pads = date.startOf("month").day() - 1;
    if (pads === -1) pads = 6;
  }

  // years selector
  let years = [];
  let selectYear = 0;
  $: {
    years = [];
    const min = date.subtract(100, "year").year();
    for (let i = min; i <= min + 200; i++) {
      years = [...years, i];
    }
    selectYear = date.year();
  }

  function setSelectYear() {
    date = date.set("year", selectYear);
  }

  // months selector
  let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let selectMonth = 0;
  $: {
    selectMonth = date.month();
  }

  function setSelectMonth() {
    date = date.set("month", selectMonth);
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

<label use:popperRef>
  <span>
    <slot />
    <input type="text" bind:value />
  </label>
  <button class="opener" on:click={toggleOpen}> 📅 </button>
</label>
{#if open}
<div class="picker" use:clickOutside on:clickedOutisde={toggleOpen} use:popperContent={popperOptions}>
  <div class="fr-sb-c">
    <button on:click={() => subtract1("year")}>◀</button>
    <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value={selectYear} on:change={setSelectYear}>
      {#each years as year}
        <option value={year}>{year}</option>
      {/each}
    </select>
    <button on:click={() => add1("year")}>▶</button>
  </div>
  <div class="fr-sb-c">
    <button on:click={() => subtract1("month")}>◀</button>
    <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value={selectMonth} on:change={setSelectMonth}>
      {#each months as months}
        <option value={months}>{months + 1}</option>
      {/each}
    </select>
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

<style type="scss">
  .container {
    position: relative;
    display: inline-block;
    .opener {
      box-sizing: border-box;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(-25%, -50%);
      height: inherit;
      margin: 0;
      padding: 0;
      background-color: transparent;
      border: none;
    }
  }
    .picker {
      // position: absolute;
      // right: 0;
      // top: calc(100% + 4px);
      padding: 8px;
      height: fit-content;
      width: fit-content;
      display: flex;
      flex-direction: column;

      // TODO: Needs to be configurable
      background-color: white;
      border: 1px solid black;
      border-radius: 4px;

      .fr-sb-c {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        select {
          min-width: 80px;
          text-align-last: center;
        }
      }
      .month-grid {
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto;
      }
    }
</style>
