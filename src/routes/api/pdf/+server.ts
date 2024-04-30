// import { exec } from 'child_process';
// import type { RequestHandler } from '@sveltejs/kit';

// export const POST: RequestHandler = async (request) => {
//     const filename = 'src/Betono kubelinio stiprio nustatymas LST EN 12390-3.tex'; // replace with your filename

//     return new Promise((resolve, reject) => {
//         exec(`latex ${filename}`, (error, stdout, stderr) => {
//                 if (error) {
//                         reject({ status: 500, body: `Error executing latex: ${error}` });
//                         return;
//                 }

//                 exec(`pdflatex ${filename.replace('.tex', '.dvi')}`, (error, stdout, stderr) => {
//                         if (error) {
//                                 reject({ status: 500, body: `Error executing pdflatex: ${error}` });
//                                 return;
//                         }

//                         const response = new Response('PDF created successfully', {
//                                 status: 200,
//                                 headers: { 'Content-Type': 'text/plain' }
//                         });

//                         resolve(response);
//                 });
//         });
//     });
// };

import { exec } from 'child_process';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async (request) => {
        const filename = 'src/Betono kubelinio stiprio nustatymas LST EN 12390-3.tex'; // replace with your filename

        try {
                await new Promise((resolve, reject) => {
                        exec(`latex ${filename}`, (error, stdout, stderr) => {
                                if (error) {
                                        reject(`Error executing latex: ${error}`);
                                        return;
                                }
                                console.log('Latex command executed successfully');
                                resolve(void 0);
                        });
                });

                await new Promise((resolve, reject) => {
                        exec(`pdflatex ${filename.replace('.tex', '.dvi')}`, (error, stdout, stderr) => {
                                if (error) {
                                        reject(`Error executing pdflatex: ${error}`);
                                        return;
                                }
                                console.log('Pdflatex command executed successfully');
                                resolve(void 0);
                        });
                });

                const response = new Response('PDF created successfully', {
                        status: 200,
                        headers: { 'Content-Type': 'text/plain' }
                });

                return response;
        } catch (error) {
                const response = new Response(`Error creating PDF: ${error}`, {
                        status: 500,
                        headers: { 'Content-Type': 'text/plain' }
                });

                return response;
        }
};
