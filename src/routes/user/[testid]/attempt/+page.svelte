<script lang="ts">
	import type { PageData } from './$types';
	import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';
	import { onDestroy, onMount } from 'svelte';
	import ReportQuestionDialog from './ReportQuestionDialog.svelte';
	import type { QuestionType } from '$lib/server/db/tables/question/QuestionType';

	export let data: PageData;

	type checkedAnswers = {
		is_correct: boolean; 
	};
	
	//console.log(data);
	let quiz = data.quiz as QuizType;
	let answers: checkedAnswers[] = [];

	let durationInSeconds = quiz.duration * 60; // convert minutes to seconds
    let interval:any;

	const updateClock = () => {
        if (durationInSeconds > 0) {
            durationInSeconds--;
        } else {
            clearInterval(interval);
            // Handle the end of the duration here
        }
    };

	onMount(() => {
		interval = setInterval(updateClock, 1000);

		quiz.questions?.forEach(question => {
			question.answers?.forEach(answer => {
				if(answer.id) {
					answers[answer.id] = {
						is_correct: false
					};
				}		
			});
		});
	});

	onDestroy(() => {
        clearInterval(interval);
    });

	let currentQuestion = 0;

	let conversionToLetter = function (number: number) {
		let letter;

		switch (number) {
			case 1:
				letter = 'A';
				break;
			case 2:
				letter = 'B';
				break;
			case 3:
				letter = 'C';
				break;
			case 4:
				letter = 'D';
				break;
			default:
				letter = 'None';
				break;
		}

		return letter;
	};

	// $: {
	// 	console.log(quiz);
	// 	console.log(answers);
	// }

	let showScore = false;
	let score = 0;
	
	async function handleSubmitBtn(){
		quiz.questions?.forEach(question => {
			question.answers?.forEach(answer => {
				if(answer.id) {
					answer.is_correct = answers[answer.id].is_correct == true ? 1 : 0;
				}		
			});
		});

		//console.log(quiz);

		const res = await fetch(`/api/tests/${quiz.id}/submitTest`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(quiz)
		});
		const data = await res.json();
		//console.log(data);
		if(data.status == 200){
			showScore = true;
			score = data.score;
			//console.log("score: " + score);
		}
	}

	let showDialog: boolean = false;
	let curQuestion: QuestionType = {} as QuestionType;

	function openDialog(question: QuestionType) {
		curQuestion = question;
        showDialog = true;
    }

	async function handleOK(question_id: number, explanation: string) {

        const res = await fetch(`/api/tests/${quiz.id}/createComplaint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({question_id, explanation}) // Ensure 'quiz' is defined and structured correctly
        });

        handleClose(); // Ensure this function is defined
	}
	
    function handleClose() {
        showDialog = false;
    }

</script>

<div class="px-4">
	<div class="py-3">
		<h1 class="title is-1">{!showScore ? "Testo atlikimas" : "Jūsų rezultatas"}</h1>
	</div>

	{#if showScore}
		<h1 class="title" style="color: red;">{score}/{(quiz.questions?.length ?? 0)}</h1>
	{/if}

	{#if !showScore}
	<div class="columns is-multiline">
		<div class="column is-three-quarters">
			<div class="box">
				<div class="columns is-vcentered is-justify-content-space-between">
					<h1 class="title">{quiz.title}</h1>
					{#if durationInSeconds > 0}
					<div>
						<span>🕓 {Math.floor(durationInSeconds / 60)}:{String(durationInSeconds % 60).padStart(2, '0')}</span>
					</div>
				{/if}
				</div>
				{#if quiz.questions}
					<div class="field">
						<label class="label" for="answers">
							Klausimas: <i>{quiz.questions?.[currentQuestion].question_text}</i>
						</label>
						<button on:click={() => openDialog(quiz.questions[currentQuestion])}>Pranešti apie klaidą</button>
						{#each quiz.questions?.[currentQuestion].answers as answer, index}
							{#if answer.id && answers[answer.id]}
								<div class="control" id="answers">
									<div class="field">
										<input class="is-checkradio" type="checkbox" name="answer" bind:checked={answers[answer.id].is_correct} />
										<label for="answer">{conversionToLetter(index + 1)}. {answer.answer_text}</label>
									</div>
								</div>
							{/if}
						{/each}
					</div>
				{/if}
				<div id="card-footer">
					<div class="level">
						<div class="level-left">
							<button class="button" on:click={() => {
								if (currentQuestion > 0) currentQuestion--;
							}}>Ankstesnis</button>
						</div>

						<div>
							<div class="level-item has-text-centered">
								<span>{currentQuestion + 1} iš {quiz.questions?.length}</span>
							</div>
						</div>

						<div class="level-right">
							<button class="button" on:click={() => {
								if (currentQuestion < ((quiz.questions?.length ?? 0) - 1)) currentQuestion++;
							}}>Sekantis</button>
						</div>
					</div>

					<div class="has-text-centered">
						<button class="button is-large is-fullwidth" type="button" on:click={handleSubmitBtn}>Patvirtinti</button>
					</div>
				</div>
			</div>
		</div>

		<div class="column">
			<div class="box has-text-centered">
				<h2 class="subtitle">Testo navigacija</h2>
				<hr />
				{#if quiz.can_navigate === 0 || quiz.can_navigate === undefined }
				<div class="points-section">
					<p class="points">"Negalima vaikščioti po klausimais"</p>
				</div>
				{/if}
				{#if quiz.can_navigate === 1}
				<div class="has-text-centered test-navigation">
					<div class="pages">
						{#if quiz.questions}
							{#each quiz.questions as question, index}
								<button
									class="square"
									on:click={() =>{
										currentQuestion = index;								
									}}>
									{index+1}
								</button>
							{/each}
						{/if}
					</div>
				</div>
				{/if}
			</div>
		</div>
	</div>
	{/if}
</div>

<ReportQuestionDialog 
isOpen={showDialog}
question={curQuestion}
onSelect={handleOK} 
onClose={handleClose} 
/>

<style>
	.square {
		width: 50px;
		height: 50px;
		border-radius: 8px;
		border: 1px solid #ccc;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
	}
	.square:hover {
		cursor: pointer;
	}
	.square:active {
		transform: scale(0.99);
	}
	.pages {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 24px;
		align-items: center;
		justify-items: center;
	}
	.test-navigation {
		margin: 20px auto;
	}
	.points-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.points {
		font-size: 24px;
		font-weight: 500;
	}
	.btn-flag {
		background-color: white;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.btn-icon {
		height: 30px;
		width: 30px;
	}
</style>