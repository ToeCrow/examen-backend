import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerDocs() {
  return (
    <div style={{ height: "100vh" }}>
      <SwaggerUI url="http://localhost:3000/api-docs/swagger.json" />
    </div>
  );
}
