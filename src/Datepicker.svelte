<svelte:options tag="as-datepicker" />

<script lang="ts">
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { createPopperActions } from "svelte-popperjs";
  import { slide } from "svelte/transition";
  import { clickOutside } from "./clickOutside.ts";

  /**
   * svelte-popperjs config
   */

  const [popperRef, popperContent] = createPopperActions();
  const popperOptions = {
    placement: "bottom",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [2, 8],
        },
      },
    ],
  };

  /**
   * Value Logic
   */

  let date = dayjs(); // internal date
  export let value: string; // external value
  let inputValue: string; // value bound to the input
  let mounted = false;

  onMount(() => {
    if (value) {
      const newDate = dayjs(value);
      if (newDate.isValid()) {
        date = newDate;
      }
    } else {
      date = dayjs();
    }
    mounted = true;
  });

  // prevents initial rewriting of mounted
  $: if (mounted) {
    value = date.format("YYYY-MM-DD"); // standard type="date" value format, runs everytime date changes
  }
  $: inputValue = value;
  // writes inputValue to value if valid
  function focusoutHandler() {
    const newDate = dayjs(inputValue);
    if (newDate.isValid()) {
      date = newDate;
    }
    inputValue = value;
  }

  /**
   * GUI Logic
   */

  let open = false; // picker open state
  function toggleOpen() {
    open = !open;
  }

  let days = []; // clickable days
  $: {
    days = [];
    for (let i = 1; i <= date.daysInMonth(); i++) {
      days = [...days, i];
    }
  }

  let pads = 0; // padding for days
  $: {
    pads = date.startOf("month").day() - 1;
    if (pads === -1) pads = 6;
  }

  let selectYear = 0; // select dropdown
  let years = [];
  $: {
    years = [];
    const min = date.subtract(100, "year").year();
    for (let i = min; i <= min + 200; i++) {
      years = [...years, i];
    }
    selectYear = date.year();
  }
  let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let selectMonth = 0;
  $: {
    selectMonth = date.month();
  }

  /**
   * date setting functions
   */

  function setSelectYear() {
    date = date.set("year", selectYear);
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

<div class="as-datepicker-container">
  <label>
    <slot />
    <input
      use:popperRef
      type="text"
      bind:value={inputValue}
      on:focusout={focusoutHandler}
    />
  </label>
  <button class="opener" on:click={toggleOpen}> 📅 </button>
</div>
{#if open}
  <div
    class="picker"
    use:clickOutside
    on:clickedOutisde={toggleOpen}
    use:popperContent={popperOptions}
    transition:slide
  >
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
      {#each ["M", "T", "W", "T", "F", "S", "S"] as weekday}
        <button disabled>{weekday}</button>
      {/each}
      {#each Array(pads) as _}
        <div class="pad" />
      {/each}
      {#each days as day}
        <button
          on:click={() => setDay(day)}
          class:current-day={selectYear === dayjs().year() &&
            day === dayjs().date()}
          class:selected-day={day === date.date()}
        >
          {day}
        </button>
      {/each}
    </div>
    <button on:click={setToday}>today</button>
  </div>
{/if}

<style type="scss">
  .current-day {
    border-color: yellowgreen;
  }
  .selected-day {
    background-color: green;
    color: white;
  }
  .as-datepicker-container {
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
