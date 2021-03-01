import { Component, getAssetPath, h, Host, State } from '@stencil/core';
import html2pdf from 'html2pdf.js'
import laboratories from './../../config/laboratory.json';
import doctors from './../../config/doctors.json';
import { Utils } from './../../utils/utils';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: false,
})
export class AppRoot {
  @State() selectedLaboartory: ILaboratory = laboratories[0];
  @State() user = {
    gender: null,
    lastname: null,
    firstname: null,
    street: null,
    city: null,
    zip: null,
    born: null
  }
  @State() reload = false;
  @State() checkAvailable = false;

  utils = new Utils();
  typeDoctor = this.utils.randomNumber(0, 1) ? 'male' : 'female';
  currentDate: string;
  folderNumber: string;
  doctor = doctors[this.typeDoctor][this.utils.randomNumber(0, doctors[this.typeDoctor].length - 1)];

  constructor() {
    this.getCurrentDate();
  }

  generatePdf() {
    const pdfDOm = document.getElementById('pdf');
    console.log('document', document)
    console.log('pdfDOm', pdfDOm)
    const opt = {
      margin: 0,
      filename: `test-pcr-${this.user.lastname}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: {
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        compress: false,
        floatPrecision: 16 // or "smart", default is 16
      }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(pdfDOm).save();

  }

  inputChange(value, type: string) {
    this.user[type] = value.target.value;
    this.disabledButton();
    this.reload = !this.reload;
  }

  disabledButton() {
    let verif = true;
    Object.keys(this.user).forEach(item => {
      if (!this.user[item]) {
        verif = false
      }
    })

    this.checkAvailable = !verif;
  }

  selectLaboratory(value) {
    this.selectedLaboartory = laboratories.find(item => item.id === parseInt(value.target.value, 10));
  }

  getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = today.getFullYear();

    this.currentDate = day + '/' + month + '/' + year;
    this.folderNumber = `FO${year}${month}${day}${this.utils.randomNumber(0, 30)}`
  }

  render() {
    return (
      <Host>
        <header>
          <div>
            <div class="select">
              <div class="bold">{this.utils.translate('Select a laboratory')}</div>
              <select class="select-laboratory" onChange={(event) => this.selectLaboratory(event)} >
                <option value="" selected disabled hidden>{this.utils.translate('Selectionner')}</option>
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
            </div>
            <div class="user-info">
              <p class="bold">{this.utils.translate("Enter your personal informations")}</p>
              <div class="flex flex-direction--row">
                <div class="select">
                  <div>{this.utils.translate('Gender')}</div>
                  <select class="select-laboratory" onChange={(event) => this.inputChange(event, 'gender')}>
                    <option value="" selected disabled hidden>{this.utils?.translate('Gender')}</option>
                    {
                      ['Male', 'Female']
                        .map(gender => {
                          return <option value={gender}>
                            {gender === 'Male' ? this.utils.translate('Male') : this.utils.translate('Female')}
                          </option>
                        })
                    }
                  </select>
                </div>
                <div class="input user-info__firstname">
                  <div>{this.utils.translate('First name')}</div>
                  <input type="text" value={this.user.firstname} onInput={(event) => this.inputChange(event, 'firstname')} />
                </div>
                <div class="input user-info__lastname">
                  <div>{this.utils.translate('Last name')}</div>
                  <input type="text" value={this.user.lastname} onInput={(event) => this.inputChange(event, 'lastname')} />
                </div>
                <div class="input user-info__street">
                  <div>{this.utils.translate('Address')}</div>
                  <input type="text" value={this.user.street} onInput={(event) => this.inputChange(event, 'street')} />
                </div>
                <div class="input user-info__city">
                  <div>{this.utils.translate('City')}</div>
                  <input type="text" value={this.user.city} onInput={(event) => this.inputChange(event, 'city')} />
                </div>
                <div class="input user-info__zip">
                  <div>{this.utils.translate('Zip')}</div>
                  <input type="text" value={this.user.zip} onInput={(event) => this.inputChange(event, 'zip')} />
                </div>
                <div class="input user-info__born">
                  <div>{this.utils.translate('Born')}</div>
                  <input type="text" value={this.user.born} onInput={(event) => this.inputChange(event, 'born')} />
                </div>
              </div>
            </div>
          </div>
          <button disabled={this.checkAvailable} onClick={() => this.generatePdf()}>{this.utils.translate('Generate')}</button>
        </header>
        <main id="pdf">
          <div class="header">
            <div class="header__name">
              {this.selectedLaboartory?.name}
            </div>
            <div class="header__address">
              {this.selectedLaboartory?.address?.street}, {this.selectedLaboartory?.address?.zip} {this.selectedLaboartory?.address?.city}
            </div>
            <div>
              <span class="header__phone">
                {this.utils.translate('Phone')}: {this.selectedLaboartory?.phone}
              </span>
              <span class="header__email">
                {this.selectedLaboartory?.email}
              </span>
            </div>
            <br></br>
            <div class="header__doctor">
              Dr {this.doctor}
            </div>
          </div>
          <div class="block-1">
            <div class="left">
              <div class="left__subject">
                <i>Rendez vous COVID sans prescription</i>
              </div>
              <div class="left__exam">
                <div class="line-1">Examen de <strong>{this.user.gender === 'Male' ? 'M.' : 'Mme.'} {this.user.firstname} {this.user.lastname}</strong></div>
                <div class="line-2">né(e) le {this.user.born}</div>
              </div>
              <div class="left__folder">
                Dossier <strong>{this.folderNumber}</strong> du <strong>{this.currentDate}</strong>
              </div>
              <div class="left__description">
                <div>Date et heure du prélévement: {this.currentDate} à 09:00</div>
                <div>(hors informations complémentaires figurant dans le compte−rendu)</div>
              </div>
            </div>
            <div class="right">
              <div class="right-address">
                <div class="right-address__name">
                  {this.user.gender === 'Male' ? 'M.' : 'Mme.'} {this.user.firstname} {this.user.lastname}
                </div>
                <div class="right-address__street">
                  {this.user.street}
                </div>
                <div class="right-address__street--2">
                  {this.user.zip} {this.user.city}
                </div>

                <div class="right-address__pub">
                  <div class="line-1">
                    <strong>COMPTE RENDU D'EXAMENS DE BIOLOGIE MEDICALE</strong>
                  </div>
                  <div class="line-2">
                    Notre politique de gestion et de protection de vos données personnelles est disponible sur notre site internet.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="block-2">
            <div class="block-2__title">
              BIOLOGIE MOLECULAIRE
            </div>
            <div class="block-2__title-2">
              Recherche d'ARN du SARS Cov2 (RT−PCR)
            </div>
            <div class="block-2__title-3">
              2019−nCoV kit Sansure Biotech (PCR Fluorescence Probing). Détection Bioer.
            </div>
            <div class="block-2__title-4">
              Sensibilité : 200 copie/ml pour les gènes ORF1ab et N.
            </div>
          </div>
          <div class="block-3">
            <div>
              <span>Origine du prélèvement:</span> Ecouvillon naso−pharyngé
            </div>
            <div>
              <span>Résultat:</span> Absence d'ARN du coronavirus SARS−CoV−2.
            </div>
            <div></div>
          </div>
          <div class="block-4">
            <strong>BIOCOVID</strong>
            <br></br>
            <span>Les données vous concernant collectées dans le cadre du présent examen biologique, en lien avec l'épidémie du Covid−19, sont enregistrées dans le système d'information national dénommé SI−DEP, mis en oeuvre par la Direction générale de la santé du ministère chargé de la santé. Ce traitement d'intérêt public a pour finalité de centraliser les résultats des tests de dépistage Covid−19 en vue de leur réutilisation à des fins d'enquête sanitaire, de surveillance épidémiologique et de recherche via la plateforme des données de santé. Pour exercer vos droits (accès, rectification, limitation, voir opposition) nous vous invitons à contacter l'adresse postale "Correspondant à la protection des données−Direction générale de la Santé (DGS) − Ministère des solidarités et de la santé − 14 avenue Duquesne − 74350 PARIS 07 SP" ou à l'adresse électronique sidep−rgpd@sante.gouv.fr</span>
          </div>
          <div class="footer">
            <img src={getAssetPath('./../../assets/img/signature.png')} alt="Signature" />
            Dossier validé biologiquement par : <strong>Dr {this.doctor}</strong>
          </div>
        </main>
      </Host>
    );
  }
}
