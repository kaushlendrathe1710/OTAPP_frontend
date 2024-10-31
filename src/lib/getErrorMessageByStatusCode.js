export default function getErrorMessageByStatusCode(statusCode) {
  switch (statusCode) {
    case 400:
      return "Bad Request: The server did not understand the request.";
    case 401:
      return "Unauthorized: Authentication is required and has failed or not been provided.";
    case 403:
      return "Forbidden: You do not have permission to access the requested resource.";
    case 404:
      return "Not Found: The requested resource could not be found on the server.";
    case 500:
      return "Internal Server Error: An unexpected condition was encountered on the server.";
    case 502:
      return "Bad Gateway: The server, while acting as a gateway or proxy, received an invalid response from the upstream server.";
    case 503:
      return "Service Unavailable: The server is not ready to handle the request. Common causes are a server that is down for maintenance or is overloaded.";
    default:
      return "An unexpected error occurred.";
  }
}
