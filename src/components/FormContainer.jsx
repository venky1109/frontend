const FormContainer = ({ children }) => {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-xs-12 col-md-8 col-lg-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;