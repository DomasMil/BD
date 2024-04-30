<script lang="ts">
	import type { QuizType } from "$lib/server/db/tables/quiz/QuizType";
    export let isOpen = false;
    export let quizes = [] as QuizType[];
    export let onSelect: (selectedItem: number) => void;
    export let onClose: () => void;

    let selectedValue: number = -1 ;

    function handleOk() {
        onSelect(selectedValue);
        onClose();
    }

    function handleCancel() {
        onClose();
    }
</script>

{#if isOpen}
<div class="dialog-backdrop">
    <div class="dialog">
        <h2>Kopijuoti testą iš</h2>
        <select bind:value={selectedValue}>
            {#each quizes as option}
            <option value={option.id}>{option.title}</option>
            {/each}
        </select>
        <button on:click={handleOk}>Kopijuoti</button>
        <button on:click={handleCancel}>Atšaukti</button>
    </div>
</div>
{/if}


<style>
    .dialog-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .dialog {
        background-color: #f2f2f2;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        width: 300px;
        text-align: center;
    }

    select {
        width: 100%;
        padding: 8px 12px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: white;
    }

    button {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        background-color: #007bff;
        color: white;
        font-size: 14px;
        cursor: pointer;
        margin-right: 10px;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #0056b3;
    }

    button:last-child {
        margin-right: 0;
    }
</style>

