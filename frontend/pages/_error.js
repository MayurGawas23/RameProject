// pages/_error.js
import React from "react";

const ErrorPage = ({ statusCode }) => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{statusCode || "An error occurred"}</h1>
      <p>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on the client"}
      </p>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
