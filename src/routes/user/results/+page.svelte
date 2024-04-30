<script lang="ts">
	import type { AnswerType } from '$lib/server/db/tables/answer/AnswerType';
	import type { AttemptType } from '$lib/server/db/tables/attempt/AttemptType';
	import type { PageData } from './$types';

    export let data: PageData;

    let attempts: AttemptType[];
    let selectedAttempt: AttemptType | null = null;
    let isModalOpen = false;


    $: if (attempts == null) {
        //console.log(data.attempts);
        attempts = data.attempts;
    }

    function closeModal() {
        isModalOpen = false;
    }

    function isAnswerSelected(questionId: number, answerId: number) {
        if(!selectedAttempt) return;
        return selectedAttempt.answeredQuestions.some(aq => aq.question_id === questionId && aq.answer_id === answerId);
    }

    function constructLabelContent(answer: AnswerType, questionId: number) {
        let content = '';
        if (answer.is_correct) {
            content += `<b style='color: green;'>${answer.answer_text}</b>`;
        } else {
            content += answer.answer_text;
        }
        if (isAnswerSelected(questionId, answer.id ?? 0)) {
            content += ' <b><- Jūsų pasirinkimas</b>';
        }
        return content;
    }
</script>


<div class="px-4 mt-5">
    <div class="card">
        <header class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <p class="title py-4 px-4">
                    Atlikti testai ir jų bandymai
                </p>
            </div>
        </header>
        <div class="card-content">
            <div class="content">
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th class="for-dark-mode">#</th>
                            <th class="for-dark-mode">Testo pavadinimas</th>
                            <th class="for-dark-mode">Atlikimo data</th>
                            <th class="for-dark-mode">Rezultatas</th>
                            <th class="for-dark-mode">Veiksmas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each attempts as attempt}
                            {#if attempt.id != null}
                                <tr>
                                    <td>{attempt.id}</td>
                                    <td>{attempt.quiz.title}</td>
                                    <td>{attempt.date.getFullYear() + "-" + (attempt.date.getMonth() + 1) + "-" + attempt.date.getDate()}</td>
                                    <td>{attempt.result}/{attempt.quiz.questions?.length ?? "NaN"}</td>
                                    <td>
                                        <button class="button is-small is-info" on:click={() => {
                                            selectedAttempt = attempt;
                                            isModalOpen = true;
                                        }}>Peržiūrėti</button>
                                    </td>
                                </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

{#if isModalOpen && selectedAttempt}
    <div class="modal is-active">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-background" on:click={closeModal}></div>
        <div class="modal-content" style="background-color: white; font-size:large; padding:3%;">
            <h2><b>Testo pavadinimas</b>: {selectedAttempt.quiz.title}</h2>
            <hr>
            <div style="margin-top:2%;">
                <h3><b>Atlikimo data:</b> {selectedAttempt.date.getFullYear() + "-" + (selectedAttempt.date.getMonth() + 1) + "-" + selectedAttempt.date.getDate()}</h3>
                <h3><b>Rezultatas:</b> {selectedAttempt.result}/{selectedAttempt.quiz.questions?.length ?? "NaN"}</h3>
                <hr>
                <h3>Atsakymai:</h3>
                <hr>
                {#if selectedAttempt.quiz.questions != null}
                    {#each selectedAttempt.quiz.questions as question}
                        <div class="field">
                            <label class="label" for="answers">
                                Klausimas: <i>{question.question_text}</i>
                            </label>
                            {#each question.answers as answer}
                                {#if question.id != null || answer.id != null}
                                    <div class="control" id="answers">
                                        <div class="field">
                                            <input class="is-checkradio" type="checkbox" name="answer" checked={isAnswerSelected(question.id ?? 0, answer.id ?? 0)} disabled />
                                            <label for="answer">
                                                {@html constructLabelContent(answer, question.id ?? 0)}
                                            </label>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" on:click={closeModal}></button>
    </div>
{/if}