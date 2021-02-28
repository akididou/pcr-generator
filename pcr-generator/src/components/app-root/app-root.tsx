import { Component, h, Host } from '@stencil/core';
import html2pdf from 'html2pdf.js'
import laboratories from './../../config/laboratory.json';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: false,
})
export class AppRoot {

  generatePdf() {
    const pdfDOm = document.getElementById('pdf');
    console.log('document', document)
    console.log('pdfDOm', pdfDOm)
    const opt = {
      margin: 1,
      filename: 'myfile.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(pdfDOm).save();

  }



  render() {
    return (
      <Host>
        <div>
          <header>
            <select class="select-laboratory" >
              {
                laboratories
                .sort((a, b) => parseInt(a?.address.department.code) - parseInt(b?.address.department.code))
                .map(laboratory => {
                  return <option value={laboratory.id}>
                    {`${laboratory.address.city}(${laboratory.address.department.code}) - ${laboratory.name}`} 
                  </option>
                })
              }
            </select>
          </header>

          <main id="pdf">
            <div class="title">

            </div>
            <h1>Title</h1>
            Mon PDF
          </main>
          <footer>
            <button onClick={() => this.generatePdf()}>Generate PDF</button>
          </footer>
        </div>
      </Host>
    );
  }
}
