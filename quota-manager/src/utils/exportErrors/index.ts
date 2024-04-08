const exportErrors = () => {
  const createErrorsJsonFile = ({ failedCreations }: any): any => {
    const errorsJson = JSON.stringify(failedCreations, null, 2);
    const blob = new Blob([errorsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'errors.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { createErrorsJsonFile };
};

export default exportErrors;
