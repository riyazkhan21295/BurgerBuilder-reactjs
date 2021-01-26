export const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) return true;

    if (rules.required) {
        isValid = value.trim() !== '' && isValid ? true : false;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid ? true : false;
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid ? true : false;
    }

    return isValid;
};
