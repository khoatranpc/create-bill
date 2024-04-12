import { toWords } from 'number-to-words';
const numberToWords = (number: string) => {
    const [wholePart, decimalPart] = number.split('.');
    const wholePartInWords = toWords(Number(wholePart));
    const decimalPartInWords = decimalPart === '00' ? '' : toWords(Number(decimalPart));
    const amountInWords = `${wholePartInWords} dollars${decimalPartInWords?` and ${decimalPartInWords} cents.`:''}`;

    return amountInWords;
}

export {
    numberToWords
}