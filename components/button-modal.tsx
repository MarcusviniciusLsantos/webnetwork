import { kebabCase } from "lodash";
import { ReactNode, ReactNodeArray } from "react";
import { Modal } from "react-bootstrap";

export default function ButtonModal({
  title = "",
  children = null,
  footer = null,
  onClick = () => {},
  show = false,
  onHide = () => {},
  className = "btn-primary",
  disabled = false,
  ...params
}: {
  title: string;
  children: ReactNode | ReactNodeArray;
  footer?: ReactNode;
  onClick: () => void;
  show: boolean;
  onHide?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <>
      <button
        className={`btn btn-md ${className}`}
        onClick={onClick}
        disabled={disabled}
        {...params}>
        {title}
      </button>
      <Modal
        centered
        aria-labelledby={`${kebabCase(title)}-modal`}
        aria-describedby={`${kebabCase(title)}-modal`}
        show={show}
        onHide={onHide}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>{footer}</Modal.Footer>
      </Modal>
    </>
  );
}