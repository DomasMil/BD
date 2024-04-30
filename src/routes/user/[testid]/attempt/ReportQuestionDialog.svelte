<script lang="ts">
	import type { QuestionType } from "$lib/server/db/tables/question/QuestionType";

    export let isOpen = false;
    export let question: QuestionType;
    export let onSelect: (question_id: number, explanation: string) => void;
    export let onClose: () => void;

    let explanation: string = '';

    function handleOk() {
        onSelect(question.id === undefined ? -1: question.id, explanation);
        onClose();
    }

    function handleCancel() {
        onClose();
    }
</script>

{#if isOpen}
<div class="dialog-backdrop">
    <div class="dialog">
        <h2>Cia aprasykite kodel klausimas yra blogas</h2>
        <textarea bind:value={explanation} rows="4" cols="50"></textarea>
        <button on:click={handleOk}>OK</button>
        <button on:click={handleCancel}>Cancel</button>
    </div>
</div>
{/if}

<style>
    .dialog-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialog {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h2, h3 {
        margin: 10px 0;
    }

    textarea {
        width: 100%;
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 10px 20px;
        margin-right: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: #007bff;
        color: white;
    }

    button:hover {
        background-color: #0056b3;
    }

    button:active {
        background-color: #004085;
    }
</style>

