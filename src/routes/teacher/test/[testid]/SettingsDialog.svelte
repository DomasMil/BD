<script lang="ts">
    import type { QuizType } from "$lib/server/db/tables/quiz/QuizType";
    export let isOpen = false;
    export let quiz = {} as QuizType;
    export let onSubmit: (selectedItem: QuizType) => void;
    export let onClose: () => void; 

    let isReusable: boolean = false;
    let canNavigate: boolean = false
    let duration = 0;
    

    $: if (canNavigate) {
        quiz.can_navigate = 1;
    }  else if (!canNavigate){
        quiz.can_navigate = 0;
    }
    
    $: if (isReusable) {
        quiz.is_reusable = 1;
    } else if (!isReusable) {
        quiz.is_reusable = 0;
    }

    $: if (duration){
        quiz.duration = duration * 60;
    }

    function handleOk() {
        quiz.duration = duration;
        onSubmit(quiz);
        onClose();
    }

    function handleCancel() {
        onClose();
    }
</script>

{#if isOpen}
<div class="overlay"></div>
<div class="dialog">
    <form on:submit|preventDefault={handleOk} class="form">
        <div class="form-group">
            <label>
                Ar gali vaikščioti per klausimus:
                <input type="checkbox" bind:checked={canNavigate}>
            </label>
        </div>
        
        <div class="form-group">
            <label>
                Trūkmė minutėmis:
                <input type="number" min="0" bind:value={duration}>
            </label>
        </div>

        <div class="form-group">
            <label>
                Pernaudojamas:
                <input type="checkbox" bind:checked={isReusable}>
            </label>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Išsaugoti nustatymus</button>
            <button type="button" class="btn btn-secondary" on:click={handleCancel}>Atšaukti</button>
        </div>
    </form>
</div>
{/if}

<style>
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6); /* semi-transparent black background */
      z-index: 1; /* Ensures the overlay is below the dialog */
    }
  
    .dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      z-index: 2; /* Ensures the dialog is above the overlay */
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Optional: adds shadow for better focus */
    }
  
    /* Hides the overlay and dialog when not open */
    .hidden {
      display: none;
    }

    .form {
    display: flex;
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
  }

  .btn {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-primary {
    background-color: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #545b62;
  }

  input[type='checkbox'] {
    margin-left: 10px;
  }

  input[type='number'] {
    margin-left: 10px;
    width: 100%;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  </style>