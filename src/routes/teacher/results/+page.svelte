<script lang="ts">
	import type { AnswerType } from '$lib/server/db/tables/answer/AnswerType';
	import type { AttemptType } from '$lib/server/db/tables/attempt/AttemptType';
	import type { UserType } from '$lib/server/db/tables/user/UserType';
	import type { PageData } from './$types';

    import * as XLSX from 'xlsx';

    export let data: PageData;

    let selectedAttempt: AttemptType | null = null;
    let selectedQuizId: string = 'all';
    let isModalOpen = false;

    let users: UserType[];

    $: {
        //console.log(data);
        if(users == null){
            users = data.users;
        }
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
            content += ' <b><- Atlikėjo pasirinkimas</b>';
        }
        return content;
    }

    function getUserName(userId: number) {
        const user = users.find(u => u.id === userId);
        return user ? user.name : 'Nežinomas';
    }

    function handleQuizChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        selectedQuizId = selectElement.value;
    }

    $: filteredAttempts = selectedQuizId === 'all' 
        ? data.quizzes.flatMap(quiz => quiz.attempts)
        : data.quizzes.find(quiz => quiz.id?.toString() === selectedQuizId)?.attempts || [];

    function exportToExcel() {
        const wb = XLSX.utils.book_new();

        const attemptsData = convertAttemptsToJSON().attempts;
        const questionsAnswersData = convertAttemptsToJSON().questionsAnswers;

        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(attemptsData), "Bandymai");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(questionsAnswersData), "Klausimai ir Atsakymai");

        XLSX.writeFile(wb, "Visi_Bandymai.xlsx");
    }

    function convertAttemptsToJSON() {
        let attemptsData: any = [];
        let questionsAnswersData: any = [];

        filteredAttempts.forEach((attempt, attemptIndex) => {
            let attemptId = `Bandymas-${attemptIndex + 1}`;
            attemptsData.push({
                'Bandymo ID': attemptId,
                'Testo Pavadinimas': attempt.quiz.title,
                'Atlikimo Data': attempt.date.toISOString().split('T')[0],
                'Atlikėtojas': getUserName(attempt.user_id),
                'Rezultatas': `${attempt.result}/${attempt.quiz.questions?.length ?? "NaN"}`,
            });

            attempt.quiz.questions?.forEach((question, qIndex) => {
                question.answers.forEach((answer, aIndex) => {
                    questionsAnswersData.push({
                        'Attempt ID': attemptId,
                        'Klausimas': question.question_text,
                        'Atsakymas': answer.answer_text,
                        'Pasirinktas': isAnswerSelected(question.id ?? 0, answer.id ?? 0) ? 'Taip' : 'Ne',
                        'Teisingas': answer.is_correct ? 'Taip' : 'Ne',
                    });
                });
            });
        });

        return { attempts: attemptsData, questionsAnswers: questionsAnswersData };
    }

</script>


<div class="px-4 mt-5">
    <div class="card">
        <header class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <p class="title py-4 px-4">
                    Atlikti testų bandymai
                </p>
            </div>
            <div class="card-header-icon">
                <div class="select">
                    <select on:change={handleQuizChange}>
                        <option value="all" selected>Visi testai</option>
                        {#each data.quizzes as quiz}
                            <option value={quiz.id}>{quiz.title}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="card-header-icon">
                <button type="button" class="button is-primary" on:click={exportToExcel}>Eksportuoti</button>
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
                            <th class="for-dark-mode">Atlikinėtojas</th>
                            <th class="for-dark-mode">Rezultatas</th>
                            <th class="for-dark-mode">Veiksmas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each filteredAttempts as attempt, index}
                            <tr>
                                <td>{index + 1}</td>
                                <td>{attempt.quiz.title}</td>
                                <td>{attempt.date.getFullYear() + "-" + (attempt.date.getMonth() + 1) + "-" + attempt.date.getDate()}</td>
                                <td>{getUserName(attempt.user_id)}</td>
                                <td>{attempt.result}/{attempt.quiz.questions?.length ?? "NaN"}</td>
                                <td><button type="button" class="button is-small is-info" on:click={() =>{
                                    selectedAttempt = attempt;
                                    isModalOpen = true;
                                }}>Peržiūrėti</button></td>
                            </tr>
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
                <h3><b>Atlikėjas:</b> {getUserName(selectedAttempt.user_id)}</h3>
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