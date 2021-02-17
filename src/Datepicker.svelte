<script lang="ts">
  import dayjs from "dayjs";
  import { clickOutside } from "./clickOutside.ts";

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

<label>
  <span>
    <slot />
  </span>
  <input type="text" bind:value />
  <button class="opener" on:click={toggleOpen}> 📅 </button>
  {#if open}
    <div class="picker" use:clickOutside on:clickedOutisde={toggleOpen}>
      <div class="fr-sb-c">
        <button on:click={() => subtract1("year")}>◀</button>
        <span>{date.year()}</span>
        <button on:click={() => add1("year")}>▶</button>
      </div>
      <div class="fr-sb-c">
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
</label>

<style type="scss">
  label {
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
    .picker {
      position: absolute;
      right: 0;
      top: calc(100% + 4px);
      padding: 8px;
      height: fit-content;
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
      }
      .month-grid {
        display: grid;
        grid-template-columns: auto auto auto auto auto auto auto;
      }
    }
  }
</style>
