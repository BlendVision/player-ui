/* @jsxImportSource @emotion/react */
import { useIntl } from "./intl";
import Icon from "./Icon";
import Backdrop from "./Backdrop";

const iconStyle = {
  width: "78px",
  height: "78px",
};

const style = {
  display: "flex",
  justifyContent: "center",
  flex: "100%",
  margin: "1rem 0",
  padding: "0 1.5rem",
  textAlign: "center",
};

const Error = ({ error = {} }) => {
  const intl = useIntl();
  const values = {
    CODE: error.code || 0,
    code: error.code || 0,
    ...error.data,
  };
  const messageKey = [error.code, error.data?.reason].filter(Boolean).join(".");

  return (
    <Backdrop open>
      <Icon type="warning" style={iconStyle} />
      <div css={style}>
        {[
          error.name === "PlaycraftApiError"
            ? `KKS.ERROR.PLAYCRAFT.${messageKey}`
            : `KKS.ERROR.${messageKey}`,
          `KKS.ERROR.${error.code}`,
          `KKS.ERROR.${error.name}`,
          error.message,
          error.name,
          `KKS.ERROR`,
        ].reduceRight(
          (last, id) =>
            intl.formatMessage({ id, defaultMessage: last }, values),
          ""
        )}
      </div>
    </Backdrop>
  );
};

export default Error;
