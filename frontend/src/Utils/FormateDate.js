export const FormateDate = (date, config) => {

    const defaultOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const options = config ? config : defaultOptions;

    // --- CORRECTED: Use toLocaleDateString() for custom formatting ---
    return new Date(date).toLocaleDateString('en-us', options);
};