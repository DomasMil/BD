<script lang="ts">
	import type { ComplaintType } from "$lib/server/db/tables/complaint/ComplaintType";
	import type { QuizType } from "$lib/server/db/tables/quiz/QuizType";
	import type { PageData } from "./$types";

    export let data: PageData;

    let complains: ComplaintType[] = data.data.complaints;
    let nestedQuizes: QuizType[] = data.data.nestedQuizes;

    console.log("complains", complains);
    console.log("nestedQuizes", nestedQuizes); 
</script>

{#each nestedQuizes as nestedQuiz }
    <div class="quiz-card" style="margin: 1%;">
        <h1 class="quiz-title">{nestedQuiz.title}</h1>
        {#each complains as complain}
            {#if complain.quiz_id === nestedQuiz.id}
                <div class="complaint-card">
                    {#if nestedQuiz.questions}
                        {#each nestedQuiz.questions as question}
                            {#if question.id === complain.question_id}
                                <div class="question-section">
                                    <h2 class="question-title">Klausimas: {question.question_text}</h2>
                                    <h3 class="answers-title">Atsakymai:</h3>
                                    {#each question.answers as answer }
                                        <p class="answer-text">{answer.answer_text}</p>
                                    {/each}
                                </div>
                                <p class="explanation">Skundas: {complain.explanation}</p>
                            {/if}
                        {/each}
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
{/each}


<style>
    .quiz-card {
        background: #f9f9f9;
        border-radius: 8px;
        margin-bottom: 20px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .quiz-title {
        color: #333;
        margin-bottom: 10px;
        font-size: 24px;
    }

    .complaint-card {
        background: #fff;
        border: 1px solid #ddd;
        padding: 10px;
        margin-top: 10px;
        border-radius: 5px;
    }

    .question-section {
        background: #efefef;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .question-title, .answers-title {
        color: #555;
        margin-bottom: 5px;
    }

    .answer-text {
        margin-left: 20px;
        color: #666;
    }

    .explanation {
        color: #444;
        font-style: italic;
        margin-top: 10px;
    }

</style>
