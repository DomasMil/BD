<script lang="ts">
	import type { PageData } from './$types';
    import type { MyUserType } from '$lib/server/db/tables/user/UserType';
	import type { StrengthTestListType } from '$lib/server/db/tables/strengthtest/StrengthTestType';
    import { goto } from '$app/navigation';

    export let data: PageData;

    //let users: MyUserType[];
    let strengthTests: StrengthTestListType[];
	let currentPageStrengthTests : StrengthTestListType[];

    let currentPage = 1;
    const itemsPerPage = 5;
 

    let isModalOpen = false;
    let selectedStrengthTest: StrengthTestListType | null = null;

    // const { exec } = require('child_process');
    // const fs = require('fs');

//     function convertToPdf() {
//     const texFile = 'src/Betono kubelinio stiprio nustatymas LST EN 12390-3.tex'; // Path to your .tex file

//     // Send a request to your server to convert the .tex file to PDF
//     fetch('/api/pdf', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ texFile }),
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to convert .tex file to PDF');
//         }
//         return response.blob();
//     })
//     .then(pdfBlob => {
//         // Do something with the PDF blob, such as displaying it or downloading it
//         const pdfUrl = URL.createObjectURL(pdfBlob);
//         window.open(pdfUrl); // Open the PDF in a new tab
//     })
//     .catch(error => {
//         console.error('Error converting .tex file to PDF:', error);
//     });
// }

// 	function convertToPdf() {
//     const texFile = 'src\\Betono kubelinio stiprio nustatymas LST EN 12390-3.tex'; // Path to your .tex file

//     exec(`pdflatex "${texFile}"`, (error: Error | null, stdout: string, stderr: string) => {
//         if (error) {
//             console.error(`Error executing pdflatex: ${error}`);
//             return;
//         }

//         console.log('PDF created successfully');

//         // Rename the PDF file to a desired name
//         fs.renameSync(`${texFile.replace('.tex', '.pdf')}`, 'output.pdf');
//     });
// }

    $: if (strengthTests == null) {
        strengthTests = data.strengthTests;
        //console.log(users);
    }

    

	$: {
		const startIndex = (currentPage - 1) * itemsPerPage;
    	const endIndex = startIndex + itemsPerPage;
    	currentPageStrengthTests = strengthTests.slice(startIndex, endIndex);
    }

    function nextPage() {
        if (currentPage < Math.ceil(strengthTests.length / itemsPerPage)) {
            currentPage += 1;
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage -= 1;
        }
    }

    function closeModal() {
        isModalOpen = false;
    }

    let timestamp = Date.now();
</script>

<div class="px-4 mt-5">
    <div class="card">
        <header class="card-header">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <p class="title py-4 px-4">
                    Kubelinio stiprio bandymai
                </p>
                <!-- <button on:click={convertToPdf} class="button is-primary">Convert to PDF</button> -->
            </div>
        </header>
        <div class="card-content">
            <div class="content">
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>Protokolo numeris</th>
                            <th>Įmonė</th>
                            <th>Objekto adresas</th>
                            <th>Testo tipas</th>
                            <th>Atlikimo data</th>
							<th>Bandytojo vardas</th>
							<th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each currentPageStrengthTests as strengthTest}
                            <!-- {#if user.id != null && user.role != 'admin'} -->
                                <tr>
                                    <td>{strengthTest.TestProtocolNumber}</td>
                                    <td>{strengthTest.ClientCompanyId.Name}</td>
                                    <td>{strengthTest.ClientConstructionSiteId.Address}</td>
                                    <td>{strengthTest.TestType}</td>
									<td>{`${strengthTest.TestSamplesReceivedDate.getFullYear()}-${('0' + (strengthTest.TestSamplesReceivedDate.getMonth() + 1)).slice(-2)}-${('0' + strengthTest.TestSamplesReceivedDate.getDate()).slice(-2)}`}</td>
									<td>{strengthTest.TestExecutedByUserId.name}</td>
									<td><button type="button" class="button is-small is-info" on:click={() =>{
                                        selectedStrengthTest = strengthTest;
                                        isModalOpen = true;
                                    }}>{"user.attempts.length"}</button></td>
                                </tr>
                            <!-- {/if} -->
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>


{#if isModalOpen && selectedStrengthTest != null}
    <div class="modal is-active">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="modal-background" on:click={closeModal}></div>
        <div class="modal-content" style="background-color: white; font-size:large; padding:3%;">
            <h2><b>Visi atlikti testai</b></h2>
            <hr>
            <div style="margin-top:2%;">
                <table class="table is-fullwidth is-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Testo pavadinimas</th>
                            <th>Atlikimo data</th>
                            <th>Rezultatas</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" on:click={closeModal}></button>
    </div>
{/if}

<div class="pagination" role="navigation" aria-label="pagination">
    <button class="pagination-previous" disabled={currentPage === 1} on:click={prevPage}>Previous</button>
    <button class="pagination-next" disabled={currentPage === Math.ceil(strengthTests.length / itemsPerPage)} on:click={nextPage}>Next page</button>
    <ul class="pagination-list">
        {#each Array.from({ length: Math.ceil(strengthTests.length / itemsPerPage) }) as _, i}
            <li>
<button class="pagination-link" aria-label="Goto page {i + 1}" aria-current={currentPage === (i + 1)} disabled={currentPage === (i + 1)} on:click={() => { currentPage = i + 1; }}>{i + 1}</button>
            </li>
        {/each}
    </ul>
</div>