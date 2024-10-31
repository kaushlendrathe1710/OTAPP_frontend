import React from "react";
import { IoDocumentText } from "react-icons/io5";
import { documentTypesWithColors } from "../../constants/helpers";

const DocumentTypeIcon = ({
  documentType = "pdf",
  docuemntSvgSize = 48,
  docuemntSvgColor = "aliceblue",
  docuemntSvgStrokeWidth = 12,
  docuemntSvgStrokeColor = "aliceblue",
  width = 54,
  height = 48,
  showOnlyIcon = false,
}) => {
  return (
    <div style={{ width, height }} className="documentTypeIcon">
      <IoDocumentText
        size={docuemntSvgSize}
        fill={docuemntSvgColor}
        strokeWidth={docuemntSvgStrokeWidth}
        stroke={docuemntSvgStrokeColor}
      />
      {!showOnlyIcon && (
        <div
          className="documentTypeWrapper"
          style={{
            backgroundColor:
              documentTypesWithColors.find((item) => item.type === documentType)
                ?.color || "var(--primary-400)",
          }}
        >
          <b>{documentType}</b>
        </div>
      )}
    </div>
  );
};

export default DocumentTypeIcon;
