import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
  return <SwaggerUI url="/docs/swagger.json" />;
};

export default ApiDocs;
