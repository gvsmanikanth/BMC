HandlebarHelpers = {

    registerHelpers: function () {
        Handlebars.registerHelper('ifCond', function (arg1, operator, arg2, options) {
            switch (operator) {
            case '===':
                return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (arg1 < arg2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (arg1 <= arg2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (arg1 > arg2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (arg1 >= arg2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (arg1 && arg2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (arg1 || arg2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('truncateText', function (text, chars) {
            return HandlebarHelpers.truncateText(text, chars);
        });
    },

    truncateText: function (pText, pChars) {
        var finalText = pText;
        var includeEllipses = true;
        var finalTextSplit = '';
        var finalTextSub = '';
        var chars = pChars;
        var lastChar = '';
        var regex = new RegExp('^[A-Za-z]+$');
        if (finalText) {
            finalText = finalText.trim();
            chars = Number(pChars);
            if (finalText.length > chars) {
                finalTextSub = finalText.substr(0, finalText.lastIndexOf(' ', chars));
                lastChar = finalTextSub.slice(-1);
                if (!lastChar.match(regex)) { //if last char isn't letter, cut off at next word
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
        return finalText;
    }
};
    
$(function() {
    HandlebarHelpers.registerHelpers();
});