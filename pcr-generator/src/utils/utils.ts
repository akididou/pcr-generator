import langJson from './../assets/lang/fr.json';

export class Utils {
    lang = navigator.language;
    debounceTimer: any = [];

    constructor() { }

    translate(text: string, params?: object): string {
        if (params) {
            let value = langJson[text] && this.lang === 'fr' ? langJson[text] : text;
            Object.keys(params).forEach(element => {
                value = value.replace('$' + element + '$', params[element]);
            });
            return value
        } else {
            return langJson[text] ? langJson[text] : text
        }
    }

    randomNumber(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    debounce(func, arg, wait: number, debounceTimerKey: string | number) {
        if (this.debounceTimer[debounceTimerKey]) {
            clearTimeout(this.debounceTimer[debounceTimerKey]);
        }
        this.debounceTimer[debounceTimerKey] = setTimeout(() => {
            func(arg);
            this.debounceTimer[debounceTimerKey] = null;
        }, wait);
    };
}