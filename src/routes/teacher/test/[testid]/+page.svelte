<script lang="ts">
	import type { PageData } from './$types';
	import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';
	import type { QuestionType } from '$lib/server/db/tables/question/QuestionType';
	import type { AnswerType } from '$lib/server/db/tables/answer/AnswerType';
	import { goto } from '$app/navigation';
	import CopyTestDialog from './CopyTestDialog.svelte';
	import SettingsDialog from './SettingsDialog.svelte';

	export let data: PageData;
	
	let showDialog: boolean = false;
	let showSettingsDialog: boolean = false;
	let reusableQuizes = data.reusableQuizes;
	
	let quiz: QuizType = data.quizID != -1 ? data.quiz as QuizType : {
		title: "",
		code: 0,
		can_navigate: 0,
		duration: 0,
		is_reusable: 0,
		creator_id: data.userID,
		questions: []
	};

    $: if(data.quizID == -1 && quiz.questions?.length === 0) {
        handleAddQuestionClick();
    }
	
	function handleAddQuestionClick(){
		quiz.questions?.push({
			question_text: "",
			answers: [
				{ answer_text: "", is_correct: 0 } as AnswerType
			]
		} as QuestionType);
		quiz.questions = quiz.questions;
	}

	function handleDeleteQuestionClick(question: QuestionType){
		if(!quiz.questions)
			return;

		if(quiz.questions.length == 1){
			alert("Testas turi turėti bent vieną klausimą");
			return;
		}
		quiz.questions = quiz.questions.filter(q => q != question);
	}

	function handleAddAnswerClick(question: QuestionType){
		if(!question.answers)
			return;

		question.answers.push({ answer_text: "", is_correct: 0 } as AnswerType);
		if (quiz.questions) {
			quiz.questions = quiz.questions;
		}
	}

	function handleDeleteAnswerClick(answer: AnswerType){
		if(!quiz.questions)
			return;

		quiz.questions.forEach(q => {
			if(q.answers)
				q.answers = q.answers.filter(a => a != answer);
		});
		quiz.questions = quiz.questions;
	}

	function openDialog() {
        showDialog = true;
    }

	async function handleSelect(selectedCopyQuizId: number) {

        const res = await fetch(`/api/tests/${selectedCopyQuizId}/copyTest`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({quiz}) // Ensure 'quiz' is defined and structured correctly
        });

        const quizAfterCopy: QuizType = await res.json();
		quiz.questions = quizAfterCopy.questions;

        handleClose(); // Ensure this function is defined
	}
	
    function handleClose() {
        showDialog = false;
    }

	async function handleSaveSettings(quiz: QuizType){
		const res = await fetch(`/api/tests/${quiz.id}/updateTest`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quiz) // Ensure 'quiz' is defined and structured correctly
        });

		const quizUpdate: QuizType = await res.json();
		quiz.duration = quizUpdate.duration;
		quiz.can_navigate = quizUpdate.can_navigate;
		quiz.is_reusable = quizUpdate.is_reusable;

		handleCloseSettings()
	}

    function handleCloseSettings(){
		showSettingsDialog = false;
	}

	function openSettingsDialog(){
		showSettingsDialog = true;
	}

	async function handleSaveQuizClick(){
		const res = await fetch(`/api/tests/createTest`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(quiz)
		});
		const data = await res.json();
		if(data.status == 200){
			goto("/teacher/"); 
		}
	}

	async function handleUpdateQuizClick(id: number){
		const res = await fetch(`/api/tests/${id}/updateTest`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(quiz)
		});
		const data = await res.json();
		if(data.status == 200){
			goto("/teacher/"); 
		}
	}

</script>

