import { exec } from 'child_process';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

function compileLatexFile(filePath: string): Promise<string> {
    const pdflatexPath =
    "C:\\Users\\Domas\\AppData\\Local\\Programs\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe";
    console.log("file path yra ", path.dirname(filePath).replaceAll('"', ''))
    const outputhFile = 'D:\\Repositories\\BD github\\BD\\tex'
    return new Promise((resolve, reject) => {
        exec(
            `"${pdflatexPath}" -output-directory="${outputhFile}" ${filePath}`,
            (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`pdflatex failed: ${stderr}`));
                    return;
                }
                resolve(stdout);
            }
        );
    });
}

// Define the POST endpoint as an async function
export const GET: RequestHandler = async ({ request, params }) => {
    const id = params.id;
    console.log("id yra ", id)
    const filename =
        '"D:\\Repositories\\BD github\\BD\\tex\\Betono kubelinio stiprio nustatymas LST EN 12390-3.tex"';

    const editedTexOutput = '.\\tex\\Betono kubelinio stiprio nustatymas LST EN 12390-3.tex';
    const outputPath = '.\\tex\\Betono kubelinio stiprio nustatymas LST EN 12390-3.pdf';

    // Read tex template
    let data = fs.readFileSync(path.basename(editedTexOutput), 'utf8');

    data = data.replace('{{TESTBROUGHT}}', 'AUGHHHHH');
    data = data.replace('{{FULLNAME}}', 'Vardenis pavardenis');

    // write into tex folder with changed data
    fs.writeFileSync(editedTexOutput, data);

    try {
        await compileLatexFile(filename); // Ensure LaTeX compilation finishes

        // Read the resulting PDF file and send it back as a response
        const pdfBuffer = fs.readFileSync(outputPath);
        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${path.basename(outputPath)}"`
            }
        });
    } catch (error) {
        // Handle errors and send appropriate responses
        console.error(error);
        return new Response(`Error creating PDF: ${error.message}`, {
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
};