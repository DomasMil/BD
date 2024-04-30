<script lang="ts">
	import type { PageData } from './$types';
	import type { QuizType } from '$lib/server/db/tables/quiz/QuizType';

    export let data: PageData;

	let isCodeVisable: boolean = false;
	let code: number = -1;
	let quizzes: QuizType[];

	$: if (quizzes == null) {
		quizzes = data.data.tests;
		//console.log(quizzes);
	}

	async function startTest(testid: number){
		const res = await fetch(`/api/tests/${testid}/startTest`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({testid})
		});
        const data = await res.json();

        code = data.joinCode;
        isCodeVisable = true;
	}

    async function deleteTest(testid: number){
        const res = await fetch(`/api/tests/${testid}/deleteTest`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({testid})
        });
        const data = await res.json();

        //console.log(data.status);
        if(data.status == 200){
            let newQuizzes = quizzes.filter(q => q.id != testid);
            quizzes = newQuizzes;
            //console.log(quizzes);
        }
    }

	function closeDialog(){
		isCodeVisable = false;
	}

</script>


<div class="px-4 mt-5">
    <div class="card">
        <header class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <p class="title py-4 px-4">
                    Testų sąrašas
                </p>
                <a class="button is-info py-4 px-4 mr-5" href="teacher/test/create">Sukurti testą</a>
            </div>
        </header>
        <div class="card-content">
            <div class="content">
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th class="for-dark-mode">#</th>
                            <th class="for-dark-mode">Testo pavadinimas</th>
                            <th class="for-dark-mode">Veiksmas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each quizzes as quizz}
                            {#if quizz.id != null}
                                <tr>
                                    <td>{quizz.id}</td>
                                    <td>{quizz.title}</td>
                                    <td>
                                        <button class="button is-small is-link" on:click={() => quizz.id != null && startTest(quizz.id)}>Pradėti</button>
                                        <a class="button is-small is-primary" href="teacher/test/{quizz.id}/">Redaguoti</a>
                                        <button class="button is-small is-danger" on:click={() => quizz.id != null && deleteTest(quizz.id)}>Ištrinti</button>
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

{#if isCodeVisable}
	<dialog open>
		<h1>Prisijungimo kodas: <b>{code}</b></h1>
		<button on:click={closeDialog}>Uždaryti</button>
	</dialog>
{/if}

<style>
    dialog {
        border: none;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        padding: 20px; 
        width: auto; 
        max-width: 90%; 
        background-color: white; 
    }

    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.6);
    }

    h1 {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 1rem;
    }

    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s;
    }

    button:hover {
        background-color: #0056b3; 
    }
</style>