<form class="container" method="post">
	<div class="quiz-menu">
		<div class="quiz-menu-buttons">
			<a class="btn btn-back" href="/teacher/">Atgal</a>
			<button class="btn btn-start-info" type="button" on:click={openDialog} >Kopijuoti testą</button>
			<button class="btn btn-add-new-test" type="button" on:click={openSettingsDialog} >Nustatymai</button>
			{#if data.quizID == -1}
				<button class="btn btn-add-new-test" type="button" on:click={handleSaveQuizClick}>Pridėti testą</button>
			{:else}
				<button class="btn btn-add-new-test" type="button" on:click={() => handleUpdateQuizClick(data.quizID)}>Redaguoti testą</button>
			{/if}
		</div>
	</div>

	<div class="quiz-creation">
		<div class="quiz-creation-header">
			<div class="container-test-name">
				<label class="name-input-label" for="name-input">Testo pavadinimas</label>
				<input type="text" class="name-input" id="name-input" name="title" bind:value={quiz.title} />
			</div>
			<!-- <button class="btn-settings"
					><svg
						class="btn-settings-icon"
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 512 512"
						><path
							d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
						/></svg
					>
				</button> -->
		</div>
		{#if quiz.questions}
			{#each quiz.questions as question, index}
				<div class="question-card">
					<div class="question">
						<div class="question-number">{index+1}</div>
						<div>
							<label for="question-input" class="question-input-label">Klausimas</label>
							<input
								name="question_text[{question.question_id ? question.question_id : index}]"
								type="text"
								class="question-input"
								id="question-input"
								bind:value={question.question_text}
							/>
						</div>
					</div>
					{#each question.answers as answer, index}
						<div class="answers">
							<ul>
								<li>
									<div class="single-answer">
										<input type="checkbox" name="is_correct[{answer.id ? answer.id : index}]" bind:checked={answer.is_correct} />
										<input
											type="text"
											name="answer[{answer.id ? answer.id : index}]"
											id="answer"
											class="answer-input"
											bind:value={answer.answer_text}
										/>
										<button
											class="btn-delete-answer"
											type="button"
											on:click={() => handleDeleteAnswerClick(answer)}
										>
											<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
												><path
													d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
												/></svg
											>
										</button>
									</div>
								</li>
							</ul>
						</div>
					{/each}
					<div class="question-card-footer">
						<button
							class="btn btn-delete-question"
							type="button"
							on:click={() => handleDeleteQuestionClick(question)}
							>Ištrinti klausimą</button
						>
						<button
							class="btn btn-add-answer"
							type="button"
							on:click={() => handleAddAnswerClick(question)}>Pridėti atsakymą
						</button>
					</div>
				</div>
			{/each}
		{/if}
		<div class="quiz-control">
			<div class="add-question-section">
				<button class="btn btn-add-question" type="button" on:click={handleAddQuestionClick}
					>Pridėti klausimą
				</button>
			</div>
			<!-- <div class="quiz-control-section">
				<button class="btn btn-delete-test">Ištrinti testą</button>
				<button class="btn btn-start-test">Pradėti testą</button>
			</div> -->
		</div>
	</div>
</form>

<CopyTestDialog 
    isOpen={showDialog}
    quizes={reusableQuizes}
    onSelect={handleSelect} 
    onClose={handleClose} 
/>

<SettingsDialog
	isOpen={showSettingsDialog}
	quiz={quiz}
	onSubmit={handleSaveSettings} 
	onClose={handleCloseSettings} 
/>

<style>
	.container {
		width: 900px;
		margin: 32px auto;
	}
	.quiz-menu-buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #444;
	}
	.btn {
		border: 2px solid #444;
		width: 200px;
		height: 56px;
		font-size: 24px;
		border-radius: 10px;
		background: #fff;
		box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.2);
	}

	/* .btn-settings:hover, */
	.btn:hover{
		cursor: pointer;
	}
	/* .btn-settings:active, */
	.btn:active{
		box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.3);
		transform: scale(0.99);
	}
	.quiz-creation-header {
		margin: 18px 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.container-test-name {
		width: 50%;
	}
	.name-input-label,
	.question-input-label {
		display: block;
		font-size: 16px;
	}
	.name-input {
		width: 100%;
		height: 32px;
		border-radius: 4px;
		font-size: 20px;
	}
	/* .btn-settings {
		width: 64px;
		height: 64px;
		border: none;
		border-radius: 50%;
		font-size: 42px;
		box-shadow: 2px 2px 2px 0px rgba(0, 0, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
	} */
	/* .btn-start-test, */
	.btn-add-new-test
	 {
		background-color: #00e2c0;
		color: #fff;
		border: none;
		font-weight: bolder;
	}
	
	.btn-start-info {
		background-color: #1f53fd;
		color: #fff;
		border: none;
		font-weight: bolder;
	}

	.btn-delete-test {
		background-color: #e20000;
		color: #fff;
		border: none; 
		font-weight: bolder;
	} 
	.btn-back{
		background-color: #e20000;
		color: #fff;
		border: none; 
		font-weight: bolder;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* .btn-settings:hover {
		cursor: pointer;
	} */

	.question {
		margin-top: 16px;
		display: flex;
		align-items: center;
	}
	.question-number {
		height: 36px;
		width: 36px;
		border-radius: 50%;
		background-color: #00e2c0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 10px;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
	}
	.question-input {
		width: 800px;
		border-radius: 4px;
		font-size: 18px;
		margin-bottom: 10px;
	}
	.answers {
		margin: 16px 72px;
	}
	.answer-input {
		width: 80%;
		border-radius: 4px;
		font-size: 18px;
	}

	.btn-add-answer,
	.btn-delete-question {
		margin-top: 10px;
		height: 45px;
		width: 190px;
	}
	.quiz-control {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.add-question-section {
		margin-right: 18px;
		margin-bottom: 32px;
		align-self: flex-end;
	}
	/* .quiz-control-section {
		display: flex;
		justify-content: space-between;
	} */
	.btn-delete-answer {
		margin-left: 24px;
		display: inline;
		font-size: 20px;
	}
	.btn-delete-answer:hover {
		cursor: pointer;
	}
</style>
