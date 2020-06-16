/* global use */
use(function () {
    var finalText = this.text;
    var includeEllipses = true;
    var finalTextSplit = '';
    var finalTextSub = '';
    var chars = this.chars;
    var lastChar = '';
    var regex = new RegExp('^[A-Za-z]+$');
    if (finalText) {
        finalText = finalText.trim();
        chars = Number(this.chars);
        if (finalText.length > chars) {
            finalTextSub = finalText.substr(0, finalText.lastIndexOf(' ', chars));
            lastChar = finalTextSub.slice(-1);
            if (!lastChar.match(regex)) { //if last char isn't letter, cut off space at next word
                finalTextSplit = finalText.replace(finalTextSub, '');
                splitOnSpace = finalTextSplit.match(/\S+/g);
                if (splitOnSpace.length > 1) { //many spaces, crop string
                    finalTextSub += ' ' + splitOnSpace[0];
                } else { //one space so end of string
                    finalTextSub += ' ' + splitOnSpace[0];
                    includeEllipses = false;
                }
            }
            if (finalTextSub) {
                finalText = finalTextSub;
            }
            if (includeEllipses) {
                finalText += '...';
            }
        }
    }
    return {
        finalText: finalText
    };
});
