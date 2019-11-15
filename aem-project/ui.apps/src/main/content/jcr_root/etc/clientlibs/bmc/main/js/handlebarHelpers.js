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
            return CommonUtils.truncateText(text, chars);
        });
    },
};

HandlebarHelpers.registerHelpers();
