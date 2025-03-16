import ReactDOM from "react-dom";

function PortalModal({ children }) {
  const portalRoot = document.getElementById("portal-root");
  return ReactDOM.createPortal(children, portalRoot);
}

export default PortalModal;
